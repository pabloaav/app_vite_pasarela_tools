<template>
  <v-main class="mx-8">
    <v-subheader class="font-weight-bold mt-2">Webhook</v-subheader>
    <v-row>
      <v-col>
        <v-form
          class="py-7 px-10 rounded"
          ref="form"
          style="border: 1px solid #ccc; max-width: 520px"
        >
          <p class="ma-0">Complete los campos</p>
          <v-text-field
            label="Cantidad de días"
            type="number"
            min="1"
            max="31"
            v-model="cantDias"
            :rules="[
              (v) => !!v || 'Cantidad de días es requerido.',
              (v) => v >= 1 || 'Cantidad de días debe ser mayor a 0.',
            ]"
          />
          <v-checkbox
            label="Informar pagos en estado final"
            v-model="estadoFinalPagos"
            @change="!estadoFinalPagos ? (pagoNotificado = false) : ''"
            hide-details
          ></v-checkbox>

          <v-checkbox
            label="Enviar pagos notificado"
            v-model="pagoNotificado"
            hide-details
            class="mb-4"
            v-show="estadoFinalPagos"
          ></v-checkbox>

          <!-- SELECT DE CUENTA -->
          <v-select
            :items="cuentas"
            v-model="cuentaId"
            :rules="[(v) => !!v || 'Debe seleccionar una cuenta']"
            item-value="id"
            item-text="text"
            label="Cuenta"
            class="mt-4"
          ></v-select>
          <v-btn class="primary mt-6" :loading="loading" @click="notificarPagos"
            >notificar pagos
          </v-btn>
        </v-form>
      </v-col>
      <!-- ------------------------------------------------------NOTIFICAR PAGOS REFERENCES--------------------------------------------- -->
      <v-col>
        <v-form
          class="py-7 px-10 rounded"
          ref="form2"
          style="border: 1px solid #ccc"
        >
          <p class="ma-0">Notificar pagos references</p>
          <!-- SELECT DE CUENTA -->
          <v-select
            :items="cuentas"
            v-model="cuentaId2"
            :rules="[(v) => !!v || 'Debe seleccionar una cuenta']"
            item-value="id"
            item-text="text"
            label="Cuenta"
            class="mt-4"
          ></v-select>
          <!-- CHECKBOX INFORMAR PAGOS EN ESTADO FINAL -->
          <!--  <v-checkbox
            label="Informar pagos en estado final"
            v-model="estadoFinalPagos2"
            hide-details
          ></v-checkbox> -->
          <!-- EXTERNAL REFERENCES (TEXAREA) -->

          <p class="mb-1 mt-5">Mandar por:</p>
          <v-btn-toggle
            v-model="tipoNotificacion"
            tile
            :borderless="true"
            color="blue darken-3"
          >
            <v-btn value="external_references" class="text-capitalize">
              External references
            </v-btn>

            <v-btn value="pagos_id" class="text-capitalize"> pagos id </v-btn>
          </v-btn-toggle>
          <v-textarea
            class="mt-5"
            :label="tipoNotificacion"
            v-model="externalReferences"
            required
            color="dark"
            filled
          ></v-textarea>
          <!-- boton -->
          <v-btn
            class="primary mt-6"
            :loading="loading2"
            @click="notificarPagosReferences"
            >notificar pagos references
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import webhookService from "@/services/webhook";
//import reportesServices from "../services/reportes";

