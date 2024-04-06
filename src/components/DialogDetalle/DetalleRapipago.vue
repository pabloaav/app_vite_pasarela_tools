<template>
  <v-dialog v-model="dialogDetalleMovimiento" width="80%">
    <v-card v-if="detalle">
      <v-card-title class="font-weight-bold"
        >DETALLE RAPIPAGO<v-divider vertical class="mx-5" /> ID BANCO:
        {{ detalle.id }}
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="detalle.detalle"
          hide-default-footer
          disable-pagination
          no-data-text="Datos no encontrados"
          class="pb-2"
          :item-class="rowColor"
        >
          <template v-slot:[`item.fecha_cobro`]="{ item }">
            {{ formatDate(item.fecha_cobro.substring(0, 10)) }}
          </template>
          <template v-slot:[`item.importe_cobrado`]="{ item }">
            {{ formatImport(item.importe_cobrado) }}
          </template>
          <template v-slot:[`item.importe_calculado`]="{ item }">
            {{ formatImport(item.importe_calculado) }}
          </template>
          <template v-slot:[`item.informado`]="{ item }">
            <td>
              <v-chip :color="item.informado ? 'success' : 'error'" dark>
                {{ item.informado ? "SI" : "NO" }}
              </v-chip>
            </td>
          </template>

          <template v-slot:[`item.conciliado`]="{ item }">
            <v-chip :color="item.conciliado ? 'green' : 'red'" dark>
              {{ item.conciliado ? "SI" : "NO" }}
            </v-chip>
          </template></v-data-table
        >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatImport, formatDate } from "@/helpers";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "DetalleRapipago",
  props: { detalle: Object },
  data: () => ({
    headers: [
      { text: "FECHA DE COBRO", value: "fecha_cobro", sortable: false },
      { text: "IMPORTE COBRADO", value: "importe_cobrado", sortable: false },
      {
        text: "IMPORTE CALCULADO",
        value: "importe_calculado",
        sortable: false,
      },
      { text: "CODIGO DE BARRA", value: "codigo_barra", sortable: false },
      { text: "INFORMADO", value: "informado", sortable: false },
      { text: "CONCILIADO", value: "conciliado", sortable: false },
    ],
    formatImport,
    formatDate,
    moment,
  }),

  computed: {
    ...mapGetters("cierre_lote", ["codigoBarra"]),
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

  methods: {
    rowColor(item) {
      return item.codigo_barra === this.codigoBarra &&
        this.detalle.detalle.length > 1
        ? "green  lighten-5"
        : "";
    },
  },
};
</script>
