import type { CategorySlug, StyleSlug } from "./catalog";

export type ProductImage = {
  src: string;
  alt: string;
  /** Optional variant label, e.g. "Ruby" — shown as a colour option on the product page. */
  label?: string;
};

export type ProductDetails = {
  dimensions?: string;
  weight?: string;
  finish?: string;
  occasion?: string;
};

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  isNew: boolean;
  soldOut: boolean;
  featured: boolean;
  category: CategorySlug;
  styles: StyleSlug[];
  description?: string;
  details?: ProductDetails;
  images: ProductImage[];
  /** ISO date; used for "Newest" sorting. */
  createdAt: string;
};

export type SiteSettings = {
  announcement: string[];
  heroTitle: string;
  heroText: string;
  heroImages: ProductImage[];
  deliveryInfo: string;
  careInfo: string;
};
