"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles, AdaptiveDpr } from "@react-three/drei";
import Headphones from "./Headphones";
import type { Variant } from "@/lib/product";

export default function Scene({ variant, active }: { variant: Variant; active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <pointLight position={[-4, -2, 3]} intensity={18} color={variant.glow} distance={12} />
      <spotLight position={[0, 5, -4]} angle={0.6} penumbra={1} intensity={40} color="#ffffff" />

      <Headphones variant={variant} />

      <Sparkles count={70} scale={[9, 6, 4]} size={2.2} speed={0.35} opacity={0.5} color={variant.glow} />

      {/* Procedural studio lighting: no HDR download needed. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 2]} scale={[8, 1.5, 1]} rotation={[Math.PI / 2, 0, 0]} />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 1]} scale={[3, 6, 1]} rotation={[0, Math.PI / 2, 0]} />
        <Lightformer form="rect" intensity={2} position={[5, 1, 1]} scale={[3, 6, 1]} rotation={[0, -Math.PI / 2, 0]} />
        <Lightformer form="ring" intensity={1.5} position={[0, 0, -6]} scale={4} />
      </Environment>
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
