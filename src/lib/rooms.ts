export type Room = {
  /** Short lowercase heading, set in the display serif. */
  title: string;
  label: string;
  what: string;
  how: string;
  why: string;
  /** Which side of the screen the text sits on (desktop). */
  side: "left" | "right";
};

/**
 * One entry per stop of the walk. Index 0 is the view of the house from
 * outside, 1–5 are the rooms, 6 is the aerial view of the whole house.
 */
export const ROOMS: Room[] = [
  {
    title: "dům.",
    label: "exteriér",
    what: "Přízemní dům pro čtyři lidi. Sto osmdesát metrů čtverečních, jedna hmota, žádné ozdoby.",
    how: "Bílá vápenná omítka, plochá střecha schovaná za atikou a vstup zapuštěný pod hlubokou markýzou.",
    why: "Dům má být v krajině tichý. Pozornost patří životu uvnitř, ne fasádě.",
    side: "left",
  },
  {
    title: "práh.",
    label: "vstup",
    what: "Vstupní prostor, kde se odkládá den. Lavice, dva háčky, zrcadlo.",
    how: "Úzké svislé okno vrhá na stěnu světelný pruh, který se během dne posouvá jako hodinová ručička.",
    why: "Přechod zvenku dovnitř potřebuje svůj rytmus. Zpomalit dřív, než vstoupíte.",
    side: "left",
  },
  {
    title: "světlo.",
    label: "obývací prostor",
    what: "Obývací prostor s oknem od podlahy ke stropu přes celou stěnu.",
    how: "Okno orientujeme na jihozápad. Hluboké ostění v létě stíní a v zimě pouští slunce až k pohovce.",
    why: "Světlo je nejlevnější materiál, který máme. A zároveň ten nejkrásnější.",
    side: "left",
  },
  {
    title: "střed.",
    label: "kuchyň",
    what: "Kuchyň jako srdce domu. Monolitický ostrov a jedna linka pod pásovým oknem.",
    how: "Spotřebiče a úložné prostory mizí ve stěně. Na očích zůstává jen kámen, dřevo a světlo nad pracovní deskou.",
    why: "Kde se vaří, tam se žije. Prostor kolem ostrova musí dýchat i pro šest lidí.",
    side: "left",
  },
  {
    title: "ticho.",
    label: "ložnice",
    what: "Ložnice se střešním světlíkem přímo nad postelí.",
    how: "Akustické omítky, dub a len. Okno vede do nebe, ne do ulice.",
    why: "Spánek potřebuje tmu a probuzení potřebuje světlo. Světlík dá obojí.",
    side: "left",
  },
  {
    title: "voda.",
    label: "koupelna",
    what: "Koupelna z jednoho materiálu. Volně stojící vana a umyvadlo jako kamenná mísa.",
    how: "Bezespárá stěrka na stěnách i podlaze, skryté odtoky a vysoké pásové okno pro soukromí.",
    why: "Méně linií znamená méně myšlenek. Koupel má být rituál, ne úkon.",
    side: "left",
  },
  {
    title: "celek.",
    label: "půdorys",
    what: "Pět místností za sebou na jedné ose. Dveře v zákrytu, pohled skrz celý dům.",
    how: "Každý prostor navrhujeme od světla a pohybu. Teprve potom kreslíme stěny.",
    why: "Dobrý dům se nevysvětluje. Prostě se v něm dobře žije.",
    side: "left",
  },
];

/** Camera stops: position and look-at target for each room, plus the doorways between them. */
type Vec = [number, number, number];

export const CAMERA_PATH: { position: Vec; target: Vec }[] = [
  { position: [-6.4, 1.9, 13.5], target: [0.6, 2.3, -3] }, // 0 exterior
  { position: [0, 1.6, 0.6], target: [0, 1.6, -6] }, //        door
  { position: [-1.4, 1.6, -2.6], target: [3.5, 1.35, -5.2] }, // 1 vstup
  { position: [0, 1.6, -8], target: [0, 1.6, -14] }, //         door
  { position: [-2.7, 1.5, -9.3], target: [2.6, 0.75, -13.2] }, // 2 obývák
  { position: [0, 1.6, -16], target: [0, 1.6, -22] }, //        door
  { position: [-2.3, 1.75, -17.5], target: [1.4, 0.9, -21] }, // 3 kuchyň
  { position: [0, 1.6, -24], target: [0, 1.6, -30] }, //        door
  { position: [-2.4, 1.6, -24.8], target: [2.2, 0.6, -28.6] }, // 4 ložnice
  { position: [0, 1.6, -32], target: [0, 1.6, -38] }, //        door
  { position: [1.8, 1.6, -32.8], target: [-1.5, 0.6, -38.6] }, // 5 koupelna
  { position: [5, 10, -30], target: [0, -1, -25] }, //            rise
  { position: [21, 27, -11], target: [0, -3.5, -21] }, //            6 aerial
];
