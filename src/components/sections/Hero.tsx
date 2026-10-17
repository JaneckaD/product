"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";

const TITLE = "AURA One";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-char", { yPercent: 120, rotate: 8, opacity: 0, duration: 1.6, stagger: 0.06, delay: 0.2 })
        .from(".hero-fade", { y: 30, opacity: 0, filter: "blur(10px)", duration: 1.2, stagger: 0.12 }, "-=1.1");

      // Title drifts back and fades as you leave the hero.
      gsap.to(".hero-content", {
        yPercent: -40,
        opacity: 0,
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom 30%", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="uvod" data-stage={0} className="relative flex h-svh flex-col items-center overflow-hidden">
      <div className="hero-content flex flex-col items-center pt-28 text-center md:pt-28">
        <p className="hero-fade mb-4 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.35em] text-white/70 backdrop-blur">
          Nová generace poslechu
        </p>
        <h1 className="flex overflow-hidden pb-2 text-[18vw] font-semibold leading-[0.9] tracking-[-0.05em] md:text-[8.5rem]">
          {TITLE.split("").map((char, i) => (
            <span key={i} className="hero-char text-gradient inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>

      <div className="hero-content absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 pb-8 md:flex-row md:items-end md:justify-between md:px-10 md:pb-10">
        <p className="hero-fade max-w-xs text-center text-base text-white/60 md:text-left">
          Studiový zvuk. Absolutní ticho. Design, který nosíte jako šperk.
        </p>
        <div className="hero-fade hidden flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/50 md:flex">
          Scrollujte
          <ChevronDown size={18} className="animate-bounce" />
        </div>
        <div className="hero-fade flex items-center gap-4">
          <a
            href="#konfigurator"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.35)]"
          >
            Koupit od 8 990 Kč
          </a>
          <a href="#zvuk" className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 backdrop-blur transition hover:border-white/50 hover:text-white">
            Prozkoumat
          </a>
        </div>
      </div>
    </section>
  );
}
