import type { TimesheetEntry, TimesheetInput, WeekSummary } from "@/types/timesheet";

/**
 * Thin client for our own /api/timesheets routes. Keeping fetch calls in
 * one place (instead of scattered across components) makes it easy to
 * change error handling or the base URL in one spot later.
 */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseOrThrow(response: Response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.message ?? "Something went wrong", response.status);
  }
  return response.json();
}

export function fetchWeeks(): Promise<WeekSummary[]> {
  return fetch("/api/timesheets").then(parseOrThrow);
}

export function fetchWeekEntries(
  weekStart: string
): Promise<{ weekStart: string; weekEnd: string; entries: TimesheetEntry[] }> {
  return fetch(`/api/timesheets/${weekStart}`).then(parseOrThrow);
}

export function createTimesheetEntry(
  weekStart: string,
  input: TimesheetInput
): Promise<TimesheetEntry> {
  return fetch(`/api/timesheets/${weekStart}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).then(parseOrThrow);
}

export function updateTimesheetEntry(
  weekStart: string,
  entryId: string,
  input: TimesheetInput
): Promise<TimesheetEntry> {
  return fetch(`/api/timesheets/${weekStart}/entries/${entryId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).then(parseOrThrow);
}

export function deleteTimesheetEntry(
  weekStart: string,
  entryId: string
): Promise<{ success: boolean }> {
  return fetch(`/api/timesheets/${weekStart}/entries/${entryId}`, {
    method: "DELETE",
  }).then(parseOrThrow);
}
