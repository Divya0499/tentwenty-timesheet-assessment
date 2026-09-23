import type { ReactNode } from "react";
import clsx from "clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Numbered pagination with a sliding window + ellipses, like the design. */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);

  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      <PageButton
        variant="nav"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </PageButton>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-gray-400">
            &hellip;
          </span>
        ) : (
          <PageButton
            key={page}
            variant="number"
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PageButton>
        )
      )}

      <PageButton
        variant="nav"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </PageButton>
    </nav>
  );
}

function PageButton({
  children,
  variant,
  active,
  disabled,
  onClick,
}: {
  children: ReactNode;
  variant: "nav" | "number";
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "rounded-md px-2 py-1 text-sm",
        disabled && "cursor-not-allowed text-gray-300",
        !disabled && variant === "nav" && "text-gray-400 hover:text-gray-600",
        !disabled && variant === "number" && !active && "text-gray-700 hover:bg-gray-100",
        !disabled && variant === "number" && active && "font-semibold text-blue-600"
      )}
    >
      {children}
    </button>
  );
}

/** e.g. currentPage=5, totalPages=20 -> [1, "...", 4, 5, 6, "...", 20] */
function buildPageList(current: number, total: number): (number | "...")[] {
  const window = 1;
  const pages = new Set<number>([1, total]);
  for (let p = current - window; p <= current + window; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "...")[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push("...");
    result.push(page);
  });
  return result;
}
