import Reveal from "./Reveal";

const PRINCIPLES = [
  {
    title: "Méně, ale lépe.",
    text: "Každá stěna, okno i materiál musí mít důvod. Co důvod nemá, do výkresu nepatří.",
  },
  {
    title: "Světlo jako první materiál.",
    text: "Dům kreslíme podle slunce. Teprve potom řešíme, kde budou stěny a kde dveře.",
  },
  {
    title: "Ticho v detailu.",
    text: "Skryté zárubně, rovné hrany, žádné lišty. Dobrý detail si nevšimnete, jen ho cítíte.",
  },
];

export default function Approach() {
  return (
    <section className="mx-auto grid max-w-6xl gap-16 px-6 py-32 md:grid-cols-[1fr_1.4fr] md:gap-24 md:px-8 md:py-48">
      <Reveal>
        <p className="eyebrow">01 — přístup</p>
        <h2 className="mt-6 font-serif text-[3.4rem] leading-[0.9] tracking-[-0.02em] md:text-[5.5rem]">přístup.</h2>
      </Reveal>
      <div className="space-y-14 md:pt-24">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1}>
            <div className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line pt-6">
              <span className="eyebrow pt-1 tabular-nums">0{i + 1}</span>
              <div>
                <h3 className="font-serif text-2xl tracking-[-0.01em] md:text-[1.9rem]">{p.title}</h3>
                <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted">{p.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
