<template>
  <v-dialog v-model="dialogDetalleMovimiento" width="55%">
    <v-card v-if="detalle">
      <v-card-title class="font-weight-bold"
        >DETALLE REPORTES ENVIADOS<v-divider vertical class="mx-5" /> CLIENTE:
        {{ detalle.cliente }}
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="detalle.detalle"
          hide-default-footer
          disable-pagination
          no-data-text="Datos no encontrados"
          class="pb-2"
          fixed-header
          height="400px"
        >
          <!-- ------------MONTO------------ -->
          <template v-slot:[`item.Monto`]="{ item }">
            {{ item.Monto < 0 ? formatImport(item.Monto) : "$ " + item.Monto }}
          </template>
          <!-- ------------COMISION------------ -->
          <template v-slot:[`item.Comision`]="{ item }">
            {{ formatImport(item.Comision, true) }}
          </template>
          <!-- ------------IVA------------ -->
          <template v-slot:[`item.Iva`]="{ item }">
            {{ formatImport(item.Iva, true) }}
          </template>
          <!-- ------------RETENCION------------ -->
          <template v-slot:[`item.Retencion`]="{ item }">
            {{
              item.Retencion === 0 ? "-" : formatImport(item.Retencion, true)
            }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatImport } from "@/helpers";
export default {
  name: "DetalleReportesEnviados",
  props: { detalle: Object },
  data: () => ({
    headers: [
      { text: "REFERENCIA", value: "PagosId", sortable: false },
      { text: "ESTADO DE PAGO", value: "Estadopago", sortable: false },
      {
        text: "MEDIO DE PAGO",
        value: "Mediopago",
        sortable: false,
      },
      { text: "MONTO", value: "Monto", sortable: false },
      { text: "COMISION", value: "Comision", sortable: false },
      { text: "IVA", value: "Iva", sortable: false },
      { text: "RETENCION", value: "Retencion", sortable: false },
    ],
    formatImport,
  }),

  computed: {
    dialogDetalleMovimiento: {
      get() {
        return this.$store.getters["cierre_lote/dialogDetalleMovimiento"];
      },
      set(newDialog) {
        this.$store.dispatch(
          "cierre_lote/setDialogDetalleMovimiento",
          newDialog
        );
      },
    },
  },
};
</script>
