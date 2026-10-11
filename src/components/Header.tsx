"use client";

import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES, SITE } from "@/lib/catalog";
import { cn, whatsappLink } from "@/lib/utils";
import { InstagramIcon, WhatsAppIcon } from "./icons";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${SITE.name} home`}>
      <span className="relative grid size-11 place-items-center rounded-full bg-emerald-950 ring-1 ring-gold-400/50 transition-transform duration-700 group-hover:rotate-45">
        <Image src="/brand/logo.png" alt="" width={36} height={37} priority />
      </span>
      <span className="leading-none">
        <span className={cn("block font-display text-2xl font-semibold", light ? "text-ivory" : "text-emerald-900")}>
          {SITE.name}
        </span>
        <span className="mt-1 block text-[0.6rem] font-semibold tracking-[0.32em] text-gold-500 uppercase">
          {SITE.tagline}
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-500",
        scrolled ? "border-sand bg-ivory/85 shadow-[0_8px_30px_-20px_rgb(0_0_0/0.25)] backdrop-blur-xl" : "border-transparent bg-ivory",
      )}
    >
      <div className={cn("container-x flex items-center justify-between transition-all duration-500", scrolled ? "h-16" : "h-20")}>
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors",
                isActive(item.href) ? "text-emerald-900" : "text-muted hover:text-emerald-900",
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span layoutId="nav-underline" className="absolute inset-x-4 -bottom-0.5 h-px bg-gold-500" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/shop#catalogue"
            aria-label="Search jewellery"
            className="grid size-10 place-items-center rounded-full text-emerald-900 transition hover:bg-cream"
          >
            <Search className="size-5" />
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener"
            className="btn btn-primary hidden !py-2.5 !px-4 lg:inline-flex"
          >
            <WhatsAppIcon className="size-4" /> Chat with us
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid size-10 place-items-center rounded-full text-emerald-900 transition hover:bg-cream md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-emerald-950/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="texture-dots fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-emerald-900 p-6 text-ivory md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
            >
              <div className="flex items-center justify-between">
                <span className="eyebrow !text-gold-300">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-full hover:bg-white/10">
                  <X className="size-6" />
                </button>
              </div>
              <nav className="mt-8 grid gap-1" aria-label="Mobile">
                {NAV.map((item, i) => (
                  <motion.div key={item.href} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05 }}>
                    <Link href={item.href} onClick={() => setOpen(false)} className={cn("block py-2 font-display text-4xl", isActive(item.href) ? "text-gold-300" : "text-ivory")}>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="gold-rule my-8" />
              <p className="eyebrow !text-gold-300">Shop by category</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <Link key={c.slug} href={`/shop?category=${c.slug}`} onClick={() => setOpen(false)} className="rounded-xl border border-white/10 px-3 py-3 text-sm hover:border-gold-400">
                    {c.title}
                  </Link>
                ))}
              </div>
              <div className="mt-auto flex gap-3">
                <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-whatsapp flex-1">
                  <WhatsAppIcon className="size-4" /> WhatsApp
                </a>
                <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="btn btn-outline !px-4">
                  <InstagramIcon className="size-5" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
