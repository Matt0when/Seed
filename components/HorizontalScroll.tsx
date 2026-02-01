import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import {
  FULLSCREEN_CONFIG,
  computeFadeOutRange,
  computeCloudsFadeInRange,
  getWhatsNextActivationPoint,
} from '../lib/scrollConfig';
import styles from './HorizontalScroll.module.css';

// Import all sections
import First7DaysSection from './sections/First7DaysSection';
import Weeks2to4Section from './sections/Weeks2to4Section';
import { WhatsNextTransition } from './WhatsNextTransition';

// ============================================================================
// SECTION CONFIGURATION
// ============================================================================

// Section configuration matching the timeline
// Timeline chapters: First 7 Days (0), Weeks 2~4 (1), What's Next (2)
// Note: WhatsNextTransition is a single unified section that combines
// the pill-to-globe transition internally with its own ScrollTrigger
const sections = [
  { id: 'first-7-days', component: First7DaysSection, chapterIndex: 0 },
  { id: 'weeks-2-4', component: Weeks2to4Section, chapterIndex: 1 },
  { id: 'whats-next', component: WhatsNextTransition, chapterIndex: 2 },
];

interface HorizontalScrollProps {
  onSectionChange?: (sectionIndex: number, progress: number) => void;
  onFullscreenChange?: (isFullscreen: boolean, uiOpacity: number) => void;
  activeSection?: number;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  onSectionChange,
  onFullscreenChange,
  activeSection,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const isScrollTriggerSetupRef = useRef(false);
  
  // Track progress for each section (used by WhatsNextTransition)
  const [sectionProgresses, setSectionProgresses] = useState<Record<number, number>>({});
  
  // Track raw scroll progress (0-1) for determining active section
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Use refs for callbacks to avoid dependency issues
  const onSectionChangeRef = useRef(onSectionChange);
  const onFullscreenChangeRef = useRef(onFullscreenChange);
  
  // Use refs to store current progress values (avoid state updates on every frame)
  const sectionProgressesRef = useRef<Record<number, number>>({});
  const scrollProgressRef = useRef(0);
  
  // Computed section boundaries based on actual DOM measurements
  // Default to equal splits, will be recalculated on mount/resize
  const sectionBoundariesRef = useRef<number[]>([0, 0.333, 0.667, 1.0]);
  
  // RAF-based throttling for state updates
  const rafIdRef = useRef<number | null>(null);
  const pendingUpdatesRef = useRef<{
    sectionProgresses?: Record<number, number>;
    scrollProgress?: number;
  }>({});
  
  // Store scheduleStateUpdate in a ref to avoid dependency issues
  const scheduleStateUpdateRef = useRef<() => void>(() => {
    // Placeholder function - will be replaced in useEffect
  });
  
  // Compute section boundaries from actual DOM measurements
  const computeSectionBoundaries = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    
    const sectionWrappers = track.querySelectorAll(`.${styles.sectionWrapper}`);
    if (sectionWrappers.length === 0) return;
    
    const totalWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollableWidth = totalWidth - viewportWidth;
    
    if (scrollableWidth <= 0) return;
    
    // Build cumulative offsets normalized by scrollable width
    const boundaries: number[] = [0];
    let cumulativeWidth = 0;
    
    sectionWrappers.forEach((wrapper, index) => {
      const sectionWidth = (wrapper as HTMLElement).offsetWidth;
      cumulativeWidth += sectionWidth;
      
      // The boundary is where this section ends (relative to scroll progress)
      // For each section, we scroll through (sectionWidth - viewportWidth) for first section,
      // and sectionWidth for subsequent sections
      // Actually, it's simpler: the scroll progress corresponds to how much of the track
      // has scrolled past the left edge of the viewport
      
      // When progress = 0, track is at x=0, we see section 0
      // When progress = 1, track is at x=-(totalWidth - viewportWidth), we see the end
      // Section boundary = (leftEdgeOfNextSection) / scrollableWidth
      // For section i, the next section starts at sum of widths[0..i]
      if (index < sectionWrappers.length - 1) {
        // Progress at which section i+1 starts = cumulative width / scrollableWidth
        // But we need to account for when the section actually comes into full view
        // A section "starts" when its left edge reaches the left of the viewport
        const boundaryProgress = Math.min(cumulativeWidth / scrollableWidth, 1);
        boundaries.push(boundaryProgress);
      }
    });
    
