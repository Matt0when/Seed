/**
 * Shared hook for section entrance/exit animations.
 * Used by First7DaysSection and Weeks2to4Section for consistent behavior.
 */
import { useRef, RefObject } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { EASING } from '../lib/animations';

interface UseSectionAnimationOptions {
  /** Container ref to scope animations */
  containerRef: RefObject<HTMLElement | null>;
  /** Refs to animate (in order of stagger) */
  elementRefs: RefObject<HTMLElement | null>[];
  /** Section scroll progress (0-1) */
  progress: number;
  /** Whether to run entrance animation on mount */
  runEntranceAnimation?: boolean;
  /** Exit animation config */
  exitConfig?: {
    start: number;
    end: number;
    maxX: number;
    maxBlur: number;
  };
}

const DEFAULT_EXIT_CONFIG = {
  start: 0.1,
  end: 0.8,
  maxX: -100,
  maxBlur: 15,
};

/**
 * Hook for coordinated section entrance and scroll-driven exit animations.
 * Uses useGSAP for proper cleanup and context scoping.
 */
export function useSectionAnimation({
  containerRef,
  elementRefs,
  progress,
  runEntranceAnimation = true,
  exitConfig = DEFAULT_EXIT_CONFIG,
}: UseSectionAnimationOptions) {
  const animationComplete = useRef(false);
  const hasRunEntrance = useRef(false);

  // Entrance animation (runs once on mount)
  useGSAP(
    () => {
      if (!runEntranceAnimation || hasRunEntrance.current) return;

      const elements = elementRefs
        .map((ref) => ref.current)
        .filter(Boolean) as HTMLElement[];

      if (elements.length === 0) return;

      hasRunEntrance.current = true;

      // Set initial state - hidden, shifted left, blurred
      gsap.set(elements, {
        opacity: 0,
        x: -80,
        filter: 'blur(12px)',
      });

      // Create staggered entrance animation
      const tl = gsap.timeline({
        delay: 0.3,
        onComplete: () => {
          animationComplete.current = true;
        },
      });

      elements.forEach((el, i) => {
        tl.to(
          el,
          {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: EASING.smoothOut,
          },
          i === 0 ? undefined : '-=0.5'
        );
      });
    },
    { scope: containerRef, dependencies: [runEntranceAnimation] }
  );

  // Scroll-driven exit animation
  useGSAP(
    () => {
      // Don't run scroll animations until entrance animation is complete
      if (!animationComplete.current) return;

      const elements = elementRefs
        .map((ref) => ref.current)
        .filter(Boolean) as HTMLElement[];

      if (elements.length === 0) return;

      const { start, end, maxX, maxBlur } = exitConfig;

      // Clamp exit progress: 0 when not exiting, 0-1 during exit
      const exitProgress =
        progress <= start ? 0 : Math.min((progress - start) / (end - start), 1);

      // Apply power3.inOut easing to blur so it ramps gradually as motion starts
      const easeInOut = gsap.parseEase(EASING.sharp);
      const easedBlurProgress = easeInOut(exitProgress);

      // Calculate values - when exitProgress is 0, everything is at rest position
      const exitX = maxX * exitProgress;
      const exitOpacity = 1 - exitProgress;
      const exitBlur = maxBlur * easedBlurProgress;

      // Apply with staggered depth effect (elements further in list move less)
      elements.forEach((el, i) => {
        const depthFactor = 1 - i * 0.2; // 1, 0.8, 0.6, etc.
        gsap.set(el, {
          opacity: exitOpacity,
          x: exitX * depthFactor,
          filter: `blur(${exitBlur}px)`,
        });
      });
    },
    { scope: containerRef, dependencies: [progress, exitConfig] }
  );

  return { animationComplete };
}
