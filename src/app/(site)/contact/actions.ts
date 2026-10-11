"use server";

import { Resend } from "resend";
import { z } from "zod";
import { SITE } from "@/lib/catalog";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address."),
  subject: z.string().trim().min(1, "Please add a subject.").max(150),
  message: z.string().trim().min(10, "Please write a little more (at least 10 characters).").max(5000),
  // Honeypot: real people never see or fill this field.
  company: z.string().max(0).optional(),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "subject" | "message", string>>;
  values?: Record<string, string>;
};

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(["name", "email", "subject", "message", "company"].map((k) => [k, String(formData.get(k) ?? "")]));
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    if (raw.company) return { status: "success", message: "Thank you — your message has been sent." };
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["fieldErrors"]>;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors, values: raw };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not set");
    return {
      status: "error",
      message: `Sorry, the form isn't available right now. Please email ${SITE.email} or message us on WhatsApp.`,
      values: raw,
    };
  }

  const { name, email, subject, message } = parsed.data;
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? `${SITE.name} website <website@anangajewels.com>`,
    to: process.env.CONTACT_TO_EMAIL ?? SITE.email,
    replyTo: `${name} <${email}>`,
    subject: `[Website] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Contact form: send failed", error);
    return {
      status: "error",
      message: `Sorry, we couldn't send your message. Please email ${SITE.email} or message us on WhatsApp.`,
      values: raw,
    };
  }

  return { status: "success", message: "Thank you — your message has been sent. We'll reply as soon as we can." };
}
