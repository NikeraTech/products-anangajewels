import { ArrowRight, Gem, Sparkles, Truck, Heart } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Img } from "@/components/Img";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/catalog";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us | Coventry, UK",
  description: "Learn about Ananga Jewels, a Coventry-based UK brand offering handpicked Indian imitation jewellery for every occasion.",
  alternates: { canonical: "/about" },
};

const REASONS = [
  { icon: Gem, title: "Exclusive handpicked collection", text: "Small batches, chosen piece by piece." },
  { icon: Sparkles, title: "Inspired by Indian craftsmanship", text: "Temple, kundan, kemp and antique designs." },
  { icon: Truck, title: "Reliable UK-wide delivery", text: "Packed with care and sent from Coventry." },
  { icon: Heart, title: "Customer satisfaction first", text: "Real people, real answers, every time." },
];

export default async function AboutPage() {
  const products = await getProducts();
  const gallery = products.filter((p) => !p.soldOut).slice(0, 4).map((p) => p.images[0]);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Our story" }]}
        eyebrow={SITE.tagline}
        title={
          <>
            About <em className="text-gold-300">Ananga Jewels</em>
          </>
        }
        text="A Coventry-based jewellery brand bringing handpicked Indian imitation pieces to customers across the United Kingdom."
      />

      <section className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">Our story</p>
          <h2 className="mt-3 text-4xl leading-tight font-medium text-emerald-900 sm:text-5xl">
            A love for <em className="text-gold-600">timeless</em> Indian design
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Welcome to <strong className="text-emerald-900">{SITE.name}</strong>, a Coventry-based UK brand bringing handpicked Indian imitation jewellery to customers across the United Kingdom.
            </p>
            <p>
              {SITE.name} was founded by {SITE.founder} with a love for timeless Indian designs. Each piece is curated to blend traditional artistry with modern style for weddings, festivals and everyday wear.
            </p>
          </div>

          <div className="mt-10 rounded-[1.75rem] bg-emerald-900 p-8 text-ivory">
            <p className="eyebrow !text-gold-300">Our mission</p>
            <p className="mt-3 font-display text-2xl leading-snug">
              To offer beautiful, high-quality jewellery at affordable prices, delivered with care throughout the UK.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
          {gallery.map(
            (img, i) =>
              img && (
                <Reveal key={img.src} delay={i * 0.1} className={i % 2 ? "mt-12" : ""}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-emerald-950">
                    <Img src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 25vw, 45vw" className="object-cover transition-transform duration-[1.4s] hover:scale-110" />
                  </div>
                </Reveal>
              ),
          )}
        </div>
      </section>

      <section className="texture-dots bg-emerald-900 py-20 text-ivory md:py-28">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow !text-gold-300">Why choose us</p>
            <h2 className="mt-3 text-4xl font-medium sm:text-5xl">Chosen with care, delivered with love</h2>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="h-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-7 transition hover:border-gold-400/50">
                  <Icon className="size-7 text-gold-300" />
                  <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-ivory/65">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x pt-20 text-center md:pt-28">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-4xl font-medium text-emerald-900 sm:text-5xl">Find a piece you&apos;ll love</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn btn-primary">
              Shop the collection <ArrowRight className="size-4" />
            </Link>
            <Link href="/contact" className="btn btn-outline text-emerald-900 hover:!bg-cream">
              Contact us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
