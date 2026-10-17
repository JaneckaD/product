export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="text-gradient text-6xl font-semibold tracking-tighter md:text-8xl">AURA</p>
          <p className="mt-3 text-sm text-white/40">Zvuk, který se stane součástí vás.</p>
        </div>
        <div className="flex gap-8 text-sm text-white/50">
          <a href="#konfigurator" className="hover:text-white">Obchod</a>
          <a href="#zvuk" className="hover:text-white">Technologie</a>
          <a href="#galerie" className="hover:text-white">Galerie</a>
          <span>© 2026 AURA</span>
        </div>
      </div>
    </footer>
  );
}
