import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { authConfig } from "./auth.config";
import { PrismaClient } from "@prisma/client";

// Ensure a single instance of PrismaClient in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const loginType = credentials.loginType as string | undefined; // e.g. 'admin' or 'user'
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });
        
        if (!user || !user.actif) return null;
        
        const isAdminRole = user.role === 'ADMIN' || user.role === 'GESTIONNAIRE';
        if (loginType === 'admin' && !isAdminRole) return null;
        if (loginType === 'user' && isAdminRole) return null;
        
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        
        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        }
        
        return null;
      },
    }),
  ],
});
