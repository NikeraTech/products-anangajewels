// Shared catalogue vocabulary used by the site, the CMS schema and the legacy migration.

export const CATEGORIES = [
  { slug: "earrings", title: "Earrings", blurb: "Chandbalis, jhumkas and statement studs" },
  { slug: "necklace-sets", title: "Necklace Sets", blurb: "Bridal and festive sets with matching earrings" },
  { slug: "bangles", title: "Bangles", blurb: "Temple and antique bangles to stack and pair" },
  { slug: "rings", title: "Rings", blurb: "Finger rings with traditional motifs" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const STYLES = [
  { slug: "temple", title: "Temple" },
  { slug: "kundan", title: "Kundan" },
  { slug: "kemp", title: "Kemp" },
  { slug: "antique", title: "Antique" },
  { slug: "american-diamond", title: "American Diamond" },
  { slug: "german-silver", title: "German Silver" },
  { slug: "oxidised", title: "Oxidised" },
  { slug: "western", title: "Western" },
] as const;

export type StyleSlug = (typeof STYLES)[number]["slug"];

export function categoryTitle(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.title ?? "Jewellery";
}

export function styleTitle(slug: string) {
  return STYLES.find((s) => s.slug === slug)?.title ?? slug;
}

export const SITE = {
  name: "Ananga Jewels",
  tagline: "Born from Beauty",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.anangajewels.com",
  description:
    "Handpicked Indian imitation jewellery in Coventry, UK. Discover new arrivals, chandbalis, jhumkas and more, with delivery across the United Kingdom.",
  keywords: [
    "Indian imitation jewellery",
    "Coventry jewellery",
    "UK jewellery",
    "Indian earrings",
    "jhumkas",
    "chandbalis",
    "necklace sets",
    "temple jewellery",
    "Ananga Jewels",
  ],
  whatsapp: "447879818251",
  phone: "+447879818251",
  email: "info@anangajewels.com",
  instagram: "https://instagram.com/anangajewels",
  facebook: "https://facebook.com/anangajewels",
  locality: "Coventry",
  region: "West Midlands",
  founder: "Keerthana",
} as const;
