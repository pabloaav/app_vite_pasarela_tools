<template>
  <div>
    <v-dialog v-model="dialog" max-width="70%">
      <v-card>
        <v-card-title>
          <span class="font-weight-bold">
            Detalle Transferencias Subcuentas: <v-divider vertical></v-divider>
            {{ cuenta }}
          </span>
          <v-card-text class="mt-8">
            <v-data-table
              :headers="headers"
              :items="detalle"
              hide-default-footer
              disable-pagination
              no-data-text="Datos no encontrados"
              class="pb-2"
              fixed-header
              height="250px"
            >
              <!-- fecha operacion -->
              <template v-slot:[`item.fecha_operacion`]="{ item }">
                <span>{{ formatDate(item.fecha_operacion) }}</span>
              </template>
              <!-- monto -->
              <template v-slot:[`item.monto`]="{ item }">
                <span>{{ formatImportFloat(item.monto) }}</span>
              </template>
              <!-- porcentaje -->
              <template v-slot:[`item.porcentaje`]="{ item }">
                <span>{{ formatPorcentaje(item.porcentaje) }}%</span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { formatImportFloat, formatDate } from "@/helpers";
export default {
  name: "DetalleTransfSub",
  data: () => ({
    dialog: false,
    cuenta: "",

    headers: [
      { text: "CBU Destino", value: "cbu_destino", sortable: false },
      { text: "CBU Origen", value: "cbu_origen", sortable: false },
      {
        text: "Fecha Operación",
        value: "fecha_operacion",
        sortable: false,
        align: "center",
      },
      { text: "Monto", value: "monto", sortable: false, align: "center" },
      {
        text: "Porcentaje",
        value: "porcentaje",
        sortable: false,
        align: "center",
      },
      {
        text: "Referencia bancaria",
        value: "referencia_bancaria",
        sortable: false,
        align: "center",
      },
    ],

    detalle: [],

    formatImportFloat,
    formatDate,
  }),

  mounted() {
    this.$on("openDetalle", (item) => {
      this.dialog = true;
      this.cuenta = item.cuenta;
      this.detalle = item.detalle;
    });
  },
  methods: {
    formatPorcentaje(p) {
      return p * 100;
    },
  },
};
</script>

<style scoped></style>
