"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { DateRangeDropdown, type DateRange } from "@/components/ui/DateRangeDropdown";
import { Pagination } from "@/components/ui/Pagination";
import { WeeksTable, type SortDir, type SortKey } from "@/components/timesheet/WeeksTable";
import { fetchWeeks, ApiError } from "@/lib/api/timesheets";
import type { WeekStatus, WeekSummary } from "@/types/timesheet";

type StatusFilter = "ALL" | WeekStatus;

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export function DashboardClient() {
  const [weeks, setWeeks] = useState<WeekSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
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

    // A week matches if it overlaps the selected [from, to] range at all,
    // not just if it falls entirely inside it.
    if (dateRange.from) {
      result = result.filter((w) => w.weekEnd >= dateRange.from);
    }
    if (dateRange.to) {
      result = result.filter((w) => w.weekStart <= dateRange.to);
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
  }, [weeks, statusFilter, dateRange, sortKey, sortDir]);

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
        <DateRangeDropdown
          value={dateRange}
          onChange={(range) => updateFilter(setDateRange, range)}
        />

        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={(v) => updateFilter(setStatusFilter, v)}
          options={[
            { value: "ALL", label: "All statuses" },
            { value: "COMPLETED", label: "Completed" },
            { value: "INCOMPLETE", label: "Incomplete" },
            { value: "MISSING", label: "Missing" },
          ]}
        />
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
