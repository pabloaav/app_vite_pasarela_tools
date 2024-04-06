<template>
  <v-main class="mx-8 py-9 overflow">
    <v-subheader class="font-weight-bold"
      >Prisma / Ejecutar proceso</v-subheader
    >
    <v-card>
      <v-tabs
        icons-and-text
        show-arrows
        grow
        v-model="tab"
        color="grey darken-2"
        centered
      >
        <v-tab
          v-for="(step, index) in steps"
          :key="index"
          active-class="blue-grey lighten-5 font-weight-medium"
          >{{ `${index + 1} - ${step}` }}</v-tab
        >
      </v-tabs>
      <v-divider></v-divider>
      <v-tabs-items v-model="tab">
        <!-- LEER ARCHIVO MINIO -->
        <v-tab-item>
          <v-card flat>
            <v-card-text
              ><v-btn
                color="primary"
                class="mr-4 mt-8"
                @click="leerArchivoMinio"
                :loading="loadingMinio"
                >Leer archivo minio</v-btn
              ></v-card-text
            >
          </v-card>
        </v-tab-item>

        <!-- PROCESAR TABLA MOVIMIENTOS -->
        <v-tab-item>
          <v-card flat>
            <v-card-text
              ><v-btn
                class="mr-4 mt-8"
                color="primary"
                @click="procesarTablaMovimientos"
                :loading="loadingTablaMovimiento"
              >
                Procesar tabla movimiento
              </v-btn>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- PROCESAR TABLA PAGOS -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-btn
                class="mr-4 mt-8"
                color="primary"
                @click="procesarTablaPagos"
                :loading="loadingTablaPago"
              >
                Procesar tabla pago
              </v-btn>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- CONCILIACION CLMX -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <div class="d-flex checkbox-container">
                <v-row no-gutters class="pa-3">
                  <v-col cols="12" class="d-flex flex-column" style="gap: 8px">
                    <v-radio-group v-model="clmx">
                      <v-radio label="Compras" value="compras"></v-radio>
                      <v-radio label="Devolucion" value="devolucion"></v-radio>
                      <v-radio label="Anulacion" value="anulacion"></v-radio>
                      <v-radio
                        label="Contracargo"
                        value="contracargo"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="showIdMx"
                      label="Agregar IDMovMxTotal: "
                    >
                    </v-checkbox>
                    <v-text-field
                      v-model="IdMovimientoMxTotal"
                      label="IdMovimientoMxTotal"
                      outlined
                      dense
                      type="number"
                      style="max-width: 300px"
                      v-show="showIdMx"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>

              <v-btn
                color="primary"
                class="mr-4 mt-4"
                @click="conciliacionCLMX"
                :loading="loadingCLMX"
              >
                Conciliar CLMX
              </v-btn>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- CONCILIACION CLPX -->
        <v-tab-item>
          <v-card flat>
            <v-card-text
              ><div class="d-flex checkbox-container">
                <v-row no-gutters class="pa-3">
                  <v-col cols="12" class="d-flex flex-column" style="gap: 8px">
                    <v-radio-group v-model="clpx">
                      <v-radio label="Compras" value="compras"></v-radio>
                      <v-radio label="Devolucion" value="devolucion"></v-radio>
                      <v-radio label="Anulacion" value="anulacion"></v-radio>
                      <v-radio
                        label="Contracargo"
                        value="contracargo"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </div>

              <v-btn
                class="mr-4 mt-4"
                @click="conciliacionCLPX"
                :loading="loadingCLPX"
                color="primary"
                >Conciliar CLPX</v-btn
              ></v-card-text
            >
          </v-card>
        </v-tab-item>

        <!-- CONCILIACION BANCOCL -->
        <v-tab-item>
          <v-card flat>
            <v-card-text
              ><div class="d-flex" style="max-width: 350px; gap: 30px">
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
                      :value="formatDate(fechaBancoCL)"
                      label="Fecha"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fechaBancoCL"
                    @input="menu1 = false"
                    locale="es"
                  ></v-date-picker>
                </v-menu>
                <v-checkbox label="Reversion" v-model="reversion" />
              </div>

              <v-btn
                class="mr-4 mt-8"
                color="primary"
                @click="conciliarBancoCL"
                :loading="loadingBancoCL"
                >Conciliar Banco-CL</v-btn
              ></v-card-text
            >
          </v-card>
        </v-tab-item>

        <!-- GENERAR MOVIMIENTO MANUAL -->
        <v-tab-item>
          <v-card flat>
            <v-card-text
              ><v-checkbox label="Reversion" v-model="reversion" />

              <v-btn
                class="mr-4 mt-6"
                color="primary"
                @click="generarMovimientoManual"
                :loading="loadingMovimiento"
                >Generar movimiento</v-btn
              ></v-card-text
            >
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-main>
</template>
<script>
import { formatDate } from "@/helpers";
import cierreService from "@/services/cierre_lote";
import moment from "moment";

