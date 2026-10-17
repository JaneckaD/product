/**
 * Mutable state shared between the scroll handler and the R3F render loop.
 * Kept outside React so scrolling never triggers a re-render.
 */
export const walk = {
  /** 0..1 while the framed picture opens to full screen. */
  intro: 0,
  /** Continuous stop index along CAMERA_PATH rooms: 0 = exterior … 6 = aerial. */
  stage: 0,
  pointerX: 0,
  pointerY: 0,
};
