function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-sm ${
            currentPage === i
              ? 'text-black dark:text-white font-medium bg-gray-50 dark:bg-gray-800'
              : 'text-gray-500 hover:text-black dark:hover:text-white'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1E1E1E]">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Mostrando{' '}
        <span className="font-medium text-black dark:text-white">{startItem}</span> a{' '}
        <span className="font-medium text-black dark:text-white">{endItem}</span> de{' '}
        <span className="font-medium text-black dark:text-white">{totalItems}</span>{' '}
        resultados
      </span>
      <div className="flex gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-sm text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        {renderPageNumbers()}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-sm text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

export default Pagination;
