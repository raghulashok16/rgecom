import SlidingPagination from '../../components/ui/sliding-pagination';

// page: 0-based index from parent
// SlidingPagination expects 1-based currentPage
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-100 shrink-0">
      <span className="text-xs text-gray-400">
        Page <span className="font-medium text-gray-600">{page + 1}</span> of <span className="font-medium text-gray-600">{totalPages}</span>
      </span>

      <SlidingPagination
        totalPages={totalPages}
        currentPage={page + 1}
        onPageChange={(p) => onPageChange(p - 1)}
        maxVisiblePages={9}
      />

      <span className="text-xs text-gray-400">
        <span className="font-medium text-gray-600">{totalPages}</span> pages total
      </span>
    </div>
  );
};

export default Pagination;
