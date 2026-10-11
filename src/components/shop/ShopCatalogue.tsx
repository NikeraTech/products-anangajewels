"use client";

import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useDeferredValue, useState } from "react";
import { CATEGORIES, STYLES, categoryTitle, styleTitle } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "../ProductCard";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

type Filters = { q: string; category: string; style: string; sort: string; available: boolean };

function readFilters(sp: URLSearchParams): Filters {
  return {
    q: sp.get("q") ?? "",
    category: sp.get("category") ?? "",
    style: sp.get("style") ?? "",
    sort: sp.get("sort") ?? "featured",
    available: sp.get("available") === "1",
  };
}

function writeUrl(f: Filters) {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.category) sp.set("category", f.category);
  if (f.style) sp.set("style", f.style);
  if (f.sort !== "featured") sp.set("sort", f.sort);
  if (f.available) sp.set("available", "1");
  const qs = sp.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
}

function matches(p: Product, q: string) {
  if (!q) return true;
  const hay = [p.name, p.sku, categoryTitle(p.category), ...p.styles.map(styleTitle), p.description ?? ""].join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((term) => hay.includes(term));
}

function filterAndSort(products: Product[], f: Filters, q: string) {
  const list = products.filter(
    (p) =>
      (!f.category || p.category === f.category) &&
      (!f.style || (p.styles as string[]).includes(f.style)) &&
      (!f.available || !p.soldOut) &&
      matches(p, q),
  );
  const byStock = (a: Product, b: Product) => Number(a.soldOut) - Number(b.soldOut);
  switch (f.sort) {
    case "new":
      return list.sort((a, b) => byStock(a, b) || b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return list.sort((a, b) => byStock(a, b) || a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => byStock(a, b) || b.price - a.price);
    default:
      return list.sort((a, b) => byStock(a, b) || Number(b.featured) - Number(a.featured) || Number(b.isNew) - Number(a.isNew));
  }
}

export function ShopCatalogue({ products }: { products: Product[] }) {
  // The URL is the source of truth (replaceState keeps useSearchParams in sync), so links like
  // /shop?category=earrings work even while already on the page. Only the search box keeps
  // local state so typing never waits on a router update.
  const searchParams = useSearchParams();
  const urlFilters = readFilters(searchParams);
  const [q, setQ] = useState(urlFilters.q);
  const filters = { ...urlFilters, q };
  const deferredQ = useDeferredValue(q);

  const update = (patch: Partial<Filters>) => {
    if (patch.q !== undefined) setQ(patch.q);
    writeUrl({ ...filters, ...patch });
  };

  // Filtering 50–100 items is cheap; React Compiler memoises this for us.
  const visible = filterAndSort(products, filters, deferredQ);

  const counts: Record<string, number> = { "": products.length };
  for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;

  const usedStyles = STYLES.filter((s) => products.some((p) => p.styles.includes(s.slug)));
  const active = [
    filters.category && { key: "category", label: categoryTitle(filters.category) },
    filters.style && { key: "style", label: styleTitle(filters.style) },
    filters.available && { key: "available", label: "In stock" },
    filters.q && { key: "q", label: `“${filters.q}”` },
  ].filter(Boolean) as { key: keyof Filters; label: string }[];

  const clear = (key: keyof Filters) => update({ [key]: key === "available" ? false : "" } as Partial<Filters>);

  return (
    <div>
      {/* Category tabs */}
      <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        <div className="flex w-max gap-1 rounded-full border border-sand bg-white/60 p-1">
          {[{ slug: "", title: "All" }, ...CATEGORIES].map((c) => {
            const on = filters.category === c.slug;
            return (
              <button
                key={c.slug || "all"}
                type="button"
                onClick={() => update({ category: c.slug })}
                className={cn("relative rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5", on ? "text-ivory" : "text-muted hover:text-emerald-900")}
              >
                {on && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-emerald-900" transition={{ type: "spring", damping: 30, stiffness: 350 }} />}
                <span className="relative">
                  {c.title} <span className={cn("text-xs", on ? "text-gold-300" : "text-muted/70")}>{counts[c.slug] ?? 0}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-20 -mx-4 mt-6 border-y border-sand bg-ivory/90 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search jewellery</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={filters.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Search jhumkas, kemp, ER-16409…"
              className="w-full rounded-full border border-sand bg-white py-2.5 pr-4 pl-11 text-sm outline-none transition focus:border-gold-400 focus:ring-4 focus:ring-gold-300/30"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-muted">
              <SlidersHorizontal className="size-4" />
              <span className="sr-only">Sort by</span>
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value })}
                className="rounded-full border border-sand bg-white py-2.5 pr-8 pl-4 text-sm text-ink outline-none focus:border-gold-400"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={filters.available}
              onClick={() => update({ available: !filters.available })}
              className="flex items-center gap-2.5 rounded-full border border-sand bg-white py-2 pr-4 pl-2 text-sm"
            >
              <span className={cn("relative h-5 w-9 rounded-full transition-colors", filters.available ? "bg-emerald-700" : "bg-sand")}>
                <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-all", filters.available ? "left-[1.125rem]" : "left-0.5")} />
              </span>
              In stock only
            </button>
          </div>
        </div>

        {usedStyles.length > 0 && (
          <div className="-mx-4 mt-3 overflow-x-auto px-4 [scrollbar-width:none]">
            <div className="flex w-max gap-2">
              {usedStyles.map((s) => {
                const on = filters.style === s.slug;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => update({ style: on ? "" : s.slug })}
                    aria-pressed={on}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                      on ? "border-gold-500 bg-gold-300/40 text-emerald-900" : "border-sand text-muted hover:border-gold-400 hover:text-emerald-900",
                    )}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Result summary */}
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted" aria-live="polite">
        <span>
          <strong className="text-emerald-900">{visible.length}</strong> {visible.length === 1 ? "piece" : "pieces"}
        </span>
        {active.map((a) => (
          <button
            key={a.key}
            onClick={() => clear(a.key)}
            className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1 text-xs font-medium text-emerald-900 hover:bg-sand"
          >
            {a.label} <X className="size-3" />
          </button>
        ))}
        {active.length > 1 && (
          <button onClick={() => update({ q: "", category: "", style: "", available: false })} className="text-xs underline underline-offset-4 hover:text-emerald-900">
            Clear all
          </button>
        )}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-sand px-6 py-20 text-center">
          <p className="font-display text-3xl text-emerald-900">No pieces found</p>
          <p className="mt-2 text-muted">Try a different search or category — or ask us on WhatsApp, we may have it in stock.</p>
        </div>
      ) : (
        <motion.div layout className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} priority={i < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/** Server-rendered grid used as the Suspense fallback, so crawlers and first paint get every product. */
export function StaticCatalogue({ products }: { products: Product[] }) {
  return (
    <div className="mt-[7.5rem] grid grid-cols-1 gap-x-6 gap-y-10 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
