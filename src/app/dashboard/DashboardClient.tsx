"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { Pagination } from "@/components/ui/Pagination";
import { WeeksTable, type SortDir, type SortKey } from "@/components/timesheet/WeeksTable";
import { fetchWeeks, ApiError } from "@/lib/api/timesheets";
import type { WeekStatus, WeekSummary } from "@/types/timesheet";

type StatusFilter = "ALL" | WeekStatus;
type DateRangeFilter = "all" | "4" | "8" | "12";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export function DashboardClient() {
  const [weeks, setWeeks] = useState<WeekSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("weekNumber");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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

  const filteredSorted = useMemo(() => {
    if (!weeks) return [];

    let result = weeks;

    if (dateRangeFilter !== "all") {
      const n = Number(dateRangeFilter);
      const maxWeekNumber = Math.max(...weeks.map((w) => w.weekNumber));
      result = result.filter((w) => w.weekNumber > maxWeekNumber - n);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((w) => w.status === statusFilter);
    }

    const sorted = [...result].sort((a, b) => {
      const compareValue =
        sortKey === "weekNumber"
          ? a.weekNumber - b.weekNumber
          : sortKey === "date"
            ? a.weekStart.localeCompare(b.weekStart)
            : a.status.localeCompare(b.status);
      return sortDir === "asc" ? compareValue : -compareValue;
    });

    return sorted;
  }, [weeks, statusFilter, dateRangeFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredSorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function handleSortChange(key: SortKey) {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function updateFilter<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  if (error) {
    return <p className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</p>;
  }

  if (!weeks) {
    return <p className="text-sm text-gray-500">Loading timesheets…</p>;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <FilterSelect
          label="Date Range"
          value={dateRangeFilter}
          onChange={(e) =>
            updateFilter(setDateRangeFilter, e.target.value as DateRangeFilter)
          }
        >
          <option value="all">All time</option>
          <option value="4">Last 4 weeks</option>
          <option value="8">Last 8 weeks</option>
          <option value="12">Last 12 weeks</option>
        </FilterSelect>

        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={(e) => updateFilter(setStatusFilter, e.target.value as StatusFilter)}
        >
          <option value="ALL">All statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="INCOMPLETE">Incomplete</option>
          <option value="MISSING">Missing</option>
        </FilterSelect>
      </div>

      <WeeksTable
        weeks={pageItems}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={handleSortChange}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <FilterSelect
          label="Rows per page"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </FilterSelect>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
