"use server";

import { revalidatePath } from "next/cache";
import { getSession, signIn, signOut } from "@/auth";
import { addEntry, deleteEntry, dbReady } from "@/lib/db";

const MAX_LENGTH = 300;

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function signInWithGitHub() {
  await signIn("github", { redirectTo: "/guestbook" });
}

export async function signOutOfGuestbook() {
  await signOut({ redirectTo: "/guestbook" });
}

export async function createEntry(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!dbReady()) return { ok: false, error: "The guestbook database is not configured yet." };

  const session = await getSession();
  if (!session?.user) return { ok: false, error: "You need to sign in first." };

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { ok: false, error: "Write something first." };
  if (body.length > MAX_LENGTH) {
    return { ok: false, error: `Keep it under ${MAX_LENGTH} characters.` };
  }

  await addEntry({
    body,
    authorName: session.user.name ?? "Anonymous",
    authorImage: session.user.image ?? null,
    // Falls back to email only if GitHub somehow returned no id.
    authorId: session.user.githubId ?? session.user.email ?? "unknown",
  });

  revalidatePath("/guestbook");
  return { ok: true };
}

export async function removeEntry(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session?.user) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const authorId = session.user.githubId ?? session.user.email ?? "unknown";
  // The delete is scoped by author id in SQL, so this cannot remove another
  // person's entry even if the id is tampered with.
  await deleteEntry(id, authorId);

  revalidatePath("/guestbook");
}
