import { defineArrayMember, defineField, defineType } from "sanity";
import { CATEGORIES, STYLES } from "../../lib/catalog";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "stock", title: "Price & stock" },
    { name: "details", title: "Details" },
  ],
  fields: [
    defineField({ name: "name", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "sku",
      title: "SKU / design code",
      type: "string",
      group: "main",
      description: "e.g. ER-16409. Shown on the product page and sent in WhatsApp enquiries.",
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "main",
      description: "The product's web address. Click Generate after setting the name.",
      options: { source: (doc) => `${doc.name ?? ""} ${doc.sku ?? ""}`, maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "images",
      type: "array",
      group: "main",
      description: "The first image is the cover. Add one image per colour option.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe the photo for screen readers." }),
            defineField({ name: "label", title: "Colour / option name", type: "string", description: "e.g. Ruby, Emerald, Pink" }),
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "category",
      type: "string",
      group: "main",
      options: { list: CATEGORIES.map((c) => ({ title: c.title, value: c.slug })), layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "styles",
      title: "Styles",
      type: "array",
      group: "main",
      of: [{ type: "string" }],
      options: { list: STYLES.map((s) => ({ title: s.title, value: s.slug })), layout: "grid" },
    }),
    defineField({ name: "description", type: "text", rows: 4, group: "main" }),

    defineField({
      name: "price",
      title: "Price (£)",
      type: "number",
      group: "stock",
      validation: (r) => r.required().min(0).precision(2),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Was price (£)",
      type: "number",
      group: "stock",
      description: "Optional. Shows the item as on sale when higher than the price.",
    }),
    defineField({ name: "quantity", type: "number", group: "stock", initialValue: 1, validation: (r) => r.min(0).integer() }),
    defineField({ name: "isNew", title: "New arrival", type: "boolean", group: "stock", initialValue: true }),
    defineField({
      name: "soldOut",
      title: "Sold out",
      type: "boolean",
      group: "stock",
      initialValue: false,
      description: "Also treated as sold out automatically when quantity is 0.",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "stock",
      initialValue: false,
      description: "Feature on the home page.",
    }),
    defineField({
      name: "publishedAt",
      title: "Listed on",
      type: "datetime",
      group: "stock",
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "details",
      type: "object",
      group: "details",
      options: { collapsible: false },
      fields: [
        defineField({ name: "dimensions", type: "string", description: "e.g. H 7 cm × W 4.5 cm" }),
        defineField({ name: "weight", type: "string", description: "e.g. 38 g" }),
        defineField({ name: "finish", type: "string", description: "e.g. Matte gold, Antique gold, Rhodium" }),
        defineField({ name: "occasion", type: "string", description: "e.g. Bridal, Festive, Everyday" }),
      ],
    }),
  ],
  orderings: [
    { title: "Newest", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] },
    { title: "Price, low to high", name: "priceAsc", by: [{ field: "price", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", sku: "sku", price: "price", soldOut: "soldOut", qty: "quantity", media: "images.0" },
    prepare({ title, sku, price, soldOut, qty, media }) {
      const stock = soldOut || qty === 0 ? "Sold out" : `${qty ?? 0} in stock`;
      return { title, subtitle: [sku, price != null ? `£${price}` : null, stock].filter(Boolean).join(" · "), media };
    },
  },
});
