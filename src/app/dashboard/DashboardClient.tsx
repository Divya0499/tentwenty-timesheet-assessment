"use client";

import { useEffect, useState } from "react";
import { WeeksTable } from "@/components/timesheet/WeeksTable";
import { fetchWeeks, ApiError } from "@/lib/api/timesheets";
import type { WeekSummary } from "@/types/timesheet";

export function DashboardClient() {
  const [weeks, setWeeks] = useState<WeekSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchWeeks()
      .then((data) => {
        if (!cancelled) setWeeks(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load timesheets.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</p>;
  }

  if (!weeks) {
    return <p className="text-sm text-gray-500">Loading timesheets…</p>;
  }

  return <WeeksTable weeks={weeks} />;
}
