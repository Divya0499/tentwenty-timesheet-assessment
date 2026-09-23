"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";

interface FilterDropdownProps<T extends string> {
  /** Static label shown on the button at all times, e.g. "Date Range". */
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Highlights the whole button when a non-default filter is applied. */
  isActive?: boolean;
}

/**
 * A filter button that keeps its label fixed (like the design) instead of
 * showing the selected value — a plain <select> can't do that, since it
 * always displays the chosen option. The current choice is still visible
 * as a checkmark inside the open menu.
 */
export function FilterDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
  isActive,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          "flex items-center gap-2 rounded-md border py-1.5 pl-3 pr-2.5 text-sm",
          isActive
            ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        )}
      >
        {label}
        <ChevronDown size={14} className={isActive ? "text-blue-400" : "text-gray-400"} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 z-10 mt-1 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={clsx(
                "flex w-full items-center justify-between px-3 py-1.5 text-left text-sm hover:bg-gray-50",
                option.value === value ? "text-blue-600" : "text-gray-700"
              )}
            >
              {option.label}
              {option.value === value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
