const ITEMS = ["Hi-Res Lossless", "Adaptivní ANC", "60 h výdrž", "Prostorový zvuk", "Bluetooth 5.4", "Letecký hliník", "Paměťová pěna"];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-6">
      <div className="marquee flex w-max gap-12 whitespace-nowrap text-4xl font-semibold tracking-tight text-white/15 md:text-6xl">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            {item}
            <span className="text-white/30">✦</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050506] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050506] to-transparent" />
    </div>
  );
}
