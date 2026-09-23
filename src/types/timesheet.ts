/**
 * Domain types for the Timesheet Management app.
 *
 * Model: a "timesheet entry" is one day's logged work (project, task,
 * hours). The dashboard groups entries by ISO week to show the
 * Week # / Date range / Status / Actions table from the brief. Weeks
 * themselves aren't stored — they're derived from entries so there's
 * only one source of truth to keep in sync. See README "Assumptions".
 */

import type { Project } from "@/lib/projects";

export type TimesheetStatus = "COMPLETED" | "INCOMPLETE";

export interface TimesheetEntry {
  id: string;
  date: string; // ISO date string, e.g. "2025-11-24"
  project: Project;
  task: string;
  description: string;
  hours: number; // 0.5 - 24
  status: TimesheetStatus;
  createdAt: string;
  updatedAt: string;
}

/** Payload used for both create and update — id/timestamps are server-set. */
export interface TimesheetInput {
  date: string;
  project: Project;
  task: string;
  description: string;
  hours: number;
  status: TimesheetStatus;
}

export type WeekStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

/** A dashboard row: one calendar week, derived from that week's entries. */
export interface WeekSummary {
  weekStart: string; // ISO date (Monday), also used as the route param
  weekEnd: string; // ISO date (Sunday)
  weekNumber: number; // ISO week-of-year
  status: WeekStatus;
  totalHours: number;
  entryCount: number;
}
