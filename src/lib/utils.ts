import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SITE } from "./catalog";
import type { Product } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
export const formatPrice = (n: number) => gbp.format(n);

export const absoluteUrl = (path = "/") => new URL(path, SITE.url).toString();

export const productUrl = (p: Pick<Product, "slug">) => `/shop/${p.slug}`;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function productEnquiryLink(p: Product, option?: string) {
  const ref = [p.sku, option].filter(Boolean).join(" · ");
  const lines = p.soldOut
    ? [`Hi, I'm interested in *${p.name}*${ref ? ` (${ref})` : ""}. Please let me know if it comes back in stock.`]
    : [`Hi, I would like to buy *${p.name}*${ref ? ` (${ref})` : ""} — ${formatPrice(p.price)}.`];
  lines.push(absoluteUrl(productUrl(p)));
  return whatsappLink(lines.join("\n"));
}

export type StockState = "sold-out" | "low" | "in-stock";
export function stockState(p: Product): StockState {
  if (p.soldOut) return "sold-out";
  return p.quantity === 1 ? "low" : "in-stock";
}
