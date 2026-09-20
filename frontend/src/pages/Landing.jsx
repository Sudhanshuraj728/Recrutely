import { SmoothScroll } from '../components/motion/SmoothScroll';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Noise } from '../components/landing/Noise';
import { useIntro } from '../context/IntroContext';
import { Hero } from './landing/Hero';
import { LightningCanvas } from './landing/LightningCanvas';
import { Marquee } from './landing/Marquee';
import { ResumeAnalysis } from './landing/ResumeAnalysis';
import { CareerJourney } from './landing/CareerJourney';
import { JobMatch } from './landing/JobMatch';
import { Networking } from './landing/Networking';
import { Features } from './landing/Features';
import { HowItWorks } from './landing/HowItWorks';
import { TemplatesShowcase } from './landing/TemplatesShowcase';
import { Pricing } from './landing/Pricing';
import { FAQ } from './landing/FAQ';
import { CtaBand } from './landing/CtaBand';
import { Footer } from './landing/Footer';

/**
 * Landing — Saffron-exact marketing surface.
 *
 * LightningCanvas sits at z-index 0 as a fixed global background — veins
 * animate continuously and remain visible wherever landing-page sections are
 * transparent or semi-transparent. Opaque section backgrounds naturally overlay
 * the canvas without extra work. All landing content lives in a z-index:1 wrapper.
 */
export default function Landing() {
  const { done, cleared } = useIntro();
  const [settled, setSettled] = useState(false);

  return (
    /* Root — pure-black background so the canvas shows through all gaps */
    <div
      style={{
        position  : 'relative',
        minHeight : '100dvh',
        background: '#000',
      }}
    >
      {/* ── All page content (z-index: 1, scrolls normally) ── */}
      {cleared && <LightningCanvas />}
      <motion.div
        initial={{ opacity: 0.78, scale: 0.96, filter: 'blur(10px)' }}
        animate={done ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : undefined}
        transition={{ duration: 1.55, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => setSettled(true)}
        style={{ position: 'relative', zIndex: 1, transformOrigin: 'center top', willChange: settled ? 'auto' : 'transform, filter, opacity' }}
      >
        <SmoothScroll />
        <Noise />
        <main>
          <Hero />
          <Marquee />
          <ResumeAnalysis />
          <CareerJourney />
          <JobMatch />
          <Networking />
          <Features />
          <HowItWorks />
          <TemplatesShowcase />
          <Pricing />
          <FAQ />
          <CtaBand />
        </main>
        <Footer />
      </motion.div>
    </div>
  );
}