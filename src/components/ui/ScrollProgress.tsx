"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress({ color }: { color: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX, background: `linear-gradient(90deg, transparent, ${color})` }}
      className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left"
    />
  );
}
