import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  text,
  link,
  dark = false,
  center = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  link?: { href: string; label: string };
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <Reveal className={cn("mb-10 flex flex-col gap-6 md:mb-14", center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between")}>
      <div className={cn("max-w-2xl", center && "mx-auto")}>
        <p className={cn("eyebrow", dark && "!text-gold-300")}>{eyebrow}</p>
        <h2 className={cn("mt-3 text-4xl leading-tight font-medium text-balance sm:text-5xl", dark ? "text-ivory" : "text-emerald-900")}>{title}</h2>
        {text && <p className={cn("mt-4 leading-relaxed", dark ? "text-ivory/70" : "text-muted")}>{text}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 text-sm font-semibold",
            dark ? "text-gold-200" : "text-emerald-900",
          )}
        >
          <span className="border-b border-current pb-0.5">{link.label}</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}
