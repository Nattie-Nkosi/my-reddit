/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { compareSync } from "bcryptjs";
import { z } from "zod";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error("GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set in .env.local");
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHub({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email }
        });

        if (!user?.password) return null;

        const isValid = compareSync(parsed.data.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          suspended: user.suspended
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, account }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.suspended = user.suspended;
      }

      if (account?.provider === 'github' && token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id },
          select: { role: true, suspended: true }
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.suspended = dbUser.suspended;
        }
      }

      if (trigger === 'update') {
        const updatedUser = await db.user.findUnique({
          where: { id: token.id },
          select: { role: true, suspended: true }
        });
        if (updatedUser) {
          token.role = updatedUser.role;
          token.suspended = updatedUser.suspended;
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role;
        session.user.suspended = token.suspended;
      }
      return session;
    }
  },
})