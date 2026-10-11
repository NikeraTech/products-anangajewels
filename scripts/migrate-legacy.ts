/**
 * One-off: converts the legacy PHP site's products.json into the typed catalogue in data/products.json.
 * Usage: npx tsx scripts/migrate-legacy.ts ../anangajewels/products.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import type { CategorySlug, StyleSlug } from "../src/lib/catalog";
import { categoryTitle, styleTitle } from "../src/lib/catalog";
import type { Product } from "../src/lib/types";

type Legacy = {
  images?: string[];
  file?: string;
  name?: string;
  price?: string | number;
  new?: boolean;
  sold?: boolean;
  quantity?: number;
};

const source = process.argv[2] ?? "../anangajewels/products.json";
const legacy: Legacy[] = JSON.parse(readFileSync(source, "utf8"));

// Order matters: "finger-ring" must win before the earring rules see "ring".
const CATEGORY_RULES: [CategorySlug, RegExp][] = [
  ["rings", /finger[- ]ring|\bfr-\d/],
  ["bangles", /bangle|bangel|\bbg-\d/],
  ["necklace-sets", /necklace|\bns-\d/],
  ["earrings", /ear ?ring|jhumka|chandbali|stud|\ber-\d/],
];

const STYLE_RULES: [StyleSlug, string[]][] = [
  ["temple", ["temple"]],
  ["kundan", ["kundan"]],
  ["kemp", ["kemp"]],
  ["antique", ["antique"]],
  ["american-diamond", ["ad-", "american diamond", "white rhodium"]],
  ["german-silver", ["german-silver", "german silver"]],
  ["oxidised", ["oxidized", "oxidised", "tribal"]],
  ["western", ["western", "boho"]],
];

// Only colour codes we are confident about; unknown codes get no label.
const COLOUR_CODES: Record<string, string> = {
  RU: "Ruby",
  RG: "Ruby Green",
  RGW: "Ruby Green White",
  PK: "Pink",
  W: "White",
  GR: "Green",
  BL: "Blue",
  GO: "Gold",
  YE: "Yellow",
  MU: "Multicolour",
  MR: "Maroon",
};

const isPlaceholderName = (n: string) => /^[A-Z0-9 -]+$/.test(n) || /^ear ?rings?$/i.test(n); // "KEMP-EARRING", "NS", "Ear Ring"

function haystack(p: Legacy) {
  return ` ${[p.name, p.file, ...(p.images ?? [])].join(" ")} `.toLowerCase();
}

function skuOf(file: string) {
  const m = file.match(/\b(ER|NS|BG|FR)-(\d+)/i);
  return m ? `${m[1].toUpperCase()}-${m[2]}` : "";
}

function colourOf(file: string) {
  const m = file.match(/\b(?:ER|NS|BG|FR)-\d+([A-Za-z]+)-/);
  return m ? COLOUR_CODES[m[1].toUpperCase()] : undefined;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const used = new Set<string>();
const base = Date.UTC(2025, 10, 1);

const products: Product[] = legacy.map((p, index) => {
  const hay = haystack(p);
  const files = p.images?.length ? p.images : p.file ? [p.file] : [];
  const category = CATEGORY_RULES.find(([, re]) => re.test(hay))?.[0] ?? "earrings";
  const styles = STYLE_RULES.filter(([, n]) => n.some((x) => hay.includes(x))).map(([s]) => s);

  const rawName = (p.name ?? "").trim();
  const name =
    !rawName || isPlaceholderName(rawName)
      ? [styles[0] ? styleTitle(styles[0]) : "", categoryTitle(category).replace(/s$/, "")].filter(Boolean).join(" ")
      : rawName;

  const sku = skuOf(p.file ?? files[0] ?? "") || `AJ-${index + 1}`;
  let slug = slugify(`${name} ${sku}`);
  while (used.has(slug)) slug += "-x";
  used.add(slug);

  const quantity = Number(p.quantity ?? 0);
  return {
    id: `legacy-${index}`,
    slug,
    sku,
    name,
    price: Number(p.price ?? 0),
    quantity,
    isNew: Boolean(p.new),
    soldOut: Boolean(p.sold) || quantity <= 0,
    featured: false,
    category,
    styles,
    images: files.map((f) => ({ src: `/products/${f}`, alt: name, label: files.length > 1 ? colourOf(f) : undefined })),
    // Preserve the legacy order: later entries in the old file were the newer additions.
    createdAt: new Date(base + index * 86_400_000).toISOString(),
  };
});

writeFileSync("src/data/products.json", JSON.stringify(products, null, 2) + "\n");
console.log(`Migrated ${products.length} products → src/data/products.json`);
for (const p of products) console.log(`${p.slug.padEnd(48)} ${p.category.padEnd(14)} ${p.styles.join(",")}`);
