export type Variant = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  /** Main shell color of the 3D model. */
  shell: string;
  /** Metal accents (sliders, cap rings). */
  accent: string;
  /** Ear cushions and headband padding. */
  fabric: string;
  /** LED ring and ambient glow behind the model. */
  glow: string;
  /** Swatch gradient shown in the UI. */
  swatch: string;
};

export const VARIANTS: Variant[] = [
  {
    id: "midnight",
    name: "Půlnoční grafit",
    tagline: "Matná černá s grafitovým kovem",
    price: 8990,
    shell: "#1a1b1f",
    accent: "#9aa0a8",
    fabric: "#0e0e10",
    glow: "#6d7cff",
    swatch: "linear-gradient(135deg, #3a3c44 0%, #111214 100%)",
  },
  {
    id: "polar",
    name: "Polární perla",
    tagline: "Perleťová bílá se šampaňským zlatem",
    price: 9490,
    shell: "#e8e3d9",
    accent: "#d4b072",
    fabric: "#cfc7b8",
    glow: "#ffd9a0",
    swatch: "linear-gradient(135deg, #ffffff 0%, #d9d1c3 100%)",
  },
  {
    id: "aurora",
    name: "Aurora modrá",
    tagline: "Limitovaná edice s měděnými detaily",
    price: 10990,
    shell: "#1f3b63",
    accent: "#e08a5a",
    fabric: "#14243b",
    glow: "#3cf0ff",
    swatch: "linear-gradient(135deg, #3d6fb0 0%, #102341 100%)",
  },
];

export type Edition = { id: string; name: string; description: string; extra: number };

export const EDITIONS: Edition[] = [
  { id: "standard", name: "Standard", description: "40 h výdrž, ANC 2. generace", extra: 0 },
  { id: "pro", name: "Pro", description: "60 h výdrž, Lossless, pouzdro z kůže", extra: 2500 },
];

export type Feature = {
  stage: number;
  eyebrow: string;
  title: string;
  description: string;
  side: "left" | "right";
  specs: { label: string; value: string }[];
};

/** One feature per scroll stage; the 3D model zooms to the matching part. */
export const FEATURES: Feature[] = [
  {
    stage: 1,
    eyebrow: "01 · Zvuk",
    title: "Měniče, které slyšíte celým tělem.",
    description:
      "Vlastní 40mm měniče s membránou z berylia a neodymovým magnetem. Každý pár je ručně kalibrován, aby basy byly hluboké a výšky křišťálově čisté.",
    side: "left",
    specs: [
      { label: "Měnič", value: "40 mm Be" },
      { label: "Frekvence", value: "4 Hz – 40 kHz" },
      { label: "Zkreslení", value: "< 0,1 %" },
    ],
  },
  {
    stage: 2,
    eyebrow: "02 · Komfort",
    title: "Polštářky z paměťové pěny.",
    description:
      "Náušníky se přizpůsobí tvaru vaší hlavy a dokonale utěsní okolní hluk. Potah z prodyšné proteinové kůže zůstává chladný i po hodinách poslechu.",
    side: "right",
    specs: [
      { label: "Materiál", value: "Memory foam" },
      { label: "Hmotnost", value: "248 g" },
      { label: "Útlum", value: "až −42 dB" },
    ],
  },
  {
    stage: 3,
    eyebrow: "03 · Konstrukce",
    title: "Hlavový most z leteckého hliníku.",
    description:
      "Jednolitý oblouk frézovaný z hliníku řady 7000, doplněný o síťovinu, která rozkládá tlak rovnoměrně. Pevný jako šperk, lehký jako myšlenka.",
    side: "left",
    specs: [
      { label: "Rám", value: "Al 7075" },
      { label: "Povrch", value: "Eloxovaný" },
      { label: "Pohyb", value: "Teleskopický" },
    ],
  },
  {
    stage: 4,
    eyebrow: "04 · Ovládání a baterie",
    title: "Jeden dotyk. Šedesát hodin.",
    description:
      "Dotyková plocha na pravém náušníku reaguje na gesta a světelný prstenec ukazuje stav baterie. Deset minut nabíjení vystačí na pět hodin poslechu.",
    side: "right",
    specs: [
      { label: "Výdrž", value: "až 60 h" },
      { label: "Rychlonabíjení", value: "10 min = 5 h" },
      { label: "Konektivita", value: "BT 5.4 · USB-C" },
    ],
  },
];

export const CONFIG_STAGE = 5;

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(value) + " Kč";
