import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatWeekRange } from "@/lib/weeks";
import type { WeekStatus, WeekSummary } from "@/types/timesheet";

export type SortKey = "weekNumber" | "date" | "status";
export type SortDir = "asc" | "desc";

interface WeeksTableProps {
  weeks: WeekSummary[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSortChange: (key: SortKey) => void;
}

/** Action link label matches the week's status, per the design. */
const ACTION_LABEL: Record<WeekStatus, string> = {
  COMPLETED: "View",
  INCOMPLETE: "Update",
  MISSING: "Create",
};

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "weekNumber", label: "Week #" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

export function WeeksTable({ weeks, sortKey, sortDir, onSortChange }: WeeksTableProps) {
  if (weeks.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        No weeks match the selected filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column.key} scope="col" className="px-4 py-3 font-medium text-gray-500">
                <button
                  type="button"
                  onClick={() => onSortChange(column.key)}
                  className="flex items-center gap-1 uppercase tracking-wide hover:text-gray-700"
                >
                  {column.label}
                  {sortKey === column.key &&
                    (sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </button>
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-right font-medium uppercase tracking-wide text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {weeks.map((week) => (
            <tr key={week.weekStart} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{week.weekNumber}</td>
              <td className="px-4 py-3 text-gray-600">
                {formatWeekRange(week.weekStart, week.weekEnd)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={week.status} />
              </td>
              <td className={clsx("px-4 py-3 text-right")}>
                <Link
                  href={`/dashboard/${week.weekStart}`}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  {ACTION_LABEL[week.status]}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
