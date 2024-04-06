<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      type="table"
      height="calc(100vh-300px)"
    >
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="registros"
        :items-per-page="5"
        class="elevation-1"
        show-expand
        :expanded.sync="expanded"
      >
        <!-- Monto total -->
        <template v-slot:[`item.monto_total`]="{ item }">
          <span>{{ formatImport(item.monto_total) }}</span>
        </template>
        <!-- Fecha operacion -->
        <template v-slot:[`item.fecha_operacion`]="{ item }">
          <span>{{ formatDate(item.fecha_operacion) }}</span>
        </template>
        <!-- Fecha creacion -->
        <template v-slot:[`item.fecha_creacion`]="{ item }">
          <span>{{ formatDate(item.fecha_creacion) }}</span>
        </template>
        <!-- -----detalle -->
        <template v-slot:[`item.detalle`]="{ item }">
          <v-btn color="#757575" text @click="openDetalle(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>

        <!-- expanded detalle -->
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="detalle-container">
            <v-simple-table v-if="item.detalle.length">
              <thead>
                <tr>
                  <th>CBU DESTINO</th>
                  <th>CBU ORIGEN</th>
                  <th>FECHA OPERACION</th>
                  <th>MONTO</th>
                  <th>PORCENTAJE</th>
                  <th>REFERENCIA BANCARIA</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="detalle in item.detalle"
                  :key="detalle.Id"
                  class="grey lighten-4"
                >
                  <td>{{ detalle.cbu_destino }}</td>
                  <td>{{ detalle.cbu_origen }}</td>
                  <td align="center">
                    {{ formatDate(detalle.fecha_operacion) }}
                  </td>
                  <td>{{ formatImportFloat(detalle.monto) }}</td>
                  <td align="center">
                    {{ formatPorcentaje(detalle.porcentaje) }}%
                  </td>
                  <td align="center">{{ detalle.referencia_bancaria }}</td>
                </tr>
              </tbody>
            </v-simple-table>
            <span class="mx-5" v-else>Sin detalle</span>
          </td>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <DetalleTransfSub ref="dialogDetalle" />
  </div>
</template>

<script>
import DetalleTransfSub from "@/components/TransferenciasSubcuentas/DetalleTransfSub.vue";
import transfSubcuentasService from "@/services/transfSubcuentas";
import { formatImport, formatDate, formatImportFloat } from "@/helpers";
export default {
  name: "TablaTransfSubcuentas",
  components: {
    DetalleTransfSub,
  },
  data() {
    return {
      expanded: [],
      singleExpand: false,
      loading: false,
      headers: [
        //{ text: "ID", value: "id" },
        { text: "Cuenta", value: "cuenta" },
        { text: "Monto Total", value: "monto_total" },
        { text: "Fecha Operación", value: "fecha_operacion" },
        { text: "Fecha Creación", value: "fecha_creacion" },
        { text: "Subcuentas", value: "subcuentas", align: "center" },
        { text: "Detalle", value: "detalle", sortable: false, align: "center" },
      ],
      registros: [],
      detalle: [],

      formatImport,
      formatDate,
      formatImportFloat,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    openDetalle(item) {
      this.$refs.dialogDetalle.$emit("openDetalle", item);
    },
    async getData() {
      try {
        this.loading = true;
        const data = await transfSubcuentasService.getTransferenciasSub();
        this.loading = false;
        this.registros = data?.data || [];
        this.detalle = data?.data.detalle || [];
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },
    formatPorcentaje(p) {
      return p * 100;
    },
  },
};
</script>

<style scoped>
.detalle-container {
  padding: 4px 3px !important;
  background: #ddd;
}
</style>
