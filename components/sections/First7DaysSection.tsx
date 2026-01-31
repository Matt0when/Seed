import React, { useRef, useMemo } from 'react';
import { useSectionAnimation } from '../../hooks';
import styles from './Section.module.css';

interface First7DaysSectionProps {
  progress?: number; // 0-1 progress within this section for scroll-driven animations
}

export const First7DaysSection: React.FC<First7DaysSectionProps> = ({ 
  progress = 0,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  // Memoize element refs array to prevent unnecessary re-renders
  const elementRefs = useMemo(
    () => [leftContentRef, mediaRef, rightContentRef],
    []
  );

  // Use shared animation hook for consistent entrance/exit behavior
  useSectionAnimation({
    containerRef: sectionRef,
    elementRefs,
    progress,
    runEntranceAnimation: true,
    // Default exit config matches the original: start 0.1, end 0.8, maxX -100, maxBlur 15
  });

  return (
    <section 
      ref={sectionRef}
      className={`${styles.section} ${styles.first7days}`} 
      data-section="first-7-days"
    >
      <div className={styles.splitLayout}>
        <div ref={leftContentRef} className={styles.leftContent}>
          <p className={styles.label}>In Your First</p>
          <h2 className={styles.bigNumber}>07 Days</h2>
        </div>
        
        <div ref={mediaRef} className={styles.mediaPlaceholder}>
          <div className={styles.placeholderBox}>
            <span>Video: Gut Barrier Animation</span>
          </div>
        </div>
        
        <div ref={rightContentRef} className={styles.rightContent}>
          <h3 className={styles.headline}>You experienced a reduction in bloating and gas.</h3>
          <p className={styles.body}>
            DS-01® has reduced bloating, eased gas, and minimized digestive 
            discomfort—helping your gut work its best.
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

export default First7DaysSection;
