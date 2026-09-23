/**
 * Fixed list of projects a user can log time against.
 * In a real system this would come from a /projects endpoint — kept static
 * here since the brief doesn't supply that API.
 */
export const PROJECTS = [
  "Internal Tools",
  "Client Website Revamp",
  "Mobile App",
  "Marketing Site",
  "R&D",
] as const;

export type Project = (typeof PROJECTS)[number];