export default {
  name: "EjecutarProceso",
  data() {
    return {
      steps: [
        "Leer  MINIO",
        "Procesar tabla movimientos",
        "Procesar tabla pagos",
        "Conciliacion CLMX",
        "Conciliacion CLPX",
        "Conciliar BancoCL",
        "Generar movimiento manual",
      ],
      step: 1,
      formatDate: formatDate,

      loadingMinio: false,
      loadingTablaMovimiento: false,
      loadingTablaPago: false,
      loadingCLMX: false,
      loadingCLPX: false,
      loadingBancoCL: false,
      loadingMovimiento: false,

      //datos para la seccion conciliacionCLMX Y CLPX
      clmx: "compras",
      clpx: "compras",
      mathCI: false,
      movimientosMx: false,
      pagosPx: false,
      banco: false,
      compras: false,
      devolucion: false,
      anulacion: false,
      contraCargo: false,
      contraCargoMx: false,
      contraCargoPx: false,
      estadoFechaPago: false,
      revision: false,
      IdMovimientoMxTotal: 0,
      showIdMx: false,

      //fecha para seccion conciliar banco cl
      fechaBancoCL: moment().format("YYYY-MM-DD"),
      reversion: false,

      menu1: false,

      tab: 0,
    };
  },
  methods: {
    leerArchivoMinio() {
      const params = {
        valor: "recibidos",
      };

      this.loadingMinio = true;

      cierreService
        .leerArchivoMinio(params)
        .then((res) =>
          this.$toast.success(
            `${res.message} - Cantidad de archivos: ${res.contadorfile}`
          )
        )
        .catch((error) => this.$toast.error(error.response.data.message))
        .finally(() => (this.loadingMinio = false));
    },

    procesarTablaMovimientos() {
      this.loadingTablaMovimiento = true;
      cierreService
        .procesarTablaMovimientos()
        .then((res) => this.$toast.success(res.message))
        .catch((error) => this.$toast.error(error.response.data.message))
        .finally(() => (this.loadingTablaMovimiento = false));
    },

    procesarTablaPagos() {
      this.loadingTablaPago = true;
      cierreService
        .procesarTablaPagos()
        .then((res) => this.$toast.success(res.message))
        .catch((error) => this.$toast.error(error.response.data.message))
        .finally(() => (this.loadingTablaPago = false));
    },

    conciliacionCLMX() {
      switch (this.clmx) {
        case "compras":
          this.mathCI = 1;
          this.movimientosMx = 1;
          this.pagosPx = 1;
          this.banco = 1;
          this.compras = 1;
          this.devolucion = 0;
          this.anulacion = 0;
          this.contraCargo = 0;
          this.contraCargoMx = 0;
          this.contraCargoPx = 0;
          this.revision = 0;
          break;
        case "devolucion":
          this.mathCI = 1;
          this.movimientosMx = 1;
          this.pagosPx = 1;
          this.banco = 1;
          this.compras = 0;
          this.devolucion = 1;
          this.anulacion = 0;
          this.contraCargo = 0;
          this.contraCargoMx = 0;
          this.contraCargoPx = 0;
          this.revision = 0;
          break;
        case "anulacion":
          this.mathCI = 1;
          this.movimientosMx = 1;
          this.pagosPx = 1;
          this.banco = 1;
          this.compras = 0;
          this.devolucion = 0;
          this.anulacion = 1;
          this.contraCargo = 0;
          this.contraCargoMx = 0;
          this.contraCargoPx = 0;
          this.revision = 0;
          break;
        case "contracargo":
          this.mathCI = 0;
          this.movimientosMx = 0;
          this.pagosPx = 0;
          this.banco = 0;
          this.compras = 1;
          this.devolucion = 0;
          this.anulacion = 0;
          this.contraCargo = 1;
          this.contraCargoMx = 0;
          this.contraCargoPx = 0;
          this.revision = 0;
          break;
      }

      const formData = new FormData();
      formData.append("MatchCI", this.mathCI);
      formData.append("MovimientosMX", this.movimientosMx);
      formData.append("PagosPx", this.pagosPx);
      formData.append("Banco", this.banco);
      formData.append("Compras", this.compras);
      formData.append("Devolucion", this.devolucion);
      formData.append("Anulacion", this.anulacion);
      formData.append("ContraCargo", this.contraCargo);
      formData.append("ContraCargoMx", this.contraCargoMx);
      formData.append("ContraCargoPx", this.contraCargoPx);
      formData.append("Reversion", this.revision);

      if (this.showIdMx && this.IdMovimientoMxTotal > 0) {
        formData.append("IdMovimientoMxTotal", this.IdMovimientoMxTotal);
      }

      this.loadingCLMX = true;
      cierreService
        .conciliacionCLMX(formData)
        .then((res) => this.$toast.success(res.message))
        .catch((error) => this.$toast.error(error.response.data.message))
        .finally(() => (this.loadingCLMX = false));
    },

    conciliacionCLPX() {
      switch (this.clpx) {
        case "compras":
          this.mathCI = 1;
          this.movimientosMx = 0;
          this.pagosPx = 1;
          this.banco = 1;
          this.estadoFechaPago = 1;
          this.compras = 1;
          this.devolucion = 0;
          this.anulacion = 0;
          this.contraCargo = 0;
          this.contraCargoMx = 0;
          this.contraCargoPx = 0;
          this.revision = 0;
          break;
        case "devolucion":
          this.mathCI = 1;
          this.movimientosMx = 0;
          this.pagosPx = 1;
          this.banco = 1;
          this.estadoFechaPago = 1;
          this.compras = 0;
          this.devolucion = 1;
          this.anulacion = 0;
          this.contraCargo = 0;
          this.contraCargoMx = 0;
          this.contraCargoPx = 0;
          this.revision = 0;
          break;
        case "anulacion":
          this.mathCI = 1;
          this.movimientosMx = 0;
          this.pagosPx = 1;
          this.banco = 1;
          this.estadoFechaPago = 1;
          this.compras = 0;
          this.devolucion = 0;
          this.anulacion = 1;
          this.contraCargo = 0;
          this.contraCargoMx = 0;
          this.contraCargoPx = 0;
          this.revision = 0;
          break;
        case "contracargo":
          this.mathCI = 0;
          this.movimientosMx = 0;
          this.pagosPx = 0;
          this.banco = 0;
          this.estadoFechaPago = 1;
          this.compras = 1;
          this.devolucion = 0;
          this.anulacion = 0;
          this.contraCargo = 1;
          this.contraCargoMx = 1;
          this.contraCargoPx = 0;
          this.revision = 1;
          break;
      }
      const formData = new FormData();
      formData.append("MatchCI", this.mathCI);
      formData.append("MovimientosMX", this.movimientosMx);
      formData.append("PagosPx", this.pagosPx);
      formData.append("Banco", this.banco);
      formData.append("EstadoFechaPago", this.estadoFechaPago);
      formData.append("FechaPago", "0000-00-00");
      formData.append("Compras", this.compras);
      formData.append("Devolucion", this.devolucion);
      formData.append("Anulacion", this.anulacion);
      formData.append("ContraCargo", this.contraCargo);
      formData.append("ContraCargoMx", this.contraCargoMx);
      formData.append("ContraCargoPx", this.contraCargoPx);
      formData.append("Reversion", this.revision);

      this.loadingCLPX = true;
      cierreService
        .conciliacionCLPX(formData)
        .then((res) => this.$toast.success(res.message))
        .catch((error) => this.$toast.error(error.response.data.message))
        .finally(() => (this.loadingCLPX = false));
    },

    conciliarBancoCL() {
      const formData = new FormData();
      formData.append("FechaAcreditacion", this.fechaBancoCL);
      formData.append("Reversion", this.reversion);

      this.loadingBancoCL = true;

      cierreService
        .conciliarBancoCL(formData)
        .then((res) => this.$toast.success(res.message))
        .catch((error) => this.$toast.error(error.response.data.message))
        .finally(() => (this.loadingBancoCL = false));
    },

    generarMovimientoManual() {
      this.loadingMovimiento = true;
      const params = {
        Reversion: this.reversion,
      };

      cierreService
        .generarMovimientoManual(params)
        .then((res) => this.$toast.success(res.message))
        .catch((error) => this.$toast.error(error.response.data.message))
        .finally(() => (this.loadingMovimiento = false));
    },

    toast() {
      return this.$swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    },
  },
};
</script>

<style scoped>
.v-application {
  overflow: auto !important;
}
.checkbox-container {
  gap: 20px;
}
</style>
