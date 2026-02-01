/**
 * Pill text layer - the "human-planet axis" text that appears during transition.
 * Separate layer so it can slide without being clipped by mask.
 */
import React, { forwardRef } from 'react';
import styles from '../WhatsNextTransition.module.css';

interface PillTextLayerProps {
  style?: React.CSSProperties;
}

export const PillTextLayer = forwardRef<HTMLDivElement, PillTextLayerProps>(
  function PillTextLayer({ style }, ref) {
    return (
      <div
        ref={ref}
        className={styles.pillTextLayer}
        style={style}
      >
        <h2 className={styles.pillHeading}>
          The<br />
          human-planet<br />
          axis.
        </h2>
      </div>
    );
  }
);
