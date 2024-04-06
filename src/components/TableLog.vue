<template>
  <div class="hide-overlay">
    <v-skeleton-loader
      :loading="loadingTable"
      type="table"
      height="calc(100vh-300px)"
    >
      <p class="text-center grey--text" v-if="log.length === 0">
        Sin registros para mostrar
      </p>
      <v-data-table
        :headers="headers"
        :items="log"
        :page.sync="page"
        :items-per-page="size"
        hide-default-footer
        class="elevation-1"
        :loading="loadingTable"
        loading-text="Cargando transacciones"
        no-data-text="Datos no encontrados"
        fixed-header
        height="calc(100vh - 280px)"
        @page-count="pageCount = $event"
      >
        <template v-slot:[`item.fecha`]="{ item }">
          {{ formatDate(item.fecha) }}
        </template>
        <template v-slot:[`item.hora`]="{ item }">
          {{ formatDateHour(item.fecha) }}
        </template>
        <template v-slot:[`item.mensaje`]="{ item }">
          {{ item.mensaje ? item.mensaje : "-" }}
        </template>
        <template v-slot:[`item.tipo`]="{ item }">
          <v-chip :color="item.tipo !== 'error' ? 'blue-grey' : 'red'" dark>
            {{ item.tipo }}
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
    <div class="text-center pt-2" v-if="log.length > 0 && !loadingTable">
      <v-pagination
        v-model="page"
        :length="lastPage"
        @input="updatePage($event)"
        circle
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { formatImport, formatDate, formatDateHour } from "@/helpers";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TableLog",
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 15,
      formatImport: formatImport,
      formatDate: formatDate,
      formatDateHour,

      headers: [
        { text: "Fecha", value: "fecha", sortable: false, width: "120px" },
        { text: "Hora", value: "hora", sortable: false, width: "80px" },
        { text: "Mensaje", value: "mensaje", sortable: false },
        { text: "Funcionalidad", value: "funcionalidad", sortable: false },
        { text: "Tipo", value: "tipo", sortable: false },
      ],
    };
  },
  methods: {
    ...mapActions(["getLogData", "setSize", "setNumber"]),

    updatePage(page, size) {
      if (page) this.setNumber(page);
      if (size) {
        this.setSize(size);
        this.setNumber(1);
        this.page = 1; //redirigiendo a la primera pagina de la tabla
      }

      this.getLogData();
    },
  },
  computed: {
    ...mapGetters([
      "number",
      "size",
      "lastPage",
      "loadingTable",
      "log",
      "fechaInicio",
      "fechaFin",
      "rowsPerPageArray",
    ]),
  },
};
</script>
