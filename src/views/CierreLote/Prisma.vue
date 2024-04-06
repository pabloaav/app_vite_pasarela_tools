<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      right
      width="340px"
    >
      <div class="pa-5 d-flex flex-column" style="gap: 20px">
        <p class="text-center font-weight-bold ma-0 text-h6">Filtros</p>
        <v-select
          :items="opcionesFecha"
          item-text="label"
          item-value="value"
          label="Tipo de fecha"
          v-model="filter.tipoFecha"
          hint="Requerido *"
          persistent-hint
          prepend-icon="mdi-calendar-search"
        ></v-select>

        <v-select
          :items="opcionesOperacion"
          item-text="label"
          item-value="value"
          label="Tipo de operación"
          hint="Opcional"
          persistent-hint
          prepend-icon="mdi-format-list-bulleted"
          v-model="filter.tipoOperacion"
        ></v-select>

        <v-checkbox
          label="Cargar movimientos prisma"
          class="ma-0 pa-0 mb-2"
          v-model="filter.cargarMovimientos"
          hide-details
        />
        <v-checkbox
          label="Cargar pagos prisma"
          class="ma-0 pa-0 mb-2"
          v-model="filter.cargarPagos"
          hide-details
        />

        <v-checkbox
          label="Disputa"
          class="ma-0 pa-0 mb-2"
          v-model="filter.disputa"
          hide-details
        ></v-checkbox>

        <v-checkbox
          label="En observación"
          class="ma-0 pa-0 mb-2"
          hide-details
          v-model="filter.enObservacion"
        ></v-checkbox>
      </div>

      <template v-slot:append>
        <div class="pa-4">
          <v-btn block color="primary" large tile @click="filtrarListado"
            >filtrar</v-btn
          >
        </div>
      </template>
    </v-navigation-drawer>
    <v-main class="mx-8 overflow-x">
      <!--FILTROS-->
      <v-row align="center" class="mt-2">
        <v-col cols="12" xl="8">
          <div class="d-flex align-center">
            <!--FECHA INICIO-->
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="formatDate(fechaInicio, false)"
                  label="Fecha inicio"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  hint="Opcional"
                  persistent-hint
                  style="max-width: 220px"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filter.date1"
                @input="menu1 = false"
                locale="es"
                @change="setFechaInicio(filter.date1)"
                :max="limitarFechas.max"
              ></v-date-picker>
            </v-menu>

            <!--FECHA FIN-->
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="formatDate(fechaFin, false)"
                  label="Fecha fin"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  hint="Opcional"
                  persistent-hint
                  style="max-width: 220px"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filter.date2"
                @input="menu2 = false"
                locale="es"
                @change="setFechaFin(filter.date2)"
              ></v-date-picker>
            </v-menu>

            <!-- CODIGOS DE AUTORIZACION -->
            <v-select
              v-model="codigosAutorizacion"
              clearable
              clear-icon="mdi-delete"
              :items="codigosAutorizacion"
              label="Códigos de autorizacion"
              :item-text="'codigo'"
              return-object
              no-data-text="Sin códigos seleccionados"
              multiple
              class="ml-3"
              single-line
            >
              <template v-slot:selection="{ item, index }">
                <v-chip small color="grey lighten-3" v-if="index < 3">
                  <span class="black--text text-subtitle-1">{{
                    item.codigo
                  }}</span>
                </v-chip>
                <span v-if="index === 4" class="grey--text text-caption">
                  (+{{ codigosAutorizacion.length - 3 }} seleccionados)
                </span>
              </template>
              <!-- boton tres puntos verticales -->
              <template v-slot:append-outer>
                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item link @click="drawer = true">
                      <v-list-item-icon>
                        <v-icon>mdi-filter-multiple-outline</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title>Más filtros</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      link
                      :disabled="codigosAutorizacion.length == 0"
                      @click="copiarPortaPapeles"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-clipboard-outline</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title>Copiar códigos</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      link
                      :disabled="codigosAutorizacion.length == 0"
                      @click="dialogEditarCodigos = true"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-pencil</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title>Editar códigos</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      link
                      :disabled="codigosAutorizacion.length == 0"
                      @click="compararPrecios"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-cash-check</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title>Comparar precios</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-select>

            <!-- boton de INFORMACION (filtros seleccionados) -->
            <template>
              <div class="text-center">
                <v-menu
                  open-on-hover
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-information-outline</v-icon>
                    </v-btn>
                  </template>

                  <v-card class="pa-3" elevation="2" width="300">
                    <strong>Filtros seleccionados:</strong>
                    <br />

                    <span class="d-flex align-center"
                      >Tipo de fecha: {{ selectedTipoFechaLabel }}</span
                    >

                    <br />
                    <span class="d-flex align-center"
                      >Tipo de operación: {{ selectedTipoOperacionLabel }}</span
                    >
                    <span class="d-flex align-center">
                      Cargar movimientos prisma:
                      <v-switch
                        class="ml-2"
                        v-model="filter.cargarMovimientos"
                      ></v-switch>
                    </span>
                    <span class="d-flex align-center">
                      Cargar pagos prisma:
                      <v-switch
                        class="ml-2"
                        v-model="filter.cargarPagos"
                      ></v-switch>
                    </span>
                    <span class="d-flex align-center">
                      Disputa:
                      <v-switch
                        class="ml-2"
                        v-model="filter.disputa"
                      ></v-switch>
                    </span>
                    <span class="d-flex align-center">
                      En observacion:
                      <v-switch
                        class="ml-2"
                        v-model="filter.enObservacion"
                      ></v-switch>
                    </span>
                  </v-card>
                </v-menu>
              </div>
            </template>

            <v-btn class="ml-8" dark color="blue" @click="filtrarListado">
              <v-icon left>mdi-filter-variant</v-icon>
              Filtrar</v-btn
            >
          </div>
        </v-col>
      </v-row>

      <v-subheader class="font-weight-bold" v-if="!loadingTable"
        >Prisma / Cierre de lote</v-subheader
      >

      <!--TABLA-->
      <TablePrisma class="mb-4" ref="tabla" />

      <v-dialog v-model="dialogPrecios" max-width="700px">
        <div class="white pa-3">
          <span class="text-h6">PRECIOS</span>
          <v-data-table
            :headers="headerPrecios"
            :items="dataPrecios"
            hide-default-footer
            no-data-text="Sin datos disponibles para mostrar"
            disable-pagination
          >
            <template v-slot:[`item.montoMovimiento`]="{ item }">
              {{ formatImport(item.montoMovimiento) }}
            </template>
            <template v-slot:[`item.montoPrisma`]="{ item }">
              {{ formatImport(item.montoPrisma) }}
            </template>
            <template v-slot:[`item.coincidencia`]="{ item }">
              <v-chip
                :color="item.coincidencia ? 'green' : 'red'"
                class="white--text"
              >
                {{ item.coincidencia ? "Si" : "No" }}
              </v-chip>
            </template>
          </v-data-table>
        </div>
      </v-dialog>

      <v-dialog
        v-model="dialogEditarCodigos"
        width="400px"
        @click:outside="filtrarListado"
      >
        <v-card>
          <v-card-title>Editar códigos de autorización</v-card-title>
          <v-card-text>
            <v-text-field
              class="pa-3"
              :value="codigo.codigo"
              v-for="(codigo, index) in codigosAutorizacion"
              :key="index"
              v-model="codigosAutorizacion[index].codigo"
            ></v-text-field
          ></v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </div>
