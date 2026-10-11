"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { categoryTitle, styleTitle } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { cn, productEnquiryLink, productUrl } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";
import { Img } from "./Img";
import { Price } from "./Price";
import { StockBadge } from "./StockBadge";

type Ctx = { open: (p: Product) => void };
const QuickViewContext = createContext<Ctx>({ open: () => {} });
export const useQuickView = () => useContext(QuickViewContext);

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const open = useCallback((p: Product) => setProduct(p), []);

  return (
    <QuickViewContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>{product && <QuickViewModal key={product.id} product={product} onClose={() => setProduct(null)} />}</AnimatePresence>
    </QuickViewContext.Provider>
  );
}

function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const image = product.images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
    >
      <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative grid max-h-[92dvh] w-full max-w-5xl overflow-auto rounded-3xl bg-ivory shadow-2xl md:grid-cols-[1.25fr_1fr]"
        initial={{ y: 40, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
      >
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-ivory/90 text-emerald-900 shadow hover:bg-cream"
        >
          <X className="size-5" />
        </button>

        <div className="bg-emerald-950 p-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={image?.src} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {image && <Img src={image.src} alt={image.alt} fill sizes="(min-width:768px) 55vw, 100vw" className="object-cover" />}
              </motion.div>
            </AnimatePresence>
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => setIndex(i)}
                  aria-label={img.label ?? `Image ${i + 1}`}
                  className={cn(
                    "relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition",
                    i === index ? "ring-gold-400" : "ring-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <Img src={img.src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col p-6 md:p-8">
          <p className="eyebrow">{[categoryTitle(product.category), ...product.styles.map(styleTitle)].join(" · ")}</p>
          <h2 className="mt-3 text-4xl leading-tight font-semibold text-emerald-900">{product.name}</h2>
          {product.sku && <p className="mt-1 text-xs tracking-wider text-muted">Design {product.sku}</p>}
          <Price product={product} className="mt-5 font-display text-3xl font-semibold text-emerald-900" />
          <StockBadge product={product} className="mt-2" />
          {image?.label && (
            <p className="mt-5 text-sm text-muted">
              Option: <span className="font-semibold text-ink">{image.label}</span>
            </p>
          )}
          {product.description && <p className="mt-5 line-clamp-4 text-sm leading-relaxed text-muted">{product.description}</p>}

          <div className="mt-auto grid gap-3 pt-8">
            <a href={productEnquiryLink(product, image?.label)} target="_blank" rel="noopener" className="btn btn-whatsapp w-full">
              <WhatsAppIcon className="size-4" />
              {product.soldOut ? "Ask about restock" : "Buy on WhatsApp"}
            </a>
            <Link href={productUrl(product)} onClick={onClose} className="btn btn-outline w-full text-emerald-900 hover:!bg-cream">
              View full details <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
