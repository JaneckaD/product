"use client";

import { motion } from "framer-motion";
import type { Feature } from "@/lib/product";

const IDS: Record<number, string> = { 1: "zvuk", 2: "komfort", 3: "konstrukce", 4: "ovladani" };

export default function FeatureSection({ feature, accent }: { feature: Feature; accent: string }) {
  const fromLeft = feature.side === "left";
  return (
    <section
      id={IDS[feature.stage]}
      data-stage={feature.stage}
      className="relative flex min-h-[130svh] items-end pb-[20svh] md:items-center md:pb-0"
    >
      <div className={`mx-auto flex w-full max-w-7xl px-5 md:px-10 ${fromLeft ? "justify-start" : "justify-end"}`}>
        <motion.article
          initial={{ opacity: 0, x: fromLeft ? -90 : 90, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ amount: 0.35 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card relative w-full max-w-[440px] overflow-hidden rounded-3xl p-7 md:p-9"
        >
          <span
            className="pointer-events-none absolute -right-6 -top-10 select-none text-[9rem] font-bold leading-none text-transparent"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.08)" }}
          >
            0{feature.stage}
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 block h-px w-16 origin-left"
            style={{ background: accent }}
          />
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em]" style={{ color: accent }}>
            {feature.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{feature.title}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/60">{feature.description}</p>
          <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
            {feature.specs.map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
              >
                <dt className="text-[11px] uppercase tracking-wider text-white/40">{spec.label}</dt>
                <dd className="mt-1 text-sm font-semibold">{spec.value}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.article>
      </div>
    </section>
  );
}
