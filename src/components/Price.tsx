import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

export function Price({ product, className }: { product: Product; className?: string }) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn(onSale && "text-ruby")}>{formatPrice(product.price)}</span>
      {onSale && <s className="text-[0.8em] font-normal text-muted">{formatPrice(product.compareAtPrice!)}</s>}
    </span>
  );
}
