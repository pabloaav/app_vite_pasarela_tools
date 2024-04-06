<template>
  <v-dialog
    scrollable
    v-model="dialogCobranzas"
    max-width="800"
    @click:outside="cleanDialogCobranzas"
  >
    <v-card>
      <v-card-title class="text-h6 mb-2">ENVIAR COBRANZAS</v-card-title>
      <v-card-text style="height: 500px">
        <v-row>
          <v-col cols="5">
            <span class="mx-3">SELECCIONE UNA FECHA: </span>
            <v-chip small class="ml-2 font-weight-medium mb-2">
              {{ formatFecha }}
            </v-chip>

            <!-- seleccionar fecha -->
            <v-date-picker
              class="ml-4 mb-3"
              elevation="1"
              v-model="fecha"
              locale="es"
              color="orange lighten-1"
            ></v-date-picker>
          </v-col>
          <v-col class="ma-10">
            <v-form @submit.prevent="enviarReporteCobranza" ref="form_email">
              <!-- ingresar email -->
              <v-text-field
                v-for="(email, index) in emails"
                :key="index"
                class="ml-4 mb-3"
                label="Ingrese su correo electrónico"
                v-model="emails[index]"
                :rules="emailRules"
                required
              ></v-text-field>

              <!-- add input with a plus button -->
              <v-btn
                class="ml-4 mb-3"
                color="grey lighten-1"
                @click="agregarEmail"
              >
                <v-icon @click="agregarEmail">mdi-plus</v-icon>
                Agregar email
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- boton enviar reporte -->
      <v-card-actions class="pb-3">
        <v-spacer></v-spacer>
        <v-btn
          outlined
          class="font-weight-medium"
          @click="enviarReporteCobranza"
          :loading="loading"
          >Enviar reporte
          <v-icon class="ml-2">mdi-subdirectory-arrow-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatDate, handleSuccessApi, handleErrorApi } from "@/helpers";
import reportesServices from "@/services/reportes";

export default {
  name: "ReportesCobranzas",
  data: () => ({
    dialogCobranzas: false,
    loading: false,

    fecha: null,

    emails: [""],

    emailRules: [
      (v) => !!v || "E-mail es requerido",
      (v) => /.+@.+/.test(v) || "E-mail debe ser válido",
    ],

    formatDate, //por que
  }),

  computed: {
    formatFecha() {
      return this.fecha ? formatDate(this.fecha) : "";
    },
  },
  methods: {
    agregarEmail() {
      this.emails.push("");
    },
    async enviarReporteCobranza() {
      if (!this.fecha || !this.$refs.form_email.validate()) {
        return this.$swal.fire({
          title: "Todos los campos son obligatorios (*)",
          icon: "info",
          text:
            this.emails.length > 1
              ? "Debe seleccionar una fecha e ingresar todos los correos electrónicos."
              : "Debe seleccionar una fecha e ingresar un correo electrónico.",
          confirmButtonText: "Aceptar",
        });
      } else {
        try {
          const params = {
            FechaInicio: this.fecha + "T23:59:59.999Z",
            FechaFin: this.fecha + "T23:59:59.999Z",
            Email: this.emails.join(","),
          };

          this.loading = true;

          const data = await reportesServices.sendReporteCobranzas(params);

          const dataSuccess = handleSuccessApi(data);
          this.$toast.success(dataSuccess);
          this.loading = false;
        } catch (error) {
          const dataError = handleErrorApi(error);
          dataError.status === 404
            ? this.$toast.warning(dataError.message)
            : this.$toast.error(dataError.message);

          this.loading = false;
        }
      }
    },
    cleanDialogCobranzas() {
      this.dialogCobranzas = false;
      this.fecha = null;
      this.$refs.form_email.reset();
      this.emails = [""];
    },
  },
  mounted() {
    this.$on("showDialogCobranzas", () => {
      this.dialogCobranzas = true;
    });
  },
};
</script>

<style scoped>
html {
  overflow: auto !important;
}
</style>
