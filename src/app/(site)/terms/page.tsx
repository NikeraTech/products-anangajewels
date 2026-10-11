import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Ananga Jewels, covering site access, content and customer responsibilities in the UK.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero crumbs={[{ href: "/", label: "Home" }, { label: "Terms of use" }]} eyebrow="Legal" title="Terms of Use" />
      <article className="prose-legal container-x max-w-3xl py-16">
        <p>
          Welcome to <strong>{SITE.name}</strong>. By using our website, you agree to the following terms:
        </p>
        <ul>
          <li>All content on this site is for informational and promotional purposes only.</li>
          <li>You may not copy, reproduce, or distribute content without permission.</li>
          <li>We are not responsible for issues caused by the use of our website.</li>
          <li>We reserve the right to modify these terms at any time.</li>
        </ul>
      </article>
    </>
  );
}
