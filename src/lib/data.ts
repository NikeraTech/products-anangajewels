import { cacheLife, cacheTag } from "next/cache";
import { defineQuery } from "next-sanity";
import localProducts from "@/data/products.json";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import type { Product, SiteSettings } from "./types";

const PRODUCTS_QUERY = defineQuery(`*[_type == "product" && defined(slug.current) && count(images) > 0]
  | order(coalesce(publishedAt, _createdAt) desc) {
    "id": _id,
    "slug": slug.current,
    "sku": coalesce(sku, ""),
    name,
    "price": coalesce(price, 0),
    compareAtPrice,
    "quantity": coalesce(quantity, 0),
    "isNew": coalesce(isNew, false),
    "soldOut": coalesce(soldOut, false) || coalesce(quantity, 0) <= 0,
    "featured": coalesce(featured, false),
    "category": coalesce(category, "earrings"),
    "styles": coalesce(styles, []),
    description,
    details,
    "images": images[defined(asset)]{ "src": asset->url, "alt": coalesce(alt, ^.name), label },
    "createdAt": coalesce(publishedAt, _createdAt)
  }`);

const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  announcement, heroTitle, heroText, deliveryInfo, careInfo,
  "heroImages": heroImages[defined(asset)]{ "src": asset->url, "alt": coalesce(alt, "") }
}`);

const DEFAULT_SETTINGS: SiteSettings = {
  announcement: [
    "Delivery across the United Kingdom",
    "Handpicked Indian jewellery from Coventry",
    "Message us on WhatsApp to reserve a piece",
  ],
  heroTitle: "Jewellery born from beauty",
  heroText:
    "Hello, I'm Keerthana, founder of Ananga Jewels. We bring handpicked Indian imitation jewellery to Coventry and deliver across the United Kingdom. Explore unique designs for weddings, festivals and everyday wear.",
  heroImages: [
    { src: "/products/TEMPLE-NECKLACE-SET-NS-14444RG-275-OM-12-QTY-2.jpg", alt: "Temple necklace set with matching jhumkas" },
    { src: "/products/ANTIQUE-EARRING-ER-16409RU-70-DH-25-QTY-2.jpg", alt: "Ruby antique chandelier earrings" },
    { src: "/products/KUNDAN-EARRING-ER-16454RA-71-DH-25-QTY-2.jpg", alt: "Kundan chandbalis" },
  ],
  deliveryInfo:
    "We're based in Coventry and deliver across the United Kingdom. Message us on WhatsApp to confirm availability, delivery cost and timing — we'll reserve the piece for you while we arrange payment and dispatch.",
  careInfo:
    "Store each piece separately in a dry pouch or box. Keep away from water, perfume, lotions and hairspray, and put your jewellery on last. Wipe gently with a soft dry cloth after wearing.",
};

/** Mark whether a product is sold out from its stock as well as the flag. */
function normalise(p: Product): Product {
  return { ...p, soldOut: p.soldOut || p.quantity <= 0 };
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("max");
  cacheTag("products");

  if (!isSanityConfigured) {
    return (localProducts as Product[])
      .map(normalise)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const products = await client.fetch<Product[]>(PRODUCTS_QUERY);
  return products.map(normalise);
}

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 8) {
  const products = await getProducts();
  const score = (p: Product) =>
    (p.category === product.category ? 2 : 0) + p.styles.filter((s) => product.styles.includes(s)).length;
  return products
    .filter((p) => p.id !== product.id && !p.soldOut)
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => p);
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("max");
  cacheTag("settings");

  if (!isSanityConfigured) return DEFAULT_SETTINGS;
  const s = await client.fetch<Partial<SiteSettings> | null>(SETTINGS_QUERY);
  return {
    announcement: s?.announcement?.length ? s.announcement : DEFAULT_SETTINGS.announcement,
    heroTitle: s?.heroTitle || DEFAULT_SETTINGS.heroTitle,
    heroText: s?.heroText || DEFAULT_SETTINGS.heroText,
    heroImages: s?.heroImages?.length ? s.heroImages : DEFAULT_SETTINGS.heroImages,
    deliveryInfo: s?.deliveryInfo || DEFAULT_SETTINGS.deliveryInfo,
    careInfo: s?.careInfo || DEFAULT_SETTINGS.careInfo,
  };
}
