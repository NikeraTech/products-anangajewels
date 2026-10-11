"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";

// Sanity's CDN resizes on the fly, so skip Next's optimiser for those URLs.
function sanityLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}

export function Img(props: ImageProps) {
  const isSanity = typeof props.src === "string" && props.src.startsWith("https://cdn.sanity.io/");
  return <Image {...props} loader={isSanity ? sanityLoader : undefined} alt={props.alt} />;
}
