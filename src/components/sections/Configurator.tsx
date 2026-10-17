"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { EDITIONS, VARIANTS, type Edition, type Variant } from "@/lib/product";
import AnimatedPrice from "../ui/AnimatedPrice";

type Props = {
  stage: number;
  variant: Variant;
  edition: Edition;
  onVariant: (id: string) => void;
  onEdition: (id: string) => void;
  onBuy: () => void;
};

const PERKS = [
  { icon: Truck, label: "Doprava zdarma do 24 h" },
  { icon: ShieldCheck, label: "Záruka 3 roky" },
  { icon: RotateCcw, label: "30 dní na vrácení" },
];

function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onPointerMove={(e) => {
        const rect = ref.current!.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="shine group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-base font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] sm:w-auto"
    >
      {children}
    </motion.button>
  );
}

export default function Configurator({ stage, variant, edition, onVariant, onEdition, onBuy }: Props) {
  const price = variant.price + edition.extra;

  return (
    <section
      id="konfigurator"
      data-stage={stage}
      className="relative flex min-h-[110svh] items-end pb-12 md:items-center md:pb-0"
    >
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card w-full max-w-[480px] rounded-3xl p-7 md:p-9"
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color: variant.glow }}>
            Konfigurátor
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Vytvořte si své.</h2>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-white/50">Barva</span>
              <motion.span
                key={variant.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium"
              >
                {variant.name}
              </motion.span>
            </div>
            <div className="mt-4 flex gap-4">
              {VARIANTS.map((v) => {
                const selected = v.id === variant.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => onVariant(v.id)}
                    aria-label={v.name}
                    aria-pressed={selected}
                    className="relative flex h-14 w-14 items-center justify-center rounded-full transition-transform hover:scale-110"
                  >
                    {selected && (
                      <motion.span
                        layoutId="swatch-ring"
                        className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: v.glow, boxShadow: `0 0 24px ${v.glow}80` }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span
                      className="h-10 w-10 rounded-full border border-white/20 shadow-inner"
                      style={{ background: v.swatch }}
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-white/40">{variant.tagline}</p>
          </div>

          <div className="mt-8">
            <span className="text-sm text-white/50">Edice</span>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {EDITIONS.map((e) => {
                const selected = e.id === edition.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => onEdition(e.id)}
                    aria-pressed={selected}
                    className={`relative rounded-2xl border p-4 text-left transition-colors ${
                      selected ? "border-white/60 bg-white/10" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{e.name}</span>
                    <span className="mt-1 block text-xs leading-snug text-white/50">{e.description}</span>
                    {e.extra > 0 && <span className="mt-2 block text-xs text-white/70">+ {e.extra.toLocaleString("cs-CZ")} Kč</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="block text-xs uppercase tracking-wider text-white/40">Cena vč. DPH</span>
              <AnimatedPrice value={price} className="text-3xl font-semibold tabular-nums" />
            </div>
            <MagneticButton onClick={onBuy}>
              <ShoppingBag size={18} />
              Koupit
            </MagneticButton>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50">
            {PERKS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon size={14} />
                {label}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
