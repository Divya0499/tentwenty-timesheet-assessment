import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import type { TimesheetEntry } from "@/types/timesheet";

interface EntriesTableProps {
  entries: TimesheetEntry[];
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entry: TimesheetEntry) => void;
}

export function EntriesTable({ entries, onEdit, onDelete }: EntriesTableProps) {
  if (entries.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        No entries logged for this week yet. Click &quot;Add Entry&quot; to log your first one.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium text-gray-600">Date</th>
            <th scope="col" className="px-4 py-3 font-medium text-gray-600">Project</th>
            <th scope="col" className="px-4 py-3 font-medium text-gray-600">Task</th>
            <th scope="col" className="px-4 py-3 font-medium text-gray-600">Hours</th>
            <th scope="col" className="px-4 py-3 font-medium text-gray-600 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                {format(new Date(entry.date), "EEE, d MMM")}
              </td>
              <td className="px-4 py-3 text-gray-900">{entry.project}</td>
              <td className="px-4 py-3 text-gray-600">
                <div>{entry.task}</div>
                {entry.description && (
                  <div className="mt-0.5 text-xs text-gray-400">{entry.description}</div>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">{entry.hours}h</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(entry)}
                    className="text-gray-400 hover:text-indigo-600"
                    aria-label={`Edit entry: ${entry.task}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry)}
                    className="text-gray-400 hover:text-red-600"
                    aria-label={`Delete entry: ${entry.task}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
