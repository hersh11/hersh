import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * GitHub sign-in for the guestbook, nothing else.
 *
 * Sessions are JWTs in a cookie — there is deliberately no database adapter,
 * because the only thing the site needs to know about you is the name and
 * avatar to put next to your message. asrvd.me ran Prisma + a full adapter
 * schema for this; the entries table below is all it actually requires.
 *
 * Env vars: AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    // Expose the GitHub account id so entries can be attributed and deleted.
    jwt({ token, profile }) {
      if (profile?.id) token.githubId = String(profile.id);
      return token;
    },
    session({ session, token }) {
      if (token.githubId) session.user.githubId = token.githubId as string;
      return session;
    },
  },
});

/** True once AUTH_SECRET and the GitHub OAuth app credentials are all present. */
export function authConfigured() {
  return Boolean(
    process.env.AUTH_SECRET && process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );
}

/**
 * `auth()` throws MissingSecret when the env isn't set up, which would log a
 * stack trace on every render of a page that only wants to know "signed in?".
 * Before configuration, the honest answer is simply "no".
 */
export async function getSession() {
  if (!authConfigured()) return null;
  return auth();
}
