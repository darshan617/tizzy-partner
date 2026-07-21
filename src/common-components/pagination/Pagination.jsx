import React from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import styles from "@/common-components/pagination/Pagination.module.css";
const Pagination = ({ setCurrentPage, currentPage, data, itemPerPage }) => {
  const pageNumberCount = Math.ceil(data?.length / itemPerPage);
  const pageNumbersArray = Array.from(
    { length: pageNumberCount },
    (_, i) => i + 1,
  );

  return (
    <div className={styles.paginationContainer}>
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        style={{
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
        className={styles.paginationBtn}
      >
        <BiChevronLeft size={22} />
      </button>
      {pageNumbersArray?.map((page, idx) => {
        return (
          <>
            <button
              onClick={() => setCurrentPage(page)}
              style={{
                fontWeight: currentPage === page ? "bold" : "normal",
                backgroundColor:
                  currentPage === page ? "var(--primaryColor)" : "#fff",
                color: currentPage === page ? "white" : "black",
              }}
              className={styles.paginationBtn}
            >
              {page}
            </button>
          </>
        );
      })}
      <button
        disabled={currentPage === pageNumbersArray?.length}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        style={{
          cursor:
            currentPage === pageNumbersArray?.length
              ? "not-allowed"
              : "pointer",
        }}
        className={styles.paginationBtn}
      >
        <BiChevronRight size={22} />
      </button>
    </div>
  );
};

export default Pagination;
