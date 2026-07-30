import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { MdOutlineFileDownload } from "react-icons/md";

const DownloadExcel = ({
  data = [],
  columns = [],
  fileName = "data",
  className = "",
  buttonText = "Download",
}) => {
  const downloadExcel = async () => {
    if (!data.length) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Header Row
    const headerRow = worksheet.addRow(columns.map((col) => col.label));

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
        size: 12,
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0355ac" },
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Data Rows
    data.forEach((item) => {
      worksheet.addRow(
        columns.map((col) =>
          col.getValue ? col.getValue(item) : (item[col.key] ?? ""),
        ),
      );
    });

    // Style Data Cells
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      row.eachCell((cell) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: "left",
          wrapText: true,
        };

        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Auto Width
    worksheet.columns.forEach((column) => {
      let maxLength = 15;

      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 10;
        if (length > maxLength) maxLength = length;
      });

      column.width = maxLength + 5;
    });

    // Freeze Header
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // Generate File
    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${fileName}.xlsx`,
    );
  };

  return (
    <button type="button" className={className} onClick={downloadExcel}>
      <MdOutlineFileDownload />
      {buttonText}
    </button>
  );
};

export default DownloadExcel;
