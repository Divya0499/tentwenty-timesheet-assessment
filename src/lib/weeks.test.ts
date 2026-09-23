import { describe, expect, it } from "vitest";
import { formatWeekRange, summarizeWeeks } from "./weeks";
import type { TimesheetEntry } from "@/types/timesheet";

// Small helper so each test only has to specify the fields it cares about.
function makeEntry(overrides: Partial<TimesheetEntry>): TimesheetEntry {
  return {
    id: "1",
    date: "2026-09-21",
    project: "Internal Tools",
    typeOfWork: "Bug fixes",
    description: "test entry",
    hours: 4,
    createdAt: "2026-09-21T00:00:00.000Z",
    updatedAt: "2026-09-21T00:00:00.000Z",
    ...overrides,
  };
}

describe("formatWeekRange", () => {
  it("shows just the day for the start date when both dates are in the same month", () => {
    expect(formatWeekRange("2026-09-21", "2026-09-27")).toBe("21 - 27 Sep, 2026");
  });

  it("shows the month for the start date too when it's different from the end date's month", () => {
    expect(formatWeekRange("2026-08-31", "2026-09-06")).toBe("31 Aug - 6 Sep, 2026");
  });
});

describe("summarizeWeeks", () => {
  // Monday-Friday of the week of 2026-09-21 (a Monday).
  const monday = "2026-09-21";
  const tuesday = "2026-09-22";
  const wednesday = "2026-09-23";
  const thursday = "2026-09-24";
  const friday = "2026-09-25";
  const referenceDate = new Date("2026-09-23"); // some day inside that week

  it("marks a week MISSING when it has no entries at all", () => {
    const [week] = summarizeWeeks([], 1, referenceDate);
    expect(week.status).toBe("MISSING");
    expect(week.totalHours).toBe(0);
  });

  it("marks a week INCOMPLETE when only some workdays have an entry", () => {
    const entries = [makeEntry({ date: monday }), makeEntry({ date: tuesday })];
    const [week] = summarizeWeeks(entries, 1, referenceDate);
    expect(week.status).toBe("INCOMPLETE");
  });

  it("marks a week COMPLETED once every workday (Mon-Fri) has an entry", () => {
    const entries = [monday, tuesday, wednesday, thursday, friday].map((date) =>
      makeEntry({ date })
    );
    const [week] = summarizeWeeks(entries, 1, referenceDate);
    expect(week.status).toBe("COMPLETED");
  });

  it("adds up hours across all entries in the week", () => {
    const entries = [
      makeEntry({ date: monday, hours: 4 }),
      makeEntry({ date: tuesday, hours: 3.5 }),
    ];
    const [week] = summarizeWeeks(entries, 1, referenceDate);
    expect(week.totalHours).toBe(7.5);
  });

  it("numbers weeks sequentially, oldest first", () => {
    const weeks = summarizeWeeks([], 3, referenceDate);
    expect(weeks.map((w) => w.weekNumber)).toEqual([1, 2, 3]);
  });
});
