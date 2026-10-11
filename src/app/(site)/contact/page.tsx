import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/catalog";
import { whatsappLink } from "@/lib/utils";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Coventry, UK",
  description:
    "Get in touch with Ananga Jewels in Coventry, UK for product enquiries and availability. Message us on WhatsApp or use the contact form.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  {
    icon: WhatsAppIcon,
    title: "WhatsApp",
    text: "Fastest reply — ask about stock, delivery or reserve a piece.",
    href: whatsappLink("Hi Ananga Jewels!"),
    cta: "Start a chat",
    accent: "bg-[#1fa855] text-white",
  },
  {
    icon: Mail,
    title: "Email",
    text: SITE.email,
    href: `mailto:${SITE.email}`,
    cta: "Send an email",
    accent: "bg-emerald-900 text-gold-300",
  },
  {
    icon: InstagramIcon,
    title: "Instagram",
    text: "See new arrivals first and send us a DM.",
    href: SITE.instagram,
    cta: "@anangajewels",
    accent: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
        eyebrow={`${SITE.locality}, ${SITE.region}`}
        title={
          <>
            We&apos;d love to <em className="text-gold-300">hear from you</em>
          </>
        }
        text="Ask about product availability, delivery across the UK, styling ideas, or reserving a piece for an occasion."
      />

      <section className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div className="grid content-start gap-4">
          {CHANNELS.map(({ icon: Icon, title, text, href, cta, accent }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener"
                className="group flex items-start gap-5 rounded-[1.5rem] border border-sand bg-white/60 p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-[0_24px_50px_-30px_rgb(7_29_22/0.4)]"
              >
                <span className={`grid size-12 shrink-0 place-items-center rounded-full ${accent}`}>
                  <Icon className="size-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-2xl font-semibold text-emerald-900">{title}</span>
                  <span className="mt-1 block text-sm text-muted">{text}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold-600">
                    {cta} <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.24}>
            <div className="flex items-center gap-3 px-2 pt-2 text-sm text-muted">
              <MapPin className="size-4 text-gold-600" /> Based in {SITE.locality}, delivering across the United Kingdom
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <p className="eyebrow">Send a message</p>
          <h2 className="mt-3 mb-8 text-4xl font-medium text-emerald-900">Write to us</h2>
          <ContactForm />
        </Reveal>
      </section>

      <section className="container-x">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-sand">
            <iframe
              title={`Map of ${SITE.locality}`}
              src="https://www.google.com/maps?q=Coventry%2C+UK&output=embed"
              loading="lazy"
              className="h-80 w-full grayscale-[40%] md:h-[26rem]"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}
