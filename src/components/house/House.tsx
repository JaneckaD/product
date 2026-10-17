"use client";

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * A clay-render model of a single-storey house: five rooms on one axis,
 * doors in line (an enfilade). Units are metres; the front door is at z = 0
 * and the house runs towards −z.
 */

export const CEILING = 3.0;
const PARAPET = 3.35;
const T = 0.2; // exterior wall thickness
const W = 7; // interior width
const L = 40; // interior length
const FY = 0.06; // floor top
const ROOM = 8;

const mat = {
  wall: new THREE.MeshStandardMaterial({ color: "#efebe4", roughness: 0.95 }),
  ceiling: new THREE.MeshStandardMaterial({ color: "#f3f0ea", roughness: 1, shadowSide: THREE.DoubleSide }),
  floor: new THREE.MeshStandardMaterial({ color: "#d8cbb6", roughness: 0.75 }),
  ground: new THREE.MeshStandardMaterial({ color: "#d3ccbf", roughness: 1 }),
  paving: new THREE.MeshStandardMaterial({ color: "#d9d3c8", roughness: 0.9 }),
  black: new THREE.MeshStandardMaterial({ color: "#1c1b1a", roughness: 0.45, metalness: 0.2 }),
  fabric: new THREE.MeshStandardMaterial({ color: "#dcd4c7", roughness: 1 }),
  linen: new THREE.MeshStandardMaterial({ color: "#f1ede6", roughness: 1 }),
  throw: new THREE.MeshStandardMaterial({ color: "#b7aa96", roughness: 1 }),
  rug: new THREE.MeshStandardMaterial({ color: "#e6e0d5", roughness: 1 }),
  wood: new THREE.MeshStandardMaterial({ color: "#b59f80", roughness: 0.7 }),
  stone: new THREE.MeshStandardMaterial({ color: "#e8e3db", roughness: 0.55 }),
  ceramic: new THREE.MeshStandardMaterial({ color: "#f7f5f1", roughness: 0.25 }),
  water: new THREE.MeshStandardMaterial({ color: "#dfe3e1", roughness: 0.05, metalness: 0.1 }),
  mirror: new THREE.MeshStandardMaterial({ color: "#dcdedb", roughness: 0.12, metalness: 0.5 }),
  plant: new THREE.MeshStandardMaterial({ color: "#8c937e", roughness: 0.9 }),
  bark: new THREE.MeshStandardMaterial({ color: "#5b5348", roughness: 1 }),
};

type Vec3 = [number, number, number];

