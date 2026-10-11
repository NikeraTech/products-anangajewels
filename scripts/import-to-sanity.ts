/**
 * Uploads the bundled catalogue (src/data/products.json + public/products/*) into Sanity.
 * Safe to re-run: documents use stable IDs and images are de-duplicated by Sanity.
 *
 * Usage: npx tsx --env-file=.env.local scripts/import-to-sanity.ts
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_API_WRITE_TOKEN (Editor token).
 */
import { createReadStream, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { createClient } from "next-sanity";
import products from "../src/data/products.json";
import type { Product } from "../src/lib/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN first.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-10-01",
  token,
  useCdn: false,
});

const uploaded = new Map<string, string>();

async function uploadImage(src: string) {
  const file = join("public", src);
  if (!existsSync(file)) throw new Error(`Missing image ${file}`);
  if (!uploaded.has(file)) {
    const asset = await client.assets.upload("image", createReadStream(file), { filename: basename(file) });
    uploaded.set(file, asset._id);
  }
  return uploaded.get(file)!;
}

async function main() {
  const list = products as Product[];
  for (const [i, p] of list.entries()) {
    const images = [];
    for (const img of p.images) {
      images.push({
        _type: "image",
        _key: basename(img.src).replace(/\W/g, "").slice(0, 40),
        asset: { _type: "reference", _ref: await uploadImage(img.src) },
        alt: img.alt,
        label: img.label,
      });
    }

    await client.createOrReplace({
      _id: `product-${p.slug}`,
      _type: "product",
      name: p.name,
      sku: p.sku,
      slug: { _type: "slug", current: p.slug },
      images,
      category: p.category,
      styles: p.styles,
      description: p.description,
      price: p.price,
      quantity: p.quantity,
      isNew: p.isNew,
      soldOut: p.soldOut,
      featured: p.featured,
      publishedAt: p.createdAt,
    });
    console.log(`[${i + 1}/${list.length}] ${p.name}`);
  }

  // Seed the settings singleton only if it doesn't exist yet.
  await client.createIfNotExists({ _id: "siteSettings", _type: "siteSettings" });
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
