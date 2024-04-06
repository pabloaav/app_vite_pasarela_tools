<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card class="white" elevation="0">
      <v-toolbar tile dark color="primary">
        <v-toolbar-title>
          Detalle
          {{ tipoFiltro === 0 ? "cobranzas" : "rendiciones" }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="handleClose()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-row class="ma-3">
        <v-col
          cols="12"
          lg="4"
          class="pa-1"
          style="border-right: 1px solid #ccc; border-bottom: 1px solid #ccc"
        >
          <v-chip color="grey lighten-4"> CABECERA </v-chip>
          <v-data-table
            v-model="selected"
            :headers="tipoFiltro === 0 ? headersCobranzas : headersRendiciones"
            :items="data"
            no-data-text="Sin registros"
            hide-default-footer
            disable-sort
            show-select
            :item-key="tipoFiltro === 0 ? 'FechaCobranzas' : 'FechaRendicion'"
            single-select
            disable-pagination
            checkbox-color="green"
            height="calc(100vh - 180px)"
            class="tabla"
            @click:row="(item) => (selected = [item])"
          >
            <template v-slot:[`item.CobranzaTotalDia`]="{ item }">
              {{ formatImportFloat(item.CobranzaTotalDia) }}
            </template>
            <template v-slot:[`item.RendicionTotalDia`]="{ item }">
              {{ formatImportFloat(item.RendicionTotalDia) }}
            </template>
            <template v-slot:[`item.ComisionTotalDia`]="{ item }">
              {{ formatImportFloat(item.ComisionTotalDia) }}
            </template>
          </v-data-table>
        </v-col>
        <v-col cols="12" lg="8" class="pl-5">
          <v-chip color="grey lighten-4"> DETALLE </v-chip>

          <v-data-table
            :headers="headersDetalleCobranzas"
            :items="selected[0]?.PagosDia || []"
            no-data-text="Seleccione un registro de la cabecera"
            hide-default-footer
            disable-sort
            disable-pagination
            height="calc(100vh - 160px)"
            v-if="tipoFiltro === 0"
          >
            <template v-slot:[`item.Pago.Monto`]="{ item }">
              $ {{ formatImport(item.Pago.Monto, true) }}
            </template>
          </v-data-table>

          <v-data-table
            :headers="headersDetalleRendiciones"
            :items="selected[0]?.RendicionesDia || []"
            no-data-text="Seleccione un registro de la cabecera"
            hide-default-footer
            disable-sort
            disable-pagination
            height="calc(100vh - 160px)"
            v-if="tipoFiltro === 1"
          >
            <template v-slot:[`item.Rendicion.ImporteCobrado`]="{ item }">
              $ {{ formatImportFloat(item.Rendicion.ImporteCobrado) }}
            </template>

            <template v-slot:[`item.Rendicion.ImporteDepositado`]="{ item }">
              $ {{ formatImportFloat(item.Rendicion.ImporteDepositado) }}
            </template>
            <template v-slot:[`item.Rendicion.Comision`]="{ item }">
              $ {{ formatImportFloat(item.Rendicion.Comision) }}
            </template>
            <template v-slot:[`item.Rendicion.Iva`]="{ item }">
              $ {{ formatImportFloat(item.Rendicion.Iva) }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatImport, formatImportFloat } from "../../helpers";
export default {
  name: "DetalleGraficos",
  data() {
    return {
      selected: [],
      dialog: false,
      tipoFiltro: 0,
      data: [],

      headersCobranzas: [
        { text: "FECHA", value: "FechaCobranzas" },
        { text: "TOTAL", value: "CobranzaTotalDia" },
      ],

      headersRendiciones: [
        { text: "FECHA", value: "FechaRendicion" },
        { text: "TOTAL RENDIDO", value: "RendicionTotalDia" },
        { text: "COMISIÓN", value: "ComisionTotalDia" },
      ],

      headersDetalleCobranzas: [
        { text: "FECHA", value: "Pago.FechaPago" },
        { text: "CLIENTE", value: "Cliente" },
        { text: "CANAL", value: "Pago.Tipo" },
        { text: "MONTO", value: "Pago.Monto" },
      ],

      headersDetalleRendiciones: [
        { text: "FECHA COBRO", value: "Rendicion.FechaCobro", width: "120px" },
        {
          text: "FECHA DEPÓSITO",
          value: "Rendicion.FechaDeposito",
          width: "120px",
        },
        { text: "CLIENTE", value: "Cliente", width: "200px" },
        { text: "CONCEPTO", value: "Rendicion.Concepto" },
        { text: "COBRADO", value: "Rendicion.ImporteCobrado", width: "125px" },
        {
          text: "DEPOSITADO",
          value: "Rendicion.ImporteDepositado",
          width: "125px",
        },
        { text: "COMISIÓN", value: "Rendicion.Comision", width: "100px" },
        { text: "IVA", value: "Rendicion.Iva", width: "100px" },
      ],

      formatImport,
      formatImportFloat,
    };
  },

  mounted() {
    this.$on("showDetalle", (data) => {
      console.log("data: ", data);
      this.tipoFiltro = data.tipo;
      this.dialog = true;
      this.data = data.tipo === 0 ? data.cobranzas : data.rendiciones;
    });
  },

  methods: {
    handleClose() {
      this.dialog = false;
      this.selected = [];
    },
  },
};
</script>

<style scoped>
.tabla ::v-deep.v-data-table__selected {
  background: #e8f5e9 !important;
}

.tabla ::v-deep tr {
  cursor: pointer;
}
</style>
