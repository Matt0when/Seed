/**
 * Animation configuration for WhatsNextTransition component.
 * Extracted for reusability and easier testing.
 */

// ============================================================================
// ANIMATION CONFIGURATION
// Flow: Fullscreen Clouds → Pill shape → Globe visible
// ============================================================================

export const ANIMATION_CONFIG = {
  ease: 'power2.inOut',

  // Phase 0: Clouds mask fades in (fullscreen clouds appear)
  // Fades in as scroll progress advances from start to end
  // Hidden at progress 0, fully visible by progress 0.05
  cloudsFadeIn: {
    start: 0,
    end: 0.05,
  },

  // Phase 1: Initial text fades in then out ("Your Health. Our Shared World.")
  initialTextFade: {
    fadeInStart: 0.025,
    fadeInEnd: 0.05,
    fadeOutStart: 0.45,
    fadeOutEnd: 0.5,
  },

  // Phase 2: Pill text fades in then out ("The human-planet axis")
  pillText: {
    fadeInStart: 0.45,
    fadeInEnd: 0.575,
    fadeOutStart: 0.775,
    fadeOutEnd: 0.9,
  },

  // Phase 3: Mask shrinks from fullscreen to pill shape
  maskShrink: {
    start: 0.3,
    end: 0.6,
  },

  // Phase 3.5: Pill to circle transition (width reduces to match height)
  // Synchronized with pill text fade-out - starts and ends together
  pillToCircle: {
    start: 0.75, // Start when pill text starts fading out (0.775)
    end: 0.9, // End when pill text fade-out completes
  },

  // Phase 4: Globe and content fade in (as they become visible around pill)
  globeReveal: {
    start: 0.7,
    end: 0.85,
  },

  // Phase 4b: Globe content (text) fade in - separate from globe video for independent tweaking
  globeContentReveal: {
    start: 0.75,
    end: 0.9,
  },

  // Phase 4c: Pill text slides left to align with globe content title
  // Synchronized with globeContentReveal so pill text moves to where title appears
  pillTextSlide: {
    start: 0.75,
    end: 0.9,
  },

  // Phase 5: Circle mask fades out (synchronized with globe reveal)
  circleMaskFadeOut: {
    start: 0.8,
    end: 0.9,
  },

  // Pill shape dimensions (fixed pixel values)
  pill: {
    width: 928, // px - pill width
    height: 405, // px - pill height
    borderRadius: 500, // px - border radius (creates pill shape)
    aspectRatio: 291 / 127, // aspect ratio
    initialScale: 3, // Start scale (2-3x bigger than screen)
    finalScale: 1.0, // Final scale (original size)
  },

  // Final circle dimensions (after pill-to-circle transition)
  circle: {
    size: 405, // px - circle size (matches pill height, 1:1 aspect ratio)
  },

  // Video scaling to prevent aspect ratio gaps
  videoScale: {
    start: 1.0, // Start scale (fullscreen)
    end: 1.2, // End scale (circle) - adjust this value (1.1-1.3) to fine-tune
  },
} as const;

export type AnimationConfig = typeof ANIMATION_CONFIG;
