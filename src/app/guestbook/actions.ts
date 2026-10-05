"use server";

import { revalidatePath } from "next/cache";
import { getSession, signIn, signOut } from "@/auth";
import { addEntry, deleteEntry, dbReady } from "@/lib/db";

const MAX_LENGTH = 300;

/**
 * Failures carry the submitted text back. React resets a form before running
 * its action, so without this a rejected message would be wiped from the box;
 * the form feeds `body` back in as the input's defaultValue.
 */
export type ActionResult = { ok: true } | { ok: false; error: string; body: string };

export async function signInWithGitHub() {
  await signIn("github", { redirectTo: "/guestbook" });
}

export async function signOutOfGuestbook() {
  await signOut({ redirectTo: "/guestbook" });
}

export async function createEntry(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const body = String(formData.get("body") ?? "").trim();
  const fail = (error: string): ActionResult => ({ ok: false, error, body });

  if (!dbReady()) return fail("The guestbook database is not configured yet.");

  // The GitHub account id is the only identity entries are keyed on. There is
  // deliberately no fallback: a shared placeholder id would let everyone who
  // fell back to it delete each other's messages.
  const session = await getSession();
  const authorId = session?.user?.githubId;
  if (!session?.user || !authorId) return fail("You need to sign in first.");

  if (!body) return fail("Write something first.");
  if (body.length > MAX_LENGTH) return fail(`Keep it under ${MAX_LENGTH} characters.`);

  try {
    await addEntry({
      body,
      authorName: session.user.name ?? "Anonymous",
      authorImage: session.user.image ?? null,
      authorId,
    });
  } catch (error) {
    console.error("Failed to save guestbook entry:", error);
    return fail("Couldn't save your message. Try again in a bit.");
  }

  revalidatePath("/guestbook");
  return { ok: true };
}

export async function removeEntry(formData: FormData): Promise<void> {
  const session = await getSession();
  const authorId = session?.user?.githubId;
  if (!authorId) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  // The delete is scoped by author id in SQL, so this cannot remove another
  // person's entry even if the id is tampered with.
  await deleteEntry(id, authorId);

  revalidatePath("/guestbook");
}
