import type { Product } from "@/lib/types";
import { cn, stockState } from "@/lib/utils";

export function StockBadge({ product, className }: { product: Product; className?: string }) {
  const state = stockState(product);
  const label = { "sold-out": "Sold out", low: "Only 1 left", "in-stock": "In stock" }[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        state === "sold-out" && "text-muted",
        state === "low" && "text-ruby",
        state === "in-stock" && "text-emerald-500",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          state === "sold-out" && "bg-muted",
          state === "low" && "animate-pulse bg-ruby",
          state === "in-stock" && "bg-emerald-500",
        )}
      />
      {label}
    </span>
  );
}

export function CornerBadges({ product }: { product: Product }) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  return (
    <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
      {product.soldOut ? (
        <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[0.65rem] font-semibold tracking-widest text-ivory uppercase backdrop-blur">
          Sold out
        </span>
      ) : product.isNew ? (
        <span className="rounded-full bg-gold-300 px-2.5 py-1 text-[0.65rem] font-semibold tracking-widest text-emerald-950 uppercase">
          New
        </span>
      ) : null}
      {onSale && !product.soldOut && (
        <span className="rounded-full bg-ruby px-2.5 py-1 text-[0.65rem] font-semibold tracking-widest text-ivory uppercase">
          Sale
        </span>
      )}
    </div>
  );
}
