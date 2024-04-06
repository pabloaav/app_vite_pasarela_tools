<template>
  <div>
    <canvas id="bar-chart" style="min-width: 100%"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { formatImportFloat } from "@/helpers";
Chart.register(...registerables);
Chart.defaults.font.size = 10;

export default {
  name: "BarChart",
  props: { data: Object, tipoFiltro: Number, n: Number },
  data() {
    return {
      totales: this.data.totales,
      operaciones: this.data.operaciones,
      labels: this.data.labels,

      barChart: null,
    };
  },
  mounted() {
    this.createChart();
  },

  watch: {
    data(newData) {
      this.totales = newData.totales;
      this.labels = newData.labels;

      this.barChart.data.datasets[0].data = this.totales;
      this.barChart.data.labels = this.labels;

      this.barChart.update();
    },
  },

  methods: {
    createChart() {
      // Obtener el contexto del canvas
      const ctx = document.getElementById("bar-chart").getContext("2d");

      // Crear el gráfico de barras
      this.barChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.labels || [],
          datasets: [
            {
              label:
                this.tipoFiltro === 0
                  ? "Ingresos díarios"
                  : "Rendiciones díarias",

              data: this.totales || [],
              backgroundColor: ["#01579B", "#2196F3"], // Color de las barras
            },
          ],
        },
        options: {
          responsive: true,

          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => this.generateTooltip(context),
              },
            },
            legend: {
              labels: {
                // This more specific font property overrides the global property
                font: {
                  size: 10,
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },

    generateTooltip(context) {
      const index = context?.dataIndex;
      const monto = formatImportFloat(context?.parsed.y);

      const operacion = this.data?.operaciones[index] || 0;
      if (this.tipoFiltro === 1) {
        const comision = formatImportFloat(this.data?.comisiones[index] || 0);
        return `Total rendido: ${monto}  -  Comisiones: ${comision}  -  Operaciones: ${operacion} `;
      }

      return `Ingresos: ${monto}  -  Operaciones: ${operacion}`;
    },
  },
};
</script>

<style scoped></style>
