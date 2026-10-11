import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd, ORG_ID } from "@/components/JsonLd";
import { ProductCarousel } from "@/components/ProductCarousel";
import { ProductView } from "@/components/product/ProductView";
import { SectionHeading } from "@/components/SectionHeading";
import { SITE, categoryTitle } from "@/lib/catalog";
import { getProduct, getProducts, getRelatedProducts, getSettings } from "@/lib/data";
import type { Product } from "@/lib/types";
import { absoluteUrl, formatPrice, productUrl } from "@/lib/utils";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Piece not found" };

  const title = `${product.name}${product.sku ? ` (${product.sku})` : ""} — ${categoryTitle(product.category)}`;
  const description =
    product.description?.slice(0, 155) ||
    `${product.name}, handpicked Indian ${categoryTitle(product.category).toLowerCase()} for ${formatPrice(product.price)}. ${
      product.soldOut ? "Currently sold out — ask us about restocks." : "Delivered across the UK from Coventry."
    }`;
  const image = product.images[0];

  return {
    title,
    description,
    alternates: { canonical: productUrl(product) },
    openGraph: {
      title,
      description,
      url: productUrl(product),
      images: image ? [{ url: image.src, alt: image.alt }] : undefined,
    },
  };
}

export default function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/shop/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [related, settings] = await Promise.all([getRelatedProducts(product), getSettings()]);

  return (
    <>
      <div className="container-x pt-6 pb-16 md:pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <Link href="/" className="hover:text-emerald-900">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/shop" className="hover:text-emerald-900">
            Shop
          </Link>
          <ChevronRight className="size-3" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-emerald-900">
            {categoryTitle(product.category)}
          </Link>
          <ChevronRight className="size-3" />
          <span aria-current="page" className="text-ink">
            {product.name}
          </span>
        </nav>
        <ProductView product={product} deliveryInfo={settings.deliveryInfo} careInfo={settings.careInfo} />
      </div>

      {related.length > 0 && (
        <section className="bg-cream/60 py-20">
          <div className="container-x">
            <SectionHeading eyebrow="Complete the look" title="You may also like" link={{ href: `/shop?category=${product.category}`, label: `More ${categoryTitle(product.category).toLowerCase()}` }} />
            <ProductCarousel products={related} />
          </div>
        </section>
      )}

      <JsonLd data={productSchema(product)} />
    </>
  );
}

function productSchema(p: Product) {
  const url = absoluteUrl(productUrl(p));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: p.name,
        sku: p.sku || undefined,
        description: p.description || `${p.name} — handpicked Indian ${categoryTitle(p.category).toLowerCase()} from ${SITE.name}.`,
        image: p.images.map((i) => absoluteUrl(i.src)),
        category: categoryTitle(p.category),
        brand: { "@type": "Brand", name: SITE.name },
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "GBP",
          price: p.price.toFixed(2),
          availability: p.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": ORG_ID },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
          { "@type": "ListItem", position: 3, name: categoryTitle(p.category), item: absoluteUrl(`/shop?category=${p.category}`) },
          { "@type": "ListItem", position: 4, name: p.name, item: url },
        ],
      },
    ],
  };
}

function ProductSkeleton() {
  return (
    <div className="container-x grid animate-pulse gap-10 pt-14 pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div className="aspect-[4/3] rounded-[1.75rem] bg-sand/60" />
      <div className="space-y-4">
        <div className="h-3 w-32 rounded bg-sand" />
        <div className="h-12 w-3/4 rounded bg-sand" />
        <div className="h-10 w-28 rounded bg-sand" />
        <div className="h-24 rounded bg-sand/60" />
        <div className="h-14 rounded-full bg-sand" />
      </div>
    </div>
  );
}
