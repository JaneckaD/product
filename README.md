# prostor. – web architektonického ateliéru

Minimalistický web ateliéru, který navrhuje moderní rodinné domy. Úvod vypadá jako stránka časopisu: papír, béžový panel, svislé logo a „fotka“ domu v rámečku. Při scrollování se rámeček roztáhne přes celou obrazovku a návštěvník projde 3D modelem domu z místnosti do místnosti (vstup → obývací prostor → kuchyň → ložnice → koupelna). Nakonec kamera vystoupá nad dům a ukáže ho celý jako řez. Ke každé zastávce patří krátký popis: co, jak, proč.

## Stack

- Next.js 16 (App Router), React 19, Tailwind CSS 4
- Three.js, React Three Fiber, drei, @react-three/postprocessing (N8AO ambient occlusion)
- GSAP ScrollTrigger (scroll → kamera, úvodní rámeček), Framer Motion (jemná odhalení v sekcích)
- Písma: Bodoni Moda (nadpisy) a Inter (texty a popisky)

## Spuštění

```bash
npm install
npm run dev
```

Ve Windows PowerShellu použijte `npm.cmd install` a `npm.cmd run dev`.

## Kde co upravit

| Soubor | Co v něm je |
| --- | --- |
| `src/lib/rooms.ts` | Texty místností (co / jak / proč) a dráha kamery |
| `src/components/house/House.tsx` | 3D model domu: stěny, okna, nábytek, materiály |
| `src/components/house/Walkthrough.tsx` | Kamera, slunce, stíny, ambient occlusion |
| `src/components/Walk.tsx` | Úvodní kompozice, rámeček, scroll a texty přes scénu |
| `src/components/sections/*` | Přístup, postup, projekty, kontakt |
| `src/app/globals.css` | Barvy a typografické tokeny |

Fotky projektů (náhled při najetí myší) jsou zatím placeholdery z Unsplash.
