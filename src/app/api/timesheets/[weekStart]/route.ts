import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listTimesheets } from "@/lib/db/timesheets";
import { entriesForWeek, getWeekEnd, toIsoDate } from "@/lib/weeks";

interface RouteParams {
  params: Promise<{ weekStart: string }>;
}

/** Returns the entries logged within a single week, given its Monday date. */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { weekStart } = await params;
  const parsedDate = new Date(weekStart);
  if (Number.isNaN(parsedDate.getTime())) {
    return NextResponse.json({ message: "Invalid week" }, { status: 400 });
  }

  const weekEnd = toIsoDate(getWeekEnd(parsedDate));
  const entries = entriesForWeek(listTimesheets(), weekStart, weekEnd);

  return NextResponse.json({ weekStart, weekEnd, entries });
}