function Box({
  size,
  position,
  material = mat.wall,
  rotation,
}: {
  size: Vec3;
  position: Vec3;
  material?: THREE.Material;
  rotation?: Vec3;
}) {
  return (
    <mesh position={position} rotation={rotation} material={material} castShadow receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

function Cyl({
  r,
  h,
  position,
  material,
  rotation,
  rTop,
  segments = 48,
}: {
  r: number;
  h: number;
  position: Vec3;
  material: THREE.Material;
  rotation?: Vec3;
  rTop?: number;
  segments?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} material={material} castShadow receiveShadow>
      <cylinderGeometry args={[rTop ?? r, r, h, segments]} />
    </mesh>
  );
}

type Opening = { x: number; y: number; w: number; h: number; frame?: boolean; mullions?: number };

/** A wall along local x with rectangular openings, built from solid boxes. */
function Wall({
  length,
  height,
  thickness = T,
  openings = [],
  position,
  rotation,
}: {
  length: number;
  height: number;
  thickness?: number;
  openings?: Opening[];
  position: Vec3;
  rotation?: Vec3;
}) {
  const pieces: { size: Vec3; position: Vec3; material?: THREE.Material }[] = [];
  const sorted = [...openings].sort((a, b) => a.x - b.x);
  let cursor = -length / 2;

  for (const o of sorted) {
    const left = o.x - o.w / 2;
    const right = o.x + o.w / 2;
    if (left > cursor) pieces.push({ size: [left - cursor, height, thickness], position: [(cursor + left) / 2, height / 2, 0] });
    if (o.y > 0) pieces.push({ size: [o.w, o.y, thickness], position: [o.x, o.y / 2, 0] });
    const top = o.y + o.h;
    if (top < height) pieces.push({ size: [o.w, height - top, thickness], position: [o.x, (top + height) / 2, 0] });

    if (o.frame) {
      const f = 0.05;
      const d = thickness * 0.55;
      pieces.push({ size: [o.w, f, d], position: [o.x, top - f / 2, 0], material: mat.black });
      if (o.y > 0) pieces.push({ size: [o.w, f, d], position: [o.x, o.y + f / 2, 0], material: mat.black });
      pieces.push({ size: [f, o.h, d], position: [left + f / 2, o.y + o.h / 2, 0], material: mat.black });
      pieces.push({ size: [f, o.h, d], position: [right - f / 2, o.y + o.h / 2, 0], material: mat.black });
      const n = o.mullions ?? 0;
      for (let i = 1; i <= n; i++) {
        const x = left + (o.w * i) / (n + 1);
        pieces.push({ size: [0.035, o.h, d * 0.8], position: [x, o.y + o.h / 2, 0], material: mat.black });
      }
    }
    cursor = right;
  }
  if (cursor < length / 2) {
    pieces.push({ size: [length / 2 - cursor, height, thickness], position: [(cursor + length / 2) / 2, height / 2, 0] });
  }

  return (
    <group position={position} rotation={rotation}>
      {pieces.map((p, i) => (
        <Box key={i} {...p} />
      ))}
    </group>
  );
}

/** Exterior side wall along z; openings are given in world z. */
function SideWall({ side, openings }: { side: -1 | 1; openings: Opening[] }) {
  const centerZ = -L / 2;
  return (
    <Wall
      length={L + 2 * T}
      height={PARAPET}
      position={[side * (W / 2 + T / 2), 0, centerZ]}
      rotation={[0, Math.PI / 2, 0]}
      openings={openings.map((o) => ({ ...o, x: centerZ - o.x }))}
    />
  );
}

/** Downward-facing ceiling planes; invisible from above so the aerial view reads as a cut model. */
function Ceiling({ z0, z1, hole }: { z0: number; z1: number; hole?: { x0: number; x1: number; z0: number; z1: number } }) {
  const plane = (x0: number, x1: number, za: number, zb: number, key: string) => (
    <mesh
      key={key}
      rotation={[Math.PI / 2, 0, 0]}
      position={[(x0 + x1) / 2, CEILING, (za + zb) / 2]}
      material={mat.ceiling}
      castShadow
      receiveShadow
    >
      <planeGeometry args={[x1 - x0, Math.abs(za - zb)]} />
    </mesh>
  );
  const x0 = -W / 2;
  const x1 = W / 2;
  if (!hole) return plane(x0, x1, z0, z1, "c");
  return (
    <group>
      {plane(x0, x1, z0, hole.z0, "a")}
      {plane(x0, x1, hole.z1, z1, "b")}
      {plane(x0, hole.x0, hole.z0, hole.z1, "c")}
      {plane(hole.x1, x1, hole.z0, hole.z1, "d")}
    </group>
  );
}

function Partition({ z }: { z: number }) {
  return (
    <Wall
      length={W}
      height={CEILING}
      thickness={0.16}
      position={[0, 0, z]}
      openings={[{ x: 0, y: 0, w: 1.2, h: 2.4, frame: true }]}
    />
  );
}

function Tree({ position, scale = 1 }: { position: Vec3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <Cyl r={0.12} rTop={0.07} h={2.4} position={[0, 1.2, 0]} material={mat.bark} segments={12} />
      {(
        [
          [0, 3.0, 0, 1.15],
          [0.6, 2.6, 0.3, 0.8],
          [-0.5, 2.7, -0.3, 0.85],
          [0.1, 3.6, -0.2, 0.75],
        ] as const
      ).map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} material={mat.plant} castShadow receiveShadow>
          <icosahedronGeometry args={[r, 3]} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- rooms ---------- */

function Entry() {
  return (
    <group>
      {/* Oak bench along the right wall */}
      <RoundedBox args={[0.42, 0.08, 1.8]} radius={0.02} position={[3.24, FY + 0.43, -4.6]} material={mat.wood} castShadow receiveShadow />
      <Box size={[0.38, 0.4, 0.06]} position={[3.24, FY + 0.2, -3.8]} material={mat.wood} />
      <Box size={[0.38, 0.4, 0.06]} position={[3.24, FY + 0.2, -5.4]} material={mat.wood} />
      {/* Two black hooks */}
      {[-4.2, -4.9].map((z) => (
        <group key={z}>
          <Cyl r={0.018} h={0.13} position={[3.44, FY + 1.72, z]} rotation={[0, 0, Math.PI / 2]} material={mat.black} segments={16} />
          <mesh position={[3.375, FY + 1.72, z]} material={mat.black} castShadow>
            <sphereGeometry args={[0.03, 16, 16]} />
          </mesh>
        </group>
      ))}
      {/* Round mirror */}
      <Cyl r={0.42} h={0.02} position={[3.48, FY + 1.55, -6.5]} rotation={[0, 0, Math.PI / 2]} material={mat.black} />
      <Cyl r={0.4} h={0.02} position={[3.47, FY + 1.55, -6.5]} rotation={[0, 0, Math.PI / 2]} material={mat.mirror} />
      {/* Vase with a branch */}
      <Cyl r={0.07} rTop={0.05} h={0.32} position={[3.22, FY + 0.63, -5.15]} material={mat.black} />
      <Cyl r={0.006} h={0.7} position={[3.2, FY + 1.0, -5.12]} rotation={[0.25, 0, -0.15]} material={mat.bark} segments={6} />
      {/* Open front door leaf */}
      <Box size={[0.05, 2.36, 1.12]} position={[0.66, FY + 1.18, -0.6]} material={mat.black} />
    </group>
  );
}

function Living() {
  return (
    <group>
      <Box size={[3.4, 0.012, 2.6]} position={[0.4, FY + 0.006, -12]} material={mat.rug} />
      {/* Low sofa facing the window */}
      <RoundedBox args={[0.95, 0.36, 2.7]} radius={0.06} position={[2.45, FY + 0.18, -12]} material={mat.fabric} castShadow receiveShadow />
      <RoundedBox args={[0.24, 0.42, 2.7]} radius={0.06} position={[2.88, FY + 0.5, -12]} material={mat.fabric} castShadow receiveShadow />
      <RoundedBox args={[0.7, 0.14, 1.3]} radius={0.05} position={[2.38, FY + 0.43, -12.66]} material={mat.linen} castShadow receiveShadow />
      <RoundedBox args={[0.7, 0.14, 1.3]} radius={0.05} position={[2.38, FY + 0.43, -11.34]} material={mat.linen} castShadow receiveShadow />
      {/* Round coffee table */}
      <Cyl r={0.55} h={0.3} position={[0.7, FY + 0.15, -12]} material={mat.stone} segments={64} />
      <Cyl r={0.12} rTop={0.09} h={0.08} position={[0.55, FY + 0.34, -11.85]} material={mat.ceramic} />
      {/* Side stool */}
      <Cyl r={0.2} h={0.42} position={[1.9, FY + 0.21, -10.2]} material={mat.black} />
      {/* Floor lamp */}
      <Cyl r={0.16} h={0.02} position={[2.9, FY + 0.01, -14.4]} material={mat.black} />
      <Cyl r={0.012} h={1.5} position={[2.9, FY + 0.76, -14.4]} material={mat.black} segments={8} />
      <Cyl r={0.24} rTop={0.18} h={0.3} position={[2.9, FY + 1.6, -14.4]} material={mat.linen} />
      {/* Art above the sofa */}
      <Box size={[0.03, 1.0, 1.4]} position={[3.485, FY + 1.75, -12]} material={mat.black} />
      <Box size={[0.03, 0.92, 1.32]} position={[3.47, FY + 1.75, -12]} material={mat.linen} />
      {/* Plant */}
      <Cyl r={0.22} rTop={0.26} h={0.5} position={[-2.8, FY + 0.25, -8.9]} material={mat.ceramic} />
      <mesh position={[-2.8, FY + 0.95, -8.9]} material={mat.plant} castShadow>
        <icosahedronGeometry args={[0.45, 3]} />
      </mesh>
    </group>
  );
}

function Kitchen() {
  return (
    <group>
      {/* Counter under the strip window and a tall cabinet */}
      <Box size={[0.65, 0.92, 5.4]} position={[-3.17, FY + 0.46, -20]} material={mat.stone} />
      <Box size={[0.65, 2.7, 1.2]} position={[-3.17, FY + 1.35, -23.3]} material={mat.wall} />
      {/* Sink and black tap */}
      <Box size={[0.42, 0.02, 0.6]} position={[-3.12, FY + 0.925, -19.4]} material={mat.black} />
      <Cyl r={0.015} h={0.32} position={[-3.38, FY + 1.08, -19.4]} material={mat.black} segments={12} />
      <Cyl r={0.013} h={0.22} position={[-3.28, FY + 1.23, -19.4]} rotation={[0, 0, Math.PI / 2]} material={mat.black} segments={12} />
      {/* Island */}
      <RoundedBox args={[1.0, 0.92, 2.8]} radius={0.025} position={[1.0, FY + 0.46, -20]} material={mat.stone} castShadow receiveShadow />
      <mesh position={[1.0, FY + 0.92, -20.6]} rotation={[Math.PI, 0, 0]} material={mat.ceramic} castShadow>
        <sphereGeometry args={[0.16, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* Stools */}
      {[-19.4, -20.6].map((z) => (
        <group key={z}>
          <Cyl r={0.18} h={0.05} position={[1.9, FY + 0.66, z]} material={mat.wood} />
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2;
            return (
              <Cyl
                key={i}
                r={0.012}
                h={0.66}
                position={[1.9 + Math.cos(a) * 0.12, FY + 0.32, z + Math.sin(a) * 0.12]}
                rotation={[Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12]}
                material={mat.black}
                segments={8}
              />
            );
          })}
        </group>
      ))}
      {/* Pendant lights */}
      {[-19.3, -20.7].map((z) => (
        <group key={z}>
          <Cyl r={0.005} h={0.75} position={[1.0, CEILING - 0.375, z]} material={mat.black} segments={6} />
          <mesh position={[1.0, CEILING - 0.85, z]} material={mat.black} castShadow>
            <coneGeometry args={[0.17, 0.22, 32, 1, true]} />
          </mesh>
        </group>
      ))}
      {/* Shelf with jars */}
      <Box size={[0.24, 0.04, 1.8]} position={[3.38, FY + 1.55, -18.6]} material={mat.wood} />
      <Cyl r={0.07} h={0.24} position={[3.35, FY + 1.69, -18.0]} material={mat.ceramic} />
      <Cyl r={0.06} h={0.18} position={[3.35, FY + 1.66, -18.25]} material={mat.black} />
      <Cyl r={0.08} h={0.12} position={[3.35, FY + 1.63, -19.0]} material={mat.ceramic} />
    </group>
  );
}

function Bedroom() {
  return (
    <group>
      <Box size={[3.0, 0.012, 3.0]} position={[1.8, FY + 0.006, -28.2]} material={mat.rug} />
      {/* Headboard panel */}
      <Box size={[0.05, 1.1, 2.6]} position={[3.47, FY + 0.85, -28.2]} material={mat.wood} />
      {/* Bed */}
      <Box size={[2.1, 0.22, 2.2]} position={[2.4, FY + 0.15, -28.2]} material={mat.wood} />
      <RoundedBox args={[2.0, 0.22, 2.06]} radius={0.06} position={[2.4, FY + 0.37, -28.2]} material={mat.linen} castShadow receiveShadow />
      <RoundedBox args={[0.42, 0.14, 0.72]} radius={0.06} position={[3.15, FY + 0.54, -27.78]} material={mat.linen} castShadow receiveShadow />
      <RoundedBox args={[0.42, 0.14, 0.72]} radius={0.06} position={[3.15, FY + 0.54, -28.62]} material={mat.linen} castShadow receiveShadow />
      <RoundedBox args={[0.8, 0.04, 2.1]} radius={0.015} position={[1.75, FY + 0.49, -28.2]} material={mat.throw} castShadow receiveShadow />
      {/* Nightstand with lamp */}
      <Box size={[0.42, 0.42, 0.42]} position={[3.2, FY + 0.21, -26.75]} material={mat.wood} />
      <mesh position={[3.2, FY + 0.56, -26.75]} material={mat.ceramic} castShadow>
        <sphereGeometry args={[0.13, 32, 16]} />
      </mesh>
      {/* Bench under the window */}
      <Box size={[0.4, 0.42, 1.4]} position={[-3.2, FY + 0.21, -26]} material={mat.wood} />
    </group>
  );
}

function Bathroom() {
  return (
    <group>
      {/* Freestanding bath */}
      <RoundedBox args={[1.75, 0.56, 0.82]} radius={0.2} smoothness={6} position={[-1.6, FY + 0.28, -38.95]} material={mat.stone} castShadow receiveShadow />
      <Box size={[1.45, 0.02, 0.52]} position={[-1.6, FY + 0.5, -38.95]} material={mat.water} />
      <Cyl r={0.016} h={0.95} position={[-0.45, FY + 0.475, -38.95]} material={mat.black} segments={12} />
      <Cyl r={0.014} h={0.22} position={[-0.56, FY + 0.94, -38.95]} rotation={[0, 0, Math.PI / 2]} material={mat.black} segments={12} />
      {/* Floating vanity with stone bowl */}
      <Box size={[0.55, 0.14, 1.8]} position={[3.22, FY + 0.82, -35.5]} material={mat.stone} />
      <Cyl r={0.22} rTop={0.24} h={0.14} position={[3.2, FY + 0.96, -35.5]} material={mat.ceramic} />
      <Cyl r={0.012} h={0.2} position={[3.4, FY + 1.18, -35.5]} rotation={[0, 0, Math.PI / 2]} material={mat.black} segments={12} />
      {/* Mirror */}
      <Cyl r={0.46} h={0.02} position={[3.48, FY + 1.7, -35.5]} rotation={[0, 0, Math.PI / 2]} material={mat.mirror} />
      {/* Towel and stool */}
      <Box size={[0.05, 0.9, 0.5]} position={[3.45, FY + 1.1, -37.6]} material={mat.linen} />
      <Cyl r={0.17} h={0.45} position={[-3.0, FY + 0.225, -37.2]} material={mat.wood} />
      <Cyl r={0.15} rTop={0.18} h={0.4} position={[-3.05, FY + 0.2, -33.0]} material={mat.ceramic} />
      <mesh position={[-3.05, FY + 0.75, -33.0]} material={mat.plant} castShadow>
        <icosahedronGeometry args={[0.32, 3]} />
      </mesh>
    </group>
  );
}

export default function House() {
  return (
    <group>
      {/* Ground, paving and trees */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]} material={mat.ground} receiveShadow>
        <planeGeometry args={[400, 400]} />
      </mesh>
      <Box size={[3.2, 0.1, 2.6]} position={[0, 0.05, 1.5]} material={mat.paving} />
      <Box size={[1.4, 0.1, 6]} position={[0, 0.02, 5.8]} material={mat.paving} />
      <Box size={[W + 2 * T, 0.18, 1.6]} position={[0, PARAPET - 0.09, 0.8]} material={mat.wall} />
      <Tree position={[5.2, 0, 4.6]} scale={1.1} />
      <Tree position={[6.8, 0, -7]} />
      <Tree position={[-7.2, 0, -22]} scale={1.3} />
      <Tree position={[7.4, 0, -31]} scale={1.15} />
      <Tree position={[-6.4, 0, -43]} />
      <Tree position={[5.2, 0, -46]} scale={0.9} />
      <Box size={[0.45, 0.42, 2.4]} position={[3.1, 0.21, 3.2]} material={mat.paving} />

      {/* Floor */}
      <Box size={[W, FY, L]} position={[0, FY / 2, -L / 2]} material={mat.floor} />

      {/* Exterior walls */}
      <Wall
        length={W}
        height={PARAPET}
        position={[0, 0, T / 2]}
        openings={[
          { x: 0, y: FY, w: 1.2, h: 2.4, frame: true },
          { x: -2.3, y: 0.5, w: 0.5, h: 2.2, frame: true },
        ]}
      />
      <Wall length={W} height={PARAPET} position={[0, 0, -L - T / 2]} openings={[{ x: 1.5, y: 1.0, w: 1.6, h: 1.4, frame: true }]} />
      <SideWall
        side={-1}
        openings={[
          { x: -5.2, y: 0.25, w: 0.45, h: 2.4, frame: true },
          { x: -12, y: FY, w: 5.6, h: 2.75, frame: true, mullions: 2 },
          { x: -20, y: 1.05, w: 4.6, h: 0.9, frame: true, mullions: 1 },
          { x: -26, y: 0.9, w: 1.1, h: 1.3, frame: true },
          { x: -36, y: 2.2, w: 6, h: 0.45, frame: true, mullions: 2 },
        ]}
      />
      <SideWall side={1} openings={[{ x: -20.5, y: 1.9, w: 0.8, h: 0.6, frame: true }]} />

      {/* Partitions and ceilings */}
      {[1, 2, 3, 4].map((i) => (
        <Partition key={i} z={-ROOM * i} />
      ))}
      <Ceiling z0={0} z1={-8} />
      <Ceiling z0={-8} z1={-16} />
      <Ceiling z0={-16} z1={-24} />
      <Ceiling z0={-24} z1={-32} hole={{ x0: 1.3, x1: 3.1, z0: -27.0, z1: -29.4 }} />
      <Ceiling z0={-32} z1={-40} />

      <Entry />
      <Living />
      <Kitchen />
      <Bedroom />
      <Bathroom />
    </group>
  );
}
