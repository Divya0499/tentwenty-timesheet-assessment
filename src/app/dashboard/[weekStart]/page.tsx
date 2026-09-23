import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { formatWeekRange, getWeekEnd, toIsoDate } from "@/lib/weeks";
import { WeekDetailClient } from "./WeekDetailClient";

interface WeekPageProps {
  params: Promise<{ weekStart: string }>;
}

export default async function WeekDetailPage({ params }: WeekPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const { weekStart } = await params;
  const parsedDate = new Date(weekStart);
  if (Number.isNaN(parsedDate.getTime())) {
    notFound();
  }

  const weekEnd = toIsoDate(getWeekEnd(parsedDate));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Back to all weeks
        </Link>

        <h1 className="mb-1 text-xl font-semibold text-gray-900">
          Week of {formatWeekRange(weekStart, weekEnd)}
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Log and manage the entries you worked this week.
        </p>

        <WeekDetailClient weekStart={weekStart} weekEnd={weekEnd} />
      </main>
    </div>
  );
}
