export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2025-10-01";

/** Until a Sanity project is connected, the site serves the bundled catalogue in src/data. */
export const isSanityConfigured = projectId.length > 0;
