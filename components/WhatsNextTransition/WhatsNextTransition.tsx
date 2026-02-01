/**
 * WhatsNextTransition - Animated transition from clouds to globe view.
 * Flow: Fullscreen Clouds → Pill shape → Globe visible
 */
import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap, useGSAP } from '../../lib/gsap';
import { mapRange } from '../../lib/animations';
import { ANIMATION_CONFIG } from '../../lib/whatsNextConfig';
import { GlobeLayer } from './GlobeLayer';
import { PillTextLayer } from './PillTextLayer';
import { CloudMaskLayer } from './CloudMaskLayer';
import styles from '../WhatsNextTransition.module.css';

interface WhatsNextTransitionProps {
  progress?: number;
  isActive?: boolean;
  globalProgress?: number;
  cloudsFadeInStart?: number;
  cloudsFadeInEnd?: number;
}

export const WhatsNextTransition: React.FC<WhatsNextTransitionProps> = ({
  progress = 0,
  isActive = false,
  globalProgress = 0,
  cloudsFadeInStart,
  cloudsFadeInEnd,
}) => {
  // Refs for animated elements
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const initialTextRef = useRef<HTMLDivElement>(null);
  const newTextRef = useRef<HTMLDivElement>(null);
  const cloudsVideoRef = useRef<HTMLVideoElement>(null);
  const globeVideoRef = useRef<HTMLVideoElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeContentRef = useRef<HTMLDivElement>(null);
  const rightTextSectionRef = useRef<HTMLDivElement>(null);

  // Mutable refs for video state
  const cloudsVideoDurationRef = useRef<number>(0);
  const globeVideoStartedRef = useRef<boolean>(false);
  // Throttle video scrubbing - only update if significant change
  const lastVideoTimeRef = useRef<number>(0);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize videos with proper cleanup
  useGSAP(
    () => {
      if (!isClient) return;

      const cloudsVideo = cloudsVideoRef.current;
      const globeVideo = globeVideoRef.current;

      // Globe video is controlled by scroll progress
      // It will start at 10 seconds when Phase 4 begins (progress >= 0.7)
      if (globeVideo) {
        globeVideo.currentTime = 10;
        globeVideo.pause();
      }

      // Clouds video is controlled by scroll - set up duration tracking
      if (cloudsVideo) {
        const handleLoadedMetadata = () => {
          cloudsVideoDurationRef.current = cloudsVideo.duration;
        };

        // If metadata is already loaded, capture duration immediately
        if (cloudsVideo.readyState >= 1) {
          cloudsVideoDurationRef.current = cloudsVideo.duration;
        }

        cloudsVideo.addEventListener('loadedmetadata', handleLoadedMetadata);
        cloudsVideo.pause();

        // Cleanup: pause videos and remove listeners on unmount
        return () => {
          cloudsVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
          cloudsVideo.pause();
          cloudsVideo.currentTime = 0;
          if (globeVideo) {
            globeVideo.pause();
            globeVideo.currentTime = 10;
          }
          globeVideoStartedRef.current = false;
          lastVideoTimeRef.current = 0;
        };
      }
    },
    { dependencies: [isClient] }
  );

  // Main animation loop - responds to scroll progress
  useGSAP(
    () => {
      const mask = maskRef.current;
      const cloudsVideo = cloudsVideoRef.current;
      const globeVideo = globeVideoRef.current;

      // When not active, pause videos and hide elements
      if (!isClient || !isActive) {
        if (mask) {
          gsap.set(mask, { opacity: 0, visibility: 'hidden' });
        }
        // Pause videos when inactive to save resources
        if (cloudsVideo) {
          cloudsVideo.pause();
        }
        if (globeVideo && globeVideoStartedRef.current) {
          globeVideo.pause();
          globeVideoStartedRef.current = false;
        }
        return;
      }

      const initialText = initialTextRef.current;
      const newText = newTextRef.current;
      const globeContainer = globeContainerRef.current;
      const globeContent = globeContentRef.current;
      const rightTextSection = rightTextSectionRef.current;

      if (!mask || !initialText || !newText || !globeContainer || !globeContent || !cloudsVideo) {
        return;
      }

      const {
        cloudsFadeIn,
        initialTextFade,
        pillText,
        maskShrink,
        pillToCircle,
        globeReveal,
        globeContentReveal,
        pillTextSlide,
        circleMaskFadeOut,
        pill,
        circle,
        videoScale,
      } = ANIMATION_CONFIG;

      // Calculate mask scale early (needed for text inverse scaling)
      const maskProgress = mapRange(progress, maskShrink.start, maskShrink.end, 0, 1);
      const currentScale = pill.initialScale - maskProgress * (pill.initialScale - pill.finalScale);
      const textInverseScale = 1 / currentScale;

      // SCROLL-CONTROLLED VIDEO: Throttle currentTime updates for performance
      // Only update if the time difference is significant (>0.05s)
      const videoDuration = cloudsVideoDurationRef.current;
      if (videoDuration > 0) {
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const targetTime = clampedProgress * videoDuration;
        if (Math.abs(targetTime - lastVideoTimeRef.current) > 0.05) {
          cloudsVideo.currentTime = targetTime;
          lastVideoTimeRef.current = targetTime;
        }
      }

      // PHASE 0: Clouds Mask Fades In
      const effectiveFadeStart = cloudsFadeInStart ?? cloudsFadeIn.start;
      const effectiveFadeEnd = cloudsFadeInEnd ?? cloudsFadeIn.end;
      const effectiveProgress = cloudsFadeInStart !== undefined ? globalProgress : progress;

      const cloudsFadeProgress = isActive
        ? mapRange(effectiveProgress, effectiveFadeStart, effectiveFadeEnd, 0, 1)
        : 0;

      const cloudsBlur = 20 * (1 - cloudsFadeProgress);

      // PHASE 1: Initial Text Fade In then Out
      const initialTextFadeInProgress = mapRange(
        progress,
        initialTextFade.fadeInStart,
        initialTextFade.fadeInEnd,
        0,
        1
      );
      const initialTextFadeOutProgress = mapRange(
        progress,
        initialTextFade.fadeOutStart,
        initialTextFade.fadeOutEnd,
        0,
        1
      );
      const initialTextOpacity = initialTextFadeInProgress * (1 - initialTextFadeOutProgress);
      const initialTextBlur = 20 * (1 - initialTextFadeInProgress);

      // PHASE 2: Pill Text Fade In, then Fade Out
      const pillTextFadeInProgress = mapRange(
        progress,
        pillText.fadeInStart,
        pillText.fadeInEnd,
        0,
        1
      );
      const pillTextFadeOutProgress = mapRange(
        progress,
        pillText.fadeOutStart,
        pillText.fadeOutEnd,
        0,
        1
      );

      const pillTextOpacity = Math.min(1, pillTextFadeInProgress) * (1 - pillTextFadeOutProgress);
      const pillTextBlur =
        15 * (1 - Math.min(1, pillTextFadeInProgress)) + 15 * pillTextFadeOutProgress;

      // PHASE 2b: Pill Text Slides Left
      const pillTextSlideProgress = mapRange(
        progress,
        pillTextSlide.start,
        pillTextSlide.end,
        0,
        1
      );

      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const textWidth = newText.offsetWidth || 200;
      const currentLeftEdge = windowWidth / 2 - textWidth / 2;

      let targetLeftPosition: number;
      if (windowWidth <= 1200) {
        targetLeftPosition = currentLeftEdge;
      } else if (windowWidth <= 1400) {
        targetLeftPosition = 60;
      } else {
        targetLeftPosition = 100;
      }

      const currentSlideX = pillTextSlideProgress * (targetLeftPosition - currentLeftEdge);

      // Color transition: white -> seed green (#1C3A13)
      const r = Math.round(255 - pillTextSlideProgress * (255 - 28));
      const g = Math.round(255 - pillTextSlideProgress * (255 - 58));
      const b = Math.round(255 - pillTextSlideProgress * (255 - 19));

      // PHASE 3: Mask Shrinks (Fullscreen → Pill)
      const pillWidth = pill.width;
      const pillHeight = pill.height;
      const pillBorderRadius = pill.borderRadius;

      // PHASE 3.5: Pill to Circle
      const pillToCircleProgress = mapRange(progress, pillToCircle.start, pillToCircle.end, 0, 1);

      const currentWidth = pillWidth - pillToCircleProgress * (pillWidth - circle.size);
      const circleRadius = circle.size / 2;
      const currentRadius =
        pillBorderRadius - pillToCircleProgress * (pillBorderRadius - circleRadius);

      // PHASE 5: Circle Mask Fade Out
      const circleMaskFadeOutProgress = mapRange(
        progress,
        circleMaskFadeOut.start,
        circleMaskFadeOut.end,
        0,
        1
      );

      const maskOpacity = cloudsFadeProgress * (1 - circleMaskFadeOutProgress);

      // VIDEO SCALING
      const videoScaleProgress = mapRange(progress, pillToCircle.start, pillToCircle.end, 0, 1);
      const finalVideoScale =
        videoScale.start + videoScaleProgress * (videoScale.end - videoScale.start);

      // PHASE 4: Globe Fade In
      const globeProgress = mapRange(progress, globeReveal.start, globeReveal.end, 0, 1);
      const globeBlur = 15 * (1 - globeProgress);

      // PHASE 4b: Globe Content Fade In
      const globeContentProgress = mapRange(
        progress,
        globeContentReveal.start,
        globeContentReveal.end,
        0,
        1
      );
      const globeContentBlur = 15 * (1 - globeContentProgress);

      // PHASE 4c: Right Text Section Slide In
      const slideFromRight = 200 * (1 - pillTextSlideProgress);

      // Apply all animations - grouped by element for clarity
      gsap.set(initialText, {
        opacity: initialTextOpacity,
        filter: `blur(${initialTextBlur}px)`,
        scale: textInverseScale,
        transformOrigin: 'center center',
      });

      gsap.set(newText, {
        opacity: pillTextOpacity,
        filter: `blur(${pillTextBlur}px)`,
        x: currentSlideX,
        color: `rgb(${r}, ${g}, ${b})`,
      });

      gsap.set(mask, {
        width: currentWidth,
        height: pillHeight,
        borderRadius: currentRadius,
        scale: currentScale,
        opacity: maskOpacity,
        visibility: 'visible',
        filter: `blur(${cloudsBlur}px)`,
        transformOrigin: 'center center',
      });

      gsap.set(cloudsVideo, {
        scale: finalVideoScale,
        transformOrigin: 'center center',
      });

      gsap.set(globeContainer, {
        opacity: globeProgress,
        scale: 0.9 + globeProgress * 0.1,
        filter: `blur(${globeBlur}px)`,
      });

      gsap.set(globeContent, {
        opacity: globeContentProgress,
        filter: `blur(${globeContentBlur}px)`,
      });

      if (rightTextSection) {
        gsap.set(rightTextSection, { x: slideFromRight });
      }

      // GLOBE VIDEO CONTROL
      if (globeVideo) {
        if (progress >= globeReveal.start) {
          if (!globeVideoStartedRef.current) {
            globeVideo.currentTime = 10;
            globeVideo.play().catch(() => {});
            globeVideoStartedRef.current = true;
          }
        } else {
          if (globeVideoStartedRef.current) {
            globeVideo.pause();
            globeVideo.currentTime = 10;
            globeVideoStartedRef.current = false;
          }
        }
      }
    },
    { dependencies: [progress, isClient, isActive, globalProgress, cloudsFadeInStart, cloudsFadeInEnd] }
  );

  if (!isClient) {
    return <div className={styles.container} style={{ height: '100vh' }} />;
  }

  const fixedElementStyle = {
    visibility: isActive ? 'visible' : 'hidden',
    pointerEvents: isActive ? 'auto' : 'none',
  } as React.CSSProperties;

  const pillTextStyle = {
    visibility: 'visible',
    pointerEvents: 'none',
  } as React.CSSProperties;

  // Fixed elements need to be rendered via Portal to escape the transformed ancestor
  const fixedElements = isClient
    ? createPortal(
        <>
          <GlobeLayer
            globeContainerRef={globeContainerRef}
            globeContentRef={globeContentRef}
            globeVideoRef={globeVideoRef}
            rightTextSectionRef={rightTextSectionRef}
            style={fixedElementStyle}
          />
          <PillTextLayer ref={newTextRef} style={pillTextStyle} />
          <CloudMaskLayer
            ref={maskRef}
            cloudsVideoRef={cloudsVideoRef}
            initialTextRef={initialTextRef}
            style={fixedElementStyle}
          />
        </>,
        document.body
      )
    : null;

  return (
    <section
      ref={containerRef}
      className={styles.container}
      aria-label="What's Next Transition"
    >
      <div className={styles.background} />
      {fixedElements}
    </section>
  );
};

export default WhatsNextTransition;
