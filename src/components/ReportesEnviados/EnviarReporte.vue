<template>
  <v-dialog v-model="dialog" max-width="1000" @click:outside="reset">
    <v-card>
      <v-card-title class="text-h6 mb-2">ENVIAR REPORTES</v-card-title>
      <v-btn-toggle
        v-model="tipoReporte"
        borderless
        class="ml-3 mb-3"
        :color="getColor"
        mandatory
        @change="reset()"
      >
        <!-- boton PAGOS -->
        <v-btn value="pagos">
          <span class="hidden-sm-and-down">Pagos</span>

          <v-icon
            :color="
              tipoReporte === 'pagos' ? 'blue darken-4 white--text' : 'black'
            "
          >
            mdi-cash-sync
          </v-icon>
        </v-btn>
        <!-- boton RENDICIONES -->
        <v-btn value="rendiciones">
          <span class="hidden-sm-and-down">Rendiciones</span>

          <v-icon
            :color="
              tipoReporte === 'rendiciones'
                ? 'green darken-3 white--text'
                : 'black'
            "
          >
            mdi-format-list-bulleted
          </v-icon>
        </v-btn>
        <!-- boton BATCH-PAGO-ITEMS -->
        <v-btn value="batch-pago-items">
          <span class="hidden-sm-and-down">Batch-pago-items</span>

          <v-icon
            :color="
              tipoReporte === 'batch-pago-items'
                ? 'yellow darken-3 white--text'
                : 'black'
            "
          >
            mdi-package
          </v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-card-text>
        <p class="ma-0">
          <span class="mr-10 ml-5">ID:</span><span>CUENTA:</span>
        </p>
        <v-row no-gutters align="center">
          <v-col cols="8">
            <v-list shaped>
              <v-list-item-group v-model="selectedAccounts" multiple>
                <v-list-item
                  v-for="(item, i) in accounts"
                  :key="i"
                  :value="item.id"
                  :active-class="
                    tipoReporte === 'pagos'
                      ? 'blue--text '
                      : tipoReporte === 'rendiciones'
                      ? 'green--text'
                      : 'yellow--text'
                  "
                  class="mb-1"
                  dense
                  :disabled="
                    tipoReporte === 'batch-pago-items' && item.id !== 9
                  "
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-icon>
                      <v-chip
                        color="grey--text text--darken-2"
                        small
                        class="font-weight-regular body-1 mt-1"
                        pill
                        >{{ item.id }}</v-chip
                      >
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        class="font-weight-regular body-1 grey--text text--darken-3"
                      >
                        {{ item.cliente }}
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-checkbox
                        v-if="
                          tipoReporte !== 'batch-pago-items' || item.id === 9
                        "
                        :input-value="active"
                        :color="getColor"
                      ></v-checkbox>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col cols="4">
            <span class="mx-3">SELECCIONE UNA FECHA: </span>
            <v-chip small class="ml-2 font-weight-medium mb-2">
              {{ formatFecha }}
            </v-chip>
            <v-date-picker
              class="ml-4 mb-3"
              elevation="1"
              v-model="fecha"
              locale="es"
              :color="getColor"
            ></v-date-picker>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="pb-3">
        <v-btn
          text
          color="grey darken-3 text-capitalize"
          @click="reset()"
          :disabled="selectedAccounts.length === 0 && !fecha"
        >
          Limpiar todo
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          outlined
          class="font-weight-medium"
          @click="sendReports"
          :loading="loading"
          >Enviar reporte
          <v-icon class="ml-2">mdi-subdirectory-arrow-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatDate, handleErrorApi, handleSuccessApi } from "../../helpers";
import reportesServices from "../../services/reportes";

export default {
  name: "EnviarReporte",
  data() {
    return {
      tipoReporte: "pagos",

      accounts: [
        { id: 1, text: "TELCO PRUEBA" },
        { id: 2, text: "TELCO CONF" },
        { id: 3, text: "MUNICIPALIDAD DE VIRASORO" },
        { id: 4, text: "VIKING SRL" },
        { id: 5, text: "AOSC - ENTE REGULADOR" },
        { id: 6, text: "MUNICIP. DE SANTO TOME - IMP TASAS CONTRIB" },
        { id: 7, text: "MUNICIP. DE SANTO TOME - OTROS SERVICIOS" },
        { id: 8, text: "LANJET S.R.L." },
        { id: 9, text: "DPEC" },
      ],

      selectedAccounts: [],

      fecha: null,
      loading: false,
      formatDate,
    };
  },
  computed: {
    dialog: {
      get() {
        return this.$store.getters["dialog"];
      },
      set(newValue) {
        this.$store.dispatch("setDialog", newValue);
      },
    },
    formatFecha() {
      return this.fecha ? formatDate(this.fecha) : "";
    },
    getColor() {
      if (this.tipoReporte === "rendiciones") {
        return "green darken-3 white--text";
      } else if (this.tipoReporte === "batch-pago-items") {
        return "yellow darken-3 white--text";
      } else {
        return "blue darken-4 white--text";
      }
    },
  },

  mounted() {
    this.getClientes();
  },

  methods: {
    reset() {
      this.selectedAccounts = [];
      this.fecha = null;
    },

    sendReports() {
      // muestra error si algún campo no se completó
      if (this.selectedAccounts.length === 0 || !this.fecha) {
        return this.$swal.fire({
          title: "Campos obligatorios (*)",
          icon: "info",
          html:
            "<p><strong>Para continuar, debes seleccionar:</strong> <br/></p>" +
            "<p>Al menos una cuenta y una fecha.</p>",
          confirmButtonText: "Aceptar",
        });
      }

      // ventana modal pidiendo confirmación del usuario
      this.$swal
        .fire({
          title: "¿Está seguro?",
          text: "Esta acción enviará los reportes..",
          icon: "warning",
          confirmButtonText: "Si, continuar.",
          showDenyButton: true,
          denyButtonText: "Cancelar",
        })
        .then(async ({ isConfirmed }) => {
          // si el usuario confirma el envio de reportes -> ejecución endpoint
          if (isConfirmed) {
            try {
              const params = {
                ClientesIds: this.selectedAccounts.toString(),
                FechaInicio: this.fecha + "T00:00:00-03:00",
                FechaFin: this.fecha + "T23:59:59.999Z",
              };
              this.loading = true;
              let data = null;

              switch (this.tipoReporte) {
                case "pagos":
                  data = await reportesServices.sendReportePagos(params);
                  break;
                case "rendiciones":
                  data = await reportesServices.sendReporteRendiciones(params);
                  break;
                case "batch-pago-items":
                  delete params.ClientesIds;
                  params.Cliente = "9";
                  data = await reportesServices.sendBatchPagoItems(params);
                  break;
              }

              const dataSuccess = handleSuccessApi(data);

              this.$toast.success(dataSuccess.message);
              this.loading = false;
            } catch (error) {
              const dataError = handleErrorApi(error);

              // mostrando msj error
              dataError.status === 404
                ? this.$toast.warning(dataError.message)
                : this.$toast.error(dataError.message);

              this.loading = false;
            }
          }
        });
    },

    async getClientes() {
      const params = {
        CargarImpuestos: false,
        CargarCuentas: false,
        CargarRubros: false,
      };

      const { data } = await reportesServices.obtenerClientes(params);

      this.accounts = data;
    },
  },
};
</script>
