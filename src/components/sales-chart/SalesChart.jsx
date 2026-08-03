import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const toArray = (value) => (Array.isArray(value) ? value : []);

export default function SalesChart({ data }) {
  const chartData = data?.datasets ? data : data?.data;
  const hasSeriesData = Boolean(
    chartData?.datasets &&
      Object.values(chartData.datasets).some((values) =>
        Array.isArray(values),
      ),
  );

  if (!hasSeriesData) {
    return (
      <div
        style={{
          width: "100%",
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
          fontSize: 14,
        }}
      >
        No sales data available
      </div>
    );
  }

  const series = [
    {
      name: "Tizzy Mail",
      type: "column",
      data: toArray(chartData?.datasets?.tizzy_mail),
    },
    {
      name: "Microsoft 365",
      type: "column",
      data: toArray(chartData?.datasets?.microsoft_solution),
    },
    {
      name: "Google Cloud",
      type: "line",
      data: toArray(chartData?.datasets?.google_cloud),
    },
    {
      name: "Total Sales",
      type: "area",
      data: toArray(chartData?.datasets?.total_sales),
    },
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },

    colors: ["#00C49A", "#F4B74A", "#0057D8", "#8DD9F7"],

    stroke: {
      width: [0, 0, 3, 3],
      curve: "smooth",
      dashArray: [0, 0, 5, 0],
    },
    tooltip: {
      shared: false,
    },

    fill: {
      opacity: [1, 1, 1, 0.25],
    },

    xaxis: {
      categories: toArray(chartData?.x_axis?.values),
    },

    yaxis: {
      title: {
        text: "Sales Amount",
      },
    },

    legend: {
      position: "bottom",
    },

    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div style={{ width: "100%", minHeight: 200 }}>
      <Chart options={options} series={series} type="line" height={200} />
    </div>
  );
}
