import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: login form */}
      <div className="flex w-full flex-col justify-center px-6 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">Welcome back</h1>
          <LoginForm />
          <p className="mt-6 text-center text-xs text-gray-400">
            Demo login &middot; employee@tentwenty.com / password123
          </p>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="relative hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:bg-blue-600 lg:px-16 lg:text-white">
        <h2 className="mb-4 text-4xl font-bold">ticktock</h2>
        <p className="max-w-md text-blue-100">
          Introducing ticktock, our cutting-edge timesheet web application
          designed to revolutionize how you manage employee work hours. With
          ticktock, you can effortlessly track and monitor employee
          attendance and productivity from anywhere, anytime, using any
          internet-connected device.
        </p>
        <p className="absolute bottom-4 right-6 text-xs text-blue-200">
          &copy; {new Date().getFullYear()} tentwenty
        </p>
      </div>
    </div>
  );
}
