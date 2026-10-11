"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, MapPin, Sparkles, Truck } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import type { ProductImage } from "@/lib/types";
import { Img } from "../Img";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({
  title,
  text,
  images,
  inStock,
}: {
  title: string;
  text: string;
  images: ProductImage[];
  inStock: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const [main, second, third] = images;

  return (
    <section ref={ref} className="texture-dots relative overflow-hidden bg-emerald-900 text-ivory">
      <div className="pointer-events-none absolute -top-40 -left-40 size-[36rem] rounded-full bg-gold-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-48 size-[32rem] rounded-full bg-emerald-500/25 blur-3xl" />

      <div className="container-x relative grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:py-28">
        <div>
          <motion.p
            className="eyebrow flex items-center gap-2 !text-gold-300"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <Sparkles className="size-4" /> Coventry jewellery studio
          </motion.p>
          <motion.h1
            className="mt-6 text-5xl leading-[1.02] font-medium text-balance sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
          >
            {title.split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <em key={i} className="bg-gradient-to-r from-gold-300 via-gold-200 to-gold-400 bg-clip-text text-transparent">
                  {word}
                </em>
              ) : (
                <span key={i}>{word} </span>
              ),
            )}
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-ivory/75 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
          >
            {text}
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease }}
          >
            <Link href="/shop" className="btn btn-gold">
              Shop the collection <ArrowRight className="size-4" />
            </Link>
            <Link href="/about" className="btn btn-outline text-ivory">
              Our story
            </Link>
          </motion.div>

          <motion.dl
            className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Stat icon={<Sparkles className="size-4" />} value={`${inStock}+`} label="Designs in stock" />
            <Stat icon={<Truck className="size-4" />} value="UK-wide" label="Delivery" />
            <Stat icon={<MapPin className="size-4" />} value="Coventry" label="Based in" />
          </motion.dl>
        </div>

        <div className="relative mx-auto aspect-[5/6] w-full max-w-[34rem]">
          {main && (
            <motion.div
              style={{ y: yBack }}
              className="absolute top-0 right-0 h-[78%] w-[78%]"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease }}
            >
              <div className="relative size-full overflow-hidden rounded-t-full rounded-b-[2rem] ring-1 ring-gold-400/40">
                <Img src={main.src} alt={main.alt} fill priority sizes="(min-width:1024px) 34vw, 80vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 to-transparent" />
              </div>
              <div className="absolute -inset-3 -z-10 rounded-t-full rounded-b-[2.4rem] border border-gold-400/30" />
            </motion.div>
          )}
          {second && (
            <motion.div
              style={{ y: yFront }}
              className="absolute bottom-0 left-0 w-[46%]"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, delay: 0.45, ease }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] shadow-2xl ring-4 ring-emerald-900">
                <Img src={second.src} alt={second.alt} fill sizes="(min-width:1024px) 16vw, 40vw" className="object-cover" />
              </div>
            </motion.div>
          )}
          {third && (
            <motion.div
              className="absolute top-[8%] left-[6%] w-[30%]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{ opacity: { duration: 1, delay: 0.7 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
            >
              <div className="relative aspect-square overflow-hidden rounded-full shadow-2xl ring-4 ring-gold-400/60">
                <Img src={third.src} alt={third.alt} fill sizes="12vw" className="object-cover" />
              </div>
            </motion.div>
          )}
          <motion.div
            className="absolute right-[4%] bottom-[10%] rounded-2xl bg-ivory/95 px-4 py-3 text-emerald-900 shadow-xl backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-gold-600 uppercase">Handpicked</p>
            <p className="font-display text-lg font-semibold">for weddings &amp; festivals</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.16em] text-ivory/55 uppercase">
        <span className="text-gold-400">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl font-semibold text-gold-200">{value}</dd>
    </div>
  );
}
