/**
 * Globe layer component - the spinning globe video and surrounding content.
 * Hidden at start, fades in as the clouds mask shrinks.
 */
import React, { forwardRef, RefObject } from 'react';
import styles from '../WhatsNextTransition.module.css';

interface GlobeLayerProps {
  globeContainerRef: RefObject<HTMLDivElement | null>;
  globeContentRef: RefObject<HTMLDivElement | null>;
  globeVideoRef: RefObject<HTMLVideoElement | null>;
  rightTextSectionRef: RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}

export const GlobeLayer = forwardRef<HTMLDivElement, GlobeLayerProps>(
  function GlobeLayer(
    { globeContainerRef, globeContentRef, globeVideoRef, rightTextSectionRef, style },
    _ref
  ) {
    return (
      <>
        {/* LAYER 1: Globe (hidden at start, appears as mask shrinks) */}
        <div
          ref={globeContainerRef}
          className={styles.globeContainer}
          style={style}
        >
          <div className={styles.globeWrapper}>
            <video
              ref={globeVideoRef}
              className={styles.globeVideo}
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/globe-poster-opt.jpg"
              aria-hidden="true"
            >
              <source src="/globe.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* LAYER 2: Globe surrounding content (hidden at start) */}
        <div
          ref={globeContentRef}
          className={styles.globeContent}
          style={style}
        >
          <div className={styles.titleSection}>
            <h2 className={styles.title}>
              The<br />
              human-planet<br />
              axis.
            </h2>
          </div>
          <div ref={rightTextSectionRef} className={styles.textSection}>
            <p className={styles.bodyText}>
              CO₂ emissions from international shipping have roughly doubled since 1990,
              now making it equivalent to the world's seventh largest emitter of the gas.
            </p>
            <p className={styles.bodyText}>
              As we expand worldwide, we actively lessen our impact through our{' '}
              <strong>Sustainable Refill Program</strong> and continuous innovation,
              including the work of <strong>Seed【Labs】</strong>.
            </p>
            <a href="#" className={styles.link}>
              <span className={styles.linkArrow}>→</span>
              <span>Engage to Learn More</span>
            </a>
          </div>
        </div>
      </>
    );
  }
);
