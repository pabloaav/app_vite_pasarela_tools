<template>
  <v-main class="mx-8">
    <!-- subheader -->
    <v-subheader class="font-weight-bold mt-2"
      >Control de Cobranzas
    </v-subheader>
    <v-row>
      <v-col cols="5">
        <v-subheader>Seleccionar CUENTA:</v-subheader>
        <div class="text-center">
          <v-progress-circular
            v-if="loading"
            size="40"
            color="green darken-4"
            indeterminate
          ></v-progress-circular>
        </div>
        <!-- ------------------------ LISTA DE CLIENTES -------------------- -->
        <v-expansion-panels flat active-class="border">
          <v-expansion-panel v-for="cliente in clientes" :key="cliente.id">
            <v-expansion-panel-header>
              {{ cliente.cliente }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <!-- ------------------------CUENTAS DEL CLIENTE -------------------- -->
              <v-list-item-group v-model="cuentaSeleccionada">
                <v-list-item
                  v-for="cuenta in cliente.cuenta"
                  :key="cuenta.apikey"
                  :value="cuenta.apikey"
                  dense
                  active-class="border"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-icon>
                      <v-chip
                        color="grey--text text--darken-2 grey lighten-2"
                        small
                        class="font-weight-regular body-1 mt-1"
                        pill
                      >
                        {{ cuenta.id }}
                      </v-chip>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        class="font-weight-regular body-1 grey--text text--darken-3"
                      >
                        {{ cuenta.cuenta }}
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-checkbox
                        :input-value="active"
                        color="green darken-4"
                      ></v-checkbox>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <v-col cols="7">
        <v-subheader>Seleccionar FECHA:</v-subheader>
        <v-chip small class="ml-2 font-weight-medium mb-3">
          {{ formatFecha }}
        </v-chip>
        <v-spacer></v-spacer>
        <v-date-picker
          class="ml-4 mb-3"
          elevation="1"
          v-model="fecha"
          locale="es"
          color="green darken-4"
          :max="moment().subtract(1, 'days').format('YYYY-MM-DD')"
          :show-current="false"
          landscape
        ></v-date-picker>

        <!-- boton verificar cobranzas -->

        <v-btn
          class="mt-5 mb-10 ml-4 px-10"
          color="green darken-4"
          dark
          @click="verificarCobranzas"
          :loading="loading2"
        >
          Verificar Cobranzas
        </v-btn>

        <!-- --------------------BLOQUE CODIGO: COBRANZAS QUE NO COINCIDEN --------------------- -->
        <div v-if="cobranzas.length > 0">
          <h5 class="mt-4">Cobranzas que no coinciden</h5>
          <div class="mt-2 mb-4">
            <pre class="language-json">
              <code class="language-json code-block" v-html="formattedCobranzas"></code>
          </pre>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import reportesServices from "@/services/reportes";
import cobranzasServices from "@/services/cobranzas";
import { formatDate } from "@/helpers";
import moment from "moment";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

export default {
  name: "ControlCobranzas",
  data() {
    return {
      clientes: [],
      cuentas: [],

      cuentaSeleccionada: "",

      loading: false,
      loading2: false,

      fecha: "",

      //cobranzas que no coinciden (Error 400)
      cobranzas: [],

      formatDate,
      moment,
    };
  },
  mounted() {
    this.getClientes();

    //bloque de codigo
    window.Prism = window.Prism || {};
    window.Prism.manual = true;
    Prism.highlightAll();
  },
  computed: {
    formatFecha() {
      return this.fecha ? formatDate(this.fecha) : "";
    },

    formattedCobranzas() {
      return Prism.highlight(
        JSON.stringify(this.cobranzas, null, 2),
        Prism.languages.json,
        "json"
      );
    },
  },
  methods: {
    async getClientes() {
      const params = {
        CargarImpuestos: false,
        CargarCuentas: true,
        CargarRubros: false,
      };

      try {
        this.loading = true;
        const { data } = await reportesServices.obtenerClientes(params);

        this.clientes = data; //array de clientes puede tener mas de una cuenta
        this.loading = false;

        //recorrer los clientes para obtener las cuentas
        this.clientes.forEach((cliente) => {
          //recorrer las cuentas de cada cliente
          cliente.cuenta.forEach((cuenta) => {
            this.cuentas.push(cuenta);
          });
        });
      } catch (error) {
        this.loading = false;
        this.$toast.error("Error al obtener los clientes");
      }
    },
    async verificarCobranzas() {
      //si no selecciona cuenta y fecha, mostrar un swt
      if (!this.cuentaSeleccionada || !this.fecha) {
        this.$swal({
          title: "Error",
          text: "Debe seleccionar una cuenta y una fecha",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      const params = {
        FechaConsultar: formatDate(this.fecha),
        apiKey: this.cuentaSeleccionada,
      };

      try {
        this.loading2 = true;
        this.cobranzas = [];
        const { data } = await cobranzasServices.controlCobranzas(params);

        this.loading2 = false;

        this.$toast.success(data.message);
      } catch ({ response }) {
        this.loading2 = false;
        if (response.status === 404) {
          return this.$toast.info(response.data.message);
        }

        //status 400 mostrar bloque de codigo
        this.cobranzas = response.data.data;
        this.$toast.error(response.data.message);
      }
    },
  },
};
</script>

<style scoped>
.border {
  /* border: 1px dashed #666; */
  background: #a5d6a760;
}
.bold {
  font-weight: bold;
}

.code-block {
  font-size: 14px;
}

.border {
  border: 1px solid #ddd;
  background: #a5d6a760;
}
</style>
