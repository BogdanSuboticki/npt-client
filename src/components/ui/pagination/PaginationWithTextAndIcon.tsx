interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationWithTextAndIcon({ currentPage, totalPages, onPageChange }: PaginationProps) {
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
    const maxVisiblePages = 7; // Maximum number of visible page numbers
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      const rightOffset = maxVisiblePages - leftOffset - 1;

      if (currentPage <= leftOffset) {
        endPage = maxVisiblePages;
      } else if (currentPage > totalPages - rightOffset) {
        startPage = totalPages - maxVisiblePages + 1;
      } else {
        startPage = currentPage - leftOffset;
        endPage = currentPage + rightOffset;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i === startPage && startPage > 1) {
        pages.push(
          <li key="1">
            <button
              onClick={() => onPageChange(1)}
              className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 rounded-lg hover:bg-brand-500 hover:text-white dark:text-gray-400 dark:hover:text-white"
            >
              1
            </button>
          </li>
        );
        if (startPage > 2) {
          pages.push(
            <li key="ellipsis1">
              <span className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 dark:text-gray-400">
                ...
              </span>
            </li>
          );
        }
      }

      pages.push(
        <li key={i}>
          <button
            onClick={() => onPageChange(i)}
            className={`flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg ${
              currentPage === i
                ? "bg-brand-500 text-white"
                : "text-gray-700 hover:bg-brand-500 hover:text-white dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            {i}
          </button>
        </li>
      );

      if (i === endPage && endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <li key="ellipsis2">
              <span className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 dark:text-gray-400">
                ...
              </span>
            </li>
          );
        }
        pages.push(
          <li key={totalPages}>
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 rounded-lg hover:bg-brand-500 hover:text-white dark:text-gray-400 dark:hover:text-white"
            >
              {totalPages}
            </button>
          </li>
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between gap-8 px-6 py-4 sm:justify-normal">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 rounded-lg border border-gray-300 px-2 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-brand-500 hover:text-white dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:px-3.5 sm:py-2.5 ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-white dark:bg-[#101828]' : 'bg-[#F9FAFB] dark:bg-[#101828]'
        }`}
      >
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z"
            fill=""
          />
        </svg>

        <span className="hidden sm:inline"> Prethodno </span>
      </button>

      <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 sm:hidden">
        Page {currentPage} of {totalPages}
      </span>

      <ul className="hidden items-center gap-0.5 sm:flex">
        {renderPageNumbers()}
      </ul>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 rounded-lg border border-gray-300 px-2 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-brand-500 hover:text-white dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:px-3.5 sm:py-2.5 ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-white dark:bg-[#101828]' : 'bg-[#F9FAFB] dark:bg-[#101828]'
        }`}
      >
        <span className="hidden sm:inline"> Sledeće </span>

        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z"
            fill=""
          />
        </svg>
      </button>
    </div>
  );
}
