"use client";

import { useEffect, useMemo, useState } from "react";
import { DaySection } from "@/components/timesheet/DaySection";
import { WeekProgress } from "@/components/timesheet/WeekProgress";
import { TimesheetModal } from "@/components/timesheet/TimesheetModal";
import { formatWeekRange, getWorkdays, toIsoDate } from "@/lib/weeks";
import {
  ApiError,
  createTimesheetEntry,
  deleteTimesheetEntry,
  fetchWeekEntries,
  updateTimesheetEntry,
} from "@/lib/api/timesheets";
import type { TimesheetEntry, TimesheetInput } from "@/types/timesheet";

interface WeekDetailClientProps {
  weekStart: string;
  weekEnd: string;
}

export function WeekDetailClient({ weekStart, weekEnd }: WeekDetailClientProps) {
  const [entries, setEntries] = useState<TimesheetEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  const [activeDate, setActiveDate] = useState(weekStart);

  function loadEntries() {
    fetchWeekEntries(weekStart)
      .then((data) => setEntries(data.entries))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Failed to load entries.");
      });
  }

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  const workdays = useMemo(() => getWorkdays(new Date(weekStart)).map(toIsoDate), [weekStart]);

  const entriesByDay = useMemo(() => {
    const map = new Map<string, TimesheetEntry[]>();
    for (const day of workdays) map.set(day, []);
    for (const entry of entries ?? []) {
      if (!map.has(entry.date)) map.set(entry.date, []);
      map.get(entry.date)!.push(entry);
    }
    return map;
  }, [entries, workdays]);

  const totalHours = (entries ?? []).reduce((sum, e) => sum + e.hours, 0);
  const loggedWorkdays = workdays.filter((day) => (entriesByDay.get(day) ?? []).length > 0).length;

  function openAddModal(date: string) {
    setEditingEntry(null);
    setActiveDate(date);
    setIsModalOpen(true);
  }

  function openEditModal(entry: TimesheetEntry) {
    setEditingEntry(entry);
    setActiveDate(entry.date);
    setIsModalOpen(true);
  }

  async function handleSubmit(values: TimesheetInput) {
    if (editingEntry) {
      await updateTimesheetEntry(weekStart, editingEntry.id, values);
    } else {
      await createTimesheetEntry(weekStart, values);
    }
    setIsModalOpen(false);
    loadEntries();
  }

  async function handleDelete(entry: TimesheetEntry) {
    const confirmed = window.confirm(
      `Delete "${entry.description}"? This can't be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteTimesheetEntry(weekStart, entry.id);
      loadEntries();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete entry.");
    }
  }

  if (error) {
    return <p className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</p>;
  }

  return (
    <div>
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-start justify-between gap-4 px-4 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              This week&apos;s timesheet
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {formatWeekRange(weekStart, weekEnd)}
            </p>
            {entries && (
              <p className="mt-1 text-xs text-gray-400">
                {loggedWorkdays >= workdays.length
                  ? "All 5 weekdays logged — this week is marked Completed."
                  : `${loggedWorkdays} of ${workdays.length} weekdays logged. Log all 5 (Mon–Fri) to mark this week Completed.`}
              </p>
            )}
          </div>
          <WeekProgress totalHours={totalHours} />
        </div>

        {!entries ? (
          <p className="px-4 pb-6 text-sm text-gray-500">Loading entries…</p>
        ) : (
          workdays.map((day) => (
            <DaySection
              key={day}
              date={day}
              entries={entriesByDay.get(day) ?? []}
              onAdd={openAddModal}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <TimesheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        defaultDate={activeDate}
        entry={editingEntry}
      />
    </div>
  );
}
