<template>
  <v-main>
    <!-- <v-subheader class="mx-4">Reportes </v-subheader> -->
    <span class="loader" v-if="loading"></span>

    <v-row v-if="!loading" class="mx-1 mt-3">
      <v-col cols="12" lg="7">
        <v-row>
          <!-- FILTROS -->
          <v-col
            cols="12"
            sm="6"
            class="d-flex flex-column justify-space-between"
            style="max-height: 220px"
          >
            <!-- FECHA DE INICO -->
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
                  :value="formatDate(fechaInicio)"
                  label="Fecha de inicio"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  dense
                  hide-details
                  class="mb-5 mb-sm-4"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fechaInicio"
                @input="menu = false"
                @change="getData()"
                no-title
                locale="es-Es"
                color="teal"
                :max="fechaFin"
              ></v-date-picker>
            </v-menu>

            <!-- FECHA FIN -->
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
                  :value="formatDate(fechaFin)"
                  label="Fecha fin"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  v-bind="attrs"
                  dense
                  v-on="on"
                  hide-details
                  class="mb-7 mb-sm-2"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fechaFin"
                @input="menu2 = false"
                @change="getData()"
                no-title
                locale="es-Es"
                color="red"
                :min="fechaInicio"
                :max="fechaActual"
              ></v-date-picker>
            </v-menu>

            <!-- TIPO DE REPORTE -->
            <div class="d-flex flex-column mx-1">
              <span class="body-2 mb-1">Filtrar por: </span>
              <v-btn-toggle
                class="mb-2"
                color="blue accent-3"
                v-model="tipoFiltro"
                madatory
                @change="getData()"
              >
                <v-btn width="50%" text height="40px">cobranzas</v-btn>

                <v-btn width="50%" text height="40px"> rendiciones </v-btn>
              </v-btn-toggle>
            </div>
          </v-col>
          <!-- CARD TOTALES -->
          <v-col cols="12" sm="6">
            <v-card
              class="elevation-0 pa-3"
              style="border: 1px solid #ccc !important"
              min-height="170px"
            >
              <v-card-title class="body-2 pb-2 d-flex">
                {{ titleReporte }}
                <v-spacer></v-spacer>

                <!-- descargar pdf -->
                <v-tooltip bottom color="black">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      text
                      class="grey lighten-4"
                      v-on="on"
                      absolute
                      right
                      style="right: 60px"
                      @click="previewPDF()"
                    >
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar PDF</span>
                </v-tooltip>
                <!-- enviar PDF -->
                <v-tooltip bottom color="black">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      text
                      class="grey lighten-4"
                      v-on="on"
                      right
                      absolute
                      @click="showDialogSendGrafico()"
                    >
                      <v-icon>mdi-email-arrow-right</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar PDF</span>
                </v-tooltip>
              </v-card-title>

              <v-card-text>
                <h2 class="black--text">$ {{ montoTotal }}</h2>

                <div>
                  <p class="caption black--text mt-4 mb-1">
                    TOTAL COMISIONES TELCO
                  </p>
                  <h3 class="black--text">$ {{ totalComisiones }}</h3>
                </div>
                <p class="ma-0 mt-2">
                  Cantidad de operaciones: <b>{{ totalOperaciones }}</b>
                </p>

                <v-btn
                  block
                  class="mt-5 blue rounded-pill"
                  dark
                  @click="showDetalle()"
                >
                  Ver detalle
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- GRAFICO DE BARRA -->
          <v-col
            cols="12"
            style="aspect-ratio: 16/10 !important"
            class="d-flex flex-column"
          >
            <v-subheader class="mt-3">Reporte semanal</v-subheader>
            <v-row class="mx-5 mt-2 justify-space-between align-center">
              <v-btn
                icon
                class="grey lighten-4"
                :disabled="semanaActual === 1"
                @click="semanaActual -= 1"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <p class="mb-2 text-body-2">
                Del
                <span class="font-weight-bold mr-1">
                  {{ currentData.labels[0] }}
                </span>
                al
                <span class="font-weight-bold ml-1">
                  {{ currentData.labels[currentData.labels.length - 1] }}
                </span>
              </p>
              <v-btn
                icon
                class="grey lighten-4"
                :disabled="semanaActual === totalSemanas"
                @click="semanaActual += 1"
                ><v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-row>

            <Bar
              :data="currentData"
              :tipoFiltro="tipoFiltro"
              style="flex: 500"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="5" class="mt-8 mt-sm-0">
        <v-row>
          <v-col
            cols="6"
            v-for="(cliente, n) in totalClientes"
            :key="n"
            class="pa-1 pa-sm-2"
          >
            <v-card
              elevation="0"
              height="100%"
              style="border: 1px solid #ccc !important"
            >
              <v-card-title class="caption pb-2">
                {{ cliente.Cliente }}
              </v-card-title>
              <v-card-text>
                <h2
                  class="black--text body-2 text-sm-h6"
                  style="font-weight: 900 !important"
                >
                  $ {{ cliente.TotalMensual }}
                </h2>
                <div>
                  <p class="mb-0 mt-2 caption">COMISIÓN TELCO</p>
                  <p class="black--text font-weight-black text-subtitle-1 mb-0">
                    $ {{ cliente.TotalComisionMensual }}
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <Doughnut :data="totalClientes" :tipoFiltro="tipoFiltro" class="mt-8" />
      </v-col>
    </v-row>

    <DetalleGraficos ref="dialogDetalle" />
    <CobranzasPDF
      :data="tipoFiltro === 0 ? cobranzasDias : rendicionesDias"
      :clientes="totalClientes"
      :tipoFiltro="tipoFiltro"
      :montoTotal="String(montoTotal)"
      :totalOperaciones="totalOperaciones"
      :totalComisiones="totalComisiones"
      :fechaInicio="fechaInicio"
      :fechaFin="fechaFin"
      :fechaActual="fechaActual"
      ref="dialogPDF"
    />
    <EnviarGrafico ref="dialogSendGrafico" />
  </v-main>
