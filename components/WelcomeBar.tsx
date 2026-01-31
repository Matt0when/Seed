import React from 'react';
import Image from 'next/image';
import styles from './WelcomeBar.module.css';

interface Stat {
  icon: string;
  value: string;
  label: string;
}

const stats: Stat[] = [
  { icon: '/icons/points.svg', value: '987', label: 'Points to Spend' },
  { icon: '/icons/subscriptions.svg', value: '001', label: 'Subscriptions' },
  { icon: '/icons/strains.svg', value: '024', label: 'Strains Delivered' },
  { icon: '/icons/nutrients.svg', value: '020', label: 'Nutrients Delivered' },
];

interface WelcomeBarProps {
  opacity?: number;
}

export const WelcomeBar: React.FC<WelcomeBarProps> = ({ opacity = 1 }) => {
  return (
    <div 
      className={styles.welcomeBar}
      style={{
        opacity,
        pointerEvents: opacity < 0.1 ? 'none' : 'auto',
      }}
    >
      <div className={styles.greeting}>
        <p className={styles.welcomeText}>
          Welcome bac
          <Image 
            src="/icons/notification-dot.svg" 
            alt="" 
            width={6} 
            height={6} 
            className={styles.dot}
          />
        </p>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <div className={styles.avatarInner}>
              <Image 
                src="/images/headshot-small.jpeg" 
                alt="User avatar" 
                width={20} 
                height={20}
                className={styles.avatarImage}
                priority
              />
            </div>
          </div>
          <span className={styles.userName}>Sade</span>
        </div>
      </div>
      <div className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <div className={styles.statValue}>
              <div className={styles.iconContainer}>
                <Image 
                  src={stat.icon} 
                  alt="" 
                  width={20} 
                  height={20}
                  className={styles.statIcon}
                />
              </div>
              <span className={styles.statNumber}>{stat.value}</span>
            </div>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeBar;
