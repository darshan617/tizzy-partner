import React, { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import styles from "@/common-components/custom-dropdown/CustomerDropdown.module.css";
import { IoClose } from "react-icons/io5";

const toDisplayValue = (value) => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "label" in value) {
    return String(value.label ?? "");
  }
  return "";
};

const CustomDropdown = ({
  options,
  value,
  label,
  placeholder,
  isSearchable = true,
  onChange,
  customHeight = "auto",
}) => {
  const [selectedOption, setSelectedOption] = useState(() =>
    toDisplayValue(value),
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSelectedOption(toDisplayValue(value));
  }, [value]);

  const filteredOptions =
    options?.filter((option) =>
      option?.label?.toLowerCase().includes(searchValue?.toLowerCase()),
    ) || options;

  const hasSelection = Boolean(selectedOption?.trim?.());

  return (
    <div>
      {label && (
        <>
          <label className={styles.label}>{label}</label>
          <span className={styles.required}>*</span>
        </>
      )}
      <div className={styles.dropdownContainer}>
        <div
          className={styles.dropdownToggle}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{ height: customHeight || "auto" }}
        >
          <span className={!hasSelection ? styles.placeholderText : undefined}>
            {hasSelection ? selectedOption : placeholder}
          </span>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {value && selectedOption && (
              // <button
              //   type="button"
              //   className=""
              //   onClick={() => setSelectedOption("")}
              // >
              //   <IoClose size={16} />
              // </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  setSelectedOption("");
                  onChange?.({
                    label: "",
                    value: "",
                  });
                }}
                className={styles.deselectButton}
              >
                <IoClose size={12} />
              </button>
            )}
            <BiChevronDown
              style={{
                transform: isDropdownOpen ? "rotate(-180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </div>
        </div>

        {isDropdownOpen && (
          <div className={styles.dropdownOptions}>
            {isSearchable && (
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search"
                  className={styles.searchInput}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            )}
            {filteredOptions?.length > 0 ? (
              filteredOptions?.map((option, idx) => (
                <div
                  className={styles.dropdownOptionItem}
                  key={option?.value}
                  onClick={() => {
                    setSelectedOption(option?.label);
                    onChange?.(option);
                    setIsDropdownOpen(false);
                  }}
                  // style={{
                  //   backgroundColor:
                  //     idx === option?.idx ? "#f0f0f0" : "transparent",
                  // }}
                >
                  {option?.label}
                </div>
              ))
            ) : (
              <div className={styles.dropdownOptionItem}>No Company Found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
