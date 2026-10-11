import { ArrowRight, Gem, HeartHandshake, Quote, Sparkles, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { Img } from "@/components/Img";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CATEGORIES, SITE, STYLES } from "@/lib/catalog";
import { getProducts, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} | Indian Imitation Jewellery in Coventry, UK` },
  description: SITE.description,
  alternates: { canonical: "/" },
};

const VALUES = [
  { icon: Gem, title: "Handpicked pieces", text: "Every design is chosen by hand for its craftsmanship and finish." },
  { icon: Sparkles, title: "Inspired by India", text: "Temple, kundan, kemp and antique styles rooted in tradition." },
  { icon: Truck, title: "UK-wide delivery", text: "Packed with care in Coventry and delivered across the UK." },
  { icon: HeartHandshake, title: "Personal service", text: "Talk to us directly on WhatsApp — no bots, no queues." },
];

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const available = products.filter((p) => !p.soldOut);

  const newArrivals = (() => {
    const featured = available.filter((p) => p.featured || p.isNew);
    return (featured.length >= 4 ? featured : available).slice(0, 12);
  })();
  const shown = new Set(newArrivals.map((p) => p.id));
  const earrings = available.filter((p) => p.category === "earrings" && !shown.has(p.id)).slice(0, 10);

  const categories = CATEGORIES.map((c) => {
    const items = products.filter((p) => p.category === c.slug);
    return { ...c, count: items.length, cover: (items.find((p) => !p.soldOut) ?? items[0])?.images[0] };
  }).filter((c) => c.count > 0);

  const storyImage = products.find((p) => p.styles.includes("temple") && p.category === "necklace-sets")?.images[0];

  return (
    <>
      <Hero title={settings.heroTitle} text={settings.heroText} images={settings.heroImages} inStock={available.length} />

      {/* Shop by category */}
      <section className="container-x py-20 md:py-28">
        <SectionHeading
          eyebrow="Shop by category"
          title="Find your next favourite"
          text="From statement chandbalis to bridal necklace sets — browse by what you're looking for."
          link={{ href: "/shop", label: "View all jewellery" }}
        />
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-emerald-950"
              >
                {c.cover && (
                  <Img
                    src={c.cover.src}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover opacity-90 transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-ivory md:p-7">
                  <p className="text-[0.65rem] tracking-[0.2em] text-gold-300 uppercase">{c.count} designs</p>
                  <h3 className="mt-1 text-3xl font-medium md:text-4xl">{c.title}</h3>
                  <p className="mt-2 hidden text-sm text-ivory/70 md:block">{c.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase opacity-0 transition-all duration-500 group-hover:opacity-100">
                    Explore <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="bg-cream/60 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Just landed"
            title={
              <>
                New <em className="text-gold-600">arrivals</em>
              </>
            }
            text="Fresh designs added to the collection. Pieces are limited — message us to reserve yours."
            link={{ href: "/shop?sort=new", label: "Shop new in" }}
          />
          <ProductCarousel products={newArrivals} />
        </div>
      </section>

      {/* Styles marquee */}
      <section aria-label="Shop by style" className="overflow-hidden border-y border-sand py-8">
        <div className="flex w-max animate-marquee gap-12 [animation-duration:60s] hover:[animation-play-state:paused]">
          {[...STYLES, ...STYLES].map((s, i) => (
            <Link
              key={i}
              href={`/shop?style=${s.slug}`}
              className="flex items-center gap-12 font-display text-4xl text-emerald-900/80 italic transition-colors hover:text-gold-600 md:text-6xl"
            >
              {s.title}
              <Sparkles className="size-6 text-gold-400 not-italic" />
            </Link>
          ))}
        </div>
      </section>

      {/* Founder story */}
      <section className="container-x grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2.5rem] bg-emerald-950">
            {storyImage && <Img src={storyImage.src} alt={storyImage.alt} fill sizes="(min-width:1024px) 45vw, 90vw" className="object-cover" />}
          </div>
          <div className="absolute -right-2 -bottom-6 max-w-[15rem] rounded-2xl bg-emerald-900 p-5 text-ivory shadow-xl md:-right-8">
            <p className="font-display text-4xl text-gold-300">Born</p>
            <p className="text-sm text-ivory/75">from a love of timeless Indian design.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">Our story</p>
          <h2 className="mt-3 text-4xl leading-tight font-medium text-emerald-900 sm:text-5xl">
            Traditional artistry, <em className="text-gold-600">modern style</em>
          </h2>
          <Quote className="mt-8 size-10 text-gold-400" />
          <blockquote className="mt-3 font-display text-2xl leading-snug text-ink/85 italic sm:text-3xl">
            Each piece is curated to blend traditional artistry with modern style — for weddings, festivals and everyday wear.
          </blockquote>
          <p className="mt-6 text-sm font-semibold tracking-wider text-emerald-900 uppercase">
            Founded by {SITE.founder} <span className="font-normal text-muted normal-case">in Coventry</span>
          </p>
          <p className="mt-6 leading-relaxed text-muted">
            We aim to offer beautiful, high-quality jewellery at affordable prices, delivered with care throughout the UK.
          </p>
          <Link href="/about" className="btn btn-primary mt-8">
            Read our story <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </section>

      {/* Earrings — dark band */}
      {earrings.length >= 3 && (
        <section className="texture-dots bg-emerald-900 py-20 md:py-28">
          <div className="container-x">
            <SectionHeading
              dark
              eyebrow="Statement earrings"
              title={
                <>
                  Chandbalis, jhumkas &amp; <em className="text-gold-300">more</em>
                </>
              }
              text="Antique, kundan and kemp earrings to finish every festive look."
              link={{ href: "/shop?category=earrings", label: "Shop earrings" }}
            />
            <ProductCarousel products={earrings} dark />
          </div>
        </section>
      )}

      {/* Values */}
      <section className="container-x py-20 md:py-28">
        <SectionHeading center eyebrow="Why Ananga" title="Jewellery chosen with care" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="group h-full rounded-[1.75rem] border border-sand bg-white/50 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold-300 hover:shadow-[0_24px_50px_-30px_rgb(7_29_22/0.4)]">
                <span className="grid size-12 place-items-center rounded-full bg-emerald-900 text-gold-300 transition-transform duration-500 group-hover:rotate-12">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold text-emerald-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="container-x">
        <Reveal>
          <div className="texture-dots relative overflow-hidden rounded-[2.5rem] bg-emerald-950 px-6 py-16 text-center text-ivory md:px-16 md:py-20">
            <div className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-gold-400/20 blur-3xl" />
            <p className="eyebrow relative !text-gold-300">Looking for something specific?</p>
            <h2 className="relative mx-auto mt-4 max-w-3xl text-4xl leading-tight font-medium sm:text-5xl">
              Tell us the occasion and we&apos;ll help you find the perfect piece
            </h2>
            <div className="relative mt-10 flex flex-wrap justify-center gap-3">
              <a href={whatsappLink("Hi Ananga Jewels, I'm looking for jewellery for an occasion.")} target="_blank" rel="noopener" className="btn btn-whatsapp">
                <WhatsAppIcon className="size-4" /> Message on WhatsApp
              </a>
              <a href={SITE.instagram} target="_blank" rel="noopener" className="btn btn-outline text-ivory">
                <InstagramIcon className="size-4" /> @anangajewels
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
