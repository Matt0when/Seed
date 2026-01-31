/**
 * Centralized GSAP plugin registration and configuration.
 * Import this module once at app startup to ensure plugins are registered.
 */
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

// Register plugins once (safe for SSR - checks for window)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);
}

// Re-export for convenience
export { gsap, useGSAP, ScrollTrigger, ScrollToPlugin };
