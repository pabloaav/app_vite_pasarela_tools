<template>
  <div>
    <v-skeleton-loader
      :loading="loadingTable"
      type="table"
      height="calc(100vh-300px)"
    >
      <p class="text-center grey--text" v-if="rapipago.length === 0">
        Sin registros para mostrar
      </p>
      <v-data-table
        :headers="headerTable"
        :items="rapipago"
        :expanded.sync="expanded"
        item-key="nombre_archivo"
        :page.sync="page"
        :items-per-page="size"
        show-expand
        hide-default-footer
        :loading="loadingTable"
        loading-text="Cargando transacciones"
        class="elevation-1 row-pointer"
        no-data-text="Datos no encontrados"
        @click:row="rowClick"
        fixed-header
        height="calc(100vh - 270px)"
        v-else
      >
        <template v-slot:[`item.conciliado`]="{ item }">
          <v-chip
            :color="esConciliado(item.detalles_cierre_lote) ? 'green' : 'red'"
            dark
          >
            {{ esConciliado(item.detalles_cierre_lote) ? "SI" : "NO" }}
          </v-chip>
        </template>
        <template v-slot:[`item.pago_actualizado`]="{ item }">
          <v-chip :color="item.pago_actualizado ? 'green' : 'red'" dark>
            {{ item.pago_actualizado ? "SI" : "NO" }}
          </v-chip>
        </template>
        <template v-slot:[`item.id_banco`]="{ item }">
          <div class="edit-banco-container">
            {{ item.id_banco }}
            <v-hover v-slot="{ hover }">
              <div class="btn-edit-banco">
                <v-btn
                  icon
                  x-small
                  absolute
                  class="pa-3"
                  outlined
                  text
                  @mouseover="editBancoId = true"
                  @mouseout="editBancoId = false"
                  v-if="showEditBanco(item)"
                  ><v-icon>mdi-pencil</v-icon>

                  <div
                    class="list-opc"
                    :style="{ visibility: hover ? 'visible' : 'hidden' }"
                  >
                    <v-card class="rounded-lg" elevation="6">
                      <v-card-title class="body-1 font-weight-bold py-3"
                        >ID BANCO: {{ item.id_banco }}</v-card-title
                      >
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-text-field
                          ref="idBanco"
                          v-model="idBancoEdit"
                          placeholder="Nuevo ID BANCO"
                          hide-details
                          dense
                          type="number"
                          outlined
                          :autofocus="true"
                        ></v-text-field>
                        <v-btn
                          class="mt-4"
                          color="blue"
                          dark
                          block
                          @click="updateIdBanco(item.id_clrapipago)"
                          :loading="loading"
                          >Actualizar</v-btn
                        >
                      </v-card-text>
                    </v-card>
                  </div>
                </v-btn>
              </div>
            </v-hover>
          </div>
        </template>
        <template v-slot:[`item.fecha_creacion`]="{ item }">
          {{ formatDate(item.fecha_creacion) }}
        </template>
        <template v-slot:[`item.fecha_proceso`]="{ item }">
          {{ formatDate(item.fecha_proceso) }}
        </template>
        <template v-slot:[`item.fecha_acrditacion`]="{ item }">
          {{ formatDate(item.fecha_acrditacion) }}
        </template>
        <template v-slot:[`item.importe_minimo_cobrado`]="{ item }">
          {{ item.importe_minimo_cobrado }}
        </template>
        <template v-slot:[`item.importe_total`]="{ item }">
          {{ formatImport(item.importe_total) }}
        </template>
        <template v-slot:[`item.diferencia_banco`]="{ item }">
          {{ formatImport(item.diferencia_banco, true) }}
        </template>
        <template v-slot:[`item.importe_total_calculado`]="{ item }">
          {{ formatImport(item.importe_total_calculado) }}
        </template>
        <template v-slot:[`item.en_observacion`]="{ item }">
          <v-chip :color="item.en_observacion ? 'green' : 'red'" dark>
            {{ item.en_observacion ? "SI" : "NO" }}
          </v-chip>
        </template>

        <!--DETALLE DE OPERACIÓN-->
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="detalle-container">
            <v-simple-table>
              <thead>
                <tr class="red">
                  <th>FECHA DE COBRO</th>
                  <th>IMPORTE COBRADO</th>
                  <th>IMPORTE CALCULADO</th>
                  <th>CÓDIGO DE BARRA</th>
                  <th>INFORMADO</th>
                  <th>CONCILIADO</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="detalle in item.detalles_cierre_lote"
                  :key="detalle.codigo_barra"
                  class="grey lighten-4"
                >
                  <td>{{ formatDate(detalle.fecha_cobro, true) }}</td>
                  <td>{{ formatImport(detalle.importe_cobrado) }}</td>
                  <td>{{ formatImport(detalle.importe_calculado) }}</td>
                  <td>{{ detalle.codigo_barra }}</td>
                  <td>
                    <v-chip
                      :color="detalle.informado ? 'success' : 'error'"
                      dark
                    >
                      {{ detalle.informado ? "SI" : "NO" }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip
                      :color="detalle.conciliado ? 'teal' : 'deep-orange'"
                      dark
                    >
                      {{ detalle.conciliado ? "SI" : "NO" }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </td>
        </template>

        <!-- FOOTER -->
        <template v-slot:footer>
          <v-row class="no-gutters">
            <v-col class="d-flex justify-center align-center my-2">
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
                    v-for="(number, index) in rowsPerPageArray"
                    :key="index"
                    @click="updatePage(page, number)"
                  >
                    <v-list-item-title>{{ number }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <div class="text-center pt-2" v-if="rapipago.length > 0 && !loadingTable">
      <v-pagination
        v-model="page"
        :length="lastPage"
        circle
        @input="updatePage($event)"
      ></v-pagination>
    </div>
    <DetalleRapipago :detalle="detalleItem" />
  </div>
</template>

<script>
import { formatDate, formatImport } from "@/helpers";
import { mapActions, mapGetters } from "vuex";
import DetalleRapipago from "../DialogDetalle/DetalleRapipago.vue";
import rapipagoService from "../../services/rapipago";
import moment from "moment";

export default {
  name: "TableRapipago",
  components: { DetalleRapipago },
  data() {
    return {
      expanded: [],
      detalleItem: null,
      page: 1,

      formatDate: formatDate,
      formatImport: formatImport,

      headerTable: [
        {
          text: "ID BANCO",
          align: "start",
          sortable: false,
          value: "id_banco",
          width: "95px",
        },
        { text: "Conciliado", value: "conciliado", sortable: false },
        {
          text: "Pago actualizado",
          value: "pago_actualizado",
          sortable: false,
        },
        { text: "Nombre archivo", value: "nombre_archivo", sortable: false },
        {
          text: "Fecha creacion",
          value: "fecha_creacion",
          sortable: false,
          width: "130",
        },
        {
          text: "Fecha proceso",
          value: "fecha_proceso",
          sortable: false,
          width: "120",
        },
        {
          text: "Fecha acreditacion",
          value: "fecha_acrditacion",
          sortable: false,
          width: "145",
          align: "center",
        },
        {
          text: "Días acreditacion",
          value: "cant_dias_acreditacion",
          sortable: false,
          width: "135",
          align: "center",
        },
        {
          text: "Total cobrado $",
          value: "importe_total",
          sortable: false,
          width: "130",
        },
        {
          text: "Importe minimo $",
          value: "importe_minimo_cobrado",
          sortable: false,
          width: "135",
        },
        {
          text: "Total calculado $",
          value: "importe_total_calculado",
          sortable: false,
          width: "135",
        },
        {
          text: "Diferencia banco $",
          value: "diferencia_banco",
          sortable: false,
          width: "145",
        },
        {
          text: "Coeficiente %",
          value: "coeficiente",
          sortable: false,
          width: "115",
        },
        {
          text: "Detalles",
          value: "detalles",
          sortable: false,
          align: "center",
        },
        { text: "Observacion", value: "en_observacion", sortable: false },
      ],

      idBancoEdit: "",
      editBancoId: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters("cierre_lote", [
      "loadingTable",
      "size",
      "number",
      "rowsPerPageArray",
      "lastPage",
      "fechaInicio",
      "fechaFin",
      "rapipago",
    ]),
  },

  watch: {
    number(newNumber) {
      this.page = newNumber;
    },
  },

  methods: {
    ...mapActions("cierre_lote", [
      "getRapipagoData",
      "setNumber",
      "setSize",
      "setDialogDetalleMovimiento",
    ]),

    updatePage(page, size) {
      if (page) this.setNumber(page);
      if (size) {
        this.setSize(size);
        this.setNumber(1);
        this.page = 1;
      }

      this.getRapipagoData();
    },

    //metodo que se encarga de desplegar el detalle al hacer click sobre una fila en la tabla
    rowClick(item, event) {
      if (event.isExpanded) {
        const indexExpanded = this.expanded.findIndex((i) => i === item);
        this.expanded.splice(indexExpanded, 1);
      } else {
        //this.expanded.push(item);
        this.detalleItem = {
          id: item.id_banco,
          detalle: item.detalles_cierre_lote,
        };

        !this.editBancoId && this.setDialogDetalleMovimiento(true);
      }
    },

    // verifica si los detalles recibidos de rapipago están conciliados
    esConciliado(detalles) {
      return detalles.every((detalle) => detalle.conciliado);
    },

    updateIdBanco(rapipago_id) {
      // validacion id requerido
      if (!this.idBancoEdit) {
        return this.$swal.fire({
          title: "ID Banco es requerido",
          confirmButtonText: "Aceptar",
          text: "Complete ese campo por favor",
          icon: "error",
        });
      }

      // ventana modal pidiendo confirmacion del usuario
      this.$swal
        .fire({
          title: "¿Está seguro?",
          icon: "warning",
          text: "El nuevo ID de banco pasará a ser: " + this.idBancoEdit,
          showDenyButton: true,
          confirmButtonText: "Si, actualizar",
          denyButtonText: "Cancelar",
        })
        .then(async ({ isConfirmed }) => {
          // si el usuario confirma -> realizar edicion de ID
          if (isConfirmed) {
            try {
              this.loading = true;
              const body = { banco_id: Number(this.idBancoEdit), rapipago_id };

              const data = await rapipagoService.updateIdBanco(body);
              this.loading = false;

              if (!data.status) throw data.statusMessage;

              this.idBancoEdit = "";
              this.$toast.success(data.statusMessage);

              this.$nextTick(() => this.getRapipagoData());
            } catch (error) {
              console.error(error);
              this.idBancoEdit = "";
              this.$toast.error(error?.response?.data?.message || error);
            }
          }
        });
    },

    showEditBanco(item) {
      const fechaActual = moment().format("YYYY-MM-DD");
      let show = moment(fechaActual).isAfter(moment(item.fecha_acrditacion));

      return item.id_banco === 0 && show;
    },
  },
};
</script>

<style scoped>
.detalle-container {
  padding: 4px 3px !important;
  background: #ddd;
}

.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}

.edit-banco-container {
  position: relative;
}

.btn-edit-banco {
  position: absolute;
  top: -10px;
  right: 10px;
  cursor: default !important;
}

.list-opc {
  position: absolute;
  left: 20px;
  top: -50px;
  width: 260px;
  background: transparent;
  z-index: 10000;
}
</style>
