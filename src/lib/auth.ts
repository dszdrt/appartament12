import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "./db";

// Rate limiting in-memory store for Brute-force protection
interface LoginAttempt {
  count: number;
  resetTime: number;
}

const attemptStore = new Map<string, LoginAttempt>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Заполните логин и пароль");
        }

        const usernameKey = credentials.username.trim().toLowerCase();
        const now = Date.now();
        const attempt = attemptStore.get(usernameKey);

        // Check if currently locked out
        if (attempt && attempt.resetTime > now) {
          if (attempt.count >= MAX_FAILED_ATTEMPTS) {
            const minutesLeft = Math.ceil((attempt.resetTime - now) / 60000);
            throw new Error(`Превышено количество попыток. Вход заблокирован на ${minutesLeft} мин.`);
          }
        } else if (attempt && attempt.resetTime <= now) {
          // Reset expired lockout
          attemptStore.delete(usernameKey);
        }

        const admin = await db.admin.findUnique({
          where: { username: credentials.username }
        });

        if (!admin) {
          recordFailedAttempt(usernameKey, now);
          throw new Error("Неверный логин или пароль");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, admin.passwordHash);

        if (!isPasswordValid) {
          recordFailedAttempt(usernameKey, now);
          throw new Error("Неверный логин или пароль");
        }

        // On successful login, clear failed attempts
        attemptStore.delete(usernameKey);

        return {
          id: admin.id,
          name: admin.username,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.name = token.name;
        (session.user as any).id = token.id;
      }
      return session;
    }
  }
};

function recordFailedAttempt(key: string, now: number) {
  const attempt = attemptStore.get(key) || { count: 0, resetTime: now + LOCKOUT_DURATION_MS };
  attempt.count += 1;
  attempt.resetTime = now + LOCKOUT_DURATION_MS;
  attemptStore.set(key, attempt);
}
