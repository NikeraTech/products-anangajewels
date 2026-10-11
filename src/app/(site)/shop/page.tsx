import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { ShopCatalogue, StaticCatalogue } from "@/components/shop/ShopCatalogue";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop Indian Imitation Jewellery | Coventry, UK",
  description:
    "Browse our full collection of Indian imitation jewellery — chandbalis, jhumkas, necklace sets, temple and kemp jewellery. Based in Coventry with delivery across the UK.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Shop" }]}
        eyebrow="The collection"
        title={
          <>
            Shop Indian <em className="text-gold-300">imitation jewellery</em>
          </>
        }
        text="Handpicked earrings, chandbalis, jhumkas, necklace sets and temple jewellery. Search, filter and preview pieces, then message us to reserve your favourite."
      />
      <section id="catalogue" className="container-x scroll-mt-24 py-10 md:py-14">
        {/* useSearchParams needs a boundary; the fallback is the full server-rendered grid. */}
        <Suspense fallback={<StaticCatalogue products={products} />}>
          <ShopCatalogue products={products} />
        </Suspense>
      </section>
    </>
  );
}
