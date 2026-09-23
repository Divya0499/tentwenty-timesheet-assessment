import clsx from "clsx";
import { TARGET_HOURS_PER_WEEK } from "@/lib/weeks";

export function WeekProgress({ totalHours }: { totalHours: number }) {
  const percent = Math.round((totalHours / TARGET_HOURS_PER_WEEK) * 100);
  const barWidth = Math.min(percent, 100);

  return (
    <div className="w-40 shrink-0 text-right">
      <p className="text-sm font-medium text-gray-900">
        {totalHours}/{TARGET_HOURS_PER_WEEK} hrs
        <span className="ml-1.5 text-xs font-normal text-gray-400">{percent}%</span>
      </p>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={clsx(
            "h-full rounded-full transition-all",
            percent >= 100 ? "bg-green-500" : "bg-orange-500"
          )}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}
