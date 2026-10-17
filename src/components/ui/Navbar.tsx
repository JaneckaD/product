"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const LINKS = [
  { href: "#zvuk", label: "Zvuk" },
  { href: "#komfort", label: "Komfort" },
  { href: "#konstrukce", label: "Konstrukce" },
  { href: "#konfigurator", label: "Konfigurátor" },
  { href: "#galerie", label: "Galerie" },
];

export default function Navbar({ cartCount }: { cartCount: number }) {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/30 px-5 py-3 backdrop-blur-xl">
        <a href="#" className="flex items-center gap-2 text-sm font-semibold tracking-[0.3em]">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-white to-white/30 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
          AURA
        </a>
        <ul className="hidden items-center gap-7 text-[13px] text-white/60 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href="#konfigurator" className="relative rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white" aria-label="Košík">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black"
              >
                {cartCount}
              </motion.span>
            )}
          </a>
          <a
            href="#konfigurator"
            className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-black transition hover:bg-white/85"
          >
            Koupit
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
