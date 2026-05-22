// ============================================
// CreatorAI - NextAuth Configuration
// ============================================

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // Email/Password
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("No account found with this email");
        }

        if (!user.password) {
          throw new Error("Please sign in with Google");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          plan: user.plan,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          // upsert — find or create, and always get the DB _id back
          let dbUser = await User.findOne({ email: user.email });

          if (!dbUser) {
            dbUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
              plan: "free",
              credits: 50,
              maxCredits: 50,
            });
          }

          // ✅ FIX 1: set user.id to the MongoDB _id so jwt callback gets it
          user.id = dbUser._id.toString();
        } catch (error) {
          console.error("Google signIn error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      // On sign-in, user object is present — capture the id + plan immediately
      if (user) {
        token.id = user.id;
        token.plan = (user as { plan?: string }).plan ?? "free";
        token.credits = 50;
        token.maxCredits = 50;
      }

      // ✅ FIX 2: only re-fetch from DB when the session is explicitly updated
      // (e.g. after a plan upgrade), NOT on every single request
      if (trigger === "update" && token.id) {
        await connectDB();
        const dbUser = await User.findById(token.id).select("plan credits maxCredits").lean();
        if (dbUser) {
          token.plan = (dbUser as { plan: string }).plan;
          token.credits = (dbUser as { credits: number }).credits;
          token.maxCredits = (dbUser as { maxCredits: number }).maxCredits;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as string) ?? "free";
        session.user.credits = (token.credits as number) ?? 50;
        session.user.maxCredits = (token.maxCredits as number) ?? 50;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: false,
};

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string;
      credits?: number;
      maxCredits?: number;
    };
  }
  interface User {
    plan?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan?: string;
    credits?: number;
    maxCredits?: number;
  }
}
