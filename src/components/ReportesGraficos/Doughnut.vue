<template>
  <div>
    <canvas ref="doughnutChart"></canvas>
  </div>
</template>

<script>
import { Chart, ArcElement, DoughnutController } from "chart.js";
import { formatImportFloat } from "@/helpers";

Chart.register(ArcElement, DoughnutController);

export default {
  name: "DoughnutChart",
  props: { data: Array, tipoFiltro: Number },
  data() {
    return {
      clientes: this.data,
    };
  },
  mounted() {
    this.createDoughnutChart();
  },
  methods: {
    createDoughnutChart() {
      const ctx = this.$refs.doughnutChart.getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: this.data.map((c) => c.Cliente),
          datasets: [
            {
              data: this.data.map((c) => this.floatToInteger(c.TotalMensual)),
              backgroundColor: [
                "#E91E63",
                "#5E35B1",
                "#009688",
                "#FF9800",
                "#FDD835",
                "#FF5722",
                "#0D47A1",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => this.generateTooltip(context),
              },
            },
          },
        },
      });
    },

    floatToInteger(float) {
      const num = float.split(",")[0].replaceAll(".", "");
      const decimals = float.split(",")[1];

      return Number(num + "." + decimals);
    },

    generateTooltip(context) {
      const dataset = context.dataset;
      const index = context.dataIndex;
      const currentValue = formatImportFloat(dataset.data[index]);

      const operaciones = this.data[index].TotalOperacionesCliente;

      if (this.tipoFiltro === 1) {
        const comision = this.data[index].TotalComisionMensual;

        return `Monto:  ${currentValue}  -  Comisión: $ ${comision}  -   Operaciones: ${operaciones}`;
      }
      // console.log("data1: ", operaciones);

      return `Monto:  ${currentValue}  -  Operaciones: ${operaciones}`;
    },
  },
};
</script>

<style>
html {
  overflow-y: auto !important;
}
</style>
