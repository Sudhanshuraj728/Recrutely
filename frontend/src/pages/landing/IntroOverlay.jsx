import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useIntro } from '../../context/IntroContext';

const DIVE_EASE = [0.76, 0, 0.24, 1];

function ResumeMockup() {
  return (
    <div className="relative h-[24rem] w-[18rem] overflow-hidden rounded-[1.25rem] border border-black/10 bg-white p-6 shadow-[0_30px_80px_rgba(20,20,20,0.2)] sm:h-[30rem] sm:w-[22rem] sm:p-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="h-3 w-28 rounded-full bg-[#17191c]" />
          <div className="mt-2 h-2 w-20 rounded-full bg-black/20" />
        </div>
        <div className="h-12 w-12 rounded-full border border-black/10 bg-[#e7e4de] shadow-inner" />
      </div>
      <div className="mt-10 h-px bg-black/10" />
      <div className="mt-8 space-y-3">
        <div className="h-2 w-24 rounded-full bg-[#b87523]/80" />
        <div className="h-2 w-full rounded-full bg-black/10" />
        <div className="h-2 w-[88%] rounded-full bg-black/10" />
        <div className="h-2 w-[68%] rounded-full bg-black/10" />
      </div>
      <div className="mt-10 space-y-3">
        <div className="h-2 w-20 rounded-full bg-[#b87523]/80" />
        <div className="h-2 w-full rounded-full bg-black/10" />
        <div className="h-2 w-[92%] rounded-full bg-black/10" />
        <div className="h-2 w-[76%] rounded-full bg-black/10" />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3">
        <div className="h-16 rounded-lg border border-black/10 bg-[#f3f1ec]" />
        <div className="h-16 rounded-lg border border-black/10 bg-[#f3f1ec]" />
      </div>
      <span className="absolute bottom-5 right-6 font-mono text-[0.5rem] uppercase tracking-[0.18em] text-black/35">ATS ready</span>
    </div>
  );
}

export function IntroOverlay() {
  const reduce = useReducedMotion();
  const { finish, clear } = useIntro();
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (reduce) {
      finish();
      clear();
      return undefined;
    }

    const holdTimer = window.setTimeout(() => {
      finish();
      setExiting(true);
    }, 800);
    const removeTimer = window.setTimeout(() => {
      clear();
      setGone(true);
    }, 2450);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(removeTimer);
    };
  }, [clear, finish, reduce]);

  if (reduce || gone) return null;

  return (
    <motion.div
      role="status"
      aria-label="Preparing your resume workspace"
      aria-live="polite"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 1.35, delay: exiting ? 0.35 : 0, ease: DIVE_EASE }}
      className="pointer-events-auto fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#f3f1ec]"
    >
      <motion.div
        aria-hidden="true"
        animate={exiting ? { scale: 30, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: DIVE_EASE }}
        className="relative z-10 origin-center"
      >
        <ResumeMockup />
      </motion.div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,rgba(243,241,236,0.72)_68%,#f3f1ec_100%)]" />
      <p className="absolute bottom-10 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-black/40">Reading your potential</p>
    </motion.div>
  );
}
