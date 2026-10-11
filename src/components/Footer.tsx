import { cacheLife } from "next/cache";
import { Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, SITE } from "@/lib/catalog";
import { whatsappLink } from "@/lib/utils";
import { Logo } from "./Header";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "./icons";

export function Footer() {
  return (
    <footer className="texture-dots relative mt-24 overflow-hidden bg-emerald-950 text-ivory/80">
      <div className="gold-rule" />
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm text-sm leading-relaxed">
              Handpicked Indian imitation jewellery from Coventry, delivered with care across the United Kingdom.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { href: SITE.instagram, label: "Instagram", Icon: InstagramIcon },
                { href: SITE.facebook, label: "Facebook", Icon: FacebookIcon },
                { href: whatsappLink(), label: "WhatsApp", Icon: WhatsAppIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-white/15 text-gold-200 transition hover:border-gold-400 hover:bg-gold-400 hover:text-emerald-950"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Shop">
            <Link href="/shop">All jewellery</Link>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/shop?category=${c.slug}`}>
                {c.title}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Ananga">
            <Link href="/about">Our story</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms of use</Link>
          </FooterColumn>

          <FooterColumn title="Get in touch">
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2">
              <Mail className="size-4 text-gold-400" /> {SITE.email}
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-2">
              <WhatsAppIcon className="size-4 text-gold-400" /> WhatsApp us
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-gold-400" /> {SITE.locality}, {SITE.region}
            </span>
          </FooterColumn>
        </div>

        <div className="gold-rule mt-14 opacity-40" />

        <div className="mt-8 flex flex-col gap-6 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between">
          <p>© <CopyrightYear /> {SITE.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="https://pdf-lab.com" target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-ivory">
              Document partner
              <Image src="/brand/pdf-lab-logo.png" alt="PDF Lab" width={74} height={20} className="h-5 w-auto rounded-sm bg-white/90 px-1" />
            </a>
            <a href="https://www.nikera.co.uk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ivory">
              <Image src="/brand/nikera.png" alt="" width={19} height={16} />
              Designed &amp; developed by <strong className="font-semibold text-ivory/80">Nikera Technologies</strong>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow !text-gold-300">{title}</h3>
      <div className="mt-5 grid gap-3 text-sm [&_a]:transition-colors [&_a:hover]:text-gold-200">{children}</div>
    </div>
  );
}

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