    boundaries.push(1.0);
    sectionBoundariesRef.current = boundaries;
  }, []);
  
  // Update refs when callbacks change
  useEffect(() => {
    onSectionChangeRef.current = onSectionChange;
    onFullscreenChangeRef.current = onFullscreenChange;
  }, [onSectionChange, onFullscreenChange]);
  
  // Initialize throttled state update function once
  useEffect(() => {
    scheduleStateUpdateRef.current = () => {
      if (rafIdRef.current !== null) return; // Already scheduled
      
      rafIdRef.current = requestAnimationFrame(() => {
        const updates = pendingUpdatesRef.current;
        
        if (updates.sectionProgresses) {
          setSectionProgresses(prev => {
            // Only update if values actually changed
            const hasChanges = Object.keys(updates.sectionProgresses!).some(
              key => prev[Number(key)] !== updates.sectionProgresses![Number(key)]
            );
            if (hasChanges) {
              return { ...prev, ...updates.sectionProgresses };
            }
            return prev;
          });
        }
        
        if (updates.scrollProgress !== undefined) {
          setScrollProgress(prev => {
            if (Math.abs(prev - updates.scrollProgress!) > 0.001) {
              return updates.scrollProgress!;
            }
            return prev;
          });
        }
        
        // Clear pending updates
        pendingUpdatesRef.current = {};
        rafIdRef.current = null;
      });
    };
  }, []); // Only set up once

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Scroll to section when activeSection changes from nav click
  const scrollToSection = useCallback((sectionIndex: number) => {
    if (!scrollTriggerRef.current || !trackRef.current) return;
    
    // Use computed section boundaries from actual DOM measurements
    const boundaries = sectionBoundariesRef.current;
    const targetProgress = boundaries[sectionIndex] || 0;
    const scrollTo = scrollTriggerRef.current.start + 
      (scrollTriggerRef.current.end - scrollTriggerRef.current.start) * targetProgress;
    
    gsap.to(window, {
      scrollTo: { y: scrollTo },
      duration: 0.8,
      ease: 'power2.inOut',
    });
  }, []);

  useEffect(() => {
    if (activeSection !== undefined && isClient) {
      scrollToSection(activeSection);
    }
  }, [activeSection, scrollToSection, isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    // Prevent multiple setups
    if (isScrollTriggerSetupRef.current) return;

    const container = containerRef.current;
    const track = trackRef.current;

    if (!container || !track) return;
    
    // Mark as setup
    isScrollTriggerSetupRef.current = true;
    
    // Compute section boundaries from actual DOM measurements
    computeSectionBoundaries();

    // Calculate total width
    const totalWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;

    // Create horizontal scroll animation - smooth free scroll, no snap
    const tween = gsap.to(track, {
      x: -(totalWidth - viewportWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalWidth - viewportWidth}`,
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Use computed section boundaries from actual DOM measurements
          const sectionBoundaries = sectionBoundariesRef.current;
          
          // Find which section we're in
          let currentSectionIndex = 0;
          for (let i = 0; i < sectionBoundaries.length - 1; i++) {
            if (progress >= sectionBoundaries[i] && progress < sectionBoundaries[i + 1]) {
              currentSectionIndex = i;
              break;
            }
          }
          // Handle exact end
          if (progress >= 1) currentSectionIndex = sections.length - 1;
          
          // Calculate internal progress within current section (0 to 1)
          const sectionStart = sectionBoundaries[currentSectionIndex];
          const sectionEnd = sectionBoundaries[currentSectionIndex + 1] || 1;
          const sectionInternalProgress = sectionEnd > sectionStart 
            ? (progress - sectionStart) / (sectionEnd - sectionStart)
            : 0;
          
          // Update refs immediately (no re-render)
          const prevSectionProgress = sectionProgressesRef.current[currentSectionIndex];
          if (prevSectionProgress !== sectionInternalProgress) {
            sectionProgressesRef.current = {
              ...sectionProgressesRef.current,
              [currentSectionIndex]: sectionInternalProgress,
            };
            // Schedule state update
            pendingUpdatesRef.current.sectionProgresses = {
              ...sectionProgressesRef.current,
            };
            scheduleStateUpdateRef.current?.();
          }
          
          // Calculate whats-next section progress even during transition period
          // This ensures WhatsNextTransition receives progress values before we fully enter section 2
          const whatsNextStart = sectionBoundaries[2] || 0.5;
          const whatsNextEnd = sectionBoundaries[3] || 1.0;
          const whatsNextActivationPoint = getWhatsNextActivationPoint(sectionBoundaries);
          
          if (progress >= whatsNextActivationPoint && currentSectionIndex < 2) {
            // Calculate progress for whats-next section (will be 0 at whatsNextStart, increases as we scroll)
            // Clamp to 0 since we're still transitioning into the section
            const whatsNextProgress = Math.max(0, (progress - whatsNextStart) / (whatsNextEnd - whatsNextStart));
            sectionProgressesRef.current[2] = whatsNextProgress;
            pendingUpdatesRef.current.sectionProgresses = {
              ...sectionProgressesRef.current,
            };
            scheduleStateUpdateRef.current?.();
          }
          
          // Update scroll progress ref
          if (Math.abs(scrollProgressRef.current - progress) > 0.001) {
            scrollProgressRef.current = progress;
            pendingUpdatesRef.current.scrollProgress = progress;
            scheduleStateUpdateRef.current?.();
          }
          
          // Get the chapter index from the section configuration
          const chapterIndex = sections[currentSectionIndex]?.chapterIndex ?? 0;
          
          // Use ref to call callback (avoids dependency issues)
          onSectionChangeRef.current?.(chapterIndex, sectionInternalProgress);

          // Calculate fullscreen state for UI visibility
          // UI starts fading OUT before entering What's Next section (synchronized with cloudsFadeIn)
          // UI is HIDDEN at START of What's Next (fullscreen clouds)
          // UI FADES IN as we scroll through the section
          const isInFullscreenSection = FULLSCREEN_CONFIG.fullscreenSectionIndices.includes(
            currentSectionIndex
          );
          const isBeforeFullscreenSection = currentSectionIndex === 1; // Weeks 2~4 section
          
          let uiOpacity = 1;
          let isFullscreen = false;
          
          // Compute fade-out thresholds using shared helper (same range used for clouds fade-in)
          const fadeOutRange = computeFadeOutRange(sectionBoundaries);
          
          // Start fading out UI before entering whats-next section
          if (isBeforeFullscreenSection) {
            if (progress >= fadeOutRange.start && progress < fadeOutRange.end) {
              // Fading out - calculate opacity based on global progress
              const fadeOutProgress = (progress - fadeOutRange.start) / (fadeOutRange.end - fadeOutRange.start);
              uiOpacity = 1 - fadeOutProgress;
              isFullscreen = false; // Not fullscreen yet, just fading out
            } else if (progress >= fadeOutRange.end) {
              // Already fully faded out (shouldn't happen in section 1, but handle it)
              uiOpacity = 0;
              isFullscreen = true;
            }
            // Before fadeOutRange.start - UI fully visible (opacity = 1)
          } else if (isInFullscreenSection) {
            const { fadeInStart, fadeInEnd } = FULLSCREEN_CONFIG;
            
            if (sectionInternalProgress <= fadeInStart) {
              // Before fade in - fully hidden (fullscreen mode)
              uiOpacity = 0;
              isFullscreen = true;
            } else if (sectionInternalProgress < fadeInEnd) {
              // In fade zone - gradually show
              const fadeProgress = (sectionInternalProgress - fadeInStart) / 
                                   (fadeInEnd - fadeInStart);
              uiOpacity = fadeProgress;
              isFullscreen = false;
            }
            // After fadeInEnd - UI fully visible (opacity = 1)
          }
          
          // Use ref to call callback (avoids dependency issues)
          onFullscreenChangeRef.current?.(isFullscreen, uiOpacity);
        },
      },
    });

    // Store ScrollTrigger reference directly from the tween for efficient cleanup
    scrollTriggerRef.current = tween.scrollTrigger || null;
    
    // Recompute boundaries on resize
    const handleResize = () => {
      computeSectionBoundaries();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      // Cancel any pending RAF updates
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
      isScrollTriggerSetupRef.current = false;
      // Kill the ScrollTrigger directly using stored reference (more efficient than iterating all)
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      tween.kill();
    };
  }, [isClient, computeSectionBoundaries]); // scheduleStateUpdate is in a ref, no dependency needed

  if (!isClient) {
    return <div className={styles.container} style={{ height: '100vh' }} />;
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={trackRef} className={styles.track}>
        {sections.map(({ id, component: Component }, index) => (
          <div key={id} className={styles.sectionWrapper} data-section={id}>
            {/* Pass progress props to all sections for scroll-driven animations */}
            {id === 'first-7-days' && (
              <Component 
                progress={sectionProgresses[index] || 0}
              />
            )}
            {id === 'weeks-2-4' && (
              <Component 
                progress={sectionProgresses[index] || 0}
                globalProgress={scrollProgress}
              />
            )}
            {id === 'whats-next' && (
              <Component 
                progress={sectionProgresses[index] || 0} 
                // isActive controls fade-in: starts at same point UI fade-out begins
                // The component is always rendered as a child, but only visible when active
                isActive={(() => {
                  const boundaries = sectionBoundariesRef.current;
                  const activationPoint = getWhatsNextActivationPoint(boundaries);
                  return scrollProgress >= activationPoint;
                })()}
                // Pass global progress and fade range for clouds fade-in (with delay)
                globalProgress={scrollProgress}
                cloudsFadeInStart={computeCloudsFadeInRange(sectionBoundariesRef.current).start}
                cloudsFadeInEnd={computeCloudsFadeInRange(sectionBoundariesRef.current).end}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScroll;
