<template>
  <div id="chart">
    <apexchart
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "LinePDF",

  components: {
    apexchart: VueApexCharts,
  },

  data() {
    return {
      series: [
        {
          name: "High - 2013",
          data: [
            28, 29, 33, 36, 32, 32, 33, 28, 29, 33, 36, 32, 32, 33, 28, 28, 29,
            33, 36, 32, 32, 33, 28, 29, 33, 36, 32, 32, 33, 28,
          ],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",

          toolbar: {
            show: false,
          },
        },
        colors: ["#B4D917"],
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "7px",
            fontWeight: "700",
          },
        },
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "Operaciones",
          align: "center",
          style: {
            color: "#888",
            fontWeight: "400",
            fontSize: 10,
          },
        },
        grid: {
          borderColor: "#e7e7e7",
        },
        markers: {
          size: 1,
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Jul",
            "Jul",
          ],
        },
        yaxis: {
          min: 5,
          max: 40,
        },
      },
    };
  },
};
</script>
