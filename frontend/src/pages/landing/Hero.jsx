import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ─── Constants ─────────────────────────────────────────────────────────── */

const BROWN = 'rgba(173,72,24,0.34)';
const EXPO  = [0.16, 1, 0.3, 1];

const STATS = [
  { label: 'Career Readiness', value: '84'  },
  { label: 'ATS Score',        value: '91%' },
  { label: 'Job Match',        value: '94%' },
];

/* ─── Entrance animation factory ────────────────────────────────────────── */

function fadeUp(delay = 0, reduce = false) {
  if (reduce) return {};
  return {
    initial:    { opacity: 0, y: 22 },
    animate:    { opacity: 1, y:  0 },
    transition: { duration: 0.95, delay, ease: EXPO },
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   Hero
   Cinematic, Saffron-faithful hero:
     • Pure-black canvas
     • Full-screen animated lightning / lava-vein background (LightningCanvas)
     • Radial vignette keeps the centre readable
     • Top-left: small descriptor line
     • Centre: large display headline + single pill CTA
     • Bottom-right: floating stats panel (bordered, glass)
     • Bottom: thin mono info strip with category labels + "Scroll ↓"
   ───────────────────────────────────────────────────────────────────────── */
export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        position   : 'relative',
        minHeight  : '100dvh',
        background : '#0a0a0a',
        display    : 'flex',
        flexDirection: 'column',
        overflow   : 'hidden',
        isolation  : 'isolate',
      }}
    >

      {/* ── Radial vignette ──────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position      : 'absolute',
          inset         : 0,
          pointerEvents : 'none',
          background    :
            'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 10%, rgba(0,0,0,0.50) 75%, rgba(0,0,0,0.88) 100%)',
        }}
      />

      {/* ── Vertical edge hairlines (desktop only) ───────────────────── */}
      <div aria-hidden="true" className="hide-mobile" style={{
        position: 'absolute', top: 0, bottom: 0, left: 0,
        width: '1px', background: BROWN, opacity: 0.6,
      }} />
      <div aria-hidden="true" className="hide-mobile" style={{
        position: 'absolute', top: 0, bottom: 0, right: 0,
        width: '1px', background: BROWN, opacity: 0.6,
      }} />

      {/* ── Layered content ──────────────────────────────────────────── */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', zIndex: 2 }}>

        {/* Top-left: small descriptor */}
        <motion.p
          {...fadeUp(0.1, reduce)}
          style={{
            position    : 'absolute',
            top         : '5.5rem',
            left        : '1.75rem',
            fontFamily  : 'var(--font-mono)',
            fontSize    : '0.82rem',
            color       : '#a1a1aa',
            letterSpacing: '0.01em',
            lineHeight  : 1.65,
            margin      : 0,
          }}
        >
          CareerCraft is an AI&#8209;powered<br className="hide-mobile" /> career intelligence platform.
        </motion.p>

        {/* ── Centre: headline + CTA ───────────────────────────────── */}
        <div
          style={{
            flex           : 1,
            display        : 'flex',
            flexDirection  : 'column',
            alignItems     : 'center',
            justifyContent : 'center',
            textAlign      : 'center',
            padding        : '5rem 1.75rem 2rem',
          }}
        >
          <motion.h1
            {...fadeUp(0.2, reduce)}
            style={{
              fontFamily    : 'var(--font-sans)',
              fontSize      : 'clamp(3rem, 8.5vw, 7.5rem)',
              fontWeight    : 750,
              color         : '#ece7e0',
              lineHeight    : 1.02,
              letterSpacing : '-0.055em',
              margin        : '0 0 2.75rem',
              textWrap      : 'balance',
            }}
          >
            Build Your Career<br />Intelligence.
          </motion.h1>

          <motion.div {...fadeUp(0.42, reduce)}>
            <Link
              to="/signup"
              style={{
                display        : 'inline-flex',
                alignItems     : 'center',
                gap            : '0.5rem',
                background     : '#f9a826',
                color          : '#0a0a0a',
                borderRadius   : '9999px',
                padding        : '1rem 2.35rem',
                fontFamily     : 'var(--font-sans)',
                fontWeight     : 600,
                fontSize       : '1rem',
                lineHeight     : 1,
                textDecoration : 'none',
                boxShadow      : '0 4px 30px rgba(249,168,38,0.28)',
                transition     : 'background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#ffc45c';
                e.currentTarget.style.transform  = 'scale(1.03)';
                e.currentTarget.style.boxShadow  = '0 7px 36px rgba(249,168,38,0.42)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#f9a826';
                e.currentTarget.style.transform  = 'scale(1)';
                e.currentTarget.style.boxShadow  = '0 4px 30px rgba(249,168,38,0.28)';
              }}
            >
              Analyze my resume
              <ArrowUpRight size={16} strokeWidth={2.2} />
            </Link>
          </motion.div>
        </div>

        {/* ── Stats panel — bottom right ───────────────────────────── */}
        <motion.aside
          aria-label="Key metrics"
          {...(reduce ? {} : {
            initial:    { opacity: 0, x: 18 },
            animate:    { opacity: 1, x: 0  },
            transition: { duration: 0.95, delay: 0.65, ease: EXPO },
          })}
          style={{
            position            : 'absolute',
            bottom              : '3.75rem',
            right               : '1.75rem',
            width               : '11.5rem',
            border              : '1px solid rgba(255,255,255,0.10)',
            borderRadius        : '0.75rem',
            background          : 'rgba(255,255,255,0.03)',
            backdropFilter      : 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow           : '0 18px 50px rgba(0,0,0,0.28)',
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding      : '0.9rem 1rem',
                borderBottom : i < STATS.length - 1 ? '1px solid rgba(249,168,38,0.22)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily    : 'var(--font-mono)',
                  fontSize      : '0.58rem',
                  textTransform : 'uppercase',
                  letterSpacing : '0.14em',
                  color         : 'rgba(236,231,224,0.44)',
                  marginBottom  : '0.38rem',
                }}
              >
                {s.label}
              </div>

              <div
                style={{
                  fontFamily : 'var(--font-display)',
                  fontSize   : '1.65rem',
                  fontWeight : 600,
                  color      : '#ece7e0',
                  lineHeight : 1,
                }}
              >
                {s.value}
              </div>

              {/* Gold dashed rule */}
              <span className="stat-rule-sm" style={{ display: 'block', marginTop: '0.45rem' }} />
            </div>
          ))}

          {/* Footer label */}
          <div
            style={{
              borderTop     : '1px solid rgba(249,168,38,0.22)',
              padding       : '0.55rem 1rem',
              fontFamily    : 'var(--font-mono)',
              fontSize      : '0.55rem',
              textTransform : 'uppercase',
              letterSpacing : '0.16em',
              color         : 'rgba(236,231,224,0.26)',
            }}
          >
            CareerCraft · 2026
          </div>
        </motion.aside>

        {/* ── Bottom info strip ────────────────────────────────────── */}
        <div
          style={{
            borderTop      : `1px solid ${BROWN}`,
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'space-between',
            padding        : '0.85rem 1.75rem',
          }}
        >
          <span style={{
            fontFamily    : 'var(--font-mono)',
            fontSize      : '0.6rem',
            textTransform : 'uppercase',
            letterSpacing : '0.20em',
            color         : 'rgba(236,231,224,0.32)',
          }}>
            Resume Intelligence&nbsp;·&nbsp;Job Matching&nbsp;·&nbsp;Career Readiness
          </span>

          <span style={{
            fontFamily    : 'var(--font-mono)',
            fontSize      : '0.6rem',
            textTransform : 'uppercase',
            letterSpacing : '0.20em',
            color         : 'rgba(236,231,224,0.32)',
          }}>
            Scroll ↓
          </span>
        </div>
      </div>
    </section>
  );
}