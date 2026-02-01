import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Header } from '../components/Header';
import { WelcomeBar } from '../components/WelcomeBar';
import { TimelineNav } from '../components/TimelineNav';
import { Footer } from '../components/Footer';

const SITE_URL = 'https://seed.com';
const PAGE_TITLE = 'Seed • Engineering Challenge';
const PAGE_DESCRIPTION = 'Seed develops clinically-studied probiotics to impact human and planetary health. Our first product is the DS-01® Daily Synbiotic—a probiotic + prebiotic for systemic benefits.';

// Dynamic import for HorizontalScroll to avoid SSR issues with GSAP
const HorizontalScroll = dynamic(() => import('../components/HorizontalScroll'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '100vh', 
      backgroundColor: 'var(--sage)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <p style={{ color: 'var(--seed-green)', fontSize: '14px' }}>Loading experience...</p>
    </div>
  ),
});

export default function Home() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [targetSection, setTargetSection] = useState<number | undefined>(undefined);
  const [uiOpacity, setUiOpacity] = useState(1);

  // Handle section changes from scroll
  const handleSectionChange = useCallback((sectionIndex: number, progress: number) => {
    setActiveChapter(sectionIndex);
    setChapterProgress(progress);
  }, []);

  // Handle fullscreen mode changes
  const handleFullscreenChange = useCallback((isFullscreen: boolean, opacity: number) => {
    setUiOpacity(opacity);
  }, []);

  // Handle timeline nav clicks
  const handleChapterClick = useCallback((chapterIndex: number) => {
    // Map chapter index to section index
    // Chapter 0 (First 7 Days) → Section 0
    // Chapter 1 (Weeks 2~4) → Section 1
    // Chapter 2 (What's Next) → Section 2 (clouds)
    // Chapter 3 (End) → Section 3 (globe)
    const sectionIndex = chapterIndex;
    setTargetSection(sectionIndex);
    
    // Reset target after animation starts
    setTimeout(() => setTargetSection(undefined), 100);
  }, []);

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={`${SITE_URL}/`} />

        {/* Open Graph / Facebook */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Seed" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${SITE_URL}/og-homepage.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="2400" />
        <meta property="og:image:height" content="1260" />
        <meta property="og:image:alt" content={PAGE_TITLE} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@seedhealth" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:url" content={SITE_URL} />
        <meta name="twitter:image" content={`${SITE_URL}/og-homepage.png`} />
        <meta name="twitter:image:alt" content={PAGE_TITLE} />
      </Head>

      {/* Fixed persistent UI - fades out in fullscreen mode */}
      <Header opacity={uiOpacity} />
      <WelcomeBar opacity={uiOpacity} />
      
      {/* Main horizontal scroll content */}
      <main>
        <h1 className="sr-only">Your DS-01 Journey - 3 Months of Progress</h1>
        <HorizontalScroll 
          onSectionChange={handleSectionChange}
          onFullscreenChange={handleFullscreenChange}
          activeSection={targetSection}
        />
      </main>

      {/* Fixed timeline navigation - fades out in fullscreen mode */}
      <TimelineNav 
        activeChapter={activeChapter} 
        progress={chapterProgress}
        onChapterClick={handleChapterClick}
        opacity={uiOpacity}
      />

      {/* Fixed footer - fades out at 1.125x speed (white element looks lingering otherwise) */}
      <Footer opacity={Math.max(0, 1 - (1 - uiOpacity) * 1.125)} />
    </>
  );
}
