import { MdOutlineFileDownload } from "react-icons/md";

const DownloadExcel = ({
  data = [],
  columns = [],
  fileName = "data",
  className = "",
  buttonText = "Download",
}) => {
  const downloadExcel = () => {
    if (!data || data.length === 0) return;

    const headers = columns.map((col) => col.label);

    const rows = data.map((item) =>
      columns.map((col) => {
        const value = col.getValue ? col.getValue(item) : item[col.key];

        return value ?? "";
      }),
    );

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.csv`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" className={className} onClick={downloadExcel}>
      <MdOutlineFileDownload />
      {buttonText}
    </button>
  );
};

export default DownloadExcel;
