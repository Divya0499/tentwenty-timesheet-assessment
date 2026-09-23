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

  // 12 weeks gives the dashboard's "Last N weeks" date-range filter enough
  // history to be meaningful.
  const weeks = summarizeWeeks(listTimesheets(), 12);
  return NextResponse.json(weeks);
}
