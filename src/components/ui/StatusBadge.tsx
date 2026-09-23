import clsx from "clsx";
import type { WeekStatus, TimesheetStatus } from "@/types/timesheet";

const STYLES: Record<WeekStatus | TimesheetStatus, string> = {
  COMPLETED: "bg-green-50 text-green-700 ring-green-600/20",
  INCOMPLETE: "bg-amber-50 text-amber-700 ring-amber-600/20",
  MISSING: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

const LABELS: Record<WeekStatus | TimesheetStatus, string> = {
  COMPLETED: "Completed",
  INCOMPLETE: "Incomplete",
  MISSING: "Missing",
};

export function StatusBadge({ status }: { status: WeekStatus | TimesheetStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        STYLES[status]
      )}
    >
      {LABELS[status]}
    </span>
  );
}
