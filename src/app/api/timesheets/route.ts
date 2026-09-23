import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listTimesheets } from "@/lib/db/timesheets";
import { summarizeWeeks } from "@/lib/weeks";

/**
 * Internal API route the dashboard talks to (not a public API).
 * Returns one row per week (Week #, date range, status, hours) — the
 * shape the dashboard table needs.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const weeks = summarizeWeeks(listTimesheets());
  return NextResponse.json(weeks);
}
