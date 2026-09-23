import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { timesheetSchema } from "@/lib/validations/timesheet";
import { deleteTimesheet, updateTimesheet } from "@/lib/db/timesheets";
import { getWeekEnd, toIsoDate } from "@/lib/weeks";

interface RouteParams {
  params: Promise<{ weekStart: string; entryId: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { weekStart, entryId } = await params;
  const weekEnd = toIsoDate(getWeekEnd(new Date(weekStart)));

  const body = await request.json().catch(() => null);
  const parsed = timesheetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.date < weekStart || parsed.data.date > weekEnd) {
    return NextResponse.json(
      { message: `Date must fall within ${weekStart} and ${weekEnd}` },
      { status: 400 }
    );
  }

  const updated = updateTimesheet(entryId, {
    ...parsed.data,
    description: parsed.data.description ?? "",
  });
  if (!updated) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { entryId } = await params;
  const deleted = deleteTimesheet(entryId);
  if (!deleted) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
