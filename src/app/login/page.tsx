import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Clock size={32} className="text-indigo-600" />
          <h1 className="text-xl font-semibold text-gray-900">
            Sign in to Timesheets
          </h1>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Demo login &middot; employee@tentwenty.com / password123
        </p>
      </div>
    </div>
  );
}