</template>

<script>
import moment from "moment";
import reporteService from "@/services/reportes";
import Doughnut from "@/components/ReportesGraficos/Doughnut.vue";
import { formatDate } from "@/helpers";
import DetalleGraficos from "../components/ReportesGraficos/DetalleGraficos.vue";
import Bar from "../components/ReportesGraficos/Bar.vue";
import CobranzasPDF from "../components/ReportesGraficos/CobranzasPDF.vue";
import EnviarGrafico from "../components/ReportesGraficos/EnviarGrafico.vue";
import notyf from "../plugins/toast";

export default {
  name: "ReportesGraficos",
  components: { Bar, Doughnut, DetalleGraficos, CobranzasPDF, EnviarGrafico },
  data() {
    return {
      fechaInicio: moment().startOf("month").format("YYYY-MM-DD"),
      fechaFin: moment().format("YYYY-MM-DD"),
      fechaActual: moment().format("YYYY-MM-DD"),
      menu: false,
      menu2: false,

      tipoFiltro: 0,

      totalClientes: [],
      montoTotal: 0,
      totalOperaciones: 0,
      totalComisiones: "0",
      cobranzasDias: [],
      rendicionesDias: [],
      // operaciones: [],
      loading: false,
      // cobranzasSemanal: [],

      semanaActual: 1,
      cantDias: 10,

      formatDate,
      titleReporte: "",
    };
  },

  mounted() {
    this.getData();
    // this.geRendicionesMensuales();
  },

  computed: {
    totalSemanas() {
      if (this.tipoFiltro === 0) {
        return Math.ceil(this.cobranzasDias.length / this.cantDias);
      }

      return Math.ceil(this.rendicionesDias.length / this.cantDias);
    },
    currentData() {
      const startIndex = (this.semanaActual - 1) * this.cantDias;
      const endIndex = startIndex + this.cantDias;

      if (this.tipoFiltro === 0) {
        // FILTRO COBRANZAS
        const semanaActual = this.cobranzasDias.slice(startIndex, endIndex);

        const labels = semanaActual.map((c) =>
          c.FechaCobranzas.substring(0, 10)
        );
        const totales = semanaActual.map((c) => c.CobranzaTotalDia.toFixed(2));
        const operaciones = semanaActual.map((c) => c.OperacionesTotalDia);

        return { labels, totales, operaciones };
      } else {
        // FILTRO RENDICIONES
        const semanaActual = this.rendicionesDias.slice(startIndex, endIndex);

        const labels = semanaActual.map((r) => r.FechaRendicion);
        const totales = semanaActual.map((r) => r.RendicionTotalDia.toFixed(2));
        const operaciones = semanaActual.map((r) => r.OperacionesTotalDia);
        const comisiones = semanaActual.map((r) => r.ComisionTotalDia);

        return { labels, totales, operaciones, comisiones };
      }
    },
  },

  methods: {
    previewPDF() {
      this.$refs.dialogPDF.$emit("generatePDF");
    },
    showDialogSendGrafico() {
      this.$refs.dialogSendGrafico.$emit("showDialogSendGrafico");
    },
    async getPagoMensuales(params) {
      try {
        this.loading = true;
        this.semanaActual = 1;
        this.tipoFiltro = 0;
        const data = await reporteService.reportesPagosMensuales(params);
        if (!data.data.CobranzasDías) {
          this.$toast.warning("Sin registros encontrados");
        }

        this.loading = false;
        this.totalClientes = data?.data?.TotalCliente || [];
        this.totalOperaciones = data?.data?.TotalOperaciones || 0;
        this.cobranzasDias = data?.data?.CobranzasDías.reverse() || [];
        this.montoTotal = data?.data?.TotalCobranza || 0;
        this.totalComisiones = data?.data?.TotalComision || "0";
        this.titleReporte = "TOTAL COBRANZAS";
        // this.semanaActual = this.totalSemanas;
      } catch (error) {
        this.loading = false;
        this.$toast.error(error.response.data.message);
        console.error(error);
      }
    },

    async geRendicionesMensuales(params) {
      try {
        this.loading = true;
        this.semanaActual = 1;
        this.tipoFiltro = 1;
        const data = await reporteService.reportesRendicionesMensuales(params);

        this.totalClientes = data?.data?.TotalCliente || [];
        this.totalOperaciones = data?.data?.TotalOperaciones || 0;
        this.montoTotal = data?.data?.TotalRendicion;
        this.rendicionesDias = data?.data?.RendicionesDías?.reverse() || [];
        this.totalComisiones = data?.data?.TotalComision || "0";

        this.loading = false;
        this.titleReporte = "TOTAL RENDICIONES";

        // en caso de que no existan registros -> mostrar toast
        if (!data.data.RendicionesDías) {
          notyf.open({
            type: "warning",
            message: "Sin registros encontrados",
          });
        }
      } catch (error) {
        this.loading = false;
        console.error(error);
        notyf.error(error.response.data.message);
      }
    },

    getData() {
      const fechaInicio = moment(this.fechaInicio);
      const fechaFin = moment(this.fechaFin);

      if (fechaFin.diff(fechaInicio, "days") > 31) {
        return this.$swal.fire({
          title: "Rango de fechas",
          text: "No puede ser mayor a 31 días",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }

      const params = {
        FechaInicio: `${this.fechaInicio}T00:00:00-03:00`,
        FechaFin: `${this.fechaFin}T00:00:00-03:00`,
        OrdenMayorCobranza: true,
      };

      this.tipoFiltro === 0
        ? this.getPagoMensuales(params)
        : this.geRendicionesMensuales(params);
    },

    showDetalle() {
      this.$refs.dialogDetalle.$emit("showDetalle", {
        cobranzas: this.cobranzasDias,
        rendiciones: this.rendicionesDias,
        tipo: this.tipoFiltro,
      });
    },
  },
};
</script>

<style scoped>
.loader {
  width: 45px;
  height: 45px;
  border: 6px solid #2196f3;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
