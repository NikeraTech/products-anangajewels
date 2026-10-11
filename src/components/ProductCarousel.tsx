"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

export function ProductCarousel({ products, dark = false }: { products: Product[]; dark?: boolean }) {
  const [ref, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", dragFree: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
    setProgress(Math.max(0, Math.min(1, api.scrollProgress())));
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const frame = requestAnimationFrame(update);
    api.on("select", update).on("reInit", update).on("scroll", update);
    return () => {
      cancelAnimationFrame(frame);
      api.off("select", update).off("reInit", update).off("scroll", update);
    };
  }, [api, update]);

  const arrow = cn(
    "grid size-11 place-items-center rounded-full border transition disabled:opacity-30",
    dark ? "border-white/20 text-ivory hover:bg-white/10" : "border-sand text-emerald-900 hover:bg-cream",
  );

  return (
    <div>
      <div ref={ref} className="overflow-hidden">
        <div className="-ml-5 flex touch-pan-y">
          {products.map((p) => (
            <div key={p.id} className="min-w-0 shrink-0 basis-[78%] pl-5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <ProductCard product={p} tone={dark ? "dark" : "light"} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center gap-6">
        <div className={cn("relative h-px flex-1 overflow-hidden", dark ? "bg-white/15" : "bg-sand")}>
          <div className="absolute inset-y-0 left-0 bg-gold-500 transition-[width] duration-200" style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
        <div className="flex gap-2">
          <button className={arrow} onClick={() => api?.scrollPrev()} disabled={!canPrev} aria-label="Previous">
            <ChevronLeft className="size-5" />
          </button>
          <button className={arrow} onClick={() => api?.scrollNext()} disabled={!canNext} aria-label="Next">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
