"use client";

import { motion } from "framer-motion";

const STAGES = [
  { id: "uvod", label: "Úvod" },
  { id: "zvuk", label: "Zvuk" },
  { id: "komfort", label: "Komfort" },
  { id: "konstrukce", label: "Konstrukce" },
  { id: "ovladani", label: "Ovládání" },
  { id: "konfigurator", label: "Konfigurátor" },
];

export default function StageDots({ active, visible }: { active: number; visible: boolean }) {
  return (
    <motion.aside
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 20 }}
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
    >
      {STAGES.map((stage, i) => (
        <a key={stage.id} href={`#${stage.id}`} className="group flex items-center justify-end gap-3" aria-label={stage.label}>
          <span
            className={`text-[11px] uppercase tracking-[0.2em] transition-all duration-500 ${
              active === i ? "text-white opacity-100" : "translate-x-2 text-white/40 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
            }`}
          >
            {stage.label}
          </span>
          <span className="relative flex h-2 w-2 items-center justify-center">
            {active === i && (
              <motion.span layoutId="stage-dot" className="absolute h-4 w-4 rounded-full border border-white/70" />
            )}
            <span className={`h-1.5 w-1.5 rounded-full transition-colors ${active === i ? "bg-white" : "bg-white/30"}`} />
          </span>
        </a>
      ))}
    </motion.aside>
  );
}
