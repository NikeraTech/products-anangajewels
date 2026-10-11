import { SITE } from "@/lib/catalog";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const ORG_ID = `${SITE.url}/#organization`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "JewelryStore",
      "@id": ORG_ID,
      name: SITE.name,
      url: `${SITE.url}/`,
      logo: `${SITE.url}/brand/logo.png`,
      image: `${SITE.url}/brand/logo.png`,
      telephone: SITE.phone,
      email: SITE.email,
      founder: { "@type": "Person", name: SITE.founder },
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.locality,
        addressRegion: SITE.region,
        addressCountry: "GB",
      },
      areaServed: ["Coventry", "United Kingdom"],
      sameAs: [SITE.facebook, SITE.instagram],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name,
      inLanguage: "en-GB",
      publisher: { "@id": ORG_ID },
    },
  ],
};
