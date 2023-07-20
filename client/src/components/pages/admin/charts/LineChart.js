/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import ReactApexChart from "react-apexcharts";
import lineChart from "./config/lineChart";

function LineChart({ weeklySales }) {
  const series = [
    {
      name: "Current Week",
      data: weeklySales.slice(1, 5),
      offsetY: 0,
    },
    {
      name: "Previous Week",
      data: weeklySales.slice(0, 4),
      offsetY: 0,
    },
  ];
  return (
    <ReactApexChart
      className="full-width"
      options={lineChart.options}
      series={series}
      type="area"
      height={250}
      width={"100%"}
    />
  );
}

export default LineChart;
