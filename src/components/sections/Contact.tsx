import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-32 md:px-8 md:pt-48">
      <Reveal>
        <p className="eyebrow">04 — kontakt</p>
        <h2 className="mt-6 max-w-[14ch] font-serif text-[3.2rem] leading-[0.95] tracking-[-0.02em] md:text-[6rem]">
          Začněme rozhovorem.
        </h2>
      </Reveal>
      <Reveal delay={0.15} className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
        <div>
          <p className="eyebrow">napište</p>
          <a href="mailto:atelier@prostor.cz" className="link mt-3 inline-block font-serif text-2xl md:text-3xl">
            atelier@prostor.cz
          </a>
        </div>
        <div>
          <p className="eyebrow">zavolejte</p>
          <a href="tel:+420222000111" className="link mt-3 inline-block font-serif text-2xl md:text-3xl">
            +420 222 000 111
          </a>
        </div>
        <div>
          <p className="eyebrow">přijďte</p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Ateliér prostor.
            <br />
            Bubenská 12, Praha 7
            <br />
            po–pá, 9–18 h
          </p>
        </div>
      </Reveal>
      <footer className="mt-32 flex flex-col justify-between gap-4 border-t border-line pt-6 md:flex-row">
        <p className="eyebrow">© 2026 prostor. architektonický ateliér</p>
        <p className="eyebrow">domy / interiéry / krajina / rekonstrukce</p>
      </footer>
    </section>
  );
}
