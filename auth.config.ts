import { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export default {
  providers: [GitHub],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    jwt: ({ token, user, profile }) => {
      if (user) {
        token.id = user.id;
        token.githubUserName = profile?.login;
      } 
      return token;
    },
    session: ({ session, token }: { session: any, token: any }) => {
      if (token) {
        session.user.id = token.id;
        session.user.githubUserName = token.githubUserName;
      }
      return session;
    },
    authorized: ({ auth, request: { nextUrl }}) => {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith('/signin');
      const isOnCreateEvent = nextUrl.pathname.startsWith('/create-event');

      if (isLoggedIn && (isOnLogin)) {
        return Response.redirect(new URL("/", nextUrl as unknown as URL));
      }

      if (isOnLogin) {
        return true; // Always allow access to register and login pages
      }

      if (isOnCreateEvent) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
  }
} satisfies NextAuthConfig;
