/**
 * Scroll configuration and fade-range helpers for HorizontalScroll.
 */

// ============================================================================
// FULLSCREEN MODE CONFIGURATION
// ============================================================================

export const FULLSCREEN_CONFIG = {
  // Which section indices have fullscreen at the START
  fullscreenSectionIndices: [2] as number[], // What's Next section

  // UI fade-out starts BEFORE entering whats-next section (during end of weeks-2-4)
  // This synchronizes with cloudsFadeIn which starts when whats-next section begins
  fadeOutStart: 0.4, // Start fading out UI at 40% global progress
  fadeOutEnd: 0.5, // UI fully hidden when whats-next section starts (50% global progress)
  // This means: at 0.45 (when clouds start appearing), UI is already 50% faded

  // UI is HIDDEN at start of section, fades IN as we scroll
  // At what progress does UI start appearing
  fadeInStart: 0.4,

  // At what progress is UI fully visible
  fadeInEnd: 0.6,
} as const;

// ============================================================================
// WHAT'S NEXT START TIMING
// ============================================================================

// How far into section 1 (as a ratio 0-1) the UI fade-out and clouds fade-in begin.
// 0.8 means the animations start at 80% through section 1.
export const UI_FADE_OUT_SECTION_RATIO = 0.8;

// Delay (in global scroll progress) before clouds fade-in starts after UI fade-out begins.
// 0.01 = 1% of total scroll delay.
export const CLOUDS_FADE_IN_DELAY = 0.03;

// ============================================================================
// FADE RANGE HELPERS
// ============================================================================

/**
 * Compute global progress start/end for UI fade-out.
 */
export function computeFadeOutRange(boundaries: number[]): {
  start: number;
  end: number;
} {
  const section1Start = boundaries[1] || 0.25;
  const section1End = boundaries[2] || 0.5;
  const section1Duration = section1End - section1Start;
  return {
    start: section1Start + section1Duration * UI_FADE_OUT_SECTION_RATIO,
    end: section1End,
  };
}

/**
 * Compute global progress start/end for clouds fade-in (with optional delay).
 */
export function computeCloudsFadeInRange(boundaries: number[]): {
  start: number;
  end: number;
} {
  const fadeOutRange = computeFadeOutRange(boundaries);
  return {
    start: fadeOutRange.start + CLOUDS_FADE_IN_DELAY,
    end: fadeOutRange.end,
  };
}

/**
 * Get the activation point for WhatsNextTransition (when isActive flips to true).
 * Uses the same computed fade-out start so clouds begin fading in immediately.
 */
export function getWhatsNextActivationPoint(boundaries: number[]): number {
  return computeFadeOutRange(boundaries).start;
}
