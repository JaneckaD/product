"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ROOMS } from "@/lib/rooms";
import { walk } from "@/lib/walk";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// WebGL only runs in the browser.
const Walkthrough = dynamic(() => import("./house/Walkthrough"), { ssr: false });

/** Scroll budget in viewport heights. */
const INTRO_VH = 110;
const STAGE_VH = 130;
const OUTRO_VH = 60;
const STAGES = ROOMS.length - 1;
const TOTAL_VH = INTRO_VH + STAGES * STAGE_VH + OUTRO_VH;

const pad = (n: number) => String(n).padStart(2, "0");

export default function Walk() {
  const section = useRef<HTMLElement>(null);
  const roomEls = useRef<(HTMLDivElement | null)[]>([]);
  const progressEl = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const [active, setActive] = useState(true);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (ctx) => {
        const desktop = ctx.conditions?.desktop;
        const frameFrom = desktop ? "inset(19% 9% 25% 58%)" : "inset(50% 6% 9% 6%)";

        const intro = gsap
          .timeline({ paused: true, defaults: { ease: "power2.inOut", duration: 1 } })
          .fromTo(".walk-frame", { clipPath: frameFrom }, { clipPath: "inset(0% 0% 0% 0%)" }, 0)
          .to(".walk-intro-text", { opacity: 0, y: -60, stagger: 0.04, duration: 0.6 }, 0)
          .to(".walk-wordmark", { opacity: 0, yPercent: -12, duration: 0.7 }, 0)
          .to(".walk-caption", { opacity: 0, duration: 0.3 }, 0)
          .fromTo(".walk-hud", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.75);


        ScrollTrigger.create({
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          onToggle: (self) => setActive(self.isActive || self.progress < 1),
          onUpdate: (self) => {
            const vh = self.progress * TOTAL_VH;
            walk.intro = gsap.utils.clamp(0, 1, vh / INTRO_VH);
            walk.stage = gsap.utils.clamp(0, STAGES, (vh - INTRO_VH) / STAGE_VH);
            intro.progress(walk.intro);

            roomEls.current.forEach((el, i) => {
              if (!el) return;
              const d = walk.stage - i;
              let o = gsap.utils.clamp(0, 1, 1 - (Math.abs(d) - 0.14) / 0.18);
              if (i === 0) o *= gsap.utils.clamp(0, 1, (walk.intro - 0.8) / 0.2);
              el.style.opacity = String(o);
              el.style.transform = `translate3d(0, ${-d * 70}px, 0)`;
              el.style.visibility = o > 0.001 ? "visible" : "hidden";
            });

            if (progressEl.current) progressEl.current.style.transform = `scaleX(${walk.stage / STAGES})`;
            setCurrent(Math.round(walk.stage));
          },
        });
      });
    },
    { scope: section },
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      walk.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      walk.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section ref={section} className="relative" style={{ height: `${TOTAL_VH + 100}svh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Paper on the left, warm panel on the right */}
        <div className="absolute inset-0 grid grid-rows-[50%_50%] md:grid-cols-2 md:grid-rows-1">
          <div className="bg-paper" />
          <div className="bg-panel" />
        </div>

        {/* Intro copy */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex w-full flex-col px-6 pb-[52svh] pt-8 md:w-1/2 md:max-w-none md:px-12 md:pb-12 md:pt-12 lg:px-16">
          <p className="walk-enter [animation-delay:200ms] walk-intro-text eyebrow">architektonický ateliér · praha</p>
          <p className="walk-enter [animation-delay:300ms] walk-intro-text mt-5 font-serif text-[2.6rem] leading-none tracking-tight md:hidden">
            prostor.
          </p>
          <div className="mt-auto max-w-[26rem]">
            <h1 className="walk-enter [animation-delay:350ms] walk-intro-text font-serif text-[1.75rem] leading-[1.12] tracking-[-0.01em] md:text-[2.6rem] lg:text-[3.1rem]">
              Navrhujeme domy, ve kterých je slyšet ticho.
            </h1>
            <p className="walk-enter [animation-delay:500ms] walk-intro-text mt-5 max-w-[34ch] text-[13px] leading-relaxed text-muted md:mt-8 md:text-sm">
              Moderní rodinné domy od prvního náčrtu po předání klíčů. Málo materiálů, hodně světla a žádné
              zbytečnosti.
            </p>
            <p className="walk-enter [animation-delay:650ms] walk-intro-text eyebrow mt-6 md:mt-12">projděte se domem ↓</p>
          </div>
        </div>

        {/* Vertical wordmark straddling the two halves */}
        <p
          className="walk-enter [animation-delay:450ms] walk-wordmark pointer-events-none absolute left-1/2 top-[18%] z-10 hidden -translate-x-[62%] font-serif text-[clamp(5rem,14vh,10rem)] leading-[0.8] tracking-[-0.03em] md:block"
          style={{ writingMode: "vertical-rl" }}
        >
          prostor.
        </p>

        {/* The house, first framed like a photograph, then full screen */}
        <div className="walk-frame absolute inset-0 z-[5]" style={{ clipPath: "inset(19% 9% 25% 58%)" }}>
          <div className="walk-frame-inner absolute inset-0 animate-[settle_2.6s_cubic-bezier(0.16,1,0.3,1)_backwards]">
            <Walkthrough active={active} />
          </div>
        </div>

        <p className="walk-enter [animation-delay:900ms] walk-caption eyebrow pointer-events-none absolute bottom-[3.5%] left-[6%] z-10 md:bottom-[19%] md:left-[58%]">
          domy / interiéry / krajina / rekonstrukce
        </p>

        {/* Room descriptions */}
        {ROOMS.map((room, i) => (
          <div
            key={room.title}
            ref={(el) => void (roomEls.current[i] = el)}
            className={`invisible absolute inset-x-4 bottom-4 z-20 opacity-0 will-change-transform md:inset-x-auto md:bottom-auto md:top-1/2 md:-mt-[11rem] md:w-[25rem] ${
              room.side === "left" ? "md:left-[6vw]" : "md:right-[6vw]"
            }`}
          >
            <div className="bg-paper/85 p-5 backdrop-blur-md md:bg-paper/80 md:p-8">
              <p className="eyebrow">
                {pad(i)} / {pad(STAGES)} — {room.label}
              </p>
              <h2 className="mt-3 font-serif text-[3.2rem] leading-[0.9] tracking-[-0.02em] md:mt-4 md:text-[5.2rem]">
                {room.title}
              </h2>
              <dl className="mt-5 grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-3 text-[13px] leading-relaxed md:mt-8 md:gap-y-4 md:text-sm">
                <dt className="eyebrow pt-[3px]">co</dt>
                <dd>{room.what}</dd>
                <dt className="eyebrow pt-[3px]">jak</dt>
                <dd>{room.how}</dd>
                <dt className="eyebrow pt-[3px]">proč</dt>
                <dd>{room.why}</dd>
              </dl>
            </div>
          </div>
        ))}

        {/* Minimal position indicator */}
        <div className="walk-hud pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-6 opacity-0 md:p-10">
          <p className="font-serif text-xl leading-none">prostor.</p>
          <p className="eyebrow tabular-nums">
            {pad(current)} / {pad(STAGES)}
          </p>
        </div>
        <div className="walk-hud pointer-events-none absolute right-6 top-14 z-20 h-px w-16 bg-ink/15 opacity-0 md:right-10 md:top-[4.6rem] md:w-24">
          <span ref={progressEl} className="block h-full origin-left scale-x-0 bg-ink" />
        </div>
      </div>
    </section>
  );
}
