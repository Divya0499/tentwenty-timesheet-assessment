import { format } from "date-fns";
import { Plus } from "lucide-react";
import { TaskRow } from "./TaskRow";
import type { TimesheetEntry } from "@/types/timesheet";

interface DaySectionProps {
  date: string; // ISO date
  entries: TimesheetEntry[];
  onAdd: (date: string) => void;
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entry: TimesheetEntry) => void;
}

export function DaySection({ date, entries, onAdd, onEdit, onDelete }: DaySectionProps) {
  return (
    <div className="border-t border-gray-200 first:border-t-0">
      <div className="px-4 pt-4 pb-1 text-sm font-semibold text-gray-900">
        {format(new Date(date), "MMM d")}
      </div>

      {entries.map((entry) => (
        <TaskRow key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} />
      ))}

      <button
        type="button"
        onClick={() => onAdd(date)}
        className="flex w-full items-center justify-center gap-1.5 border-t border-gray-100 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
      >
        <Plus size={14} />
        Add new task
      </button>
    </div>
  );
}
