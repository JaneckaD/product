"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { scrollState } from "@/lib/scrollState";
import { CONFIG_STAGE, EDITIONS, FEATURES, VARIANTS } from "@/lib/product";
import Navbar from "./ui/Navbar";
import ScrollProgress from "./ui/ScrollProgress";
import StageDots from "./ui/StageDots";
import Hotspots from "./ui/Hotspots";
import Hero from "./sections/Hero";
import FeatureSection from "./sections/FeatureSection";
import Configurator from "./sections/Configurator";
import Marquee from "./sections/Marquee";
import Gallery from "./sections/Gallery";
import Footer from "./sections/Footer";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// WebGL only runs in the browser.
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

export default function Experience() {
  const [variantId, setVariantId] = useState(VARIANTS[0].id);
  const [editionId, setEditionId] = useState(EDITIONS[0].id);
  const [activeStage, setActiveStage] = useState(0);
  const [canvasActive, setCanvasActive] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const zoneRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const hotspotWrapRef = useRef<HTMLDivElement>(null);

  const variant = VARIANTS.find((v) => v.id === variantId) ?? VARIANTS[0];
  const edition = EDITIONS.find((e) => e.id === editionId) ?? EDITIONS[0];

  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-stage]");
      sections.forEach((section) => {
        const stage = Number(section.dataset.stage);
        if (stage > 0) {
          // The model travels to keyframe `stage` while this section scrolls into view.
          ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              scrollState.stage = stage - 1 + self.progress;
            },
          });
        }
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActiveStage(stage),
        });
      });

      // Pause rendering once the 3D zone has scrolled away.
      ScrollTrigger.create({
        trigger: zoneRef.current,
        start: "top top",
        end: "bottom top",
        onToggle: (self) => setCanvasActive(self.isActive),
      });

      gsap.fromTo(
        [canvasWrapRef.current, hotspotWrapRef.current],
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: "#galerie", start: "top bottom", end: "top 25%", scrub: true },
        },
      );

      gsap.from(canvasWrapRef.current, { opacity: 0, scale: 0.85, duration: 2, ease: "expo.out", delay: 0.3 });
    },
    { dependencies: [] },
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
      spotlightRef.current?.style.setProperty("--x", `${e.clientX}px`);
      spotlightRef.current?.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(id);
  }, [toast]);

  const handleBuy = () => {
    setCartCount((c) => c + 1);
    setToast(`AURA One ${edition.name} · ${variant.name} je v košíku`);
  };

  return (
    <main className="relative bg-[#050506] text-white">
      <Navbar cartCount={cartCount} />
      <ScrollProgress color={variant.glow} />

      {/* Ambient glow that follows the selected color */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(60% 50% at 50% 55%, ${variant.glow}26 0%, transparent 70%), radial-gradient(40% 40% at 80% 10%, ${variant.accent}14 0%, transparent 70%)`,
        }}
      />

      {/* Fixed WebGL canvas behind the scrolling HTML overlay */}
      <div ref={canvasWrapRef} className="pointer-events-none fixed inset-0 z-0">
        <Scene variant={variant} active={canvasActive} />
      </div>

      <div
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
        style={{
          background:
            "radial-gradient(500px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.06), transparent 60%)",
        }}
      />

      <div ref={hotspotWrapRef}>
        <Hotspots />
      </div>
      <StageDots active={activeStage} visible={canvasActive} />

      <div ref={zoneRef} className="relative z-10">
        <Hero />
        {FEATURES.map((feature) => (
          <FeatureSection key={feature.stage} feature={feature} accent={variant.glow} />
        ))}
        <Configurator
          stage={CONFIG_STAGE}
          variant={variant}
          edition={edition}
          onVariant={setVariantId}
          onEdition={setEditionId}
          onBuy={handleBuy}
        />
      </div>

      <div className="relative z-20 bg-[#050506]">
        <Marquee />
        <Gallery />
        <Footer />
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm shadow-2xl backdrop-blur-xl"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-black">
              <Check size={14} strokeWidth={3} />
            </span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Film grain */}
      <div className="grain pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-overlay" />
    </main>
  );
}
