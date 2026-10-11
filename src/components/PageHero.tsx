import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  text,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  crumbs: { href?: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="texture-dots relative overflow-hidden bg-emerald-900 text-ivory">
      <div className="pointer-events-none absolute -top-32 right-0 size-[28rem] rounded-full bg-gold-400/15 blur-3xl" />
      <div className="container-x relative py-14 md:py-20">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ivory/60">
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3" />}
              {c.href ? (
                <Link href={c.href} className="hover:text-gold-300">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ivory/90">
                  {c.label}
                </span>
              )}
            </span>
          ))}
        </nav>
        <Reveal>
          <p className="eyebrow mt-8 !text-gold-300">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-5xl leading-[1.05] font-medium text-balance md:text-6xl">{title}</h1>
          {text && <p className="mt-5 max-w-2xl leading-relaxed text-ivory/70">{text}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
