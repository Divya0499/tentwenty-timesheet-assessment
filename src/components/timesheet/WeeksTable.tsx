import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatWeekRange } from "@/lib/weeks";
import type { WeekSummary } from "@/types/timesheet";

export function WeeksTable({ weeks }: { weeks: WeekSummary[] }) {
  if (weeks.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        No timesheet weeks to show yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium text-gray-600">
              Week #
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-gray-600">
              Date
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-gray-600">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {weeks.map((week) => (
            <tr key={week.weekStart} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                Week {week.weekNumber}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {formatWeekRange(week.weekStart, week.weekEnd)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={week.status} />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/${week.weekStart}`}
                  className="font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
