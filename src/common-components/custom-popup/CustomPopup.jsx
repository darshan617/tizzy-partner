import React, { useEffect, useState } from "react";
import styles from "@/common-components/custom-popup/CustomPopup.module.css";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

const CustomPopup = ({
  children,
  onClose,
  title = "Popup Title",
  description = "",
  primaryText = "Confirm",
  secondaryText = "Cancel",
  onPrimary,
  showFooter = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePrimary = () => {
    if (onPrimary) {
      onPrimary();
      return;
    }
    onClose?.();
  };

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <>
      <div className={styles.popupRoot} role="dialog" aria-modal="true">
        <button
          type="button"
          className={styles.overlay}
          onClick={onClose}
          aria-label="Close popup"
        />

        <div className={styles.popup}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close popup"
          >
            <IoClose size={20} />
          </button>

          {(description || children) && (
            <div className={styles.body}>
              {description && (
                <p className={styles.description}>{description}</p>
              )}
              {children}
            </div>
          )}

          {showFooter && (
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onClose}
              >
                {secondaryText}
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handlePrimary}
              >
                {primaryText}
              </button>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
};

export default CustomPopup;
