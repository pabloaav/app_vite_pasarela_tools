<template>
  <div class="hide-overlay">
    <v-skeleton-loader
      :loading="loadingTable"
      type="table"
      height="calc(100vh-300px)"
    >
      <p class="text-center grey--text" v-if="reportes_enviados.length === 0">
        Sin registros para mostrar
      </p>
      <v-data-table
        :headers="headers"
        :items="reportes_enviados"
        :page.sync="page"
        :items-per-page="size"
        item-key="Id"
        hide-default-footer
        class="elevation-1 row-pointer"
        :loading="loadingTable"
        loading-text="Cargando transacciones"
        no-data-text="Sin registros para mostrar"
        fixed-header
        height="calc(100vh - 200px)"
        @click:row="rowClick"
        :expanded.sync="expanded"
        v-else
        show-expand
      >
        <template v-slot:[`item.Tiporeporte`]="{ item }">
          <v-chip
            :color="
              item.Tiporeporte === 'pagos'
                ? 'blue darken-4 white--text'
                : item.Tiporeporte === 'rendiciones'
                ? 'green darken-3 white--text'
                : 'purple lighten-2 white--text'
            "
          >
            {{ item.Tiporeporte }}
          </v-chip>
        </template>
        <template v-slot:[`item.Nro_reporte`]="{ item }">
          {{ formatNumReporte(item.Nro_reporte) }}
        </template>
        <template v-slot:[`item.Fecharendicion`]="{ item }">
          {{ item.Fecharendicion ? item.Fecharendicion : "-" }}
        </template>
        <template v-slot:[`item.Fechacobranza`]="{ item }">
          {{ item.Fechacobranza ? item.Fechacobranza : "-" }}
        </template>
        <template v-slot:[`item.Totalcobrado`]="{ item }">
          {{ "$ " + item.Totalcobrado }}
        </template>
        <template v-slot:[`item.Totalrendido`]="{ item }">
          {{ item.Totalrendido ? "$ " + item.Totalrendido : " - " }}
        </template>
        <template v-slot:[`item.Detalles`]="{ item }">
          {{ item.Detalles ? item.Detalles : "-" }}
        </template>

        <!--DETALLE DE OPERACIÓN-->
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="detalle-container">
            <v-simple-table v-if="item.Tiporeporte === 'pagos'">
              <thead>
                <tr class="red">
                  <th>PAGO ID</th>
                  <th>ESTADO DE PAGO</th>
                  <th>MEDIO DE PAGO</th>
                  <th>MONTO</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="detalle in item.Detalles"
                  :key="detalle.Id"
                  class="grey lighten-4"
                >
                  <td>{{ detalle.PagosId }}</td>
                  <td>{{ detalle.Estadopago }}</td>
                  <td>{{ detalle.Mediopago }}</td>
                  <td>{{ "$ " + detalle.Monto }}</td>
                </tr>
              </tbody>
            </v-simple-table>
            <span class="mx-5 font-weight-bold" v-else>SIN DETALLE</span>
          </td>
        </template>

        <template v-slot:footer>
          <v-divider></v-divider>
          <div class="d-flex align-center justify-space-between pa-2">
            <span style="min-width: 100px"></span>
            <v-pagination
              v-model="page"
              :length="lastPage"
              @input="updatePage($event)"
              circle
            ></v-pagination>
            <v-select
              :items="rowsPerPageArray"
              hide-details
              label="Mostrar:"
              v-model="size"
              @change="
                () => {
                  page = 1;
                  getReportesEnviadosData();
                }
              "
              append-icon="mdi-arrow-down  "
              class="pa-0 ma-0 items-per-page"
              style="max-width: 100px"
              outlined
              dense
            />
          </div>
        </template>
      </v-data-table>
    </v-skeleton-loader>

    <DetalleReportesEnviados :detalle="itemDetalle" />
    <enviar-reporte />
  </div>
</template>

<script>
import {
  formatImport,
  formatDate,
  formatDateHour,
  formatNumReporte,
} from "@/helpers";
import { mapGetters, mapActions } from "vuex";
import DetalleReportesEnviados from "./DialogDetalle/DetalleReportesEnviados.vue";
import EnviarReporte from "./ReportesEnviados/EnviarReporte.vue";

export default {
  name: "TablaReportesEnviados",
  components: { DetalleReportesEnviados, EnviarReporte },
  data() {
    return {
      page: 1,
      itemsPerPage: 15,
      itemDetalle: null,
      expanded: [],
      formatImport: formatImport,
      formatDate: formatDate,
      formatDateHour,
      formatNumReporte,

      headers: [
        { text: "Número", value: "Nro_reporte", sortable: false },
        { text: "Cliente", value: "Cliente", sortable: false },
        { text: "Tipo de reporte", value: "Tiporeporte", sortable: false },
        {
          text: "Fecha de cobranza",
          value: "Fechacobranza",
          width: "150px",
          sortable: false,
          align: "center",
        },
        {
          text: "Fecha de rendicion",
          value: "Fecharendicion",
          width: "150px",
          sortable: false,
          align: "center",
        },

        {
          text: "Total cobrado",
          value: "Totalcobrado",
          sortable: false,
          width: "140px",
        },
        {
          text: "Total rendido",
          value: "Totalrendido",
          sortable: false,
          align: "center",
          width: "140px",
        },
        {
          text: "Fecha de envio",
          value: "Fechacreacion",
          width: "140px",
          sortable: false,
          align: "center",
        },
      ],
    };
  },
  watch: {
    number(newNumber) {
      this.page = newNumber;
    },
  },
  methods: {
    ...mapActions(["getReportesEnviadosData", "setNumber", "setDialog"]),
    ...mapActions("cierre_lote", ["setDialogDetalleMovimiento"]),

    updatePage(page, size) {
      if (page) this.setNumber(page);
      if (size) {
        this.setSize(size);
        this.setNumber(1);
        this.page = 1; //redirigiendo a la primera pagina de la tabla
      }

      this.getReportesEnviadosData();
    },

    //metodo que se encarga de desplegar el detalle al hacer click sobre una fila en la tabla
    rowClick(item, event) {
      if (event.isExpanded) {
        const indexExpanded = this.expanded.findIndex((i) => i === item);
        this.expanded.splice(indexExpanded, 1);
      } else {
        //this.expanded.push(item);

        if (item.Tiporeporte !== "rendiciones") {
          this.itemDetalle = { cliente: item.Cliente, detalle: item.Detalles };
          this.setDialogDetalleMovimiento(true);
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      "number",
      "lastPage",
      "loadingTable",
      "reportes_enviados",
      "fechaInicio",
      "fechaFin",
      "rowsPerPageArray",
    ]),

    size: {
      get() {
        return this.$store.getters["size"];
      },
      set(newSize) {
        return this.$store.dispatch("setSize", newSize);
      },
    },
  },
};
</script>

<style scoped>
.detalle-container {
  padding: 4px 3px !important;
  background: #ddd;
}

.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}

.items-per-page >>> .v-input__slot::before {
  border-style: none !important;
}
</style>
