"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { inputClasses } from "@/components/ui/FormField";

export interface DateRange {
  from: string; // ISO date, "" = no lower bound
  to: string; // ISO date, "" = no upper bound
}

interface DateRangeDropdownProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

const EMPTY: DateRange = { from: "", to: "" };

/**
 * "Date Range" filter button — label stays fixed (matches the design),
 * opens a small panel to pick an actual From/To date instead of fixed
 * presets like "last 4 weeks".
 */
export function DateRangeDropdown({ value, onChange }: DateRangeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(value);
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

  const isActive = Boolean(value.from || value.to);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setDraft(value); // reset the draft to the applied value each time it opens
          setOpen((o) => !o);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-2.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        Date Range
        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {open && (
        // Fixed at 22rem the panel ran off the right edge of narrow
        // screens (it's anchored to a button that isn't flush against the
        // viewport edge). w-72 on mobile is narrow enough to always fit;
        // sm:w-[22rem] gives it more room once there's space to spare.
        // Stacking From/To vertically on mobile avoids squeezing two
        // native date inputs (with their calendar icons) into a tight row.
        <div className="absolute left-0 z-10 mt-1 w-72 rounded-md border border-gray-200 bg-white p-4 shadow-lg sm:w-[22rem]">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="min-w-0 flex-1 text-xs font-medium text-gray-500">
              From
              <input
                type="date"
                value={draft.from}
                max={draft.to || undefined}
                onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
                className={`${inputClasses} mt-1 px-2`}
              />
            </label>
            <label className="min-w-0 flex-1 text-xs font-medium text-gray-500">
              To
              <input
                type="date"
                value={draft.to}
                min={draft.from || undefined}
                onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
                className={`${inputClasses} mt-1 px-2`}
              />
            </label>
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDraft(EMPTY);
                onChange(EMPTY);
                setOpen(false);
              }}
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
