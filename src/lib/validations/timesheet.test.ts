import { describe, expect, it } from "vitest";
import { timesheetSchema } from "./timesheet";

// A valid entry that every test can start from and then break one field at
// a time :- makes it obvious which field each test is actually checking.
const validEntry = {
  date: "2026-09-21",
  project: "Internal Tools",
  typeOfWork: "Bug fixes",
  description: "Fixed the login bug",
  hours: 4,
};

describe("timesheetSchema", () => {
  it("accepts a fully valid entry", () => {
    const result = timesheetSchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it("rejects a project that isn't in the known list", () => {
    const result = timesheetSchema.safeParse({ ...validEntry, project: "Not A Real Project" });
    expect(result.success).toBe(false);
  });

  it("rejects a description that's too short", () => {
    const result = timesheetSchema.safeParse({ ...validEntry, description: "a" });
    expect(result.success).toBe(false);
  });

  it("rejects hours below the 0.5 minimum", () => {
    const result = timesheetSchema.safeParse({ ...validEntry, hours: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects hours above the 24-in-a-day maximum", () => {
    const result = timesheetSchema.safeParse({ ...validEntry, hours: 25 });
    expect(result.success).toBe(false);
  });

  it("rejects a missing date", () => {
    const result = timesheetSchema.safeParse({ ...validEntry, date: "" });
    expect(result.success).toBe(false);
  });

  it("coerces a numeric string for hours into a number (what the <input> sends)", () => {
    const result = timesheetSchema.safeParse({ ...validEntry, hours: "6" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.hours).toBe(6);
    }
  });
});
