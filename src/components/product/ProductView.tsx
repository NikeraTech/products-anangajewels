"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Gem, HeartHandshake, Mail, MapPin, Share2, Truck } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SITE, categoryTitle, styleTitle } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { absoluteUrl, cn, productEnquiryLink, productUrl } from "@/lib/utils";
import { WhatsAppIcon } from "../icons";
import { Img } from "../Img";
import { Price } from "../Price";
import { StockBadge } from "../StockBadge";
import { ProductGallery } from "./ProductGallery";

export function ProductView({ product, deliveryInfo, careInfo }: { product: Product; deliveryInfo: string; careInfo: string }) {
  const [index, setIndex] = useState(0);
  const onIndexChange = useCallback((i: number) => setIndex(i), []);
  const option = product.images[index]?.label;
  const hasOptions = product.images.length > 1;
  const buyRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  // Mobile sticky buy bar appears once the main buttons scroll out of view.
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const enquiry = productEnquiryLink(product, option);
  const share = async () => {
    const url = absoluteUrl(productUrl(product));
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: `${product.name} — ${SITE.name}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  const details = [
    ["Design code", product.sku],
    ["Category", categoryTitle(product.category)],
    ["Style", product.styles.map(styleTitle).join(", ")],
    ["Options", hasOptions ? `${product.images.length} colour options` : ""],
    ["Dimensions", product.details?.dimensions],
    ["Weight", product.details?.weight],
    ["Finish", product.details?.finish],
    ["Occasion", product.details?.occasion],
  ].filter(([, v]) => v) as [string, string][];

  const description =
    product.description ||
    `A handpicked ${product.styles[0] ? `${styleTitle(product.styles[0]).toLowerCase()} ` : ""}design from our ${categoryTitle(product.category).toLowerCase()} collection — chosen for its detail and finish, and perfect for weddings, festivals and celebrations. The photos show the actual piece; message us for a closer look or a video.`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ProductGallery product={product} index={index} onIndexChange={onIndexChange} />
      </div>

      <div>
        <p className="eyebrow flex flex-wrap gap-x-2">
          <Link href={`/shop?category=${product.category}`} className="hover:text-emerald-900">
            {categoryTitle(product.category)}
          </Link>
          {product.styles.map((s) => (
            <span key={s} className="flex gap-2">
              <span aria-hidden>·</span>
              <Link href={`/shop?style=${s}`} className="hover:text-emerald-900">
                {styleTitle(s)}
              </Link>
            </span>
          ))}
        </p>
        <h1 className="mt-3 text-4xl leading-[1.05] font-semibold text-emerald-900 sm:text-5xl">{product.name}</h1>
        {product.sku && <p className="mt-2 text-xs tracking-[0.18em] text-muted uppercase">Design {product.sku}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Price product={product} className="font-display text-4xl font-semibold text-emerald-900" />
          <StockBadge product={product} className="text-sm" />
        </div>

        <div className="gold-rule my-7" />

        <p className="leading-relaxed text-muted">{description}</p>

        {hasOptions && (
          <div className="mt-8">
            <p className="text-sm font-medium text-ink">
              Colour option{option ? ":" : "s"} <span className="text-gold-600">{option}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={i === index}
                  aria-label={img.label ?? `Option ${i + 1}`}
                  title={img.label}
                  className={cn(
                    "relative size-16 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-ivory transition",
                    i === index ? "ring-gold-500" : "ring-sand hover:ring-gold-300",
                  )}
                >
                  <Img src={img.src} alt="" fill sizes="64px" className="scale-150 object-cover" />
                  {i === index && (
                    <span className="absolute inset-0 grid place-items-center bg-emerald-950/30">
                      <Check className="size-5 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={buyRef} className="mt-8 flex gap-3">
          <a href={enquiry} target="_blank" rel="noopener" className="btn btn-whatsapp flex-1 !py-4 text-base">
            <WhatsAppIcon className="size-5" />
            {product.soldOut ? "Ask about restock" : "Buy on WhatsApp"}
          </a>
          <button type="button" onClick={share} className="btn btn-outline !px-4 text-emerald-900 hover:!bg-cream" aria-label="Share this piece">
            <Share2 className="size-5" />
          </button>
        </div>
        <a
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Enquiry: ${product.name} ${product.sku}`)}&body=${encodeURIComponent(absoluteUrl(productUrl(product)))}`}
          className="mt-3 inline-flex items-center gap-2 text-sm text-muted underline-offset-4 hover:text-emerald-900 hover:underline"
        >
          <Mail className="size-4" /> Prefer email? Send us an enquiry
        </a>

        <ul className="mt-8 grid grid-cols-2 gap-3">
          {[
            { icon: Truck, text: "UK-wide delivery" },
            { icon: MapPin, text: "Dispatched from Coventry" },
            { icon: Gem, text: "Handpicked quality" },
            { icon: HeartHandshake, text: "Personal service" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 rounded-2xl bg-cream/70 px-4 py-3 text-sm text-emerald-900">
              <Icon className="size-4 shrink-0 text-gold-600" /> {text}
            </li>
          ))}
        </ul>

        <div className="mt-8 divide-y divide-sand border-y border-sand">
          <Accordion title="Product details" defaultOpen>
            <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2.5 text-sm">
              {details.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Accordion>
          <Accordion title="Delivery & how to buy">
            <p className="text-sm leading-relaxed text-muted">{deliveryInfo}</p>
          </Accordion>
          <Accordion title="Caring for your jewellery">
            <p className="text-sm leading-relaxed text-muted">{careInfo}</p>
          </Accordion>
        </div>
      </div>

      <AnimatePresence>
        {showBar && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-ivory/95 px-4 py-3 shadow-[0_-12px_30px_-20px_rgb(0_0_0/0.4)] backdrop-blur-xl lg:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg leading-tight font-semibold text-emerald-900">{product.name}</p>
                <Price product={product} className="text-sm font-semibold text-emerald-900" />
              </div>
              <a href={enquiry} target="_blank" rel="noopener" className="btn btn-whatsapp !px-5 !py-3">
                <WhatsAppIcon className="size-4" /> {product.soldOut ? "Ask" : "Buy"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-5 text-left">
        <span className="font-display text-xl font-semibold text-emerald-900">{title}</span>
        <ChevronDown className={cn("size-5 text-gold-600 transition-transform duration-300", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
