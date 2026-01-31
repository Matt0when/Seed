/**
 * Shared animation utilities and configuration.
 */

/**
 * Maps a value from one range to another, clamping to the output range.
 * Useful for converting scroll progress (0-1) to animation values.
 *
 * @param value - The input value to map
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns The mapped and clamped value
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  if (value <= inMin) return outMin;
  if (value >= inMax) return outMax;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/**
 * Clamps a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linearly interpolates between two values.
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Standard easing curve names for consistency across animations.
 */
export const EASING = {
  smooth: 'power2.inOut',
  smoothOut: 'power2.out',
  smoothIn: 'power2.in',
  sharp: 'power3.inOut',
  sharpOut: 'power3.out',
  sharpIn: 'power3.in',
  bounce: 'elastic.out(1, 0.5)',
} as const;

/**
 * Common animation durations in seconds.
 */
export const DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.8,
  entrance: 0.8,
  exit: 0.6,
} as const;
