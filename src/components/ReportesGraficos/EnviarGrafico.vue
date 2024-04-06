<template>
  <v-dialog
    scrollable
    v-model="dialogSendGrafico"
    max-width="650"
    @click:outside="cleanEnviarGrafico"
  >
    <v-card>
      <v-card-actions>
        <v-card-title class="text-h6">ENVIAR REPORTE GRAFICO</v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="cleanEnviarGrafico">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-actions>

      <v-card-text style="height: 350px">
        <v-row>
          <v-col class="ma-10">
            <v-form
              @submit.prevent="enviarReporteGrafico"
              ref="form_envio_grafico"
              lazy-validation
            >
              <!-- adjuntar pdf -->
              <v-file-input
                class="ml-4 mb-3"
                label="Adjuntar PDF"
                v-model="pdf"
                :rules="pdfRules"
                required
                chips
                accept="application/pdf"
              ></v-file-input>

              <!-- ingresar email -->
              <v-text-field
                v-for="(email, index) in emails"
                :key="index"
                class="ml-4 mb-3"
                label="Ingresar un correo electrónico"
                v-model="emails[index]"
                :rules="emailRules"
                required
                prepend-icon="mdi-email-outline"
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
          @click="enviarReporteGrafico"
          :loading="loading"
          >Enviar reporte
          <v-icon class="ml-2">mdi-subdirectory-arrow-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import reportesServices from "@/services/reportes";
import { handleSuccessApi, handleErrorApi } from "@/helpers";
import { Notyf } from "notyf";
import "notyf/notyf.min.css"; // for React, Vue and Svelte
const notyf = new Notyf();
export default {
  name: "EnviarGrafico",
  data() {
    return {
      dialogSendGrafico: false,
      loading: false,

      emails: [""],
      pdf: null,

      //rules
      pdfRules: [(v) => !!v || "PDF es requerido"],
      emailRules: [
        (v) => !!v || "E-mail es requerido",
        (v) => /.+@.+/.test(v) || "E-mail debe ser válido",
      ],
    };
  },
  mounted() {
    this.$on("showDialogSendGrafico", () => {
      this.dialogSendGrafico = true;
    });
  },
  methods: {
    agregarEmail() {
      this.emails.push("");
    },
    async enviarReporteGrafico() {
      if (!this.$refs.form_envio_grafico.validate()) {
        return this.$swal.fire({
          title: "Todos los campos son obligatorios (*)",
          icon: "info",
          text:
            this.emails.length > 1
              ? "Debe seleccionar un archivo e ingresar todos los correos electrónicos."
              : "Debe seleccionar un archivo e ingresar un correo electrónico.",
          confirmButtonText: "Aceptar",
        });
      } else {
        try {
          const formData = new FormData();
          formData.append("Email", JSON.stringify(this.emails));
          formData.append("Archivos", this.pdf);

          this.loading = true;

          const data = await reportesServices.sendReporteGrafico(formData);

          const dataSuccess = handleSuccessApi(data);
          notyf.success({
            message: dataSuccess,
            position: {
              x: "right",
              y: "top",
            },
            dismissible: true,
          });
          //this.$toast.success(dataSuccess);
          this.loading = false;
          this.cleanEnviarGrafico();
        } catch (error) {
          const dataError = handleErrorApi(error);

          notyf.error({
            message: dataError.message,
            position: {
              x: "right",
              y: "top",
            },
            dismissible: true,
          });

          // dataError.status === 404
          //   ? this.$toast.warning(dataError.message)
          //   : this.$toast.error(dataError.message);
          this.loading = false;
        }
      }
    },
    cleanEnviarGrafico() {
      this.dialogSendGrafico = false;
      this.$refs.form_envio_grafico.reset();
      this.emails = [""];
    },
  },
};
</script>

<style></style>
