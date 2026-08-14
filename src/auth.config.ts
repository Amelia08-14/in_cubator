import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/connexion',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as any)?.role as string | undefined;
      
      const path = nextUrl.pathname;

      // ─── Admin routes ───
      if (path.startsWith('/admin')) {
        // Let the admin login page through
        if (path === '/admin/connexion') {
          if (isLoggedIn && (role === 'ADMIN' || role === 'GESTIONNAIRE')) {
            return Response.redirect(new URL('/admin', nextUrl));
          }
          return true;
        }

        if (!isLoggedIn) return Response.redirect(new URL('/admin/connexion', nextUrl));
        if (role !== 'ADMIN' && role !== 'GESTIONNAIRE') {
          return Response.redirect(new URL('/403', nextUrl));
        }
        return true;
      }

      // ─── Startup routes (/espace) ───
      // IMPORTANT: This must be checked AFTER /espace-mentor and /espace-investisseur
      // because /espace is a prefix of both. We handle the more specific ones first.
      
      // ─── Mentor routes (/espace-mentor) ───
      if (path.startsWith('/espace-mentor')) {
        if (!isLoggedIn) return Response.redirect(new URL('/connexion', nextUrl));
        if (role !== 'MENTOR_EXPERT') {
          return Response.redirect(new URL('/403', nextUrl));
        }
        return true;
      }

      // ─── Investor routes (/espace-investisseur) ───
      if (path.startsWith('/espace-investisseur')) {
        if (!isLoggedIn) return Response.redirect(new URL('/connexion', nextUrl));
        if (role !== 'INVESTISSEUR') {
          return Response.redirect(new URL('/403', nextUrl));
        }
        return true;
      }

      // ─── Startup routes (/espace) ───
      if (path.startsWith('/espace')) {
        if (!isLoggedIn) return Response.redirect(new URL('/connexion', nextUrl));
        if (role !== 'PORTEUR_STARTUP') {
          return Response.redirect(new URL('/403', nextUrl));
        }
        return true;
      }

      // ─── Login page: redirect already-logged-in users to their dashboard ───
      if (path === '/connexion') {
        if (isLoggedIn && role) {
          const dashboardMap: Record<string, string> = {
            'ADMIN': '/admin',
            'GESTIONNAIRE': '/admin',
            'PORTEUR_STARTUP': '/espace',
            'MENTOR_EXPERT': '/espace-mentor',
            'INVESTISSEUR': '/espace-investisseur',
          };
          const dest = dashboardMap[role];
          if (dest) {
            return Response.redirect(new URL(dest, nextUrl));
          }
        }
        return true;
      }

      // ─── Public routes: always allowed ───
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
