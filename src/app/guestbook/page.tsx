import Image from "next/image";
import { SiGithub } from "react-icons/si";
import { FiTrash2 } from "react-icons/fi";
import { PageShell } from "@/components/page-shell";
import { PageHeader, Card } from "@/components/card";
import { GuestbookForm } from "@/components/guestbook-form";
import { getSession, authConfigured } from "@/auth";
import { getEntries, dbReady, type Entry } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { signInWithGitHub, signOutOfGuestbook, removeEntry } from "./actions";

export const metadata = pageMetadata({
  path: "guestbook",
  description: "Sign my guestbook and leave a message.",
  emoji: "📖",
});

// Entries change on user action, so render per request rather than at build.
export const dynamic = "force-dynamic";

/**
 * A database error shouldn't take the whole page down. The usual cause on a
 * fresh setup is that db/schema.sql hasn't been run, so the table is missing.
 */
async function loadEntries(): Promise<{ entries: Entry[]; failed: boolean }> {
  try {
    return { entries: await getEntries(), failed: false };
  } catch (error) {
    console.error("Failed to load guestbook entries:", error);
    return { entries: [], failed: true };
  }
}

export default async function GuestbookPage() {
  const [session, { entries, failed }] = await Promise.all([getSession(), loadEntries()]);
  // Both halves have to be wired up before anyone can sign anything.
  const configured = dbReady() && authConfigured();
  const missing = [!dbReady() && "DATABASE_URL", !authConfigured() && "AUTH_SECRET / GitHub OAuth"]
    .filter(Boolean)
    .join(" and ");
  const myId = session?.user?.githubId ?? null;
  const isOwner = myId !== null && myId === site.githubId;

  return (
    <PageShell>
      <PageHeader title="Guestbook">
        Leave a message, a recommendation, or whatever you like.
      </PageHeader>

      <Card className="flex flex-col gap-4">
        {!configured ? (
          <p className="m-0 text-sm text-zinc-700 dark:text-zinc-400">
            The guestbook isn&apos;t switched on yet — {missing} still needs setting. See{" "}
            <code>.env.example</code> and <code>db/schema.sql</code>.
          </p>
        ) : session?.user ? (
          <>
            <GuestbookForm />
            <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
              <span>
                Signed in as <span className="text-zinc-800 dark:text-zinc-200">{session.user.name}</span>
              </span>
              <form action={signOutOfGuestbook}>
                <button
                  type="submit"
                  className="underline decoration-dotted underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Sign out
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <form action={signInWithGitHub}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-100 shadow transition duration-300 hover:shadow-xl dark:bg-zinc-200 dark:text-zinc-900"
              >
                <SiGithub aria-hidden /> Sign in with GitHub
              </button>
            </form>
            <p className="m-0 text-xs text-zinc-600 dark:text-zinc-500">
              Only your name and avatar are stored, alongside whatever you write.
            </p>
          </>
        )}
      </Card>

      <div className="flex flex-col gap-3">
        {failed ? (
          <p className="m-0 text-sm text-zinc-500">
            Couldn&apos;t load messages right now.
            {process.env.NODE_ENV === "development" &&
              " Check DATABASE_URL, and that db/schema.sql has been run against it."}
          </p>
        ) : (
          entries.length === 0 &&
          configured && <p className="m-0 text-sm text-zinc-500">No messages yet. Be the first.</p>
        )}

        {entries.map((entry) => (
          <div key={entry.id} className="flex items-start gap-3">
            {entry.author_image ? (
              <Image
                src={entry.author_image}
                alt=""
                width={32}
                height={32}
                unoptimized
                className="mt-0.5 h-8 w-8 shrink-0 rounded-full"
              />
            ) : (
              <span className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            )}

            <div className="min-w-0 flex-1">
              <p className="m-0 text-sm break-words text-zinc-800 dark:text-zinc-200">{entry.body}</p>
              <p className="m-0 mt-1 flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-500">
                <span>{entry.author_name}</span>
                <span aria-hidden>&middot;</span>
                <time dateTime={entry.created_at.toISOString()}>{formatDate(entry.created_at)}</time>

                {(isOwner || (myId && myId === entry.author_id)) && (
                  <form action={removeEntry}>
                    <input type="hidden" name="id" value={entry.id} />
                    <button
                      type="submit"
                      aria-label={myId === entry.author_id ? "Delete your message" : "Delete this message"}
                      className="flex items-center hover:text-red-600 dark:hover:text-red-400"
                    >
                      <FiTrash2 size="0.8rem" aria-hidden />
                    </button>
                  </form>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
