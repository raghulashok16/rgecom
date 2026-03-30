import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SlidingPagination({
  totalPages,
  currentPage,
  onPageChange,
  className,
  maxVisiblePages = 7,
}) {

  const generatePages = () => {
    if (totalPages <= maxVisiblePages)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = [];
    const first = 1;
    const last = totalPages;
    const sideCount = 1;
    const middleCount = maxVisiblePages - 2 * sideCount - 2;

    pages.push(first);

    let left = Math.max(currentPage - Math.floor(middleCount / 2), sideCount + 1);
    let right = Math.min(currentPage + Math.floor(middleCount / 2), totalPages - sideCount);

    if (left > sideCount + 1) pages.push(-1);
    else left = sideCount + 1;

    for (let i = left; i <= right; i++) pages.push(i);

    if (right < totalPages - sideCount) pages.push(-1);

    pages.push(last);

    return pages;
  };

  const pagesToShow = generatePages();

  return (
    <div className={cn("relative inline-flex items-center gap-2", className)}>
      {pagesToShow.map((pageNum, i) =>
        pageNum === -1 ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <Button
            key={pageNum}
            variant="ghost"
            onClick={() => onPageChange(pageNum)}
            className={cn(
              "relative w-9 h-9 p-0 text-sm rounded-full transition-all duration-200",
              pageNum === currentPage
                ? "bg-indigo-500 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {pageNum}
          </Button>
        )
      )}

    </div>
  );
}
