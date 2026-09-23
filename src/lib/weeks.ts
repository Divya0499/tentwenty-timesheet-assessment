import {
  addDays,
  endOfWeek,
  format,
  getISOWeek,
  startOfWeek,
  subWeeks,
} from "date-fns";
import type { TimesheetEntry, WeekStatus, WeekSummary } from "@/types/timesheet";

const WEEK_OPTS = { weekStartsOn: 1 as const }; // Monday-start weeks

export function getWeekStart(date: Date): Date {
  return startOfWeek(date, WEEK_OPTS);
}

export function getWeekEnd(date: Date): Date {
  return endOfWeek(date, WEEK_OPTS);
}

export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = new Date(weekStart);
  const end = new Date(weekEnd);
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = format(start, sameMonth ? "d" : "d MMM");
  const endLabel = format(end, "d MMM yyyy");
  return `${startLabel} - ${endLabel}`;
}

/** A week counts as COMPLETED once 5+ workdays are logged (>=1 entry each). */
function computeWeekStatus(
  weekStart: Date,
  entries: TimesheetEntry[]
): WeekStatus {
  if (entries.length === 0) return "MISSING";

  const loggedDays = new Set(entries.map((e) => e.date));
  const workdays = Array.from({ length: 5 }, (_, i) =>
    toIsoDate(addDays(weekStart, i))
  );
  const allWorkdaysLogged = workdays.every((day) => loggedDays.has(day));

  return allWorkdaysLogged ? "COMPLETED" : "INCOMPLETE";
}

/**
 * Groups entries into week summaries covering `weeksBack` weeks up to and
 * including the current week (so the dashboard always shows the current
 * week, even with zero entries logged so far, as MISSING).
 */
export function summarizeWeeks(
  entries: TimesheetEntry[],
  weeksBack = 6,
  referenceDate = new Date()
): WeekSummary[] {
  const currentWeekStart = getWeekStart(referenceDate);

  const weeks: WeekSummary[] = [];
  for (let i = 0; i < weeksBack; i++) {
    const weekStartDate = subWeeks(currentWeekStart, i);
    const weekEndDate = getWeekEnd(weekStartDate);
    const weekStart = toIsoDate(weekStartDate);
    const weekEnd = toIsoDate(weekEndDate);

    const weekEntries = entries.filter(
      (entry) => entry.date >= weekStart && entry.date <= weekEnd
    );

    weeks.push({
      weekStart,
      weekEnd,
      weekNumber: getISOWeek(weekStartDate),
      status: computeWeekStatus(weekStartDate, weekEntries),
      totalHours: weekEntries.reduce((sum, e) => sum + e.hours, 0),
      entryCount: weekEntries.length,
    });
  }

  return weeks;
}

export function entriesForWeek(
  entries: TimesheetEntry[],
  weekStart: string,
  weekEnd: string
): TimesheetEntry[] {
  return entries
    .filter((entry) => entry.date >= weekStart && entry.date <= weekEnd)
    .sort((a, b) => a.date.localeCompare(b.date));
}
