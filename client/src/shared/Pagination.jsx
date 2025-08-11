import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const visiblePages = 5;

  const getPageNumbers = () => {
    const pages = [];
    const half = Math.floor(visiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + visiblePages - 1);

    if (end - start + 1 < visiblePages) {
      start = Math.max(1, end - visiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-between items-center mt-6 px-2 text-xs sm:text-sm text-primary">
      <div>
        Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </div>
      <div className="flex items-center space-x-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2.5 py-1 border border-primary rounded hover:bg-primary transition hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          &lt; Prev
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`px-2 py-1 border hover:bg-primary transition hover:text-white rounded ${
              page === currentPage
                ? "bg-primary transition text-white font-semibold"
                : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2 py-1 border border-primary rounded hover:bg-primary transition hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
