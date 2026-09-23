/**
 * Fixed list of "type of work" categories a task can be tagged with,
 * shown as a select in the Add/Edit modal (see Figma). Static here for
 * the same reason PROJECTS is static — no real backend was supplied.
 */
export const TYPES_OF_WORK = [
  "Bug fixes",
  "Feature Development",
  "Code Review",
  "Documentation",
  "Testing",
  "Meeting",
  "Research",
] as const;

export type TypeOfWork = (typeof TYPES_OF_WORK)[number];
