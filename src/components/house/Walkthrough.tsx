"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, N8AO, SMAA } from "@react-three/postprocessing";
import * as THREE from "three";
import House from "./House";
import { CAMERA_PATH } from "@/lib/rooms";
import { walk } from "@/lib/walk";

const BG = "#e8e3db";

/** Ease that rests at each stop, so the camera pauses in a room while its text is read. */
function restEase(stage: number) {
  const i = Math.floor(stage);
  const t = THREE.MathUtils.clamp((stage - i - 0.18) / 0.64, 0, 1);
  return i + t * t * (3 - 2 * t);
}

const curves = {
  pos: new THREE.CatmullRomCurve3(CAMERA_PATH.map((p) => new THREE.Vector3(...p.position)), false, "centripetal"),
  tgt: new THREE.CatmullRomCurve3(CAMERA_PATH.map((p) => new THREE.Vector3(...p.target)), false, "centripetal"),
};
// Scratch vectors reused every frame.
const tmp = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const look = new THREE.Vector3(...CAMERA_PATH[0].target);

function CameraRig() {
  const sun = useRef<THREE.DirectionalLight>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const cam = state.camera;
    const segments = CAMERA_PATH.length - 1;
    // Each stage spans two curve points: the room and the doorway after it.
    const u = THREE.MathUtils.clamp((restEase(walk.stage) * 2) / segments, 0, 1);
    const t = state.clock.elapsedTime;

    curves.pos.getPoint(u, tmp);
    curves.tgt.getPoint(u, tmpLook);

    // While the picture is still framed, drift gently around the house.
    const drift = 1 - walk.intro;
    tmp.x += Math.sin(t * 0.25) * 0.8 * drift;
    tmp.y += Math.sin(t * 0.4) * 0.05 + 0.3 * drift;

    // Head movement from the pointer.
    tmpLook.x += walk.pointerX * 0.35;
    tmpLook.y -= walk.pointerY * 0.2;

    const k = 1 - Math.exp(-3.2 * dt);
    cam.position.lerp(tmp, k);
    look.lerp(tmpLook, k);
    cam.lookAt(look);

    // The sun follows the camera so the shadow map stays sharp where we look.
    const light = sun.current;
    if (light) {
      const aerial = THREE.MathUtils.clamp(walk.stage - 5, 0, 1);
      const extent = THREE.MathUtils.lerp(11, 30, aerial);
      const sc = light.shadow.camera;
      if (sc.right !== extent) {
        sc.left = -extent;
        sc.right = extent;
        sc.top = extent;
        sc.bottom = -extent;
        sc.updateProjectionMatrix();
      }
      const focus = THREE.MathUtils.lerp(look.z, -20, aerial);
      light.target.position.set(0, 0, focus);
      light.position.set(-13, 17, focus + 11);
      light.target.updateMatrixWorld();
    }
  });

  return (
    <directionalLight
      ref={sun}
      intensity={2.6}
      color="#fff1dc"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.03}
      shadow-camera-near={1}
      shadow-camera-far={70}
    />
  );
}

export default function Walkthrough({ active }: { active: boolean }) {
  return (
    <Canvas
      shadows="soft"
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: CAMERA_PATH[0].position, fov: 42, near: 0.05, far: 200 }}
      gl={{ antialias: false, powerPreference: "high-performance", toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.05 }}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 24, 95]} />
      <hemisphereLight args={["#fffaf2", "#e3d9cb", 2.3]} />
      <CameraRig />
      <House />

      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1.2} position={[0, 6, 0]} scale={[12, 12, 1]} rotation={[Math.PI / 2, 0, 0]} />
        <Lightformer form="rect" intensity={0.6} position={[-8, 2, 0]} scale={[6, 4, 1]} rotation={[0, Math.PI / 2, 0]} />
      </Environment>

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <N8AO aoRadius={0.9} distanceFalloff={0.6} intensity={1.7} color="#4a4239" halfRes />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
