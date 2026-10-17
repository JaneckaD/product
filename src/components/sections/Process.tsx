import Reveal from "./Reveal";

const STEPS = [
  { name: "Rozhovor", text: "Poznáme vás, pozemek i to, jak chcete žít. Zatím nic nekreslíme.", time: "2 týdny" },
  { name: "Koncept", text: "Hmota, světlo a dispozice. Tři varianty, ze kterých vybereme jednu.", time: "6 týdnů" },
  { name: "Projekt", text: "Stavební povolení, prováděcí dokumentace a každý detail do milimetru.", time: "4 měsíce" },
  { name: "Stavba", text: "Autorský dozor na stavbě až do chvíle, kdy vám předáme klíče.", time: "12–14 měsíců" },
];

export default function Process() {
  return (
    <section className="bg-panel">
      <div className="mx-auto max-w-6xl px-6 py-32 md:px-8 md:py-48">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">02 — postup</p>
            <h2 className="mt-6 font-serif text-[3.4rem] leading-[0.9] tracking-[-0.02em] md:text-[5.5rem]">postup.</h2>
          </div>
          <p className="max-w-[38ch] text-[15px] leading-relaxed text-muted">
            Od prvního rozhovoru po kolaudaci zhruba dva roky. Celou dobu s jedním architektem.
          </p>
        </Reveal>
        <ol className="mt-20 border-b border-ink/15">
          {STEPS.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <li className="group grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2 border-t border-ink/15 py-8 transition-colors md:grid-cols-[5rem_1fr_1.6fr_9rem] md:items-baseline md:py-10">
                <span className="eyebrow tabular-nums">0{i + 1}</span>
                <h3 className="font-serif text-3xl tracking-[-0.01em] transition-transform duration-700 ease-out group-hover:translate-x-2 md:text-4xl">
                  {s.name}
                </h3>
                <p className="col-start-2 max-w-[48ch] text-[15px] leading-relaxed text-muted md:col-start-auto">{s.text}</p>
                <span className="eyebrow col-start-2 md:col-start-auto md:text-right">{s.time}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
