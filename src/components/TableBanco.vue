<template>
  <div class="hide-overlay">
    <v-skeleton-loader
      :loading="loadingTable"
      type="table"
      height="calc(100vh-300px)"
    >
      <p class="text-center grey--text" v-if="banco.length === 0">
        Sin registros para mostrar
      </p>
      <v-data-table
        :headers="headers"
        :items="banco"
        :page.sync="number"
        :items-per-page="size"
        :search="search"
        hide-default-footer
        class="elevation-1"
        :loading="loadingTable"
        loading-text="Cargando transacciones"
        no-data-text="Sin registros para mostrar"
        no-results-text="Busqueda sin coincidencias"
        fixed-header
        height="calc(100vh - 280px)"
        @page-count="pageCount = $event"
        v-else
      >
        <template v-slot:[`item.tipo_movimiento`]="{ item }">
          {{
            item.debin_id ? "17 - Debin" : tipoMovimiento(item.tipo_movimiento)
          }}
        </template>
        <template v-slot:[`item.fecha_creacion`]="{ item }">
          {{ formatDate(item.fecha_creacion) }}
        </template>
        <template v-slot:[`item.fecha_acreditacion`]="{ item }">
          {{ formatDate(item.fecha_acreditacion) }}
        </template>
        <template v-slot:[`item.importe`]="{ item }">
          {{ formatImport(item.importe) }}
        </template>
        <template v-slot:[`item.referencia`]="{ item }">
          {{ item.referencia ? item.referencia : "-" }}
        </template>
        <template v-slot:[`item.debin_id`]="{ item }">
          {{ item.debin_id ? item.debin_id : "-" }}
        </template>
        <template v-slot:[`item.observacion`]="{ item }">
          {{ item.observacion ? item.observacion : "-" }}
        </template>
        <template v-slot:[`item.conciliado`]="{ item }">
          <v-chip :color="item.conciliado ? 'green' : 'red'" dark>
            {{ item.conciliado ? "SI" : "NO" }}
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
                    v-for="(size, index) in rowsPerPageArray"
                    :key="index"
                    @click="updatePage(number, size)"
                  >
                    <v-list-item-title>{{ size }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <div class="text-center pt-2" v-if="banco.length > 0 && !loadingTable">
      <v-pagination
        v-model="number"
        :length="lastPage"
        @input="updatePage($event)"
        circle
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { formatImport, formatDate } from "@/helpers";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TableBanco",
  data() {
    return {
      itemsPerPage: 15,
      formatImport: formatImport,
      formatDate: formatDate,

      headers: [
        { text: "id", value: "id", sortable: false, align: "center" },
        {
          text: "Tipo de movimiento",
          align: "start",
          sortable: false,
          value: "tipo_movimiento",
          width: "250",
        },
        {
          text: "Fecha de creacion",
          value: "fecha_creacion",
          sortable: false,
          width: "140",
        },
        {
          text: "Fecha",
          value: "fecha_acreditacion",
          sortable: false,
          width: "140",
        },
        { text: "Importe", value: "importe", sortable: false },
        { text: "Archivo", value: "nombre_archivo", sortable: false },
        {
          text: "Referencia",
          value: "referencia",
          align: "center",
          sortable: false,
        },
        { text: "Subcuenta", value: "subcuenta", sortable: false },
        { text: "DB_CR", value: "db_cr", sortable: false },
        { text: "Conciliado", value: "conciliado", sortable: false },
        {
          text: "Debin id",
          value: "debin_id",
          align: "center",
          sortable: false,
        },
        {
          text: "Observaciones",
          value: "observacion",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
  methods: {
    ...mapActions(["getBancoData", "setSize", "setNumber"]),

    updatePage(page, size) {
      if (page) this.setNumber(page);
      if (size) {
        this.setSize(size);
        this.setNumber(1);
      }

      this.getBancoData();
    },

    tipoMovimiento(tipo) {
      switch (tipo) {
        case 17:
          return "17 - Transferencia";
        case 522:
          return "522 - Prisma";
        case 84:
          return "84 - Rapipago";
        case 523:
          return "523 - Reversion";
        case 202:
          return "202 - Transferencia revertida";
        default:
          return tipo;
      }
    },
  },
  computed: {
    ...mapGetters([
      "size",
      "lastPage",
      "loadingTable",
      "banco",
      "fechaInicio",
      "fechaFin",
      "rowsPerPageArray",
    ]),

    number: {
      get() {
        return this.$store.getters["number"];
      },
      set(newNumber) {
        this.$store.dispatch("setNumber", newNumber);
      },
    },
    search: {
      get() {
        return this.$store.getters["search"];
      },
      set(newSearch) {
        this.$store.dispatch("setSearch", newSearch);
      },
    },
  },
};
</script>
