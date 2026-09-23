"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EntriesTable } from "@/components/timesheet/EntriesTable";
import { TimesheetModal } from "@/components/timesheet/TimesheetModal";
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

  function openAddModal() {
    setEditingEntry(null);
    setIsModalOpen(true);
  }

  function openEditModal(entry: TimesheetEntry) {
    setEditingEntry(entry);
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
    const confirmed = window.confirm(`Delete "${entry.task}"? This can't be undone.`);
    if (!confirmed) return;

    try {
      await deleteTimesheetEntry(weekStart, entry.id);
      loadEntries();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete entry.");
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openAddModal}>
          <Plus size={16} />
          Add Entry
        </Button>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}

      {!entries ? (
        <p className="text-sm text-gray-500">Loading entries…</p>
      ) : (
        <EntriesTable entries={entries} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      <TimesheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        weekStart={weekStart}
        weekEnd={weekEnd}
        entry={editingEntry}
      />
    </div>
  );
}
