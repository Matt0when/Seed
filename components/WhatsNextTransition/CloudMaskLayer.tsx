/**
 * Cloud mask layer - fullscreen clouds that shrink to pill/circle shape.
 * Contains the clouds video and initial text overlay.
 */
import React, { forwardRef, RefObject } from 'react';
import styles from '../WhatsNextTransition.module.css';

interface CloudMaskLayerProps {
  cloudsVideoRef: RefObject<HTMLVideoElement | null>;
  initialTextRef: RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}

export const CloudMaskLayer = forwardRef<HTMLDivElement, CloudMaskLayerProps>(
  function CloudMaskLayer({ cloudsVideoRef, initialTextRef, style }, ref) {
    return (
      <div
        ref={ref}
        className={styles.mask}
        style={style}
      >
        <video
          ref={cloudsVideoRef}
          className={styles.cloudsVideo}
          muted
          playsInline
          preload="metadata"
          poster="/images/clouds-poster.jpg"
          aria-hidden="true"
        >
          <source src="/clouds.mp4" type="video/mp4" />
        </video>
        <div className={styles.overlay} />

        {/* Initial text - "Your Health. Our Shared World." */}
        <div ref={initialTextRef} className={styles.textContainer}>
          <h1 className={styles.heading}>Your Health.</h1>
          <p className={styles.heading}>Our Shared World.</p>
        </div>
      </div>
    );
  }
);
