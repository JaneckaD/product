"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Reveal from "./Reveal";

// Placeholder photography from Unsplash; swap for real project photos later.
const PROJECTS = [
  { name: "Dům pod lipou", place: "Řevnice", year: 2025, area: 186, photo: "1600585154340-be6161a56a0c" },
  { name: "Atrium", place: "Hostivice", year: 2024, area: 212, photo: "1600607687939-ce8a6c25118c" },
  { name: "Dům na hraně lesa", place: "Beskydy", year: 2024, area: 154, photo: "1600596542815-ffad4c1539a9" },
  { name: "Vila v sadu", place: "Mělník", year: 2023, area: 240, photo: "1600566753190-17f0baa2a6c3" },
  { name: "Dům z jednoho kamene", place: "Šumava", year: 2022, area: 128, photo: "1512917774080-9991f1c4c750" },
];

const src = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&h=1100&q=80`;

export default function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const listRef = useRef<HTMLUListElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 140, damping: 22, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 140, damping: 22, mass: 0.6 });

  const project = hovered === null ? null : PROJECTS[hovered];

  return (
    <section className="mx-auto max-w-6xl px-6 py-32 md:px-8 md:py-48">
      <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">03 — projekty</p>
          <h2 className="mt-6 font-serif text-[3.4rem] leading-[0.9] tracking-[-0.02em] md:text-[5.5rem]">projekty.</h2>
        </div>
        <p className="max-w-[38ch] text-[15px] leading-relaxed text-muted">
          Pár domů z posledních let. Každý je jiný, protože každý pozemek a každá rodina je jiná.
        </p>
      </Reveal>

      <ul
        ref={listRef}
        className="relative mt-20 border-b border-line"
        onPointerMove={(e) => {
          const rect = listRef.current!.getBoundingClientRect();
          x.set(e.clientX - rect.left);
          y.set(e.clientY - rect.top);
        }}
        onPointerLeave={() => setHovered(null)}
      >
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.06}>
            <li
              onPointerEnter={() => setHovered(i)}
              className={`grid cursor-default grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-t border-line py-7 transition-opacity duration-500 md:grid-cols-[1fr_10rem_5rem_5rem] md:py-9 ${
                hovered !== null && hovered !== i ? "opacity-30" : "opacity-100"
              }`}
            >
              <h3 className="font-serif text-3xl tracking-[-0.01em] md:text-[2.6rem]">{p.name}</h3>
              <span className="eyebrow text-right md:text-left">{p.place}</span>
              <span className="eyebrow tabular-nums">{p.year}</span>
              <span className="eyebrow text-right tabular-nums">{p.area} m²</span>
            </li>
          </Reveal>
        ))}

        {/* Photo that follows the cursor (desktop) */}
        <motion.div
          style={{ x, y }}
          className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
          aria-hidden
        >
          <AnimatePresence>
            {project && !failed[project.photo] && (
              <motion.div
                key={project.photo}
                initial={{ opacity: 0, scale: 0.92, clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -left-[110px] -top-[300px] h-[270px] w-[220px] overflow-hidden bg-panel"
              >
                <Image
                  src={src(project.photo)}
                  alt={project.name}
                  fill
                  sizes="220px"
                  className="object-cover grayscale-[30%]"
                  onError={() => setFailed((f) => ({ ...f, [project.photo]: true }))}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </ul>
    </section>
  );
}
