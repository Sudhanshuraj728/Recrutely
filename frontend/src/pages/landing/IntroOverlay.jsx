import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useIntro } from '../../context/IntroContext';

// ─── Timing constants ────────────────────────────────────────────────────────
// Phase 1 — wordmark rises in: 0ms → ~900ms
// Phase 2 — hold: 900ms → 1800ms
// Phase 3 — curtain panels slide out: 1800ms → 2700ms (IntroContext notified at 1600ms so homepage loads beneath)
// Phase 4 — overlay unmounts: 2800ms
const T_FINISH   = 1600;   // tell app "content is ready" (homepage renders beneath)
const T_EXIT     = 1800;   // trigger curtain split animation
const T_UNMOUNT  = 2800;   // remove DOM node entirely

const LETTERS = [...'CareerCraft'];

// Expo-out easing — cinematic, matches Saffron's ease-out-expo
const EXPO_OUT = [0.16, 1, 0.3, 1];

/**
 * IntroOverlay — cinematic brand intro shown once on initial site entry.
 *
 * A pure-black canvas with the CareerCraft wordmark rising letter by letter
 * (staggered, with expo-out easing). After ~1.8 s the canvas splits into
 * two curtain panels that slide off-screen (top ↑ / bottom ↓), revealing
 * the homepage beneath in one continuous experience.
 *
 * Honours prefers-reduced-motion: the entire sequence is skipped and the
 * site is revealed immediately.
 */
export function IntroOverlay() {
  const reduce        = useReducedMotion();
  const { finish }    = useIntro();
  const [exiting, setExiting] = useState(false);
  const [gone,    setGone]    = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    // Skip entirely for reduced-motion users
    if (reduce) {
      finish();
      return undefined;
    }

    const t = [
      setTimeout(() => finish(),          T_FINISH),
      setTimeout(() => setExiting(true),  T_EXIT),
      setTimeout(() => setGone(true),     T_UNMOUNT),
    ];
    timers.current = t;
    return () => t.forEach(clearTimeout);
  }, [reduce, finish]);

  // Reduced-motion OR fully unmounted — render nothing
  if (reduce || gone) return null;

  return (
    <div
      role="status"
      aria-label="CareerCraft intro"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >
      {/* ── Top curtain panel ──────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '51%',          /* slightly > 50% to avoid sub-pixel gap */
          background: '#000',
          transformOrigin: 'top center',
          willChange: 'transform',
        }}
        animate={exiting ? { y: '-101%' } : { y: 0 }}
        transition={exiting ? { duration: 0.85, ease: EXPO_OUT } : false}
      />

      {/* ── Bottom curtain panel ───────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '51%',
          background: '#000',
          transformOrigin: 'bottom center',
          willChange: 'transform',
        }}
        animate={exiting ? { y: '101%' } : { y: 0 }}
        transition={exiting ? { duration: 0.85, ease: EXPO_OUT } : false}
      />

      {/* ── Centre content (wordmark + accent) ────────────────────────── */}
      <motion.div
        aria-hidden={exiting}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={exiting ? { duration: 0.4, ease: 'easeOut' } : false}
      >
        {/* Breathing radial glow — very subtle, gold-tinted */}
        <div
          aria-hidden="true"
          className="intro-glow"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '56vmin',
            height: '56vmin',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,188,9,0.13) 0%, transparent 68%)',
          }}
        />

        {/* Wordmark — letters staggered rise */}
        <motion.div
          style={{ display: 'flex', alignItems: 'baseline', position: 'relative' }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.042,
                delayChildren: 0.12,
              },
            },
          }}
        >
          {LETTERS.map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              variants={{
                hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.8, ease: EXPO_OUT },
                },
              }}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 9.5vw, 6.25rem)',
                fontWeight: 'var(--weight-display)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                userSelect: 'none',
                // "Career" in cream, "Craft" in saffron gold
                color: i >= 7 ? 'var(--color-primary)' : 'var(--color-text)',
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Hairline rule — grows from center after wordmark settles */}
        <motion.span
          aria-hidden="true"
          style={{
            display: 'block',
            marginTop: '1.75rem',
            height: '1px',
            width: '3.5rem',
            background: 'var(--color-primary)',
            transformOrigin: 'center',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.85, ease: EXPO_OUT }}
        />

        {/* Micro-tagline — fades in last */}
        <motion.p
          style={{
            marginTop: '1.1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.36em',
            color: 'var(--color-text-subtle)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          Resume · Jobs · Career
        </motion.p>
      </motion.div>
    </div>
  );
}