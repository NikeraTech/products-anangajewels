import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "announcement",
      title: "Announcement bar messages",
      type: "array",
      of: [{ type: "string" }],
      description: "Short messages that scroll across the top of every page.",
    }),
    defineField({ name: "heroTitle", title: "Home hero heading", type: "string" }),
    defineField({ name: "heroText", title: "Home hero text", type: "text", rows: 3 }),
    defineField({
      name: "heroImages",
      title: "Home hero images",
      type: "array",
      description: "Three photos work best.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        }),
      ],
      validation: (r) => r.max(3),
    }),
    defineField({ name: "deliveryInfo", title: "Delivery & enquiries text", type: "text", rows: 4 }),
    defineField({ name: "careInfo", title: "Jewellery care text", type: "text", rows: 4 }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
