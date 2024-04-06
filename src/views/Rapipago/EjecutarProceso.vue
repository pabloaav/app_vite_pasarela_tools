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
      <!-- LEER ARCHIVO MINIO -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-btn
              block
              outlined
              class="mr-4 mt-8"
              @click="leerArchivoMinio"
              :loading="loading"
            >
              <v-icon class="mx-2">mdi-text</v-icon>
              Leer archivo minio
            </v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <!-- ACTUALIZAR ESTADO DE PAGOS -->
      <v-tab-item>
        <v-card flat>
          <v-card-text
            ><v-btn
              block
              outlined
              class="mr-4 mt-8"
              @click="actualizarPagosCL"
              :loading="loading"
            >
              <v-icon class="mx-2">mdi-update</v-icon>
              Actualizar estado de pagos
            </v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <!-- NOTIFICAR PAGOS -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-btn
              block
              outlined
              class="mr-4 mt-8"
              @click="notificarPagos"
              :loading="loading"
            >
              <v-icon class="mx-2">mdi-bell-outline</v-icon>
              Notificar pagos-cl
            </v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <!-- CONCILIACION BANCO -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-btn
              block
              outlined
              class="mr-4 mt-8"
              @click="conciliacionBanco"
              :loading="loading"
            >
              <v-icon class="mx-2">mdi-align-horizontal-distribute</v-icon>
              Conciliacion banco
            </v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <!-- GENERAR MOVIMIENTO -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-btn
              block
              outlined
              class="mr-4 mt-8"
              @click="generarMovimiento"
              :loading="loading"
            >
              <v-icon class="mx-2">mdi-autorenew</v-icon>
              Generar movimiento
            </v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import rapipagoService from "@/services/rapipago";
import notyf from "../../plugins/toast";
import { handleErrorApi, handleSuccessApi } from "../../helpers";

export default {
  name: "EjecutarProceso",
  data() {
    return {
      steps: [
        "leer minio",
        "actualizar estado de pagos",
        "notificar pagos",
        "conciliación banco",
        "generar movimiento",
      ],
      tab: 0,

      loading: false,
    };
  },
  methods: {
    async leerArchivoMinio() {
      try {
        this.loading = true;
        const params = { valor: "recibidos" };

        const res = await rapipagoService.leerArchivoMinio(params);

        this.$toast.success(
          `${res.message} - Cantidad de archivos: ${res.contadorfile}`
        );

        this.loading = false;
      } catch (error) {
        this.$toast.error(error.response.data.message);
        this.loading = false;
      }
    },

    async actualizarPagosCL() {
      try {
        this.loading = true;

        const res = await rapipagoService.actualizarPagosCL();

        if (res.error) throw res.error; // si existe algun error mostrar toast

        notyf.success(handleSuccessApi(res));

        this.loading = false;
      } catch (error) {
        if (typeof error === "string") notyf.error(error);
        else notyf.error(handleErrorApi(error));

        this.loading = false;
      }
    },

    async notificarPagos() {
      try {
        const params = { EstadoId: 4 };
        this.loading = true;

        const res = await rapipagoService.notificarPagosCL(params);

        if (res.error) throw res.error; // si existe algun error mostrar toast

        notyf.success(handleSuccessApi(res));

        this.loading = false;
      } catch (error) {
        if (typeof error === "string") notyf.error(error);
        else notyf.error(handleErrorApi(error));
        this.loading = false;
      }
    },

    async conciliacionBanco() {
      try {
        this.loading = true;

        const res = await rapipagoService.conciliacionBanco();

        if (res.error) throw res.error; // si existe algun error mostrar toast

        notyf.success(handleSuccessApi(res)); // mensaje de exito

        this.loading = false;
      } catch (error) {
        if (typeof error === "string") notyf.error(error);
        else notyf.error(handleErrorApi(error));
        this.loading = false;
      }
    },

    async generarMovimiento() {
      try {
        this.loading = true;

        const res = await rapipagoService.generarMovimiento();

        if (res.error) throw res.error; // si existe algun error mostrar toast

        notyf.success(handleSuccessApi(res)); // mensaje de exito

        this.loading = false;
      } catch (error) {
        if (typeof error === "string") notyf.error(error);
        else notyf.error(handleErrorApi(error));
        this.loading = false;
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
