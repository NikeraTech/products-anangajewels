import type { NextConfig } from "next";

// Old PHP URLs → new routes, so existing search rankings and shared links keep working.
const legacyRedirects = [
  ["/index.php", "/"],
  ["/shop.php", "/shop"],
  ["/about.php", "/about"],
  ["/contact.php", "/contact"],
  ["/privacy.php", "/privacy"],
  ["/terms.php", "/terms"],
  ["/sitemap.php", "/sitemap.xml"],
  ["/manage.php", "/studio"],
  ["/reel.html", "/"],
  ["/assets/products/:file", "/products/:file"],
  ["/assets/logo.png", "/brand/logo.png"],
] as const;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
