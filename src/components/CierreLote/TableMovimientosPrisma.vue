<template>
  <div>
    <v-skeleton-loader
      :loading="loadingTable"
      type="table"
      height="calc(100vh-300px)"
    >
      <p class="text-center grey--text" v-if="movimientosPrisma.length === 0">
        Sin registros para mostrar
      </p>
      <v-data-table
        :headers="headerTable"
        :items="movimientosPrisma"
        :expanded.sync="expanded"
        item-key="Id"
        :page.sync="page"
        :items-per-page="size"
        hide-default-footer
        show-expand
        :loading="loadingTable"
        loading-text="Cargando movimientos"
        class="elevation-1 row-pointer"
        no-data-text="Datos no encontrados"
        @click:row="rowClick"
        :item-class="reversionColor"
        fixed-header
        height="calc(100vh - 280px)"
        v-else
      >
        <template v-slot:[`item.FechaCreacion`]="{ item }">
          {{ formatDate(item.FechaCreacion) }}
        </template>
        <template v-slot:[`item.FechaPresentacion`]="{ item }">
          {{ formatDate(item.FechaPresentacion, true) }}
        </template>
        <template v-slot:[`item.FechaPago`]="{ item }">
          {{ formatDate(item.FechaPago, true) }}
        </template>
        <template v-slot:[`item.ImporteTotal`]="{ item }">
          {{ formatImport(item.ImporteTotal) }}
        </template>
        <template v-slot:[`item.Match`]="{ item }">
          <v-chip :color="item.Match === 1 ? 'success' : 'error'">
            {{ item.Match === 1 ? "Si" : "No" }}
          </v-chip>
        </template>

        <template v-slot:footer>
          <v-row class="no-gutters mt-2">
            <v-col class="d-flex justify-center align-center my-2">
              <span>Mostrar</span>
              <v-menu top>
                <template v-slot:activator="{ on }">
                  <v-btn dark text color="primary" class="ml-2" v-on="on">
                    {{ size }}
                    <v-icon>mdi-arrow-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(number, index) in rowsPerPageArray"
                    :key="index"
                    @click="updatePage(page, number)"
                  >
                    <v-list-item-title>{{ number }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <div
      class="text-center pt-2"
      v-if="movimientosPrisma.length > 0 && !loadingTable"
    >
      <v-pagination
        v-model="page"
        :length="lastPage"
        @input="updatePage($event)"
        circle
      ></v-pagination>
    </div>
    <DetalleMovimientoPrisma :item="detalleItem" />
  </div>
</template>

<script>
import { formatDate, formatImport } from "@/helpers";
import { mapGetters, mapActions } from "vuex";
import DetalleMovimientoPrisma from "./DetalleMovimientoPrisma.vue";

export default {
  name: "TableMovimientosPrisma",
  components: {
    DetalleMovimientoPrisma,
  },
  data() {
    return {
      expanded: [],
      page: 1,
      pageCount: 0,
      formatDate: formatDate,
      formatImport: formatImport,

      detalleItem: null,

      headerTable: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "Id",
        },
        { text: "Empresa", value: "Empresa", sortable: false },
        { text: "FechaCreacion", value: "FechaCreacion", sortable: false },
        {
          text: "FechaPresentacion",
          value: "FechaPresentacion",
          sortable: false,
        },
        {
          text: "FechaPago",
          value: "FechaPago",
          width: "120px",
          sortable: false,
        },
        { text: "TipoRegistro", value: "TipoRegistro", sortable: false },
        { text: "ComercioNro", value: "ComercioNro", sortable: false },
        {
          text: "EstablecimientoNro",
          value: "EstablecimientoNro",
          sortable: false,
        },
        { text: "Codop", value: "Codop", sortable: false },
        { text: "TipoAplicacion", value: "TipoAplicacion", sortable: false },
        { text: "ImporteTotal", value: "ImporteTotal", sortable: false },
        {
          text: "SignoImporteTotal",
          value: "SignoImporteTotal",
          sortable: false,
        },
        {
          text: "Match",
          value: "Match",
          sortable: false,
        },
      ],
    };
  },

  watch: {
    number(newNumber) {
      this.page = newNumber;
    },
  },

  computed: {
    ...mapGetters("cierre_lote", [
      "movimientosPrisma",
      "loadingTable",
      "rowsPerPageArray",
      "size",
      "number",
      "lastPage",
    ]),
  },

  methods: {
    ...mapActions("cierre_lote", [
      "setDialogDetalleMovimiento",
      "setSize",
      "setNumber",
      "getMovimientosPrismaData",
    ]),
    //metodo que se encarga de desplegar el detalle al hacer click sobre una fila en la tabla
    rowClick(item, event) {
      if (event.isExpanded) {
        const indexExpanded = this.expanded.findIndex((i) => i === item);
        this.expanded.splice(indexExpanded, 1);
      } else {
        this.detalleItem = item;
        this.setDialogDetalleMovimiento(true);
        //this.expanded.push(item);
      }
    },

    reversionColor(item) {
      return item.Codop !== "0005" && item.TipoAplicacion === "-"
        ? "red  lighten-4"
        : "";
    },

    updatePage(page, size) {
      if (page) this.setNumber(page);
      if (size) {
        this.setSize(size);
        this.setNumber(1);
      }

      this.getMovimientosPrismaData();
    },
  },
};
</script>

<style scoped>
.detalle-container {
  padding: 0 !important;
}

.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
