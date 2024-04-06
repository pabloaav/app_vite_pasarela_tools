<template>
  <v-main class="mx-8 overflow-x">
    <!--FILTRO FECHA-->
    <v-row align="center" class="mt-2">
      <v-col cols="12" xl="6" class="d-flex align-center">
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
            v-model="filter.date1"
            @input="menu1 = false"
            locale="es"
            @change="setFechaInicio(filter.date1)"
            :max="limitarFechas.max"
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
            v-model="filter.date2"
            @input="menu2 = false"
            locale="es"
            @change="setFechaFin(filter.date2)"
          ></v-date-picker>
        </v-menu>
        <!-- <div class="d-flex align-center">
          <p class="mb-0 pl-8 pr-2">
            Filtrar por <span style="font-weight: bold">fecha</span> de:
          </p>
          <v-radio-group v-model="tipoFecha" :column="false">
            <v-radio
              label="Presentacion"
              value="fechaPresentacion"
              class="mr-3"
            ></v-radio>
            <v-radio label="Pago" value="fechaPago" class="mr-3"></v-radio>
            <v-radio label="Creacion" value="fechaCreacion"></v-radio>
          </v-radio-group>
        </div> -->

        <v-select
          label="Filtro de fecha"
          class="mx-4"
          :items="filtroFecha"
          clearable
          clear-icon="mdi-delete"
          style="max-width: 280px"
          item-text="label"
          item-value="filtro"
          v-model="tipoFecha"
        >
        </v-select>
        <v-btn
          class="blue white--text ml-4"
          @click="
            {
              setNumber(1);
              getMovimientosPrismaData();
            }
          "
        >
          <v-icon left>mdi-filter-variant</v-icon> Filtrar</v-btn
        >
      </v-col>
    </v-row>

    <v-subheader class="font-weight-bold" v-if="!loadingTable"
      >Prisma / Movimientos</v-subheader
    >

    <!--TABLA DE MOVIMIENTOS-->
    <TableMovimientosPrisma class="mb-4" />
  </v-main>
</template>

<script>
import TableMovimientosPrisma from "@/components/CierreLote/TableMovimientosPrisma.vue";
import { formatDate } from "@/helpers";
import { mapActions, mapGetters, mapMutations } from "vuex";
import moment from "moment";

export default {
  name: "MovimientosPrisma",
  components: { TableMovimientosPrisma },
  data() {
    return {
      filter: {
        date1: null,
        date2: null,
      },

      limitarFechas: {
        max: new Date().toISOString().substr(0, 10),
      },

      menu1: false,
      menu2: false,
      tipoFecha: "fechaCreacion",
      filtroFecha: [
        { label: "Fecha de presentacion", filtro: "fechaPresentacion" },
        { label: "Fecha de pago", filtro: "fechaPago" },
        { label: "Fecha de creacion", filtro: "fechaCreacion" },
      ],
      formatDate,
    };
  },
  computed: {
    ...mapGetters("cierre_lote", [
      "fechaInicio",
      "fechaFin",
      "loadingTable",

      "fechaPresentacion",
    ]),
  },
  watch: {
    tipoFecha(newValue) {
      switch (newValue) {
        case "fechaPago":
          this.setFechaPagoMov(true);
          this.setFechaPresentacion(false);
          this.setFechaCreacion(false);
          break;
        case "fechaPresentacion":
          this.setFechaPagoMov(false);
          this.setFechaPresentacion(true);
          this.setFechaCreacion(false);
          break;
        case "fechaCreacion":
          this.setFechaPagoMov(false);
          this.setFechaPresentacion(false);
          this.setFechaCreacion(true);
          break;
      }
    },
  },
  mounted() {
    this.filter.date1 = moment(this.fechaInicio).format("YYYY-MM-DD");
    this.reset();
    this.setFechaCreacion(true);
    this.getMovimientosPrismaData();
  },
  methods: {
    ...mapActions("cierre_lote", [
      "getMovimientosPrismaData",
      "setFechaInicio",
      "setFechaFin",
      "setFechaPresentacion",
      "setFechaPagoMov",
      "setFechaCreacion",
      "setNumber",
    ]),

    ...mapMutations("cierre_lote", ["reset"]),
  },
};
</script>

<style scoped>
.v-application {
  display: flex;
  overflow: auto;
}

.v-card {
  flex: 1 !important;
  max-width: 330px;
}
.v-main {
  flex: 1 !important;
}
</style>
