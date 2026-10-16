import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Noise } from '../../components/landing/Noise';

const COLUMN_COUNT = 13;

const reveal = {
  hidden: { opacity: 0, y: 42 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const columnVariants = {
  hidden: { scaleY: 0.5, opacity: 0 },
  visible: (index) => ({
    scaleY: 1,
    opacity: 1,
    transition: { duration: 1.2, delay: 0.06 * index, ease: [0.16, 1, 0.3, 1] },
  }),
};

function RecrutelyMark() {
  return (
    <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7B568] shadow-[0_0_24px_rgba(231,181,104,0.35)]">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M4 3h5.5a3.5 3.5 0 0 1 0 7H4V3Z" fill="#17191c" />
        <path d="M4 10h4.5L12 15H9L6 10.5V15H4V10Z" fill="#17191c" />
        <circle cx="14.5" cy="3.5" r="1.5" fill="#17191c" opacity="0.5" />
      </svg>
    </span>
  );
}


export function Hero() {
  const reduce = useReducedMotion();
  const initial = reduce ? false : 'hidden';
  const animate = reduce ? false : 'visible';

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-white">
      <Noise opacity={0.035} className="!fixed !z-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_45%,rgba(211,161,91,0.10),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(255,255,255,0.34),transparent_32%)]" />

      <div className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-[#050505]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-90">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:7.7%_100%]" />
          <motion.div
            aria-hidden="true"
            className="absolute -left-[18%] top-[-35%] h-[125%] w-[72%] rotate-[20deg] bg-[url('/ellipse-gradients.png')] bg-cover bg-center opacity-40 mix-blend-screen"
            animate={reduce ? undefined : { x: ['0%', '4%', '0%'], rotate: [20, 22, 20] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -right-[20%] bottom-[-45%] h-[145%] w-[78%] rotate-[18deg] bg-[url('/ellipse-gradients.png')] bg-cover bg-center opacity-34 mix-blend-screen"
            animate={reduce ? undefined : { x: ['0%', '-3%', '0%'], rotate: [18, 16, 18] }}
            transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,16,20,0.02)_16%,rgba(13,16,20,0.32)_60%,rgba(13,16,20,0.9)_100%)]" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[10%] top-[25%] z-[2] h-[52%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.78)_0%,rgba(5,5,5,0.52)_36%,rgba(5,5,5,0.18)_62%,transparent_78%)] blur-2xl"
        />

        <motion.div
          variants={reveal}
          initial={initial}
          animate={animate}
          className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-12 sm:py-7"
        >
          <Link to="/" className="flex items-center gap-2.5 font-display text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
            <RecrutelyMark />
            Recrutely
          </Link>
          <nav className="hidden items-center gap-8 font-sans text-sm text-white/70 md:flex">
            <a className="transition-colors hover:text-[#E7B568]" href="#features">Features</a>
            <a className="transition-colors hover:text-[#E7B568]" href="#how-it-works">How it works</a>
            <a className="transition-colors hover:text-[#E7B568]" href="#templates">Templates</a>
            <a className="transition-colors hover:text-[#E7B568]" href="#pricing">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/signup" className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-sans text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-[#E7B568] hover:text-black">
              Get started <ArrowUpRight className="ml-1 inline h-3 w-3" />
            </Link>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-20 z-[1] flex justify-center overflow-hidden opacity-30">
          {Array.from({ length: COLUMN_COUNT }, (_, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={columnVariants}
              initial={initial}
              animate={animate}
              className="h-full flex-1 origin-bottom border-r border-white/10 first:border-l"
            />
          ))}
        </div>

        <motion.div
          variants={reveal}
          initial={initial}
          animate={animate}
          transition={{ delay: 0.2 }}
          className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-24 pt-10 text-center sm:px-10 sm:pb-28"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[22rem] w-[min(92vw,54rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.36)_40%,transparent_74%)] blur-3xl"
          />
          <h1 className="max-w-4xl font-display text-[clamp(3.2rem,8vw,7.8rem)] font-medium leading-[0.88] tracking-[-0.065em] text-white">
            Build a resume
            <br />
            <span className="bg-gradient-to-r from-[#FFF8EB] via-[#E7B568] to-[#A86F32] bg-clip-text text-transparent">that gets noticed.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base text-gray-300 leading-7 sm:mt-9 sm:text-lg">
            Shape your experience into an ATS-ready story, match with better roles, and move from application to offer with clarity.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4 sm:mt-11">
            <Link to="/signup" className="group rounded-full bg-[#F9A826] px-7 py-4 font-sans text-base font-semibold text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_28px_rgba(249,168,38,0.24)] transition-[background-color,transform,box-shadow] hover:scale-105 hover:bg-[#ffc45c] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_0_36px_rgba(249,168,38,0.4)] active:scale-95">
              Analyze my resume <ArrowUpRight className="ml-1 inline h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <a href="#features" className="rounded-full border border-white/20 bg-black/30 px-7 py-4 font-sans text-base font-medium text-white/80 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white">
              Explore the toolkit
            </a>
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 px-6 py-4 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/40 sm:px-12 sm:py-5 sm:text-[0.68rem]">
          <span>ATS analysis · Job matching · Career readiness</span>
          <span>Scroll to explore ↓</span>
        </div>
      </div>
    </section>
  );
}
