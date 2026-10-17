"use client";

import { hotspotEls } from "@/lib/scrollState";

const LABELS = ["Měnič 40 mm", "Paměťová pěna", "Hliníkový oblouk", "Dotyková plocha"];

/** HTML labels pinned to parts of the 3D model; positioned by Headphones' render loop. */
export default function Hotspots() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {LABELS.map((label, i) => (
        <div
          key={label}
          ref={(el) => void (hotspotEls[i] = el)}
          className="absolute left-0 top-0 -ml-2 -mt-2 flex items-center gap-2 whitespace-nowrap opacity-0 will-change-transform"
        >
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-white/30 backdrop-blur" />
          </span>
          <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-md">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
