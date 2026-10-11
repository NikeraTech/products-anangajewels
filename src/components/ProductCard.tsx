"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { categoryTitle } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { cn, productUrl } from "@/lib/utils";
import { Img } from "./Img";
import { Price } from "./Price";
import { useQuickView } from "./QuickView";
import { CornerBadges, StockBadge } from "./StockBadge";

export function ProductCard({
  product,
  priority = false,
  tone = "light",
  className,
}: {
  product: Product;
  priority?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  const quickView = useQuickView();
  const [cover, second] = product.images;
  const href = productUrl(product);

  return (
    <article className={cn("group relative", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-emerald-950 ring-1 ring-sand/60 transition-shadow duration-500 group-hover:shadow-[0_24px_50px_-24px_rgb(7_29_22/0.55)]">
        <Link href={href} prefetch={true} aria-label={product.name} className="absolute inset-0">
          {cover && (
            <Img
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
              priority={priority}
              className={cn(
                "object-cover transition-all duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]",
                second && "group-hover:opacity-0",
                product.soldOut && "grayscale-[60%]",
              )}
            />
          )}
          {second && (
            <Img
              src={second.src}
              alt=""
              fill
              sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
              className="scale-[1.06] object-cover opacity-0 transition-all duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </Link>

        <CornerBadges product={product} />

        {product.images.length > 1 && (
          <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-ivory/90 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-900 backdrop-blur">
            {product.images.length} options
          </span>
        )}

        <button
          type="button"
          onClick={() => quickView.open(product)}
          className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 rounded-full bg-ivory/95 py-2.5 text-xs font-semibold tracking-wider text-emerald-900 uppercase opacity-0 shadow-lg backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 max-md:hidden"
        >
          <Eye className="size-4" /> Quick view
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <p className={cn("text-[0.68rem] font-semibold tracking-[0.18em] uppercase", dark ? "text-gold-300" : "text-gold-600")}>{categoryTitle(product.category)}</p>
          <h3 className={cn("mt-1 truncate font-display text-xl leading-tight font-semibold", dark ? "text-ivory" : "text-emerald-900")}>
            <Link href={href} prefetch={true} className={dark ? "hover:text-gold-300" : "hover:text-gold-600"}>
              {product.name}
            </Link>
          </h3>
          <StockBadge product={product} className="mt-1.5" />
        </div>
        <Price product={product} className={cn("shrink-0 pt-4 text-base font-semibold", dark ? "text-gold-200" : "text-emerald-900")} />
      </div>
    </article>
  );
}
