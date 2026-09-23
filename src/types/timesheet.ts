/**
 * Domain types for the Timesheet Management app.
 *
 * Model: a "timesheet entry" is one task logged against a specific day
 * (project, type of work, description, hours). The dashboard groups
 * entries by ISO week to show the Week # / Date range / Status / Actions
 * table from the design. Weeks themselves aren't stored — they're
 * derived from entries so there's only one source of truth. See README
 * "Assumptions".
 */

import type { Project } from "@/lib/projects";
import type { TypeOfWork } from "@/lib/typesOfWork";

export interface TimesheetEntry {
  id: string;
  date: string; // ISO date string, e.g. "2025-11-24"
  project: Project;
  typeOfWork: TypeOfWork;
  description: string; // the task's label, e.g. "Homepage Development"
  hours: number; // 0.5 - 24
  createdAt: string;
  updatedAt: string;
}

/** Payload used for both create and update — id/timestamps are server-set. */
export interface TimesheetInput {
  date: string;
  project: Project;
  typeOfWork: TypeOfWork;
  description: string;
  hours: number;
}

export type WeekStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

/** A dashboard row: one calendar week, derived from that week's entries. */
export interface WeekSummary {
  weekStart: string; // ISO date (Monday), also used as the route param
  weekEnd: string; // ISO date (Sunday)
  weekNumber: number; // sequential, 1-indexed from the oldest week shown
  status: WeekStatus;
  totalHours: number;
  entryCount: number;
}
