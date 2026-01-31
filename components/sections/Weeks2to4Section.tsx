import React, { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { EASING } from '../../lib/animations';
import styles from './Section.module.css';

interface Weeks2to4SectionProps {
  progress?: number; // 0-1 progress within this section for scroll-driven animations
  globalProgress?: number; // 0-1 overall scroll progress to determine entrance timing
}

export const Weeks2to4Section: React.FC<Weeks2to4SectionProps> = ({
  progress = 0,
  globalProgress = 0,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const cardGridRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  // Scroll-driven entrance and exit animations
  useGSAP(
    () => {
      const leftContent = leftContentRef.current;
      const cardGrid = cardGridRef.current;
      const rightContent = rightContentRef.current;

      if (!leftContent || !cardGrid || !rightContent) return;

      // Section boundaries
      const sectionStart = 0.25;
      const entranceStart = 0.05; // Start entrance 10% earlier
      const entranceEnd = 0.15; // Complete entrance earlier
      const exitStart = 0.1;
      const exitEnd = 0.8;

      // Calculate entrance progress (0 = hidden right, 1 = fully entered)
      let entranceProgress: number;
      if (globalProgress >= sectionStart) {
        entranceProgress = 1; // Fully entered when in section
      } else if (globalProgress >= entranceStart) {
        entranceProgress = (globalProgress - entranceStart) / (entranceEnd - entranceStart);
      } else {
        entranceProgress = 0; // Not yet entering
      }

      // Calculate exit progress (0 = not exiting, 1 = fully exited)
      const exitProgress =
        progress <= exitStart ? 0 : Math.min((progress - exitStart) / (exitEnd - exitStart), 1);

      // Apply power3.inOut easing to blur so it ramps gradually as motion starts
      const easeInOut = gsap.parseEase(EASING.sharp);
      const easedEntranceBlurProgress = easeInOut(1 - entranceProgress);
      const easedExitBlurProgress = easeInOut(exitProgress);

      // Combine entrance and exit:
      // - During entrance: slide from right (x: 100 → 0)
      // - At rest: x: 0
      // - During exit: slide left (x: 0 → -100)
      const entranceX = 100 * (1 - entranceProgress);
      const exitX = -100 * exitProgress;

      // Opacity: fade in during entrance, fade out during exit
      const entranceOpacity = entranceProgress;
      const exitOpacity = 1 - exitProgress;
      // Combined: if not fully entered, use entrance. If exiting, use exit.
      const opacity = entranceProgress < 1 ? entranceOpacity : exitOpacity;

      // Blur: blur during entrance, blur during exit (with eased progress)
      const entranceBlur = 12 * easedEntranceBlurProgress;
      const exitBlur = 15 * easedExitBlurProgress;
      const blur = entranceProgress < 1 ? entranceBlur : exitBlur;

      // Final x position: entrance offset + exit offset
      const baseX = entranceX + exitX;

      // Apply with staggered depth effect
      gsap.set(leftContent, {
        opacity: Math.min(opacity * (entranceProgress < 1 ? 1.5 : 1), 1),
        x: baseX * (entranceProgress < 1 ? 0.6 : 1),
        filter: `blur(${blur * (entranceProgress < 1 ? 0.6 : 1)}px)`,
      });
      gsap.set(cardGrid, {
        opacity: opacity,
        x: baseX * 0.8,
        filter: `blur(${blur * 0.8}px)`,
      });
      gsap.set(rightContent, {
        opacity: Math.min(opacity * (entranceProgress < 1 ? 0.8 : 1), 1),
        x: baseX * (entranceProgress < 1 ? 1 : 0.6),
        filter: `blur(${blur}px)`,
      });
    },
    { scope: sectionRef, dependencies: [progress, globalProgress] }
  );

  return (
    <section 
      ref={sectionRef}
      className={`${styles.section} ${styles.weeks2to4}`} 
      data-section="weeks-2-4"
    >
      <div className={styles.splitLayout}>
        <div ref={leftContentRef} className={styles.leftContent}>
          <p className={styles.label}>During Weeks</p>
          <h2 className={styles.bigNumber}>02 & 04</h2>
        </div>
        
        <div ref={cardGridRef} className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <span>Health Regularity</span>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <span>Smoother, Clearer Skin</span>
            </div>
          </div>
        </div>
        
        <div ref={rightContentRef} className={styles.rightContent}>
          <h3 className={styles.headline}>You improved your health regularity and skin.</h3>
          <p className={styles.body}>
            Bowel movements became more consistent, and smoother, clearer skin 
            gave you a healthy, resilient glow.
          </p>
          <a href="#" className={styles.link}>
            <span className={styles.arrow}>→</span>
            Dive Deeper
          </a>
        </div>
      </div>
    </section>
  );
};

export default Weeks2to4Section;
