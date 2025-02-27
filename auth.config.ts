import { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export default {
  providers: [GitHub],
  callbacks: {
    authorized: ({ auth, request: { nextUrl }}) => {
      const isLoggedIn = !!auth?.user;
      const isOnRegister = nextUrl.pathname.startsWith('/register');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnCreateEvent = nextUrl.pathname.startsWith('/create-event');

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL("/", nextUrl as unknown as URL));
      }

      if (isOnRegister || isOnLogin) {
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
