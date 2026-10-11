import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how Ananga Jewels handles personal data and cookies for customers in the UK.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ href: "/", label: "Home" }, { label: "Privacy policy" }]} eyebrow="Legal" title="Privacy Policy" />
      <article className="prose-legal container-x max-w-3xl py-16">
        <p>
          Your privacy is important to us at <strong>{SITE.name}</strong>. This policy explains how we collect, use, and protect your information when you visit our website in the UK.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>Personal information you provide via forms (like name and email).</li>
          <li>Non-personal information collected automatically (like IP address, browser type, and pages visited).</li>
        </ul>

        <h2>How we use your information</h2>
        <ul>
          <li>To respond to enquiries or provide services.</li>
          <li>To improve our website experience.</li>
          <li>To send updates or promotional emails if you opt in.</li>
        </ul>

        <h2>WhatsApp enquiries</h2>
        <p>
          When you contact us through WhatsApp, your messages are handled by WhatsApp under its own privacy policy. We only use your details to respond to your enquiry and arrange your order.
        </p>

        <h2>Cookies</h2>
        <p>We may use cookies to enhance user experience. You can disable cookies in your browser settings if desired.</p>

        <h2>Third-party services</h2>
        <p>We use Google Analytics to understand how visitors use our website. Google may collect data according to its own privacy policy.</p>

        <h2>Changes to this policy</h2>
        <p>We may update this Privacy Policy from time to time. The latest version will always be on this page.</p>

        <h2>Contact</h2>
        <p>
          Questions about your data? Email us at <a href={`mailto:${SITE.email}`} className="text-emerald-900 underline">{SITE.email}</a>.
        </p>
      </article>
    </>
  );
}
