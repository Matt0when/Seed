import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';

interface FooterProps {
  opacity?: number;
}

const tabs = ['For You', 'Rewards', 'Subscriptions', 'Order History', 'Settings'];

// Color values from CSS variables
const SNOW_WHITE = { r: 252, g: 252, b: 247 }; // #fcfcf7
const SAGE = { r: 208, g: 215, b: 211 }; // #d0d7d3

// Interpolate between two colors based on progress (0 = first color, 1 = second color)
const interpolateColor = (from: typeof SNOW_WHITE, to: typeof SAGE, progress: number) => {
  const r = Math.round(from.r + (to.r - from.r) * progress);
  const g = Math.round(from.g + (to.g - from.g) * progress);
  const b = Math.round(from.b + (to.b - from.b) * progress);
  return `rgb(${r}, ${g}, ${b})`;
};

export const Footer: React.FC<FooterProps> = ({ opacity = 1 }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Interpolate background color: snow-white when visible, sage when fading out
  // Use inverse of opacity so color transitions as footer fades
  const backgroundColor = useMemo(() => {
    const colorProgress = 1 - opacity;
    return interpolateColor(SNOW_WHITE, SAGE, colorProgress);
  }, [opacity]);

  return (
    <footer 
      className={styles.footer}
      style={{
        opacity,
        backgroundColor,
        pointerEvents: opacity < 0.1 ? 'none' : 'auto',
        transition: 'opacity 0.3s ease-in',
      }}
    >
      {/* Left Section - Pill Buttons */}
      <div className={styles.leftSection}>
        <button className={styles.pill}>
          <span className={styles.pillText}>DAY 60</span>
        </button>
        <button className={styles.pill}>
          <span className={styles.pillText}>DS-01®</span>
        </button>
      </div>

      {/* Center Section - Navigation Tabs */}
      <div className={styles.centerSection}>
        {/* Curved Background */}
        <div className={styles.curvedBackground}>
          <Image 
            src="/images/footer-curve.svg" 
            alt="" 
            width={48}
            height={458}
            className={styles.curvedBackgroundSvg}
            aria-hidden="true"
            priority
            fetchPriority="high"
          />
        </div>
        
        {/* Tabs */}
        <nav className={styles.tabsContainer} aria-label="Account navigation">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`${styles.tab} ${index === activeTab ? styles.tabActive : styles.tabInactive}`}
              onClick={() => setActiveTab(index)}
              aria-current={index === activeTab ? 'page' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Right Section - Audio Controls */}
      <div className={styles.rightSection}>
        <div className={styles.rightContent}>
          {/* Audio Visualizer */}
          <div className={styles.audioVisualizer} aria-hidden="true">
            <div className={`${styles.visualizerBar} ${styles.bar1}`} />
            <div className={`${styles.visualizerBar} ${styles.bar2}`} />
            <div className={`${styles.visualizerBar} ${styles.bar3}`} />
            <div className={`${styles.visualizerBar} ${styles.bar4}`} />
            <div className={`${styles.visualizerBar} ${styles.bar5}`} />
            <div className={`${styles.visualizerBar} ${styles.bar6}`} />
          </div>

          {/* Track Info */}
          <div className={styles.trackInfo}>
            <span className={styles.trackTitle}>Bionic Frequencies</span>
            <span className={styles.trackArtist}>Seed</span>
          </div>

          {/* Menu Button */}
          <button className={styles.menuButton} aria-label="Audio menu">
            <Image 
              src="/images/footer-menu-icon.svg" 
              alt="" 
              width={12}
              height={14}
              className={styles.menuIcon}
              aria-hidden="true"
            />
          </button>

          {/* Play Button */}
          <button className={styles.playButton} aria-label="Play audio">
            <Image 
              src="/images/footer-play-icon.svg" 
              alt="" 
              width={7}
              height={9}
              className={styles.playIcon}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
