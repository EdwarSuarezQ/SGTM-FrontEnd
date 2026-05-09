import React from "react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
}) => {
  if (totalItems === 0) {
    return null;
  }
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 0) pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    onItemsPerPageChange(newLimit);
  };

  return (
    <div className="border-t border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      {}
      <div className="flex items-center gap-2">
        <label className="text-gray-700 text-sm">Mostrando:</label>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="px-2 py-1 bg-white text-gray-700 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-gray-700 text-sm">registros por página</span>
      </div>

      {}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1">
          {}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
            title="Primera página"
          >
            «
          </button>
          
          {}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
            title="Página anterior"
          >
            ‹
          </button>

          {}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md border transition-colors text-sm font-medium ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          {}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
            title="Página siguiente"
          >
            ›
          </button>

          {}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
            title="Última página"
          >
            »
          </button>
        </div>
      )}

      {}
      <div className="text-gray-700 text-sm text-center md:text-right">
        Mostrando <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> de <span className="font-medium">{totalItems}</span> registros
      </div>
    </div>
  );
};

export default Pagination;
