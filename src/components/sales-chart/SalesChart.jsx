import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const toArray = (value) => (Array.isArray(value) ? value : []);

const LEGACY_SERIES = [
  { name: "Tizzy Mail", type: "column", key: "tizzy_mail" },
  { name: "Microsoft 365", type: "column", key: "microsoft_solution" },
  { name: "Google Cloud", type: "line", key: "google_cloud" },
  { name: "Total Sales", type: "area", key: "total_sales" },
];

const SERIES_TYPES = ["column", "column", "line", "area"];
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
/** Zoom when axis has more points than roughly one month of daily labels */
const MAX_VISIBLE_POINTS = 40;

/**
 * When there are too many x-axis labels, return min/max category indices
 * focused on the current month (or nearest fallback window).
 */
const getAutoZoomRange = (categories) => {
  if (!categories?.length || categories.length <= MAX_VISIBLE_POINTS) {
    return null;
  }

  const now = new Date();
  const monthLabel = MONTH_SHORT[now.getMonth()];
  const dayLabel = String(now.getDate()).padStart(2, "0");

  const monthIndices = [];
  let todayIndex = -1;

  categories.forEach((raw, index) => {
    const label = String(raw ?? "");
    if (label.includes(monthLabel)) {
      monthIndices.push(index);
      if (label.includes(dayLabel) && todayIndex === -1) {
        todayIndex = index;
      }
    }
  });

  if (monthIndices.length > 0) {
    return {
      min: monthIndices[0],
      max: monthIndices[monthIndices.length - 1],
    };
  }

  // No matching month labels — center a window on "today" if found, else last N points
  if (todayIndex >= 0) {
    const half = Math.floor(MAX_VISIBLE_POINTS / 2);
    const min = Math.max(0, todayIndex - half);
    const max = Math.min(categories.length - 1, min + MAX_VISIBLE_POINTS - 1);
    return { min, max };
  }

  return {
    min: Math.max(0, categories.length - MAX_VISIBLE_POINTS),
    max: categories.length - 1,
  };
};

export default function SalesChart({ data, height = 200, chartRef }) {
  const chartData =
    data?.datasets || data?.y_axis?.datasets ? data : data?.data;

  const xAxisValues = toArray(chartData?.x_axis?.values);
  const yAxisLabel = chartData?.y_axis?.label || "Sales Amount";
  const rawDatasets = chartData?.y_axis?.datasets || chartData?.datasets;
  const isArrayDatasets = Array.isArray(rawDatasets);

  const hasSeriesData = isArrayDatasets
    ? rawDatasets.some((dataset) => Array.isArray(dataset?.data))
    : Boolean(
        rawDatasets &&
          Object.values(rawDatasets).some((values) => Array.isArray(values)),
      );

  if (!hasSeriesData) {
    return (
      <div
        style={{
          width: "100%",
          height,
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

  const series = isArrayDatasets
    ? rawDatasets.map((dataset, index) => ({
        name: dataset?.label || dataset?.key || "",
        type: SERIES_TYPES[index] || "line",
        data: toArray(dataset?.data),
      }))
    : LEGACY_SERIES.map((item) => ({
        name: item.name,
        type: item.type,
        data: toArray(rawDatasets?.[item.key]),
      }));

  const strokeWidths = series.map((item) =>
    item.type === "column" ? 0 : 3,
  );
  const dashArray = series.map((item) => (item.type === "line" ? 5 : 0));
  const fillOpacity = series.map((item) => (item.type === "area" ? 0.25 : 1));
  const zoomRange = getAutoZoomRange(xAxisValues);
  const isZoomed = Boolean(zoomRange);

  const options = {
    chart: {
      zoom: {
        enabled: isZoomed,
        type: "x",
        autoScaleYaxis: true,
      },
      toolbar: {
        show: isZoomed,
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
    },
    colors: ["#00C49A", "#F4B74A", "#0057D8", "#8DD9F7"],
    stroke: {
      width: strokeWidths,
      curve: "smooth",
      dashArray,
    },
    tooltip: {
      shared: false,
    },
    fill: {
      opacity: fillOpacity,
    },
    xaxis: {
      categories: xAxisValues,
      ...(zoomRange
        ? {
            min: zoomRange.min,
            max: zoomRange.max,
            tickAmount: Math.min(
              12,
              zoomRange.max - zoomRange.min + 1,
            ),
            labels: {
              rotate: -45,
              hideOverlappingLabels: true,
              trim: true,
            },
          }
        : {
            labels: {
              hideOverlappingLabels: true,
              trim: true,
            },
          }),
    },
    yaxis: {
      title: {
        text: yAxisLabel,
      },
    },
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
  };

  const chartKey = [
    xAxisValues.length,
    zoomRange?.min ?? "all",
    zoomRange?.max ?? "all",
    series.map((s) => s.name).join("|"),
  ].join("-");

  return (
    <div style={{ width: "100%", minHeight: height }}>
      <Chart
        key={chartKey}
        chartRef={chartRef}
        options={options}
        series={series}
        type="line"
        height={height}
      />
    </div>
  );
}
