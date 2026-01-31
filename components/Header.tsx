import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  opacity?: number;
}

export const Header: React.FC<HeaderProps> = ({ opacity = 1 }) => {
  return (
    <header 
      className={styles.header}
      style={{
        opacity,
        pointerEvents: opacity < 0.1 ? 'none' : 'auto',
        transition: 'opacity 0.3s ease-in',
      }}
    >
      <nav className={styles.navLeft}>
        <a className={styles.seedLogo} href="https://seed.com">
          Seed
          <span className={styles.screenreaderOnly}>Home</span>
        </a>
        <a href="#" className={styles.navLink}>Shop</a>
        <a href="#" className={styles.navLink}>Science</a>
        <a href="#" className={styles.navLink}>Learn</a>
      </nav>
      <nav className={styles.navRight}>
        <a href="#" className={styles.navLink}>Account</a>
        <a href="#" className={styles.navLink}>Refer</a>
      </nav>
    </header>
  );
};

export default Header;
