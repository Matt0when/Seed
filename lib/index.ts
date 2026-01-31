// GSAP utilities
export { gsap, useGSAP, ScrollTrigger, ScrollToPlugin } from './gsap';

// Animation utilities
export { mapRange, clamp, lerp, EASING, DURATION } from './animations';

// Scroll configuration
export {
  FULLSCREEN_CONFIG,
  UI_FADE_OUT_SECTION_RATIO,
  CLOUDS_FADE_IN_DELAY,
  computeFadeOutRange,
  computeCloudsFadeInRange,
  getWhatsNextActivationPoint,
} from './scrollConfig';

// WhatsNext configuration
export { ANIMATION_CONFIG } from './whatsNextConfig';
export type { AnimationConfig } from './whatsNextConfig';
