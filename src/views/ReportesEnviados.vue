<template>
  <v-main class="mx-8">
    <!--FILTRO FECHA-->
    <v-row class="my-2" no-gutters>
      <v-col cols="12" xl="8" class="d-flex" style="gap: 10px">
        <!-- FECHA DE INICIO -->
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
              :value="formatDate(fechaInicio)"
              label="Fecha inicio"
              prepend-icon="mdi-calendar"
              hide-details
              readonly
              v-bind="attrs"
              v-on="on"
              style="max-width: 180px"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date1"
            @input="menu1 = false"
            @change="setFechaInicio(date1)"
            locale="es"
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
              prepend-icon="mdi-calendar"
              readonly
              hide-details
              v-bind="attrs"
              v-on="on"
              style="max-width: 180px"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date2"
            @input="menu2 = false"
            locale="es"
            @change="setFechaFin(date2)"
            :max="new Date().toISOString().slice(0, 10)"
            :min="fechaInicio"
          />
        </v-menu>

        <!-- TIPO DE REPORTE -->
        <v-select
          class="ml-2"
          clearable
          clear-icon="mdi-delete"
          :items="['rendiciones', 'pagos', 'revertidos']"
          label="Tipo de reporte"
          hide-details
          @input="(item) => setTipoReporte(item)"
        />

        <!-- FILTRO CLIENTE -->
        <v-autocomplete
          label="Cliente"
          no-data-text="Sin clientes disponibles"
          :items="clientes"
          class="ml-2"
          hide-details
          clear-icon="mdi-delete"
          item-text="cliente"
          clearable
          item-value="id"
          v-model="cliente"
        />

        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" class="align-self-end">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item link @click="setDialog(true)">
              <v-list-item-icon>
                <v-icon>mdi-file-replace</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Enviar reportes</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="showDialogCobranzas">
              <v-list-item-icon>
                <v-icon>mdi-file-download-outline</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Enviar cobranzas</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- BTN GET DATA -->
        <v-btn
          class="blue white--text ml-8 align-self-end"
          @click="
            () => {
              setNumber(1);
              getReportesEnviadosData();
            }
          "
        >
          <v-icon left>mdi-filter-variant</v-icon>
          Filtrar
        </v-btn>
      </v-col>
    </v-row>

    <v-subheader class="font-weight-bold" v-if="!loadingTable">
      Reportes enviados
    </v-subheader>

    <!--TABLA DE REPORTES ENVIADOS-->
    <TablaReportesEnviados />

    <!-- dialog reportes cobranzas -->
    <ReportesCobranzas ref="dialogCobranzas" />
  </v-main>
</template>

<script>
import TablaReportesEnviados from "@/components/TablaReportesEnviados.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { formatDate } from "@/helpers";
import moment from "moment";
import reportesServices from "@/services/reportes";
import ReportesCobranzas from "@/views/ReportesCobranzas.vue";

export default {
  name: "ReportesEnviados",
  components: { TablaReportesEnviados, ReportesCobranzas },
  data: () => ({
    menu1: false,
    menu2: false,
    date1: null,
    date2: null,
    formatDate,
    clientes: [
      "TELCO PRUEBA",
      "MUNICIPALIDAD DE VIRASORO",
      "VIKING SRL",
      "MUNICIP. DE SANTO TOME CTES",
      "LANJET S.R.L.",
      "DPEC",
    ],
  }),
  mounted() {
    this.date1 = moment(this.fechaInicio).format("YYYY-MM-DD");
    this.reset();
    this.getClientes();
    this.getReportesEnviadosData();
  },
  computed: {
    ...mapGetters(["fechaInicio", "fechaFin", "loadingTable"]),

    cliente: {
      get() {
        return this.$store.getters["cliente"];
      },
      set(newClient) {
        return this.$store.dispatch("setCliente", newClient);
      },
    },
  },
  methods: {
    ...mapActions([
      "setFechaInicio",
      "setFechaFin",
      "setTipoReporte",
      "setNumber",
      "setDialog",
      "getReportesEnviadosData",
    ]),

    ...mapMutations(["reset"]),

    async getClientes() {
      const params = {
        CargarImpuestos: false,
        CargarCuentas: false,
        CargarRubros: false,
      };

      const { data } = await reportesServices.obtenerClientes(params);

      this.clientes = data.map((d) => d.cliente);
    },
    showDialogCobranzas() {
      this.$refs.dialogCobranzas.$emit("showDialogCobranzas");
    },
  },
};
</script>
