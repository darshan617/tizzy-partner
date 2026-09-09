import React from "react";
import styles from "./Pagination.module.css";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const PaginationNew = ({
  pageNumbersArray,
  setCurrentPage,
  currentPage,
  itemPerPage,
}) => {
  return (
    <div>
      {pageNumbersArray?.length > 0 && (
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            <BiChevronLeft size={16} />
          </button>
          {pageNumbersArray?.map((page) => (
            <button
              className={styles.paginationButton}
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                backgroundColor:
                  currentPage === page ? "var(--primaryColor)" : "",
                color:
                  currentPage === page
                    ? "var(--whiteColor)"
                    : "var(--darkColor)",
              }}
            >
              {page}
            </button>
          ))}
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === pageNumbersArray?.length}
          >
            <BiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginationNew;
