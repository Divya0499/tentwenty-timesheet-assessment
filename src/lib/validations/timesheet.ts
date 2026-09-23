import { z } from "zod";
import { PROJECTS } from "@/lib/projects";
import { TYPES_OF_WORK } from "@/lib/typesOfWork";

/**
 * Single source of truth for timesheet-entry validation. Used by:
 *  - the Add/Edit modal form (react-hook-form + @hookform/resolvers/zod)
 *  - the API routes, so invalid data can never reach the "database"
 *    even if a request bypasses the UI.
 */
export const timesheetSchema = z.object({
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => !Number.isNaN(new Date(val).getTime()), {
      message: "Enter a valid date",
    }),
  project: z.enum(PROJECTS, { error: "Select a project" }),
  typeOfWork: z.enum(TYPES_OF_WORK, { error: "Select a type of work" }),
  description: z
    .string()
    .trim()
    .min(2, "Task description must be at least 2 characters")
    .max(500, "Task description must be under 500 characters"),
  hours: z.coerce
    .number({ error: "Hours must be a number" })
    .min(0.5, "Minimum is 0.5 hours")
    .max(24, "Can't exceed 24 hours in a day"),
});

// react-hook-form needs both shapes: the raw values the <input> fields
// produce (e.g. `hours` typed as the coercible `unknown` before parsing)
// and the parsed/validated output the resolver hands to onSubmit.
export type TimesheetFormInput = z.input<typeof timesheetSchema>;
export type TimesheetFormValues = z.output<typeof timesheetSchema>;
