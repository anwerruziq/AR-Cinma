import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { useApp } from '../../context/AppContext';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const { language } = useApp();
    const maxVisiblePages = 5;

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={`flex items-center justify-center gap-2 mt-8 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${currentPage === 1
                    ? 'bg-dark-200 text-gray-600 cursor-not-allowed'
                    : 'bg-dark-200 text-white hover:bg-accent-cyan hover:text-white shadow-[0_0_15px_rgba(255,75,31,0.2)] hover:shadow-[0_0_20px_rgba(255,75,31,0.4)]'
                    }`}
            >
                <BiChevronLeft size={20} />
            </button>

            {/* First Page */}
            {pageNumbers[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="w-10 h-10 rounded-lg bg-dark-200 text-white hover:bg-accent-cyan hover:text-white transition-all duration-300"
                    >
                        1
                    </button>
                    {pageNumbers[0] > 2 && (
                        <span className="text-gray-500">...</span>
                    )}
                </>
            )}

            {/* Page Numbers */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${currentPage === page
                        ? 'bg-accent-cyan text-white shadow-[0_0_15px_rgba(255,75,31,0.3)] shadow-accent-orange/20'
                        : 'bg-dark-200 text-white hover:bg-dark-100'
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Last Page */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                        <span className="text-gray-500">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="w-10 h-10 rounded-lg bg-dark-200 text-white hover:bg-accent-red transition-all duration-300"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${currentPage === totalPages
                    ? 'bg-dark-200 text-gray-600 cursor-not-allowed'
                    : 'bg-dark-200 text-white hover:bg-accent-cyan hover:text-white shadow-lg shadow-accent-cyan/10'
                    }`}
            >
                <BiChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;
