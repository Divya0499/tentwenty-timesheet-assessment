"use client";

import { signOut, useSession } from "next-auth/react";
import { Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 text-gray-900">
          <Clock size={22} className="text-indigo-600" />
          <span className="text-lg font-semibold">Timesheets</span>
        </div>

        <div className="flex items-center gap-3">
          {session?.user?.name && (
            <span className="hidden text-sm text-gray-600 sm:inline">
              {session.user.name}
            </span>
          )}
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
