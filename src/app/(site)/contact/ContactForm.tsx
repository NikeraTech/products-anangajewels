"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { sendContactMessage, type ContactState } from "./actions";

const initial: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initial);

  if (state.status === "success") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="grid place-items-center rounded-[1.75rem] bg-emerald-900 px-8 py-20 text-center text-ivory">
        <CheckCircle2 className="size-14 text-gold-300" />
        <h3 className="mt-5 text-4xl font-medium">Message sent</h3>
        <p className="mt-3 max-w-sm text-ivory/70">{state.message}</p>
      </motion.div>
    );
  }

  const v = state.values ?? {};
  const err = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-5 rounded-[1.75rem] border border-sand bg-white/70 p-6 shadow-[0_30px_60px_-40px_rgb(7_29_22/0.35)] sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" defaultValue={v.name} error={err.name} autoComplete="name" />
        <Field name="email" label="Email" type="email" defaultValue={v.email} error={err.email} autoComplete="email" />
      </div>
      <Field name="subject" label="Subject" defaultValue={v.subject} error={err.subject} placeholder="e.g. Availability of ER-16409" />
      <Field name="message" label="Message" textarea defaultValue={v.message} error={err.message} />
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <AnimatePresence>
        {state.status === "error" && state.message && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl bg-ruby/10 px-4 py-3 text-sm text-ruby" role="alert">
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" disabled={pending} className="btn btn-primary justify-self-start disabled:opacity-60">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  textarea,
  error,
  ...props
}: {
  name: string;
  label: string;
  textarea?: boolean;
  error?: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const cls = cn(
    "mt-2 w-full rounded-xl border bg-ivory px-4 py-3 text-sm outline-none transition focus:border-gold-400 focus:ring-4 focus:ring-gold-300/30",
    error ? "border-ruby" : "border-sand",
  );
  return (
    <label className="block text-sm font-medium text-emerald-900">
      {label}
      {textarea ? (
        <textarea name={name} rows={6} required aria-invalid={!!error} className={cls} {...props} />
      ) : (
        <input name={name} required aria-invalid={!!error} className={cls} {...props} />
      )}
      {error && <span className="mt-1.5 block text-xs font-normal text-ruby">{error}</span>}
    </label>
  );
}
