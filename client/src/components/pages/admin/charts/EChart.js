import ReactApexChart from "react-apexcharts";
import eChart from "./config/eChartConfig";

function EChart({ monthlySales }) {
  const series = [
    {
      name: "Sales",
      data: monthlySales,
      color: "#fff",
    },
  ];
  return (
    <div id="chart">
      <ReactApexChart
        className="bar-chart"
        options={eChart.options}
        series={series}
        type="bar"
        height={250}
      />
    </div>
  );
}

export default EChart;
