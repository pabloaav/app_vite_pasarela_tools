<template>
  <apexchart
    type="bar"
    height="250"
    :options="chartOptions"
    :series="data"
  ></apexchart>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { formatImport } from "@/helpers.js";
import moment from "moment";

export default {
  name: "BarPDF",
  components: { apexchart: VueApexCharts },
  props: {
    series: Array,
    categories: Array,
    tipoFiltro: Number,
  },
  data() {
    return {
      data: [{ name: "Cobranzas", data: this.series || [] }],

      chartOptions: {
        chart: {
          height: 350,
          type: "bar",
          toolbar: {
            show: true,
            tools: {
              download: false,
            },
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "45%",

            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,

          formatter: function (val) {
            return formatImport(val, true).split(",")[0];
          },
          offsetY: -18,
          style: {
            fontSize: "7px",
            fontWeight: "700",
            colors: ["#000"],
          },
          background: {
            enabled: true,
          },
        },
        stroke: {
          show: false,
          width: 1,
          colors: ["#ccc"],
        },

        xaxis: {
          categories: this.categories || [],
          position: "bottom",
          labels: {
            show: true,
            style: { fontSize: "8px" },
            formatter: function (val) {
              const formatted = moment(val, "DD-MM-YYYY").format("lll");

              return formatted.split(",")[0];
            },
          },

          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "vertical",
            shadeIntensity: 0.25,
            gradientToColors: ["#34BDF1", "#B4D917", "#f00"],
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 90, 100],
          },
        },

        grid: {
          borderColor: "#eeeeee",

          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },

        title: {
          text: this.getTitle(),
          floating: true,
          align: "center",
          style: {
            color: "#888",
            fontWeight: "400",
            fontSize: 10,
          },
        },

        noData: {
          text: "Sin registros...",
        },
      },
    };
  },

  watch: {
    series(newSeries) {
      // console.log("new: ", newSeries);
      this.data[0].data = newSeries;
    },

    categories(newCategories) {
      // console.log("new cat: ", newCategories);
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          xaxis: { categories: newCategories },
          title: { text: this.getTitle() },
        },
      };
    },
  },

  methods: {
    getTitle() {
      const index = this.categories.length;
      const firstDate = this.categories[0];
      const endDate = this.categories[index - 1];

      return this.tipoFiltro === 0
        ? `Cobranzas del ${firstDate} al ${endDate}`
        : `Rendiciones del ${firstDate} al ${endDate}`;
    },
  },
};
</script>
