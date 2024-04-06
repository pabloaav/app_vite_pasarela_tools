<template>
  <v-card elevation="0">
    <v-tabs
      show-arrows
      grow
      v-model="tab"
      color="black"
      center-active
      background-color="grey lighten-4"
    >
      <v-tab
        class="text-capitalize"
        v-for="(step, index) in steps"
        :key="index"
        active-class="blue-grey lighten-5 font-weight-medium"
        >{{ `${index + 1} - ${step}` }}</v-tab
      >
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-items v-model="tab">
      <!-- 1- CONCILIAR DEBINES -->
      <v-tab-item>
        <v-card flat>
          <v-card-text class="mt-10">
            <v-btn outlined block :loading="loading" @click="conciliarDebines">
              <v-icon left>mdi-refresh-circle</v-icon>
              Conciliar Debines
            </v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <!-- 2- NOTIFICAR DEBINES -->
      <v-tab-item>
        <v-card flat>
          <v-card-text class="mt-10"
            ><v-btn outlined block :loading="loading" @click="notificarDebines">
              <v-icon left class="mx-2">mdi-bell</v-icon>
              Notificar Debines
            </v-btn></v-card-text
          >
        </v-card>
      </v-tab-item>

      <!-- 3- CONCILIACION BANCO -->
      <v-tab-item>
        <v-card flat>
          <v-card-text class="mt-10"
            ><v-btn outlined block :loading="loading" @click="conciliarBanco">
              <v-icon left class="mx-2">mdi-bank-check</v-icon>
              Conciliacion con banco
            </v-btn></v-card-text
          >
        </v-card>
      </v-tab-item>

      <!-- 4- GENERACION DE MOVIMIENTOS -->
      <v-tab-item>
        <v-card flat>
          <v-card-text class="mt-10"
            ><v-btn
              outlined
              block
              :loading="loading"
              @click="generarMovimientos"
            >
              <v-icon left class="mx-2">mdi-arrow-u-left-bottom</v-icon>
              Generación de movimientos
            </v-btn></v-card-text
          >
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import apilinkService from "../../services/apilink";
export default {
  name: "EjecutarProceso",
  data() {
    return {
      steps: [
        "Conciliar debines",
        "Notificar debines",
        "Conciliación con banco",
        "Generación de movimientos",
      ],

      tab: 0,
      loading: false,
    };
  },
  methods: {
    // PASO 1 - CONCILIAR DEBINES
    async conciliarDebines() {
      try {
        this.loading = true; // aniciando animación de carga
        const { message } = await apilinkService.conciliarDebines();

        this.$toast.success(message); // mostrando msj de exito
        this.loading = false; // deteniendo animación de carga
      } catch (error) {
        this.loading = false; // deteniendo animación de carga
        console.error(error);

        const errorData = error.response.data;

        errorData.status === 404
          ? this.$toast.warning(errorData.message) // si el error producido es un 404
          : this.$toast.error(errorData.message); // en caso de que sea un 400
      }
    },

    // PASO 2 - NOTIFICAR DEBINES
    async notificarDebines() {
      try {
        this.loading = true; // iniciando animación de carga
        const { message } = await apilinkService.notificarDebines();

        this.$toast.success(message); // mostrando mjs de exito
        this.loading = false; // deteniendo animación de carga
      } catch (error) {
        const errorData = error.response.data;

        errorData.status === 404
          ? this.$toast.warning(errorData.message) // si el error producido es un 404
          : this.$toast.error(errorData.message); // en caso de que sea un 400

        this.loading = false; // deteniendo animación de carga
        console.error(error);
      }
    },

    // PASO 3 - CONCILIAR BANCO
    async conciliarBanco() {
      try {
        this.loading = true; // iniciando animación de carga

        const { mesagge } = await apilinkService.conciliarBanco();

        this.$toast.success(mesagge); // mostrando msj de exito
        this.loading = false; // deteniendo animación de carga
      } catch (error) {
        console.error(error);
        const errorData = error.response.data;

        errorData.status === 404
          ? this.$toast.warning(errorData.message) // si el error producido es un 404
          : this.$toast.error(errorData.message); // en caso de que sea un 400

        this.loading = false; // deteniendo animación de carga
      }
    },

    // PASO 4 - GENERAR MOVIMIENTOS
    async generarMovimientos() {
      try {
        this.loading = true; // iniciando animación de carga

        const { message } = await apilinkService.generarMovimientos();

        this.$toast.success(message); // mostrando msj de exito
        this.loading = false; // deteniendo animación de carga
      } catch (error) {
        const errorData = error.response.data;

        errorData.status === 404
          ? this.$toast.warning(errorData.message) // si el error producido es un 404
          : this.$toast.error(errorData.message); // en caso de que sea un 400

        console.error(error);
        this.loading = false; // deteniendo animación de carga
      }
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
