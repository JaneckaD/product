# AURA One – 3D produktová landing page

Interaktivní landing page ve stylu produktových stránek Apple: 3D model, který se při scrollování otáčí a přibližuje na jednotlivé části, konfigurátor barev s cenou a galerie „v akci“.

## Stack

- Next.js 16 (App Router), React 19, Tailwind CSS 4
- Three.js, React Three Fiber, @react-three/drei
- GSAP + ScrollTrigger (scroll choreografie 3D modelu), Framer Motion (UI animace)
- lucide-react (ikony)

## Spuštění

```bash
npm install
npm run dev
```

Otevřete http://localhost:3000.

## Struktura

| Soubor | Co dělá |
| --- | --- |
| `src/components/Experience.tsx` | Skládá stránku, drží zvolenou variantu, napojuje ScrollTrigger na 3D scénu |
| `src/components/three/Scene.tsx` | Canvas, světla, studiové prostředí, částice |
| `src/components/three/Headphones.tsx` | Placeholder model sluchátek + klíčové snímky pro jednotlivé scroll sekce |
| `src/components/sections/*` | HTML overlay: hero, informační karty, konfigurátor, galerie, patička |
| `src/lib/product.ts` | Barevné varianty, ceny, edice a texty sekcí |

## Vlastní .glb model

1. Uložte model do `public/models/product.glb`.
2. V `Headphones.tsx` nahraďte primitivní geometrii za `useGLTF("/models/product.glb")` uvnitř skupiny `<group ref={root}>` – scroll choreografie zůstane funkční.
3. Barvu měňte přes materiály modelu (`materials.shell.color` apod.), stejně jako teď.
4. Pozice hotspotů (`HOTSPOT_ANCHORS`) a klíčové snímky (`KEYFRAMES`) doladíte podle tvaru modelu.

Fotky v galerii jsou zatím placeholdery z Unsplash (`src/components/sections/Gallery.tsx`).
