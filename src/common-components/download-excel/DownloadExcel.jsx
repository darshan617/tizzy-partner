import { useEffect, useRef, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { MdOutlineFileDownload } from "react-icons/md";
import CustomPopup from "../custom-popup/CustomPopup";
import otpStyles from "@/components/auth/verify-otp/VerifyOtp.module.css";
import {
  useDownloadReportApiMutation,
  useGetDownloadReportApiMutation,
  useResendDownloadReportApiMutation,
  useVerifyDownloadReportApiMutation,
} from "@/redux/apis/downloadReportOtpApi";
import Cookies from "js-cookie";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const DownloadExcel = ({
  data = [],
  columns = [],
  fileName = "data",
  className = "",
  buttonText = "Download",
}) => {
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};
  const { showToast } = useToast();
  const [isDownloadPopupVisible, setIsDownloadPopupVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputsRef = useRef([]);
  const [sessionId, setSessionId] = useState("");
  const [isDownloadVisible, setIsDownloadVisible] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const [getDownloadReportOtpApi, { isLoading: isGettingOtp }] =
    useGetDownloadReportApiMutation();
  const [verifyDownloadReportOtpApi, { isLoading: isVerifyingOtp }] =
    useVerifyDownloadReportApiMutation();
  const [resendReportOtp, { isLoading: isResendingOtp }] =
    useResendDownloadReportApiMutation();

  const handleGetDownloadReportOtp = async () => {
    try {
      const res = await getDownloadReportOtpApi({
        body: {
          partner_id: userData?.id,
        },
      });
      if (res?.data?.success) {
        setIsDownloadPopupVisible(true);
        showToast(res?.data?.message, "success");
        setSessionId(res?.data?.session);
        setIsDownloadVisible(false);
        setResendCountdown(10);
      }
    } catch (error) {
      console.log(error, "error");
      showToast(error?.message, "error");
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const res = await verifyDownloadReportOtpApi({
        body: {
          partner_id: userData?.id,
          otp: [...otp].toString()?.split(",")?.join(""),
          session_id: sessionId,
        },
      });
      if (res?.data?.success) {
        setIsDownloadPopupVisible(true);
        setIsDownloadVisible(true);
        setOtp(["", "", "", "", "", ""]);
        showToast(res?.data?.message, "success");
      } else {
        showToast(res?.error?.data?.message, "error");
      }
    } catch (error) {
      console.log(error, "error");
      showToast(error?.message, "error");
    }
  };
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    setOtp((currentOtp) => {
      const nextOtp = [...currentOtp];
      nextOtp[index] = value;
      return nextOtp;
    });

    if (value && index < otpInputsRef.current.length - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedOtp = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const nextOtp = [...pastedOtp, "", "", "", "", "", ""].slice(0, 6);

    setOtp(nextOtp);
    otpInputsRef.current[Math.min(pastedOtp.length, 5)]?.focus();
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

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

  const handleResendOtp = async () => {
    try {
      const res = await resendReportOtp({
        body: {
          partner_id: userData?.id,
        },
      });
      if (res?.data?.success) {
        setOtp(["", "", "", "", "", ""]);
        setResendCountdown(10);
        showToast(res?.data?.message, "success");
      }
    } catch (error) {
      console.log(error, "error");
      showToast(error?.message, "error");
    }
  };

  useEffect(() => {
    if (isDownloadPopupVisible) {
      setTimeout(() => {
        otpInputsRef.current?.[0]?.focus();
      }, 100);
    }
  }, [isDownloadPopupVisible]);

  useEffect(() => {
    if (!isDownloadPopupVisible || isDownloadVisible || resendCountdown === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setResendCountdown((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isDownloadPopupVisible, isDownloadVisible, resendCountdown]);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={handleGetDownloadReportOtp}
      >
        <MdOutlineFileDownload />
        <p className="m-0 d-none d-sm-block">
          {isGettingOtp ? "Downloading..." : buttonText}
        </p>
      </button>

      {isDownloadPopupVisible &&
        (isDownloadVisible ? (
          <CustomPopup
            onClose={() => setIsDownloadPopupVisible(false)}
            title="Download File"
            description={`Your file is ready to download. Please click on below button to download.`}
            maxWidth="480px"
            bodyPadding="24px"
          >
            <div className={otpStyles.otpWrapper}>
              <button
                type="button"
                className={otpStyles.confirmBtn}
                onClick={downloadExcel}
              >
                Download List
              </button>
            </div>
          </CustomPopup>
        ) : (
          <CustomPopup
            onClose={() => setIsDownloadPopupVisible(false)}
            title="OTP Verification"
            description={`Enter the 6-digit verification code sent on your ${userData?.email}  to continue.`}
            maxWidth="480px"
            bodyPadding="24px"
          >
            <div className={otpStyles.otpWrapper}>
              <p className={otpStyles.label}>
                Verification code <span>*</span>
              </p>
              <div className={otpStyles.otpContainer} onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpInputsRef.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    aria-label={`OTP digit ${index + 1}`}
                    className={otpStyles.otpInput}
                    value={digit}
                    onChange={(event) =>
                      handleOtpChange(event.target.value, index)
                    }
                    onKeyDown={(event) => handleOtpKeyDown(event, index)}
                  />
                ))}
              </div>
              <p className={otpStyles.resend}>
                Didn’t receive a code?{" "}
                <button
                  type="button"
                  className={otpStyles.resendBtn}
                  onClick={handleResendOtp}
                  disabled={resendCountdown > 0 || isResendingOtp}
                >
                  {isResendingOtp
                    ? "Resending..."
                    : resendCountdown > 0
                      ? `Resend in 00:${String(resendCountdown).padStart(2, "0")}`
                      : "Resend OTP"}
                </button>
              </p>
              <div>
                <button
                  type="button"
                  className={otpStyles.confirmBtn}
                  disabled={otp.some((digit) => !digit)}
                  onClick={() => handleVerifyOtp()}
                >
                  Verify OTP
                </button>
              </div>
            </div>
          </CustomPopup>
        ))}
    </>
  );
};

export default DownloadExcel;
