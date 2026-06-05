import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function SalesChart({ data }) {
  const series = [
    {
      name: "Tizzy Mail",
      type: "column",
      data: data?.datasets?.tizzy_mail,
    },
    {
      name: "Microsoft Solution",
      type: "column",
      data: data?.datasets?.microsoft_solution,
    },
    {
      name: "Google Cloud",
      type: "line",
      data: data?.datasets?.google_cloud,
    },
    {
      name: "Total Sales",
      type: "area",
      data: data?.datasets?.total_sales,
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
      categories: data?.x_axis?.values,
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
    <div style={{ width: "100%" }}>
      <Chart options={options} series={series} type="line" height={400} />
    </div>
  );
}
