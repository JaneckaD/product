"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { hotspotEls, scrollState } from "@/lib/scrollState";
import type { Variant } from "@/lib/product";

/**
 * Placeholder headphones built from primitives. Replace with a .glb later:
 * keep the outer <group ref={root}> so the scroll choreography still applies.
 */

type Keyframe = {
  px: number;
  py: number;
  rx: number;
  ry: number;
  s: number;
  /** Exploded view of the ear cups (0..1). */
  explode: number;
  /** LED ring intensity. */
  glow: number;
  /** How much the idle spin applies (0..1). */
  spin: number;
};

// One keyframe per scroll stage, tuned for a wide viewport.
const KEYFRAMES: Keyframe[] = [
  { px: 0, py: -0.5, rx: 0.18, ry: -0.6, s: 0.85, explode: 0, glow: 0.6, spin: 1 },
  { px: 0.6, py: 0.45, rx: 0.12, ry: -1.0, s: 1.25, explode: 1, glow: 1.2, spin: 0 },
  { px: -1.85, py: 0.5, rx: 0.1, ry: -2.25, s: 1.5, explode: 0, glow: 0.4, spin: 0 },
  { px: 0.95, py: -1.05, rx: 0.8, ry: 0.25, s: 1.4, explode: 0, glow: 0.4, spin: 0 },
  { px: -1.25, py: 0.55, rx: 0.05, ry: -Math.PI / 2, s: 1.5, explode: 0, glow: 3, spin: 0 },
  { px: 1.15, py: -0.15, rx: 0.15, ry: -0.55, s: 1.0, explode: 0, glow: 1, spin: 0.35 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

function sampleKeyframes(stage: number, mobile: boolean): Keyframe {
  const max = KEYFRAMES.length - 1;
  const clamped = THREE.MathUtils.clamp(stage, 0, max);
  const i = Math.min(Math.floor(clamped), max - 1);
  const t = smooth(clamped - i);
  const a = KEYFRAMES[i];
  const b = KEYFRAMES[i + 1];
  const k = {} as Keyframe;
  for (const key of Object.keys(a) as (keyof Keyframe)[]) {
    k[key] = THREE.MathUtils.lerp(a[key], b[key], t);
  }
  if (mobile) {
    // Narrow screens: keep the product centered above the cards.
    k.px *= 0.15;
    k.py = k.py * 0.5 + 0.6;
    k.s *= 0.6;
  }
  return k;
}

/** 3D anchors (model space) for the HTML hotspot labels; order matches HOTSPOT_LABELS. */
const HOTSPOT_ANCHORS = [
  { stage: 1, position: [1.62, -0.45, 0] as const },
  { stage: 2, position: [-0.82, -0.45, 0] as const },
  { stage: 3, position: [0, 1.25, 0] as const },
  { stage: 4, position: [1.42, -0.45, 0] as const },
];

const projected = new THREE.Vector3();

const CUP_X = 0.98;
const CUP_Y = -0.45;

function useCupGeometry() {
  return useMemo(() => {
    // Lathe profile (radius, height); y = 0 faces the head, y grows outward.
    const pts = [
      [0.44, 0],
      [0.52, 0.01],
      [0.57, 0.05],
      [0.59, 0.12],
      [0.585, 0.22],
      [0.56, 0.29],
      [0.51, 0.335],
      [0.47, 0.345],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const geo = new THREE.LatheGeometry(pts, 96);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

export default function Headphones({ variant }: { variant: Variant }) {
  const root = useRef<THREE.Group>(null);
  const caps = useRef<(THREE.Group | null)[]>([]);
  const drivers = useRef<(THREE.Group | null)[]>([]);
  const anchors = useRef<(THREE.Object3D | null)[]>([]);
  const spin = useRef(0);
  const size = useThree((s) => s.size);

  const cupGeo = useCupGeometry();

  const materials = useMemo(
    () => ({
      shell: new THREE.MeshPhysicalMaterial({
        color: variant.shell,
        metalness: 0.35,
        roughness: 0.32,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
        side: THREE.DoubleSide,
      }),
      accent: new THREE.MeshPhysicalMaterial({
        color: variant.accent,
        metalness: 1,
        roughness: 0.18,
        clearcoat: 0.6,
      }),
      fabric: new THREE.MeshPhysicalMaterial({
        color: variant.fabric,
        roughness: 0.85,
        sheen: 0.6,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color("#5a5a60"),
      }),
      glow: new THREE.MeshStandardMaterial({
        color: variant.glow,
        emissive: variant.glow,
        emissiveIntensity: 1,
        toneMapped: false,
      }),
      driver: new THREE.MeshPhysicalMaterial({
        color: "#c8ccd4",
        metalness: 0.9,
        roughness: 0.25,
        iridescence: 1,
        iridescenceIOR: 1.6,
      }),
      magnet: new THREE.MeshStandardMaterial({ color: "#2a2b30", metalness: 1, roughness: 0.35 }),
    }),
    // Materials are created once; colors are animated in useFrame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const targets = useMemo(
    () => ({
      shell: new THREE.Color(),
      accent: new THREE.Color(),
      fabric: new THREE.Color(),
      glow: new THREE.Color(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const group = root.current;
    if (!group) return;
    const dt = Math.min(delta, 1 / 20);
    const mobile = size.width < 768;
    const k = sampleKeyframes(scrollState.stage, mobile);

    spin.current = (spin.current + dt * 0.45) % (Math.PI * 2);
    const idle = Math.sin(spin.current) * 0.9 * k.spin;
    const t = state.clock.elapsedTime;

    const damp = THREE.MathUtils.damp;
    group.position.x = damp(group.position.x, k.px, 4, dt);
    group.position.y = damp(group.position.y, k.py + Math.sin(t * 0.9) * 0.04, 4, dt);
    group.rotation.x = damp(group.rotation.x, k.rx + scrollState.pointerY * 0.08, 4, dt);
    group.rotation.y = damp(group.rotation.y, k.ry + idle + scrollState.pointerX * 0.15, 4, dt);
    group.rotation.z = damp(group.rotation.z, Math.sin(t * 0.6) * 0.02, 4, dt);
    const s = damp(group.scale.x, k.s, 4, dt);
    group.scale.setScalar(s);

    caps.current.forEach((cap) => {
      if (cap) cap.position.y = damp(cap.position.y, 0.345 + k.explode * 0.5, 5, dt);
    });
    drivers.current.forEach((driver) => {
      if (driver) driver.position.y = damp(driver.position.y, 0.16 + k.explode * 0.27, 5, dt);
    });

    // Smooth color transitions between variants.
    const lerp = 1 - Math.exp(-6 * dt);
    targets.shell.set(variant.shell);
    targets.accent.set(variant.accent);
    targets.fabric.set(variant.fabric);
    targets.glow.set(variant.glow);
    materials.shell.color.lerp(targets.shell, lerp);
    materials.accent.color.lerp(targets.accent, lerp);
    materials.fabric.color.lerp(targets.fabric, lerp);
    materials.glow.color.lerp(targets.glow, lerp);
    materials.glow.emissive.lerp(targets.glow, lerp);
    materials.glow.setValues({
      emissiveIntensity: damp(materials.glow.emissiveIntensity, k.glow * (0.85 + Math.sin(t * 3) * 0.15), 4, dt),
    });

    // Project anchors to screen space and move the HTML labels there.
    HOTSPOT_ANCHORS.forEach((h, i) => {
      const el = hotspotEls[i];
      const anchor = anchors.current[i];
      if (!el || !anchor) return;
      const o = THREE.MathUtils.clamp(1 - Math.abs(scrollState.stage - h.stage) * 2.5, 0, 1);
      projected.setFromMatrixPosition(anchor.matrixWorld).project(state.camera);
      const x = ((projected.x + 1) / 2) * size.width;
      const y = ((1 - projected.y) / 2) * size.height;
      el.style.opacity = String(o);
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${0.6 + o * 0.4})`;
    });
  });

  const cup = (side: 1 | -1, index: number) => (
    <group position={[side * CUP_X, CUP_Y, 0]} rotation={[0, 0, -side * (Math.PI / 2)]}>
      {/* Shell */}
      <mesh geometry={cupGeo} material={materials.shell} castShadow />
      {/* Inner fabric wall */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.fabric}>
        <circleGeometry args={[0.45, 64]} />
      </mesh>
      {/* Cushion */}
      <mesh position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.75]} material={materials.fabric}>
        <torusGeometry args={[0.41, 0.125, 32, 96]} />
      </mesh>
      {/* Driver, visible in the exploded view */}
      <group ref={(el) => void (drivers.current[index] = el)} position={[0, 0.16, 0]}>
        <mesh material={materials.driver} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.38, 0.12, 64, 1, true]} />
        </mesh>
        <mesh position={[0, -0.08, 0]} material={materials.magnet}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 48]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.accent}>
          <torusGeometry args={[0.39, 0.018, 16, 96]} />
        </mesh>
      </group>
      {/* Outer cap with metal ring and LED */}
      <group ref={(el) => void (caps.current[index] = el)} position={[0, 0.345, 0]}>
        <mesh material={materials.shell}>
          <cylinderGeometry args={[0.47, 0.47, 0.035, 96]} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.accent}>
          <torusGeometry args={[0.47, 0.022, 16, 96]} />
        </mesh>
        <mesh position={[0, 0.022, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.glow}>
          <torusGeometry args={[0.3, 0.01, 12, 96]} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.accent}>
          <circleGeometry args={[0.06, 32]} />
        </mesh>
      </group>
    </group>
  );

  return (
    <group ref={root}>
      {/* Headband: flattened aluminium arc + padded inner band */}
      <mesh scale={[1, 1, 2.4]} material={materials.shell} castShadow>
        <torusGeometry args={[1.15, 0.07, 32, 160, Math.PI]} />
      </mesh>
      <mesh scale={[1, 1, 2.6]} rotation={[0, 0, Math.PI * 0.12]} material={materials.fabric}>
        <torusGeometry args={[1.07, 0.05, 24, 160, Math.PI * 0.76]} />
      </mesh>
      {/* Telescopic sliders */}
      {[1, -1].map((side) => (
        <mesh key={side} position={[side * 1.15, -0.06, 0]} material={materials.accent}>
          <cylinderGeometry args={[0.035, 0.035, 0.36, 24]} />
        </mesh>
      ))}
      {cup(1, 0)}
      {cup(-1, 1)}

      {HOTSPOT_ANCHORS.map((h, i) => (
        <object3D key={h.stage} position={h.position} ref={(el) => void (anchors.current[i] = el)} />
      ))}
    </group>
  );
}
