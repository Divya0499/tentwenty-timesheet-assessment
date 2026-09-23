import type { DefaultSession } from "next-auth";

// Extend next-auth's session type with the `id` field we add in callbacks.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
