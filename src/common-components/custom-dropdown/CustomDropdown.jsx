import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import styles from "@/common-components/custom-dropdown/CustomerDropdown.module.css";

const CustomDropdown = ({
  options,
  value,
  label,
  placeholder,
  isSearchable = true,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions =
    options?.filter((option) =>
      option?.label?.toLowerCase().includes(searchValue?.toLowerCase()),
    ) || options;

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
        >
          <span>{selectedOption ? selectedOption : placeholder}</span>
          <BiChevronDown
            style={{
              transform: isDropdownOpen ? "rotate(-180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          />
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
