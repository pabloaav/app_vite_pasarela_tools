<template>
  <div>
    <v-skeleton-loader
      :loading="loadingTable"
      type="table"
      height="calc(100vh-300px)"
    >
      <p class="text-center grey--text" v-if="apilink.length === 0">
        Sin registros para mostrar
      </p>
      <v-data-table
        :headers="headers"
        :items="apilink"
        :page.sync="page"
        :items-per-page="size"
        hide-default-footer
        class="elevation-1"
        :loading="loadingTable"
        loading-text="Cargando transacciones"
        no-data-text="Datos no encontrados"
        fixed-header
        height="calc(100vh - 280px)"
        mobile-breakpoint="800px"
        v-else
      >
        <template v-slot:[`item.fecha_expiracion`]="{ item }">
          {{ formatDate(item.fecha_expiracion) }}
        </template>
        <template v-slot:[`item.fechaacreditacion`]="{ item }">
          {{
            moment(item.fechaacreditacion).get("year") === 0
              ? "-"
              : formatDate(item.fechaacreditacion)
          }}
        </template>
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip
            v-if="item.estado === 'ACREDITADO' || item.estado === 'VENCIDO'"
            :color="item.estado === 'ACREDITADO' ? 'success' : 'error'"
            >{{ item.estado }}</v-chip
          >
          <span v-else>{{ item.estado }}</span>
        </template>

        <template v-slot:[`item.pago_informado`]="{ item }">
          <v-chip v-if="item.pago_informado === 'No informado'" color="grey">
            {{ item.pago_informado }}
          </v-chip>
          <span v-else>{{ item.pago_informado }}</span>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <template v-slot:[`item.devuelto`]="{ item }">
          {{ item.devuelto ? "Si" : "No" }}
        </template>
        <template v-slot:[`item.contracargo_id`]="{ item }">
          {{ item.contracargo_id ? item.contracargo_id : "-" }}
        </template>
        <template v-slot:[`item.importe`]="{ item }">
          {{ formatImport(item.importe) }}
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
    <div class="text-center pt-2" v-if="apilink.length > 0 && !loadingTable">
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
import { formatDate, formatImport } from "@/helpers";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "TableApilink",
  data() {
    return {
      formatImport,
      formatDate,

      headers: [
        {
          text: "fechaacreditacion",
          value: "fechaacreditacion",
          sortable: false,
          align: "center",
        },
        { text: "estado", value: "estado", sortable: false },
        {
          text: "banco_external_id",
          value: "banco_external_id",
          sortable: false,
        },
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "Id",
        },
        {
          text: "referencia_banco",
          value: "referencia_banco",
          sortable: false,
        },
        { text: "debin_id", value: "debin_id", sortable: false },
        { text: "concepto", value: "concepto", sortable: false },
        { text: "pago_informado", value: "pago_informado", sortable: false },
        { text: "moneda", value: "moneda", sortable: false },
        { text: "importe", value: "importe", sortable: false },

        { text: "tipo", value: "tipo", sortable: false },
        {
          text: "fecha_expiracion",
          value: "fecha_expiracion",
          sortable: false,
        },
        { text: "devuelto", value: "devuelto", sortable: false },
        {
          text: "contracargo_id",
          value: "contracargo_id",
          align: "center",
          sortable: false,
        },
        { text: "comprador_cuit", value: "comprador_cuit", sortable: false },
        { text: "vendedor_cuit", value: "vendedor_cuit", sortable: false },

        { text: "match", value: "match", sortable: false, align: "center" },

        {
          text: "created_at",
          value: "created_at",
          sortable: false,
          width: "120px",
        },
        /*  { text: "pago_estado", value: "pago_estado", sortable: false }, */
        { text: "uuid", value: "uuid", width: "330px", sortable: false },
      ],

      page: 1,
      moment,
    };
  },
  methods: {
    ...mapActions("cierre_lote", ["getApilinkData", "setNumber", "setSize"]),

    updatePage(page, size) {
      if (page) this.setNumber(page);
      if (size) {
        this.setSize(size);
        this.setNumber(1);
        this.page = 1;
      }

      this.getApilinkData();
    },
  },
  computed: {
    ...mapGetters("cierre_lote", [
      "apilink",
      "fechaInicio",
      "fechaFin",
      "loadingTable",
      "lastPage",
      "size",
      "rowsPerPageArray",
    ]),
  },
};
</script>
