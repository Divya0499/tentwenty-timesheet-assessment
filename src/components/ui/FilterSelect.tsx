import { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface FilterSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

/** A native <select> styled as the pill-shaped filter dropdown in the design. */
export function FilterSelect({ label, children, ...rest }: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        className="appearance-none rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-8 text-sm text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}
