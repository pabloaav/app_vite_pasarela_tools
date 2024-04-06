<template>
  <v-main class="mx-8">
    <!--FILTRO FECHA-->
    <v-row align="center" class="mt-2">
      <v-col
        cols="12"
        lg="10"
        xl="7"
        class="d-flex align-center"
        style="gap: 10px"
      >
        <!-- FECHA INICIO -->
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
              readonly
              v-bind="attrs"
              v-on="on"
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
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date2"
            @input="menu2 = false"
            locale="es"
            @change="setFechaFin(date2)"
            :max="new Date().toISOString().slice(0, 10)"
            :min="fechaInicio"
          ></v-date-picker>
        </v-menu>

        <!-- BTN GET DATA -->
        <v-btn class="blue white--text ml-8" @click="getData()">
          <v-icon left>mdi-filter-variant</v-icon> Filtrar</v-btn
        >
      </v-col>
    </v-row>

    <!-- <v-subheader class="font-weight-bold" v-if="!loadingTable">LOG</v-subheader> -->

    <!-- ELECCION DE TABLA -->
    <v-btn-toggle
      v-model="tipoTabla"
      borderless
      class="ml-1 mb-4"
      mandatory
      dense
      @change="getData()"
    >
      <!-- BOTON LOG -->
      <v-btn value="log">
        <v-icon> mdi-text-box-outline </v-icon>

        <span class="ml-2 hidden-sm-and-down">LOG</span>
      </v-btn>
      <!-- BOTON NOTIFICACIONES -->
      <v-btn value="notificaciones">
        <v-icon> mdi-bell-outline </v-icon>

        <span class="ml-2 hidden-sm-and-down">NOTIFICACIONES</span>
      </v-btn>
    </v-btn-toggle>

    <!--TABLA DE LOG-->
    <TableLog v-show="tipoTabla === 'log'" />
    <!-- TABLA DE NOTIFICACIONES -->
    <TableNotificacion v-show="tipoTabla === 'notificaciones'" />
  </v-main>
</template>

<script>
import Dashboard from "@/components/Dashboard.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { formatDate } from "../helpers";
import TableLog from "@/components/TableLog.vue";
import TableNotificacion from "@/components/TableNotificacion.vue";
import moment from "moment";

export default {
  name: "Log",
  components: { Dashboard, TableLog, TableNotificacion },
  data: () => ({
    menu1: false,
    menu2: false,
    date1: null,
    date2: null,
    formatDate,

    tipoTabla: "log",
  }),
  computed: {
    ...mapGetters(["fechaInicio", "fechaFin", "loadingTable"]),
  },

  async mounted() {
    this.date1 = moment(this.fechaInicio).format("YYYY-MM-DD");
    this.reset();
    this.setSize(100);
    this.getData();
  },
  methods: {
    ...mapActions([
      "setFechaInicio",
      "setFechaFin",
      "getLogData",
      "setSize",
      "getNotificacionData",
    ]),
    ...mapMutations(["reset"]),

    getData() {
      this.tipoTabla === "log" ? this.getLogData() : this.getNotificacionData();
    },
  },
};
</script>
