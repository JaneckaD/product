/**
 * Mutable state shared between the DOM (GSAP ScrollTrigger, pointer events)
 * and the R3F render loop. Kept outside React so scrolling never re-renders.
 */
export const scrollState = {
  /** Continuous stage index: 0 = hero, 1..4 = features, 5 = configurator. */
  stage: 0,
  /** Pointer position normalized to -1..1. */
  pointerX: 0,
  pointerY: 0,
};

/** DOM nodes of the hotspot labels, positioned each frame by the 3D scene. */
export const hotspotEls: (HTMLDivElement | null)[] = [];