</template>

<script>
import moment from "moment";
import TablePrisma from "@/components/CierreLote/TablePrisma.vue";
import { formatImport, formatDate } from "@/helpers";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "PrismaView",
  components: { TablePrisma },
  data() {
    return {
      showCard: false,
      drawer: false,
      filter: {
        date1: null,
        date2: null,
        tipoFecha: "C",
        fechaCreacion: true,
        fechaOperacion: false,
        fechaPago: false,
        tipoOperacion: null,
        disputa: false,
        enObservacion: false,
        cargarMovimientos: false,
        cargarPagos: false,
      },

      limitarFechas: {
        max: new Date().toISOString().substr(0, 10),
      },

      formatDate: formatDate,
      formatImport: formatImport,

      menu: null,
      menu1: false,
      menu2: false,

      dialogPrecios: false,
      dataPrecios: [],

      headerPrecios: [
        {
          text: "CODIGO AUTORIZACIÓN",
          value: "codigoautorizacion",
          sortable: false,
        },
        {
          text: "PRECIO MOVIMIENTO",
          value: "montoMovimiento",
          sortable: false,
        },
        { text: "PRECIO PRISMA", value: "montoPrisma", sortable: false },
        { text: "COINCIDENCIA", value: "coincidencia", sortable: false },
      ],

      dialogEditarCodigos: false,

      opcionesFecha: [
        { label: "Fecha de creación", value: "C" },
        { label: "Fecha de operación", value: "O" },
        { label: "Fecha de pago", value: "P" },
      ],
      opcionesOperacion: [
        { label: "C - Autorizado", value: "c" },
        { label: "A - Rechazado", value: "a" },
        { label: "D - Revertido", value: "d" },
      ],
    };
  },
  computed: {
    ...mapGetters("cierre_lote", [
      "fechaInicio",
      "fechaFin",
      "loadingTable",
      "prisma",
    ]),

    codigosAutorizacion: {
      get() {
        return this.$store.getters["cierre_lote/codigosAutorizacion"];
      },
      set(newCode) {
        return this.$store.dispatch(
          "cierre_lote/setCodigosAutorizacion",
          newCode
        );
      },
    },
    selectedTipoFechaLabel() {
      const selectedValue = this.filter.tipoFecha;
      const selectedItem = this.opcionesFecha.find(
        (item) => item.value === selectedValue
      );
      return selectedItem ? selectedItem.label : "";
    },
    selectedTipoOperacionLabel() {
      const selectedValue = this.filter.tipoOperacion;
      const selectedItem = this.opcionesOperacion.find(
        (item) => item.value === selectedValue
      );
      return selectedItem ? selectedItem.label : "No seleccionado";
    },
  },

  watch: {
    "filter.tipoFecha"(nuevoTipo) {
      switch (nuevoTipo) {
        case "C":
          this.filter.fechaCreacion = true;
          this.filter.fechaOperacion = false;
          this.filter.fechaPago = false;
          break;
        case "O":
          this.filter.fechaCreacion = false;
          this.filter.fechaOperacion = true;
          this.filter.fechaPago = false;
          break;
        case "P":
          this.filter.fechaCreacion = false;
          this.filter.fechaOperacion = false;
          this.filter.fechaPago = true;
          break;
      }
    },
    codigosAutorizacion(newCodes) {
      if (newCodes.length === 0) this.getPrismaData();
    },
  },
  mounted() {
    this.reset();
    this.setSize(100);
    this.setFechaInicio(moment());
    this.filter.date1 = moment(this.fechaInicio).format("YYYY-MM-DD");
    this.filtrarListado();
  },
  methods: {
    ...mapActions("cierre_lote", [
      "setFechaInicio",
      "setFechaFin",
      "setFechaCreacion",
      "setFechaOperacion",
      "setCargarMovimientos",
      "setCargarPagos",
      "setFechaPago",
      "setTipoOperacion",
      "setDisputa",
      "setObservacion",
      "getPrismaData",
      "setNumber",
      "setSize",
    ]),

    ...mapMutations("cierre_lote", ["reset"]),

    async filtrarListado() {
      if (this.codigosAutorizacion.length > 0) {
        this.filter.cargarPagos = true;
        this.filter.cargarMovimientos = true;
      }

      this.setFechaCreacion(this.filter.fechaCreacion);
      this.setFechaOperacion(this.filter.fechaOperacion);
      this.setFechaPago(this.filter.fechaPago);
      this.setTipoOperacion(this.filter.tipoOperacion);
      this.setDisputa(this.filter.disputa);
      this.setObservacion(this.filter.enObservacion);
      this.setCargarMovimientos(this.filter.cargarMovimientos);
      this.setCargarPagos(this.filter.cargarPagos);

      this.setNumber(1);
      this.getPrismaData(); //realizando peticion de datos a la api
      //emito evento para resetear valores de tablePrisma
      this.$refs.tabla.$emit("resetValores");
    },

    async copiarPortaPapeles() {
      try {
        await navigator.clipboard.writeText(
          this.codigosAutorizacion.map(({ codigo }) => codigo).toString()
        );
        this.$toast.success("Códigos de autorización copiados");
      } catch ($e) {
        this.$toast.error("Error al copiar en porta papeles");
      }
    },

    compararPrecios() {
      const data = this.prisma.map(({ codigoautorizacion, monto }) => {
        const codigo = this.codigosAutorizacion.find(
          (cod) => cod.codigo === codigoautorizacion
        );

        return {
          codigoautorizacion,
          montoMovimiento: codigo.importe,
          montoPrisma: monto,
          coincidencia: codigo.importe === monto,
        };
      });

      this.dataPrecios = data;
      this.dialogPrecios = true;
    },
  },
};
</script>

<style scoped>
.v-application {
  display: flex;
  overflow: auto;
}

.v-main {
  flex: 1 !important;
}
</style>