export default {
  name: "Webhook",
  data: () => ({
    cantDias: null,
    pagoNotificado: false,
    estadoFinalPagos: false,
    estadoFinalPagos2: false,
    cuentaId: null,
    cuentaId2: null,

    tipoNotificacion: "external_references",
    externalReferences: [""],
    cuentas: [
      { id: 1, text: "Cliente: 1 - CUENTA PRUEBA" },
      { id: 2, text: "Cliente: 3 - CUENTA COMERCIO" },
      { id: 3, text: "Cliente: 4 - TASAS MUNICIPALES" },
      { id: 4, text: "Cliente: 5 - SERVICIO INTERNET" },
      { id: 5, text: "Cliente: 6 - AOSC - ENTE REGULADOR" },
      { id: 6, text: "Cliente: 7 - IMP TASAS CONTRIB" },
      { id: 7, text: "Cliente: 7 - OTROS SERVICIOS" },
      { id: 8, text: "Cliente: 8 - SERVICIO INTERNET" },
      { id: 9, text: "Cliente: 9 - COBRO SERVICIOS PUBLICOS" },
      { id: 10, text: "Cliente: 10 - CUOTAS" },
      { id: 11, text: "Cliente: 11 - INGRESOS BRUTOS Y SELLOS" },
      { id: 12, text: "Cliente: 11 - INMOBILIARIO RURAL" },
      { id: 13, text: "Cliente: 11 - TASAS Y MARCAS" },
      { id: 14, text: "Cliente: 11 - TRAGAMONEDAS" },
      { id: 15, text: "Cliente: 12 - SERVICIO INTERNET" },
      { id: 16, text: "Cliente: 13 - TICKETS" },
      { id: 17, text: "Cliente: 14 - ENTRADAS ESPECTACULOS" },
    ],

    loading: false,
    loading2: false,
  }),

  mounted() {
    // this.getClientes();
  },

  methods: {
    notificarPagos() {
      // realizando validacion del formulario
      if (this.$refs.form.validate()) {
        // pidiendo al usuario su confirmacion
        this.$swal
          .fire({
            title: "¿Está seguro?",
            text: "Esta acción notificará los pagos.",
            showDenyButton: true,
            icon: "warning",
            confirmButtonText: "Si, notificar",
            denyButtonText: "Cancelar",
          })
          .then(async ({ isConfirmed }) => {
            // si se confirma, realizar peticion
            if (isConfirmed) {
              try {
                const params = {
                  DiasPago: this.cantDias,
                  PagosNotificado: this.pagoNotificado,
                  EstadoFinalPagos: this.estadoFinalPagos,
                  CuentaId: this.cuentaId,
                };

                this.loading = true;
                const data = await webhookService.notificarPagos(params);

                if (data.error) throw data.error;

                this.loading = false;

                const msjSuccess = data?.message + ": " + data.data.toString();

                this.$toast.success(
                  msjSuccess || "Notificacion de pagos exitoso"
                );
              } catch (error) {
                console.error(error);
                this.$toast.error(error?.response?.data?.message || error);
                this.loading = false;
              }
            }
          });
      }
    },

    notificarPagosReferences() {
      // realizando validacion del formulario
      if (this.$refs.form2.validate()) {
        // pidiendo al usuario su confirmacion
        this.$swal
          .fire({
            title: "¿Está seguro?",
            text: "Esta acción notificará los pagos.",
            showDenyButton: true,
            icon: "warning",
            confirmButtonText: "Si, notificar",
            denyButtonText: "Cancelar",
          })
          .then(async ({ isConfirmed }) => {
            // si se confirma, realizar peticion
            if (isConfirmed) {
              try {
                const params = {
                  cuenta_id: this.cuentaId2,
                  [this.tipoNotificacion]: this.externalReferences,
                  estado_final: this.estadoFinalPagos2,
                };

                this.loading2 = true;
                const data = await webhookService.notificarPagosReferences(
                  params
                );
                if (data.error) throw data.error;
                console.log(data);
                this.loading2 = false;

                /* toast notification */
                const msjSuccess = data?.message + ": " + data.data.toString();

                this.$toast.success(
                  msjSuccess || "Notificacion de pagos exitoso"
                );
              } catch (error) {
                console.error(error);
                this.$toast.error(error?.response?.data?.message || error);
                this.loading2 = false;
              }
            }
          });
      }
    },

    async getClientes() {
      const params = {
        CargarImpuestos: false,
        CargarCuentas: false,
        CargarRubros: false,
      };

      const { data } = await reportesServices.obtenerClientes(params);

      this.clientes = data;
    },
  },
};
</script>
