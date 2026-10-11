"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Img } from "../Img";
import { CornerBadges } from "../StockBadge";

export function ProductGallery({
  product,
  index,
  onIndexChange,
}: {
  product: Product;
  index: number;
  onIndexChange: (i: number) => void;
}) {
  const [ref, api] = useEmblaCarousel({ loop: product.images.length > 1 });
  const [lightbox, setLightbox] = useState(false);
  const images = product.images;

  useEffect(() => {
    if (!api) return;
    const onSelect = () => onIndexChange(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onIndexChange]);

  useEffect(() => {
    if (api && api.selectedScrollSnap() !== index) api.scrollTo(index);
  }, [api, index]);

  return (
    <div>
      <div className="group relative overflow-hidden rounded-[1.75rem] bg-emerald-950">
        <div ref={ref} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {images.map((img, i) => (
              <div key={img.src} className="relative aspect-[4/3] min-w-0 shrink-0 basis-full">
                <ZoomImage src={img.src} alt={img.alt} priority={i === 0} onOpen={() => setLightbox(true)} />
              </div>
            ))}
          </div>
        </div>

        <CornerBadges product={product} />

        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-ivory/90 text-emerald-900 shadow backdrop-blur transition hover:scale-105"
          aria-label="View full screen"
        >
          <Expand className="size-4" />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-emerald-900 opacity-0 shadow transition group-hover:opacity-100 max-md:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              aria-label="Next image"
              className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-emerald-900 opacity-0 shadow transition group-hover:opacity-100 max-md:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 md:hidden">
              {images.map((_, i) => (
                <span key={i} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-gold-300" : "w-1.5 bg-ivory/60")} />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 hidden grid-cols-5 gap-3 md:grid">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={img.label ? `Show ${img.label}` : `Show image ${i + 1}`}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl bg-emerald-950 ring-2 ring-offset-2 ring-offset-ivory transition",
                i === index ? "ring-gold-500" : "ring-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Img src={img.src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        open={lightbox}
        close={() => setLightbox(false)}
        index={index}
        on={{ view: ({ index: i }) => onIndexChange(i) }}
        slides={images.map((img) => ({ src: img.src, alt: img.alt }))}
        plugins={[Zoom, Counter]}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        carousel={{ finite: images.length <= 1 }}
        render={images.length <= 1 ? { buttonPrev: () => null, buttonNext: () => null } : undefined}
        styles={{ container: { backgroundColor: "rgb(7 29 22 / 0.97)" } }}
      />
    </div>
  );
}

/** Desktop hover-to-magnify: the image scales from the pointer position. */
function ZoomImage({ src, alt, priority, onOpen }: { src: string; alt: string; priority: boolean; onOpen: () => void }) {
  const [origin, setOrigin] = useState<string | null>(null);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Enlarge: ${alt}`}
      className="absolute inset-0 cursor-zoom-in overflow-hidden"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      onPointerLeave={() => setOrigin(null)}
    >
      <Img
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={90}
        sizes="(min-width:1024px) 55vw, 100vw"
        className="object-cover transition-transform duration-300 ease-out"
        style={origin ? { transform: "scale(1.8)", transformOrigin: origin } : undefined}
      />
    </button>
  );
}
