import clsx from "clsx";
import type { WeekStatus } from "@/types/timesheet";

const STYLES: Record<WeekStatus, string> = {
  COMPLETED: "bg-green-50 text-green-700 ring-green-600/20",
  INCOMPLETE: "bg-amber-50 text-amber-700 ring-amber-600/20",
  MISSING: "bg-rose-50 text-rose-600 ring-rose-500/20",
};

const LABELS: Record<WeekStatus, string> = {
  COMPLETED: "Completed",
  INCOMPLETE: "Incomplete",
  MISSING: "Missing",
};

export function StatusBadge({ status }: { status: WeekStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide ring-1 ring-inset",
        STYLES[status]
      )}
    >
      {LABELS[status]}
    </span>
  );
}
