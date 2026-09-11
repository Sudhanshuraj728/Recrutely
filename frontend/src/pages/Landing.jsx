import { SmoothScroll } from '../components/motion/SmoothScroll';
import { Noise } from '../components/landing/Noise';
import { LandingNavbar } from './landing/LandingNavbar';
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
  return (
    /* Root — pure-black background so the canvas shows through all gaps */
    <div
      style={{
        position  : 'relative',
        minHeight : '100dvh',
        background: '#000',
      }}
    >
      {/* ── Global fixed lightning background (z-index: 0) ── */}
      <LightningCanvas />

      {/* ── All page content (z-index: 1, scrolls normally) ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SmoothScroll />
        <Noise />
        <LandingNavbar />
        <main>
          <CtaBand />
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
        </main>
        <Footer />
      </div>
    </div>
  );
}