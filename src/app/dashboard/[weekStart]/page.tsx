import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getWeekEnd, toIsoDate } from "@/lib/weeks";
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Back to all weeks
        </Link>

        <WeekDetailClient weekStart={weekStart} weekEnd={weekEnd} />
        <Footer />
      </main>
    </div>
  );
}
