<template>
  <v-main class="mx-8">
    <!-- <v-subheader class="font-weight-bold mt-2">Calculo Comisiones</v-subheader> -->

    <v-row>
      <v-col>
        <v-form
          class="py-7 px-10 rounded mt-8"
          ref="form"
          style="border: 1px solid #ccc; max-width: 700px"
        >
          <p class="ma-0 mb-5">Calcular movimientos temporales pagos</p>
          <!-- seleccionar fecha -->
          <v-chip small class="ml-2 font-weight-medium mb-3">
            {{ fecha }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-date-picker
            class="ml-4 mb-3"
            elevation="1"
            v-model="fecha"
            locale="es"
            color="green darken-4"
          ></v-date-picker>
          <v-row align="center" class="mt-2">
            <v-col class="d-flex align-center justify-end" style="gap: 10px">
              <!-- BOTON CALCULAR MOVIMIENTOS -->
              <v-btn
                outlined
                class="font-weight-medium"
                @click="calcularMovimientos()"
                :loading="loading"
                color="green darken-4"
              >
                <v-icon left>mdi-calculator-variant-outline</v-icon>
                CALCULAR</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col>
        <div
          class="py-7 px-10 rounded mt-8 mb-12"
          style="border: 1px solid #ccc; max-width: 700px"
        >
          <p class="ma-0 mb-5">Calcular comisiones temporales</p>
          <v-textarea
            label="Movimientos"
            v-model="emails"
            required
            color="dark"
            filled
          ></v-textarea>
          <v-col class="d-flex align-center justify-end">
            <v-btn
              class="font-weight-medium"
              @click="calcularComisionManual()"
              :loading="loading2"
              color="grey darken-4"
              text
              tile
              outlined
            >
              <v-icon left>mdi-calculator-variant-outline</v-icon>
              CALCULAR
            </v-btn>
          </v-col>
        </div>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import Dashboard from "@/components/Dashboard.vue";
import { formatDate } from "../helpers";

import comisionesServices from "@/services/comisiones";
import notyf from "../plugins/toast";
import moment from "moment";
export default {
  name: "CalculoComisiones",
  components: {
    Dashboard,
  },
  data: () => ({
    loading: false,
    loading2: false,

    fecha: moment().startOf("month").format("YYYY-MM-DD"),

    fechaActual: moment().format("YYYY-MM-DD"),

    formatDate,

    emails: [""],
  }),
  methods: {
    async calcularMovimientos() {
      const params = {
        FechaPagoInicio: `${this.fecha}T00:00:00-03:00`,
        FechaPagoFin: `${this.fecha}T00:00:00-03:00`,
      };
      this.loading = true;
      const data = await comisionesServices.movimientosTemporalesPagos(params);
      this.loading = false;

      if (data.error)
        return notyf.open({
          type: "warning",
          message: data.error,
        });

      notyf.success("Movimientos calculados correctamente");

      try {
      } catch (error) {
        this.loading = false;
        notyf.error(error.response.data.message);
      }
    },
    async calcularComisionManual() {
      const formData = new FormData();
      formData.append("movimiento_id", JSON.stringify(this.emails));

      try {
        this.loading2 = true;
        const data = await comisionesServices.comisionManual(formData);
        this.loading2 = false;

        return notyf.success(data.statusMessage);
      } catch (error) {
        this.loading2 = false;
        notyf.error(error.response.data.message);
      }
    },
  },
};
</script>

<style></style>
