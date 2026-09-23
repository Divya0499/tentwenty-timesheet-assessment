import { randomUUID } from "crypto";
import { addDays } from "date-fns";
import type { TimesheetEntry, TimesheetInput } from "@/types/timesheet";
import type { Project } from "@/lib/projects";
import { getWeekStart, toIsoDate } from "@/lib/weeks";

/**
 * In-memory "database" for timesheet entries.
 *
 * The brief doesn't provide a real backend, so this stands in for one.
 * Every mutation goes through the functions below — that's the only seam
 * the API routes touch, so swapping this for a real DB later shouldn't
 * require touching route handlers or client code.
 *
 * Caveat: resets on dev-server restart and isn't shared across serverless
 * instances in production. Fine for a demo; called out in the README.
 */

let entries: TimesheetEntry[] = seed();

function seed(): TimesheetEntry[] {
  const now = new Date().toISOString();
  const thisWeekStart = getWeekStart(new Date());
  const lastWeekStart = addDays(thisWeekStart, -7);
  const twoWeeksAgoStart = addDays(thisWeekStart, -14);

  const raw: Array<Omit<TimesheetEntry, "id" | "createdAt" | "updatedAt">> = [
    // Two weeks ago: fully logged (Mon-Fri) -> COMPLETED
    ...["Homepage layout", "Navbar + routing", "API integration", "Bug fixes", "Code review"].map(
      (task, i) => ({
        date: toIsoDate(addDays(twoWeeksAgoStart, i)),
        project: "Client Website Revamp" as Project,
        task,
        description: `Worked on ${task.toLowerCase()}.`,
        hours: 8,
        status: "COMPLETED" as const,
      })
    ),
    // Last week: only 2 days logged -> INCOMPLETE
    {
      date: toIsoDate(addDays(lastWeekStart, 0)),
      project: "Mobile App" as Project,
      task: "Login screen",
      description: "Implemented form validation and API hookup.",
      hours: 6,
      status: "COMPLETED",
    },
    {
      date: toIsoDate(addDays(lastWeekStart, 1)),
      project: "Mobile App" as Project,
      task: "Onboarding flow",
      description: "Built the 3-step onboarding carousel.",
      hours: 5,
      status: "COMPLETED",
    },
    // This week: one entry so far -> INCOMPLETE
    {
      date: toIsoDate(thisWeekStart),
      project: "Internal Tools" as Project,
      task: "Dashboard refactor",
      description: "Started splitting the dashboard into smaller components.",
      hours: 4,
      status: "INCOMPLETE",
    },
  ];

  return raw.map((entry) => ({
    ...entry,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  }));
}

export function listTimesheets(): TimesheetEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

export function getTimesheet(id: string): TimesheetEntry | undefined {
  return entries.find((entry) => entry.id === id);
}

export function createTimesheet(input: TimesheetInput): TimesheetEntry {
  const now = new Date().toISOString();
  const entry: TimesheetEntry = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  entries = [entry, ...entries];
  return entry;
}

export function updateTimesheet(
  id: string,
  input: TimesheetInput
): TimesheetEntry | undefined {
  let updated: TimesheetEntry | undefined;
  entries = entries.map((entry) => {
    if (entry.id !== id) return entry;
    updated = { ...entry, ...input, updatedAt: new Date().toISOString() };
    return updated;
  });
  return updated;
}

export function deleteTimesheet(id: string): boolean {
  const before = entries.length;
  entries = entries.filter((entry) => entry.id !== id);
  return entries.length < before;
}
