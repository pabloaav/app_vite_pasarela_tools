<template>
  <div>
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :margin="5"
      :paginate-elements-by-height="1400"
      :filename="tipoFiltro === 0 ? 'grafico-cobranzas' : 'grafico-rendiciones'"
      :pdf-quality="6"
      :manual-pagination="true"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="790px"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <div class="container-pdf">
          <div class="images-container">
            <img src="../../assets/wee_logo.png" width="60px" />
            <img
              src="../../assets/logotelco-removebg-preview.png"
              width="60px"
            />
          </div>
          <!-- TOTALES GENERALES -->
          <div class="title-container">
            <p class="text-md">
              {{ `REPORTE ${tipoFiltro === 0 ? "COBRANZAS" : "RENDICIONES"}` }}
            </p>
            <p class="text-xs">Fecha: {{ formatDate(fechaActual) }}</p>
          </div>
          <div class="info-container">
            <div class="resume-container">
              <p class="text-xs" style="font-size: 9px">
                TOTAL {{ tipoFiltro === 0 ? "COBRANZAS" : "RENDICIONES" }}
              </p>
              <p class="text-xs bold" style="margin-bottom: 2px">
                $ {{ montoTotal }}
              </p>

              <!-- MOSTRAR COMISIONES CUANDO SEA RENDICIONES -->
              <div v-if="tipoFiltro === 1" style="margin-bottom: 8px">
                <p class="text-xs" style="font-size: 9px">
                  TOTAL COMISIONES TELCO
                </p>
                <p class="text-xs bold" style="font-size: 9px">
                  $ {{ totalComisiones }}
                </p>
              </div>
              <p class="text-xs">
                Cantidad de operaciones:
                <span class="bold">{{ totalOperaciones }}</span>
              </p>
              <p class="text-xs" style="margin-top: 8px; font-size: 9px">
                Fecha de inicio:
                <span class="bold">
                  {{ formatDate(fechaInicio) }}
                </span>
              </p>
              <p class="text-xs" style="font-size: 9px">
                Fecha de fin:
                <span class="bold">{{ formatDate(fechaFin) }}</span>
              </p>
            </div>

            <!-- TOTALES DE CLIENTES -->
            <div class="cliente-container">
              <div class="cliente-item" v-for="cliente in clientes">
                <p class="text-xs" style="font-size: 9px; margin-bottom: 2px">
                  {{ cliente.Cliente }}
                </p>
                <p class="text-xs bold">${{ cliente.TotalMensual }}</p>

                <div v-if="tipoFiltro === 1" style="margin-top: 3px">
                  <p class="text-xs" style="font-size: 9px">Comisión TelCo</p>
                  <p class="text-xs bold" style="font-size: 9px">
                    $ {{ cliente.TotalComisionMensual }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- GRAFICOS -->
          <v-row no-gutters style="margin-top: 35px; margin-right: 5px">
            <v-col cols="12" v-if="data.length > 0">
              <BarPDF
                :series="currentData(true).series"
                :categories="currentData(true).categories"
                :tipoFiltro="tipoFiltro"
              />
            </v-col>
            <v-col cols="12" style="margin-top: 20px" v-if="data.length > 16">
              <BarPDF
                :series="currentData().series"
                :categories="currentData().categories"
                :tipoFiltro="tipoFiltro"
              />
            </v-col>
            <v-col cols="12" v-if="false">
              <LinePDF />
            </v-col>

            <v-col cols="6">
              <v-simple-table
                dense
                style="margin: 0 10px; border: 1px solid #eee; border-radius: 0"
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th style="font-size: 9px">Fecha</th>
                      <th style="font-size: 9px">Operaciones</th>
                      <th style="font-size: 9px" v-if="tipoFiltro === 1">
                        Comisión total día
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, i) in currentData(true).categories"
                      :key="i"
                    >
                      <td style="font-size: 9px">{{ item }}</td>
                      <td style="font-size: 9px">
                        {{ currentData(true).operaciones[i] }}
                      </td>
                      <td style="font-size: 9px" v-if="tipoFiltro === 1">
                        {{
                          formatImport(currentData(true).comisiones[i], true)
                        }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="6">
              <v-simple-table
                dense
                style="margin: 0 10px; border: 1px solid #eee"
                class="rounded-0"
                v-if="data.length > 16"
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th style="font-size: 9px">Fecha</th>
                      <th style="font-size: 9px">Operaciones</th>
                      <th style="font-size: 9px" v-if="tipoFiltro === 1">
                        Comisión total día
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in currentData().categories" :key="i">
                      <td style="font-size: 9px">{{ item }}</td>
                      <td style="font-size: 9px">
                        {{ currentData().operaciones[i] }}
                      </td>
                      <td style="font-size: 9px" v-if="tipoFiltro === 1">
                        {{
                          formatImport(currentData(true).comisiones[i], true)
                        }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </div>
      </section>
    </vue-html2pdf>
  </div>
</template>

<script>
import BarPDF from "./BarPDF.vue";
import LinePDF from "./LinePDF.vue";
import { formatDate, formatImport } from "../../helpers";

export default {
  name: "CobranzasPDF",
  components: { BarPDF, LinePDF },

  props: {
    data: Array,
    clientes: Array,
    tipoFiltro: Number,
    fechaInicio: String,
    fechaFin: String,
    fechaActual: String,
    montoTotal: String,
    totalOperaciones: Number,
    totalComisiones: String,
  },
  data() {
    return {
      preview: true,

      formatDate,
      formatImport,
    };
  },

  mounted() {
    this.$on("generatePDF", () => this.generatePDF());
  },

  methods: {
    onProgress(event) {
      console.log(`Processed: ${event} / 100`);
      if (event === 100) this.loading = false;
    },
    hasGenerated() {
      alert("PDF generated successfully!");
    },
    generatePDF() {
      this.loading = true;
      this.$refs.html2Pdf.generatePdf();
    },

    // los datos se dividen en 2, en caso de que el parametro 'first' es verdadero
    // se obtiene la primera parte del arreglo, en caso contrario la segunda parte
    currentData(first = false) {
      //obtenemos la cantidad de elementos
      const index = this.data.length;
      let comisiones = [];

      // obtenemos si el filtro del monto es por rendicion o cobranza
      const atributoFilterAmout =
        this.tipoFiltro === 0 ? "CobranzaTotalDia" : "RendicionTotalDia";

      // obtenemos si el filtro de la fecha es por rendicion o cobranza
      const atributoFilterDate =
        this.tipoFiltro === 0 ? "FechaCobranzas" : "FechaRendicion";

      let startIndex = first ? 0 : index / 2;
      let endIndex = first ? index / 2 : index;

      if (index <= 16) {
        startIndex = 0;
        endIndex = index;
      }

      // arreglo de montos
      const series = this.data
        .slice(startIndex, endIndex)
        .map((c) => c[atributoFilterAmout]);

      // arreglo de fechas
      const categories = this.data
        .slice(startIndex, endIndex)
        .map((c) => c[atributoFilterDate]);

      // arreglo de fechas
      const operaciones = this.data
        .slice(startIndex, endIndex)
        .map((c) => c.OperacionesTotalDia);

      if (this.tipoFiltro === 1) {
        comisiones = this.data
          .slice(startIndex, endIndex)
          .map((c) => c.ComisionTotalDia);
      }

      return { series, categories, operaciones, comisiones };
    },
  },
};
</script>

<style scoped>
.text-md {
  font-size: 12px;
  font-weight: 900;
  margin: 0;
}
.text-xs {
  font-size: 10px;
  margin: 0;
}

.bold {
  font-weight: 900;
}

.container-pdf {
  background: #fff !important;
  padding: 15px 10px 10px;
}

.images-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.images-container > img {
  aspect-ratio: 16/10;
  margin: 0 5px;
}
.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 5px 10px 10px;
  border: 1px solid #ccc;
  padding: 10px;
}

.info-container {
  display: flex;
  margin: 15px 10px;
  gap: 5px;
}

.resume-container {
  border: 1px solid #ccc;
  flex: 1;

  padding: 5px 8px;
}

.cliente-container {
  flex: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.cliente-item {
  border: 1px solid #ccc;
  min-width: 150px;

  padding: 5px;
  flex: 1;
}

.labels {
  transform: rotate(70deg) !important;
}
</style>
