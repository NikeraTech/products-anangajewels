import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SITE } from "@/lib/catalog";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Indian Imitation Jewellery in Coventry, UK`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_GB",
    images: [{ url: "/brand/logo.png", width: 624, height: 642, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image" },
  other: {
    "geo.region": "GB-WMD",
    "geo.placename": "Coventry",
    "geo.position": "52.4068;-1.5197",
    ICBM: "52.4068, -1.5197",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b2a20",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
