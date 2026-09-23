import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Dummy auth for this assessment — there's no real user backend, so we
 * check credentials against a single hardcoded demo account instead of
 * calling out to a database. Swapping this for a real provider later
 * only means editing `authorize()`.
 */
const DEMO_EMAIL = "employee@tentwenty.com";
const DEMO_PASSWORD = "password123";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailMatches =
          credentials.email.trim().toLowerCase() === DEMO_EMAIL;
        const passwordMatches = credentials.password === DEMO_PASSWORD;

        if (!emailMatches || !passwordMatches) return null;

        return {
          id: "1",
          name: "Demo Employee",
          email: DEMO_EMAIL,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
