<template>
  <v-main class="mx-6 mt-2">
    <v-row no-gutters class="mb-3">
      <v-col cols="12" sm="6" lg="3" xl="2" class="mr-sm-2">
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
              :value="formatDate(fechaInicio, false)"
              label="Fecha inicio"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              hide-details
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="fechaInicio"
            @input="menu1 = false"
            locale="es"
            @change="getData()"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6" lg="3" xl="2">
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
              :value="formatDate(fechaFin, false)"
              label="Fecha fin"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              hide-details
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="fechaFin"
            @input="menu2 = false"
            locale="es"
            @change="getData()"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <!-- totales -->
      <v-col class="ml-6">
        <v-alert
          dense
          elevation="1"
          outlined
          text
          style="font-family: Montserrat, sans-serif; font-size: 13px"
          type="info"
          max-width="600"
        >
          Total pagos intento:
          <span class="font-weight-bold"> {{ this.totalPagosIntento }}</span>
          / Total transaccion faltante:
          <span class="font-weight-bold">
            {{ this.totalTransaccionFaltante }}
          </span>
          / Total cierre lote:
          <span class="font-weight-bold"> {{ this.totalCierreLote }} </span>
        </v-alert>
      </v-col>
    </v-row>

    <v-subheader class="font-weight-bold">
      Prisma / Trasacciones faltantes
      <v-checkbox
        v-model="soloFaltantes"
        label="Solo faltantes"
        class="font-weight-regular ml-13"
      >
      </v-checkbox>
      <v-btn
        class="ml-10 grey lighten-5"
        small
        outlined
        style="border: 1px solid #bbb !important"
        @click="copiarPortaPapeles"
      >
        <v-icon class="mx-2 text-h6">mdi-content-paste</v-icon> Copiar códigos
      </v-btn>
    </v-subheader>

    <v-skeleton-loader v-if="loading" type="table" height="calc(100vh-300px)" />

    <v-data-table
      :headers="headers"
      :items="filterData"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      @page-count="pageCount = $event"
      hide-default-footer
      no-data-text="Sin registros"
      height="calc(100vh - 205px)"
      class="elevation-1 row-pointer"
      disable-sort
      :loading="loading"
      :item-class="rowColor"
      @click:row="rowClick"
      :expanded.sync="expanded"
      v-else
    >
      <template v-slot:[`item.paid_at`]="{ item }">
        {{ formatDate(item.paid_at) }}
      </template>
      <template v-slot:[`item.report_at`]="{ item }">
        {{ formatDate(item.report_at) }}
      </template>
      <template v-slot:[`item.is_available`]="{ item }">
        {{ item.is_available ? "Si" : "No" }}
      </template>
      <template v-slot:[`item.amount`]="{ item }">
        $ {{ item.amount }}
      </template>
      <template v-slot:[`item.available_at`]="{ item }">
        {{ formatDate(item.report_at) }}
      </template>
      <template v-slot:[`item.reverted_at`]="{ item }">
        {{ formatDate(item.reverted_at) }}
      </template>
      <template v-slot:[`item.valorcupon`]="{ item }">
        {{ formatImportFloat(item.valorcupon) }}
      </template>
    </v-data-table>
    <v-row
      no-gutters
      class="mt-3"
      justify="center"
      align="center"
      style="position: relative"
      v-if="!loading"
    >
      <v-pagination
        v-model="page"
        :length="pageCount"
        :total-visible="10"
      ></v-pagination>

      <v-select
        label="Cantidad de registros"
        v-model="itemsPerPage"
        :items="itemsPerPageArray"
        style="position: absolute; max-width: 150px; right: 0"
        outlined
        dense
        hide-details
        @change="getData()"
      ></v-select>
    </v-row>

    <DetalleTransacciones ref="dialogTransaccion" />
  </v-main>
</template>

<script>
import cierreService from "@/services/cierre_lote.js";
import { formatDate, formatImportFloat } from "../../helpers";
import moment from "moment";
import DetalleTransacciones from "../../components/CierreLote/DetalleTransacciones.vue";
import notyf from "../../plugins/toast";

