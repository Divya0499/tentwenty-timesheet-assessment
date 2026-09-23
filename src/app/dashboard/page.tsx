import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-1 text-xl font-semibold text-gray-900">Timesheets</h1>
        <p className="mb-6 text-sm text-gray-500">
          Your logged weeks. Click a week to view or edit its entries.
        </p>
        <DashboardClient />
      </main>
    </div>
  );
}
