"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export function Studio() {
  if (!isSanityConfigured) {
    return (
      <div style={{ fontFamily: "system-ui", padding: "4rem 1.5rem", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
        <h1>Studio not connected yet</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and optionally <code>NEXT_PUBLIC_SANITY_DATASET</code>) in your environment, then
          reload. See the README for the full setup.
        </p>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