export default {
  name: "TransaccionesFaltantes",
  components: { DetalleTransacciones },
  data() {
    return {
      menu1: false,
      menu2: false,
      fechaInicio: moment().subtract(1, "days").format("YYYY-MM-DD"),
      fechaFin: moment().subtract(1, "days").format("YYYY-MM-DD"),
      page: 1,
      itemsPerPage: 300,
      pageCount: 0,
      itemsPerPageArray: [10, 30, 50, 100, 300],

      headers: [
        { text: "pago_intento_id", value: "pago_intento_id" },
        { text: "pagos_id", value: "pagos_id" },
        { text: "external_id", value: "external_id" },
        { text: "paid_at", value: "paid_at", width: "115px" },
        { text: "report_at", value: "report_at", width: "115px" },
        { text: "is_available", value: "is_available" },
        { text: "amount", value: "amount", width: "120px" },
        { text: "valorcupon", value: "valorcupon" },
        { text: "state_comment", value: "state_comment" },
        { text: "available_at", value: "available_at", width: "120px" },
        { text: "reverted_at", value: "reverted_at", width: "120px" },
        { text: "authorization_code", value: "authorization_code" },
        { text: "transaction_id", value: "transaction_id", width: "240px" },
        { text: "site_id", value: "site_id" },
        { text: "ticket_number", value: "ticket_number" },
        { text: "mediopagos_id", value: "mediopagos_id" },
        { text: "channels_id", value: "channels_id" },
        { text: "mediopago", value: "mediopago" },
        { text: "telco_external_id", value: "telco_external_id" },
        { text: "installmentdetails_id", value: "installmentdetails_id" },
        { text: "cuota", value: "cuota" },
        { text: "tna", value: "tna" },
        { text: "tem", value: "tem" },
        { text: "coeficiente", value: "coeficiente" },
      ],

      transacciones: [],
      loading: false,
      expanded: [],

      soloFaltantes: true,

      formatDate,
      formatImportFloat,

      //card totales
      totalPagosIntento: 0,
      totalTransaccionFaltante: 0,
      totalCierreLote: 0,
    };
  },

  mounted() {
    this.getData();
  },

  computed: {
    filterData() {
      return this.soloFaltantes
        ? this.transacciones.filter((t) => t.cierre_lote?.cl_id === 0)
        : this.transacciones;
    },
  },

  methods: {
    async getData() {
      const params = {
        FechaInicio: this.fechaInicio + "T00:00:00.000Z",
        FechaFin: this.fechaFin + "T23:59:59.999Z",
      };

      try {
        this.loading = true;
        this.transacciones = [];
        this.page = 1;
        const data = await cierreService.transaccionesFaltantes(params);

        this.loading = false;
        this.transacciones = data.data?.datos_pagos_intento_cl;

        //totales
        this.totalPagosIntento = data.data?.total_pagos_intento;
        this.totalTransaccionFaltante = data.data?.total_transaccion_faltante;
        this.totalCierreLote = data.data?.totla_cierre_lote;
      } catch (error) {
        console.error("error: ", error);
        this.loading = false;
        notyf.error("error al obtener las transacciones");
      }
    },

    rowColor(item) {
      return item?.cierre_lote?.cl_id === 0 ? "red  lighten-5" : "";
    },

    rowClick(item, event) {
      if (item?.cierre_lote?.cl_id !== 0) {
        this.$refs.dialogTransaccion.$emit("showDialog", {
          id: item.pago_intento_id,
          detalle: item.cierre_lote,
        });
      }
    },

    async copiarPortaPapeles() {
      try {
        await navigator.clipboard.writeText(
          this.filterData
            .map(({ transaction_id }) => `"${transaction_id}"`)
            .toString()
        );

        notyf.success("transactions_id copiados exitosamente");
      } catch ($e) {
        notyf.error("Error al copiar transactions_id");
      }
    },
  },
};
</script>

<style scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
