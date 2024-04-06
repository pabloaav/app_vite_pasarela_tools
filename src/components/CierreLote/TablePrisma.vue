<template>
  <div>
    <!--DIALOGO DE EDITAR-->
    <v-dialog v-model="dialog" persistent max-width="440px">
      <v-card>
        <v-toolbar color="blue" dark
          >Actualizar cierre de lote prisma
          <v-divider vertical class="mx-4" />
          ID: {{ editItem.id }}</v-toolbar
        >
        <v-card-text>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="formatDate(editItem.fecha_cierre)"
                      label="Fecha de cierre"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fechaCierre"
                    @change="editItem.fecha_cierre = fechaCierre"
                    @input="menu = false"
                    locale="es"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  label="En disputa"
                  v-model="editItem.disputa"
                ></v-checkbox>
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  label="En observación"
                  v-model="editItem.enobservacion"
                ></v-checkbox>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  prefix="$"
                  placeholder="Monto"
                  prepend-icon="mdi-cash-multiple"
                  v-model="editItem.monto"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text @click="dialog = false"> Cancelar </v-btn>
          <v-btn
            color="blue darken-1 "
            text
            @click="editarItem"
            style="font-weight: bold"
            :loading="loading"
          >
            Guardar cambios
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogReversion" max-width="600px" v-if="reversion">
      <v-card>
        <v-card-title>REVERSIÓN DETALLE </v-card-title>
        <v-card-text class="text-subtitle-1">
          <v-divider class="mb-3" />
          <!-- DETALLEMOVIMINTE_ID -->
          <div class="mb-1">
            detallemovimineto_id:
            <span class="black--text">{{
              reversion.detallemovimineto_id
            }}</span>
          </div>

          <!-- DETALLEPAGO_ID -->
          <div class="mb-1">
            detallepago_id:
            <span class="black--text">{{ reversion.detallepago_id }}</span>
          </div>

          <!-- descripcioncontracargo -->
          <div class="mb-2">
            descripcioncontracargo:
            <span class="black--text">{{
              reversion.descripcioncontracargo
            }}</span>
          </div>

          <!-- extbancoreversion_id -->
          <div class="mb-1">
            extbancoreversion_id:
            <span class="black--text">{{
              reversion.extbancoreversion_id
            }}</span>
          </div>

          <!-- conciliacion -->
          <div class="mb-1">
            conciliacion:
            <v-chip
              :color="reversion.conciliacion ? 'green' : 'red'"
              text-color="white"
              >{{ reversion.conciliacion ? "SI" : "NO" }}</v-chip
            >
          </div>

          <!-- estadomovimineto -->
          <div class="mb-1">
            estadomovimineto:
            <v-chip
              :color="reversion.estadomovimineto ? 'green' : 'red'"
              text-color="white"
              >{{ reversion.estadomovimineto ? "SI" : "NO" }}</v-chip
            >
          </div>

          <!-- descripcionbanco -->
          <div class="mb-2">
            descripcionbanco:
            <span class="black--text">{{ reversion.descripcionbanco }}</span>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!--TABLA DE PRISMA-->

    <div class="overflow-x-visible">
      <v-skeleton-loader :loading="loadingTable" type="table">
        <p class="text-center grey--text" v-if="prisma.length === 0">
          Sin registros para mostrar
        </p>
        <div v-else>
          <v-data-table
            :headers="headersTable"
            :items="prisma"
            :page.sync="number"
            :items-per-page="size"
            item-key="cl_id"
            class="elevation-1 overflow-x-visible mt-2"
            :loading="loadingTable"
            loading-text="Cargando transacciones..."
            no-data-text="Datos no encontrados"
            hide-default-footer
            scrollable
            show-select
            v-model="selected"
            height="calc(100vh - 285px)"
            checkbox-color="black"
            fixed-header
            :item-class="rowColorReversion"
            @click:row="rowClick"
          >
            <template v-slot:[`item.fechaoperacion`]="{ item }">
              {{ formatDate(item.fechaoperacion, true) }}
            </template>
            <template v-slot:[`item.fecha_creacion`]="{ item }">
              {{ formatDate(item.fecha_creacion) }}
            </template>
            <template v-slot:[`item.fecha_cierre`]="{ item }">
              {{ formatDate(item.fecha_cierre, true) }}
            </template>
            <template v-slot:[`item.fecha_pago`]="{ item }">
              {{ formatDate(item.fecha_pago, true) }}
            </template>
            <template v-slot:[`item.monto`]="{ item }">
              {{ formatImport(item.monto) }}
            </template>
            <template v-slot:[`item.montofinal`]="{ item }">
              {{ formatImport(item.montofinal) }}
            </template>
            <template v-slot:[`item.valorpresentado`]="{ item }">
              {{ formatImport(item.valorpresentado) }}
            </template>

            <template v-slot:[`item.descripcionpresentacion`]="{ item }">
              {{
                item.descripcionpresentacion
                  ? item.descripcionpresentacion
                  : "-"
              }}
            </template>

            <template v-slot:[`item.disputa`]="{ item }">
              <v-chip :color="item.disputa ? 'green' : 'red'" dark>
                {{ item.disputa ? "SI" : "NO" }}
              </v-chip>
            </template>

            <template v-slot:[`item.enobservacion`]="{ item }">
              <v-chip :color="item.enobservacion ? 'green' : 'red'" dark>
                {{ item.enobservacion ? "SI" : "NO" }}
              </v-chip>
            </template>

            <!--COLUMNA DE ACCIONES-->

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                color="black"
                class="mr-2"
                @click="cargarDatosEditar(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon color="red lighten-1" @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>

            <template v-slot:footer>
              <v-row class="no-gutters align-center">
                <div style="position: absolute" class="d-flex align-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="d-inline-block">
                        <v-btn
                          icon
                          text
                          color="blue"
                          class="mr-2"
                          @click="setDialogDetalleMovimiento(true)"
                          :disabled="
                            !cargarMovimientos || selected.length === 0
                          "
                        >
                          <v-icon> mdi-eye</v-icon>
                        </v-btn>
                      </div>
                    </template>
                    <span>Ver detalle</span>
                  </v-tooltip>

                  <span class="font-weight-bold mr-2"
                    ><span class="font-weight-regular body-2">Monto: </span
                    >{{ calcularTotales().totalMonto }}
                  </span>
                  <span class="font-weight-bold mr-2">
                    <span class="font-weight-regular body-2"
                      >Valor Presentado:
                    </span>
                    {{ calcularTotales().totalValorPresentado }}
                  </span>
                  <span class="font-weight-bold body-1">
                    <span class="font-weight-regular body-2">
                      Importe Iva Arancel:
                    </span>
                    {{ calcularTotales().totalImporteIvaArancel }}
                  </span>
                </div>

                <v-col class="d-flex justify-end align-center my-2">
                  <span>Mostrar</span>
                  <v-menu top>
                    <template v-slot:activator="{ on }">
                      <v-btn dark text color="primary" class="ml-2" v-on="on">
                        {{ size }}
                        <v-icon>mdi-arrow-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(size, index) in rowsPerPageArray"
                        :key="index"
                        @click="updatePage(number, size)"
                      >
                        <v-list-item-title>{{ size }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>
            </template>
          </v-data-table>
        </div>
      </v-skeleton-loader>

      <div class="text-center pt-2" v-if="prisma.length > 0 && !loadingTable">
        <v-pagination
          v-model="number"
          :length="lastPage"
          @input="updatePage($event)"
          circle
        ></v-pagination>
      </div>
      <DetallePrisma
        :movimientos="selected.map((mov) => mov.movimiento_prisma)"
        :pagos="selected.map((mov) => mov.pago_prisma)"
      />
    </div>
  </div>
</template>

<script>
import { formatDate, formatImport } from "@/helpers";
import cierreService from "@/services/cierre_lote";
import DetallePrisma from "./DetallePrisma.vue";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TablePrisma",
  components: { DetallePrisma },

  data() {
    return {
      formatImport,
      formatDate,

      selected: [],

      headersTable: [
        {
          text: "cl_id",
          align: "start",
          sortable: false,
          value: "cl_id",
        },
        {
          text: "Pago estado externos id",
          value: "pagoestadoexternos_id",
          width: "190px",
          sortable: false,
        },
        {
          text: "Channel aranceles id",
          value: "channelaranceles_id",
          width: "160px",
          sortable: false,
        },
        { text: "Impuestos_id", value: "impuestos_id", sortable: false },
        {
          text: "prismamovimientodetalles_id",
          value: "prismamovimientodetalles_id",
          sortable: false,
        },

        {
          text: "prismatrdospagos_id",
          value: "prismatrdospagos_id",
          sortable: false,
        },
        {
          text: "banco_external_id",
          value: "banco_external_id",
          sortable: false,
        },
        { text: "tiporegistro", value: "tiporegistro", sortable: false },
        {
          text: "pagos_uuid",
          value: "pagos_uuid",
          width: "180px",
          sortable: false,
        },
        {
          text: "externalmediopago",
          value: "externalmediopago",
          sortable: false,
        },
        { text: "tipooperacion", value: "tipooperacion", sortable: false },
        { text: "fechaoperacion", value: "fechaoperacion", sortable: false },
        { text: "fecha_creacion", value: "fecha_creacion", sortable: false },
        { text: "monto", value: "monto", sortable: false },
        { text: "montofinal", value: "montofinal", sortable: false },
        { text: "valorpresentado", value: "valorpresentado", sortable: false },
        {
          text: "difernciaimporte",
          value: "difernciaimporte",
          sortable: false,
        },
        {
          text: "coeficientecalculado",
          value: "coeficientecalculado",
          sortable: false,
        },
        {
          text: "costototalporcentaje",
          value: "costototalporcentaje",
          sortable: false,
        },
        {
          text: "importeivaarancel",
          value: "importeivaarancel",
          sortable: false,
        },
        {
          text: "codigoautorizacion",
          value: "codigoautorizacion",
          sortable: false,
        },
        { text: "nroticket", value: "nroticket", sortable: false },
        { text: "site_id", value: "site_id", sortable: false },
        { text: "nrocuota", value: "nrocuota", sortable: false },
        { text: "fecha_de_cierre", value: "fecha_cierre", sortable: false },
        {
          text: "nroestablecimiento",
          value: "nroestablecimiento",
          sortable: false,
        },
        {
          text: "externalcliente_id",
          value: "externalcliente_id",
          width: "350px",
          sortable: false,
        },
        {
          text: "nombrearchivolote",
          value: "nombrearchivolote",
          sortable: false,
        },
        { text: "match", value: "match", sortable: false },
        { text: "fecha_de_pago", value: "fecha_pago", sortable: false },
        {
          text: "descripcion",
          value: "descripcion",
          sortable: false,
          width: "470px",
        },
        {
          text: "descripcionpresentacion",
          value: "descripcionpresentacion",
          sortable: false,
          width: "450px",
        },
        { text: "cantdias", value: "cantdias", sortable: false },
        { text: "disputa", value: "disputa", sortable: false },
        { text: "enobservacion", value: "enobservacion", sortable: false },
        { text: "Acciones", value: "actions", sortable: false, width: "100px" },
      ],

      dialog: false,
      dialogReversion: false,
      reversion: null, // donde se guardan los datos de los movimientos que son reversiones para mostrar en el dialog

      menu: false,

      editItem: {
        id: "",
        fecha_cierre: null,
        disputa: false,
        enobservacion: false,
        monto: "",
      },

      fechaCierre: null,
      loading: false,
    };
  },

  computed: {
    ...mapGetters("cierre_lote", [
      "fechaInicio",
      "fechaFin",
      "prisma",
      "size",
      "rowsPerPageArray",
      "loadingTable",
      "lastPage",
      "cargarMovimientos",
      "cargarPagos",
    ]),

    number: {
      get() {
        return this.$store.getters["cierre_lote/number"];
      },
      set(newNumber) {
        this.$store.dispatch("cierre_lote/setNumber", newNumber);
      },
    },
  },

  methods: {
    ...mapActions("cierre_lote", [
      "setSize",
      "setNumber",
      "getPrismaData",
      "setDialogDetalleMovimiento",
    ]),

    deleteItem(item) {
      //this.dialogDelete = true;
      this.$swal
        .fire({
          title:
            "<p style='font-family: sans-serif'>Desea eliminar este movimiento?</p>",
          showCancelButton: true,
          confirmButtonText: "Eliminar",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#F44336",
        })
        .then((result) => {
          //eliminar movimiento
          if (result.isConfirmed) {
            const params = {
              id: item.Id,
            };

            cierreService.deletePrisma(params).then(() => {
              this.$swal.fire({
                html: "<p style='font-family: sans-serif'>Movimiento eliminado correctamente</p>",
                icon: "success",
              });
            });
          }
        });
    },

    cargarDatosEditar(item) {
      const { cl_id, monto, fecha_cierre, enobservacion, disputa } = item;

      this.editItem.id = cl_id;
      this.editItem.monto = this.formatImport(monto).substring(2);
      this.editItem.fecha_cierre = moment(fecha_cierre).add(1, "days");
      this.editItem.enobservacion = enobservacion;
      this.editItem.disputa = disputa;

      this.dialog = true;
    },

    async editarItem() {
      const monto = this.editItem.monto.split(".").join("").split(",").join("");

      const datos = {
        id: this.editItem.id,
        fecha_cierre: this.fechaCierre
          ? moment(this.editItem.fecha_cierre).toISOString()
          : moment(this.editItem.fecha_cierre)
              .subtract(1, "days")
              .toISOString(),
        disputa: this.editItem.disputa,
        enobservacion: this.editItem.enobservacion,
        monto: parseInt(monto),
      };

      try {
        this.loading = true;
        await cierreService.updatePrisma(datos);
        this.fechaCierre = null;

        this.dialog = false;
        this.loading = false;
        this.$swal.fire({
          html: "<p style='font-family: sans-serif'>Movimiento actualizado correctamente</p>",
          icon: "success",
        });

        this.getPrismaData();
      } catch (error) {
        this.loading = false;
        console.error("error: ", error);
      }
    },

    updatePage(page, size) {
      this.selected = [];
      if (page) this.setNumber(page);
      if (size) {
        this.setSize(size);
        this.setNumber(1);
      }
      this.getPrismaData();
    },

    calcularTotales() {
      let totalMonto = 0;
      let totalValorPresentado = 0;
      let totalImporteIvaArancel = 0;
      for (let mov of this.selected) {
        totalMonto += mov.monto;
        totalValorPresentado += mov.valorpresentado;
        totalImporteIvaArancel += mov.importeivaarancel;
      }

      return {
        totalMonto: this.formatImport(totalMonto),
        totalValorPresentado: this.formatImport(totalValorPresentado),
        totalImporteIvaArancel: this.formatImport(totalImporteIvaArancel, true),
      };
    },
    // se encarga de cambiar el fondo de rojo cuando se trata de una reversion
    rowColorReversion(item) {
      if (item.reversion) return "red lighten-5 row-pointer";
    },

    rowClick(item) {
      if (item.reversion) {
        this.dialogReversion = true;
        this.reversion = item;
      }
    },
    cleanSelected() {
      this.selected = [];
    },
  },
  mounted() {
    //escuchar evento para limpiar los movimientos seleccionados, viene desde el componente Prisma, al apretar el boton Filtrar
    this.$on("resetValores", this.cleanSelected);
  },
};
</script>

<style scoped>
::v-deep .row-pointer {
  cursor: pointer;
}
</style>
