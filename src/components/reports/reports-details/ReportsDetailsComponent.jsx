import { useReportDetailsMutation } from "@/redux/apis/reportsApi";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import styles from "./ReportsDetailsComponent.module.css";
import { FiChevronDown } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";
import SalesChart from "@/components/sales-chart/SalesChart";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import CustomDropdown from "@/common-components/custom-dropdown/CustomDropdown";

const AVAILABLE_YEARS = [2026, 2025, 2024, 2023];

const slugify = (value) =>
  String(value || "report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Helvetica can't render ₹ and similar glyphs — normalize for PDF text */
const toPdfText = (value) =>
  String(value ?? "-")
    .replace(/₹/g, "Rs.")
    .replace(/[^\x20-\x7E]/g, (char) => {
      if (char === "—") return "-";
      return "";
    });

const getChartImageUri = async (chartRef) => {
  const chart = chartRef?.current;
  if (!chart || typeof chart.dataURI !== "function") return null;

  const result = await chart.dataURI({ scale: 2 });
  return result?.imgURI || null;
};

const ReportsDetailsComponent = () => {
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : null;
  const [reportDetails, { isLoading }] = useReportDetailsMutation();
  const router = useRouter();
  const [year, setYear] = useState(AVAILABLE_YEARS[0]);
  const [reportData, setReportData] = useState(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef(null);
  const downloadMenuRef = useRef(null);

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });
  const today = new Date().toISOString().split("T")[0];
  const [filterActiveTab, setFilterActiveTab] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const getReportDetails = async () => {
    try {
      const response = await reportDetails({
        body: {
          slug: router?.query?.slug,
          partner_id: userData?.id,
          fromDate: dateRange.fromDate || null,
          toDate: dateRange.toDate || null,
          provider_id: selectedProvider || null,
        },
      });

      if (response?.data?.status) {
        setReportData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const graph = reportData?.graph;
  const table = reportData?.table;
  const columns = table?.columns || [];
  const rows = table?.rows || [];
  const reportTitle =
    reportData?.title || router.query.slug?.replace(/-/g, " ").toUpperCase();
  const fileBaseName = `${slugify(reportTitle)}-${year}`;

  useEffect(() => {
    if (router?.isReady && router.query.slug) {
      getReportDetails();
    }
  }, [router?.isReady, router.query.slug]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target)
      ) {
        setIsDownloadOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.mergeCells(1, 1, 1, Math.max(columns.length + 1, 2));
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = `${reportTitle} (${year})`;
    titleCell.font = { bold: true, size: 14, color: { argb: "FF1B2430" } };

    if (reportData?.description) {
      worksheet.mergeCells(2, 1, 2, Math.max(columns.length + 1, 2));
      worksheet.getCell(2, 1).value = reportData.description;
      worksheet.getCell(2, 1).font = { size: 10, color: { argb: "FF8B93A1" } };
    }

    worksheet.addRow([]);

    if (columns.length > 0 && rows.length > 0) {
      const headerRow = worksheet.addRow(["", ...columns]);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "0355AC" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });

      rows.forEach((row) => {
        const dataRow = worksheet.addRow([
          row?.label || row?.key || "",
          ...(row?.values || []).map((value) => value ?? "-"),
        ]);

        dataRow.eachCell((cell, colNumber) => {
          cell.alignment = {
            vertical: "middle",
            horizontal: colNumber === 1 ? "left" : "center",
          };
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      worksheet.columns.forEach((column) => {
        let maxLength = 12;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const length = cell.value ? String(cell.value).length : 10;
          if (length > maxLength) maxLength = length;
        });
        column.width = Math.min(maxLength + 4, 28);
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${fileBaseName}.xlsx`,
    );
  };

  const downloadPdf = async () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 12;
    let y = margin;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(27, 36, 48);
    pdf.text(toPdfText(`${reportTitle} (${year})`), margin, y);
    y += 8;

    if (reportData?.description) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(139, 147, 161);
      const descLines = pdf.splitTextToSize(
        toPdfText(reportData.description),
        pageWidth - margin * 2,
      );
      pdf.text(descLines, margin, y);
      y += descLines.length * 5 + 4;
    }

    const imgURI = await getChartImageUri(chartRef);
    if (imgURI) {
      const chartWidth = pageWidth - margin * 2;
      const chartHeight = 90;
      pdf.addImage(imgURI, "PNG", margin, y, chartWidth, chartHeight);
      y += chartHeight + 8;
    }

    if (columns.length > 0 && rows.length > 0) {
      const pageHeight = pdf.internal.pageSize.getHeight();
      const usableWidth = pageWidth - margin * 2;
      const labelColWidth = 28;
      const minDataColWidth = 14;
      // Fit as many date columns as possible per chunk, keep Metric label repeated
      const colsPerChunk = Math.max(
        1,
        Math.floor((usableWidth - labelColWidth) / minDataColWidth),
      );

      const tableOptions = {
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 7,
          cellPadding: 1.5,
          overflow: "ellipsize",
          valign: "middle",
          halign: "center",
          textColor: [27, 36, 48],
          lineColor: [238, 241, 244],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: [3, 85, 172],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [250, 251, 252],
        },
        columnStyles: {
          0: { halign: "left", fontStyle: "bold", cellWidth: labelColWidth },
        },
        margin: { left: margin, right: margin, bottom: margin },
        pageBreak: "avoid",
      };

      // Estimated height of one chunk (header + rows) to decide page breaks
      const chunkHeight = 8 + rows.length * 7 + 6;

      for (let start = 0; start < columns.length; start += colsPerChunk) {
        const chunkColumns = columns.slice(start, start + colsPerChunk);
        const head = [
          ["Metric", ...chunkColumns.map((column) => toPdfText(column))],
        ];
        const body = rows.map((row) => [
          toPdfText(row?.label || row?.key || ""),
          ...(row?.values || [])
            .slice(start, start + colsPerChunk)
            .map((value) => toPdfText(value)),
        ]);

        // Stack next chunk under the previous one when space remains
        if (y + chunkHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }

        autoTable(pdf, {
          ...tableOptions,
          startY: y,
          head,
          body,
        });

        y = (pdf.lastAutoTable?.finalY || y) + 6;
      }
    }

    pdf.save(`${fileBaseName}.pdf`);
  };

  const handleDownload = async (format) => {
    if (!reportData || isExporting) return;

    setIsExporting(true);
    setIsDownloadOpen(false);

    try {
      if (format === "excel") {
        await downloadExcel();
      } else {
        await downloadPdf();
      }
    } catch (error) {
      console.error("Failed to download report:", error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (router?.query?.slug) {
      getReportDetails();
    }
  }, [selectedProvider]);

  return (
    <>
      <div className={styles.pageWrap}>
        <nav className={styles.breadcrumb}>
          Dashboard / Reports / General Reports /
        </nav>
        <h1 className={styles.pageTitle}>{reportTitle}</h1>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            {/* <div className={styles.yearSelectWrap}>
              <select
                className={styles.yearSelect}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {AVAILABLE_YEARS.map((y) => (
                  <option key={y} value={y}>
                    YEAR {y}
                  </option>
                ))}
              </select>
              <FiChevronDown className={styles.yearSelectIcon} />
            </div> */}
            <div className="d-flex  gap-2 flex-column">
              <div className={styles.dateGroup}>
                <label className={styles.dateLabel}>
                  From Date
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={dateRange.fromDate}
                    max={today}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, fromDate: e.target.value })
                    }
                  />
                </label>
                <label className={styles.dateLabel}>
                  To Date
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={dateRange.toDate}
                    max={today}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, toDate: e.target.value })
                    }
                  />
                </label>
                <div className={styles.filterGroup}>
                  <CustomDropdown
                    placeholder="Select Provider"
                    isSearchable={false}
                    value={filterActiveTab}
                    options={[
                      {
                        label: "Google Workspace",
                        value: "google_workspace",
                        idx: 3,
                      },
                      {
                        label: "Microsoft 365",
                        value: "microsoft_365",
                        idx: 2,
                      },
                      {
                        label: "Tizzy",
                        value: "tizzy",
                        idx: 1,
                      },
                    ]}
                    onChange={(selectedOption) => {
                      setFilterActiveTab(selectedOption?.label || null);
                      setSelectedProvider(selectedOption?.idx || null);
                    }}
                    customWidth={"182px"}
                  />

                  <button
                    className={styles.btnApply}
                    onClick={getReportDetails}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* <div className={styles.filterYear}>
                            {summaryTabs?.map((tab) => (
                              <button
                                key={tab}
                                className={`${styles.btnFilterYear} ${summaryActiveTab === tab ? styles.active : ""}`}
                                onClick={() => setSummaryActiveTab(tab)}
                              >
                                {tab}
                              </button>
                            ))}
                          </div> */}
            </div>

            <div className={styles.downloadWrap} ref={downloadMenuRef}>
              <button
                type="button"
                className={styles.downloadBtn}
                onClick={() => setIsDownloadOpen((prev) => !prev)}
                disabled={!reportData || isLoading || isExporting}
              >
                <MdOutlineFileDownload size={16} />
                {isExporting ? "Downloading..." : "Download Report"}
                <FiChevronDown size={14} />
              </button>

              {isDownloadOpen && (
                <div className={styles.downloadMenu}>
                  <button
                    type="button"
                    className={styles.downloadOption}
                    onClick={() => handleDownload("pdf")}
                  >
                    <IoDocumentTextOutline size={16} />
                    Download PDF
                  </button>
                  <button
                    type="button"
                    className={styles.downloadOption}
                    onClick={() => handleDownload("excel")}
                  >
                    <RiFileExcel2Line size={16} />
                    Download Excel
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className={styles.cardSubtitle}>
            {reportData?.description ||
              "This report shows a monthly activity summary for a given year."}
          </p>

          <hr className={styles.divider} />

          <div className={styles.chartWrap}>
            {isLoading ? (
              <p className={styles.cardSubtitle}>Loading chart...</p>
            ) : (
              <SalesChart data={graph} height={320} chartRef={chartRef} />
            )}
          </div>

          {columns.length > 0 && rows.length > 0 && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.rowLabelHead} />
                    {columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows?.map((row, idx) => (
                    <tr
                      key={row?.key || row?.label || idx}
                      className={idx % 2 === 0 ? styles.rowShaded : ""}
                    >
                      <td className={styles.rowLabel}>
                        {row?.label || row?.key || "—"}
                      </td>
                      {(row?.values || []).map((value, colIdx) => (
                        <td key={`${row?.key}-${colIdx}`}>{value ?? "-"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportsDetailsComponent;
