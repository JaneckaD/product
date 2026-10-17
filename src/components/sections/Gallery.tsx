"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Placeholder photography from Unsplash; swap for real product shots later.
const PHOTOS = [
  { id: "1505740420928-5e560c06d30e", w: 1200, h: 1500, title: "Studiový detail", tag: "Produkt" },
  { id: "1484704849700-f032a568e944", w: 1200, h: 800, title: "Ranní rituál", tag: "Lifestyle" },
  { id: "1583394838336-acd977736f90", w: 1200, h: 1600, title: "Čistá forma", tag: "Design" },
  { id: "1546435770-a3e426bf472b", w: 1200, h: 900, title: "Zvuk bez kompromisů", tag: "Produkt" },
  { id: "1487215078519-e21cc028cb29", w: 1200, h: 1500, title: "Ve městě", tag: "Lifestyle" },
  { id: "1618366712010-f4ae9c647dcb", w: 1200, h: 1200, title: "Řemeslo", tag: "Materiály" },
  { id: "1524678606370-a47ad25cb82a", w: 1200, h: 800, title: "Na cestách", tag: "Lifestyle" },
  { id: "1572536147248-ac59a8abfa4b", w: 1200, h: 1500, title: "Minimalismus", tag: "Design" },
  { id: "1599669454699-248893623440", w: 1200, h: 1000, title: "Noční session", tag: "Lifestyle" },
];

function Tile({ photo, index }: { photo: (typeof PHOTOS)[number]; index: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <motion.figure
      initial={{ opacity: 0, y: 80, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, delay: (index % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative mb-5 break-inside-avoid overflow-hidden rounded-3xl border border-white/10 bg-white/5"
      style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
    >
      {failed ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#3a3d4a,#0b0b0d_70%)]" />
      ) : (
        <Image
          src={`https://images.unsplash.com/photo-${photo.id}?auto=format&fit=crop&w=${photo.w}&h=${photo.h}&q=90`}
          alt={photo.title}
          fill
          quality={90}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setFailed(true)}
          className="object-cover transition duration-[1.4s] ease-out group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
      <figcaption className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between p-5 transition-transform duration-500 group-hover:translate-y-0">
        <span className="text-lg font-semibold">{photo.title}</span>
        <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-wider text-white/80 backdrop-blur">
          {photo.tag}
        </span>
      </figcaption>
    </motion.figure>
  );
}

export default function Gallery() {
  return (
    <section id="galerie" className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
      <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl font-semibold tracking-tight md:text-7xl"
        >
          <span className="text-gradient">V akci.</span>
        </motion.h2>
        <p className="max-w-sm text-white/50">
          Ve studiu, ve městě i na cestách. AURA One je stvořena pro chvíle, kdy na zvuku záleží nejvíc.
        </p>
      </div>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {PHOTOS.map((photo, i) => (
          <Tile key={photo.id} photo={photo} index={i} />
        ))}
      </div>
    </section>
  );
}
