"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { createEntry, type ActionResult } from "@/app/guestbook/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-100 shadow transition duration-300 hover:shadow-xl disabled:opacity-60 dark:bg-zinc-200 dark:text-zinc-900"
    >
      {pending ? "Signing..." : "Sign"}
    </button>
  );
}

export function GuestbookForm() {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(createEntry, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the box on success, surface the reason on failure.
  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      formRef.current?.reset();
      toast.success("Thanks for signing!");
    } else {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex w-full gap-2">
      <input
        name="body"
        maxLength={300}
        required
        placeholder="Leave a message..."
        aria-label="Your message"
        className="w-full rounded-lg border border-zinc-300 bg-zinc-100/60 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200"
      />
      <SubmitButton />
    </form>
  );
}
