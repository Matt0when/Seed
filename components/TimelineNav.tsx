import React, { useRef, useEffect, useState } from 'react';
import styles from './TimelineNav.module.css';

export interface Chapter {
  id: string;
  label: string;
  shortLabel?: string;
}

export const chapters: Chapter[] = [
  { id: 'first-7-days', label: 'First 7 Days', shortLabel: '01' },
  { id: 'weeks-2-4', label: 'Weeks 2~4', shortLabel: '02' },
  { id: 'whats-next', label: "What's Next", shortLabel: '03' },
];

interface TimelineNavProps {
  activeChapter: number;
  progress?: number;
  onChapterClick?: (index: number) => void;
  opacity?: number;
}

export const TimelineNav: React.FC<TimelineNavProps> = ({ 
  activeChapter = 0,
  progress = 0,
  onChapterClick,
  opacity = 1,
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  // Update pill position when active chapter changes
  useEffect(() => {
    const updatePillPosition = () => {
      const activeButton = chapterRefs.current[activeChapter];
      const timelineItems = navRef.current?.querySelector('[class*="timelineItems"]') as HTMLElement;
      
      if (activeButton && timelineItems) {
        // Use offsetLeft relative to the timeline items container
        const buttonLeft = activeButton.offsetLeft;
        const buttonWidth = activeButton.offsetWidth;
        
        setPillStyle({
          left: buttonLeft,
          width: buttonWidth,
        });
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(updatePillPosition);
    
    // Also update on window resize
    window.addEventListener('resize', updatePillPosition);
    return () => window.removeEventListener('resize', updatePillPosition);
  }, [activeChapter]);

  const handleChapterClick = (index: number) => {
    onChapterClick?.(index);
  };

  return (
    <nav 
      className={styles.timelineNav} 
      aria-label="Timeline navigation" 
      ref={navRef}
      style={{
        opacity,
        pointerEvents: opacity < 0.1 ? 'none' : 'auto',
        transition: 'opacity 0.3s ease-in',
      }}
    >
      <div className={styles.timelineItems}>
        {/* Animated pill indicator */}
        <div 
          ref={pillRef}
          className={styles.activePill}
          style={{
            left: `${pillStyle.left}px`,
            width: `${pillStyle.width}px`,
          }}
        />
        
        {chapters.map((chapter, index) => (
          <React.Fragment key={chapter.id}>
            <button
              ref={(el) => { chapterRefs.current[index] = el; }}
              className={`${styles.chapter} ${index === activeChapter ? styles.active : ''}`}
              onClick={() => handleChapterClick(index)}
              aria-current={index === activeChapter ? 'step' : undefined}
              aria-label={`Go to ${chapter.label}`}
            >
              <span className={styles.chapterLabel}>【 {chapter.label} 】</span>
            </button>
            {index < chapters.length - 1 && (
              <div className={styles.connector}>
                <div 
                  className={styles.connectorProgress} 
                  style={{ 
                    width: index < activeChapter 
                      ? '100%' 
                      : index === activeChapter 
                        ? `${progress * 100}%` 
                        : '0%' 
                  }} 
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <button className={styles.pauseButton} aria-label="Pause timeline">
        <span className={styles.pauseIcon}>❚❚</span>
      </button>
    </nav>
  );
};

export default TimelineNav;
