import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, FileText, Moon, Sun } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Noise } from '../../components/landing/Noise';
import { useTheme } from '../../context/ThemeContext';

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

function CareerCraftMark() {
  return (
    <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7B568] text-[#17191c] shadow-[0_0_24px_rgba(231,181,104,0.2)]">
      <FileText className="h-4 w-4" strokeWidth={2.2} />
      <ArrowUpRight className="absolute bottom-1 right-1 h-3 w-3" strokeWidth={2.8} />
    </span>
  );
}


export function Hero() {
  const reduce = useReducedMotion();
  const { isLight, toggleTheme } = useTheme();
  const initial = reduce ? false : 'hidden';
  const animate = reduce ? false : 'visible';

  return (
    <section className={`relative min-h-screen w-full overflow-hidden text-white ${isLight ? 'bg-[#f5f3ee] text-[#17191c]' : 'bg-[#050505]'}`}>
      <Noise opacity={0.035} className="!fixed !z-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_45%,rgba(211,161,91,0.10),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(255,255,255,0.34),transparent_32%)]" />

      <div className={`relative isolate flex min-h-screen w-full flex-col overflow-hidden ${isLight ? 'bg-[#f5f3ee] text-[#17191c]' : 'bg-[#050505]'}`}>
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
            <CareerCraftMark />
            CareerCraft
          </Link>
          <nav className="hidden items-center gap-8 font-sans text-sm text-white/70 md:flex">
            <a className={`transition-colors hover:text-[#E7B568] ${isLight ? 'text-black/65' : ''}`} href="#features">Features</a>
            <a className={`transition-colors hover:text-[#E7B568] ${isLight ? 'text-black/65' : ''}`} href="#how-it-works">How it works</a>
            <a className={`transition-colors hover:text-[#E7B568] ${isLight ? 'text-black/65' : ''}`} href="#templates">Templates</a>
            <a className={`transition-colors hover:text-[#E7B568] ${isLight ? 'text-black/65' : ''}`} href="#pricing">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-colors ${isLight ? 'border-black/15 bg-black/5 text-[#17191c] hover:bg-black/10' : 'border-white/20 bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <Link to="/signup" className={`rounded-full border px-5 py-2.5 font-sans text-sm font-medium backdrop-blur-md transition-colors hover:bg-[#E7B568] hover:text-black ${isLight ? 'border-black/15 bg-black/5 text-[#17191c]' : 'border-white/20 bg-white/10 text-white'}`}>
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
          <p className="mb-6 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[#E7B568] sm:mb-8">Resume intelligence / 01</p>
          <h1 className={`max-w-4xl font-display text-[clamp(3.2rem,8vw,7.8rem)] font-medium leading-[0.88] tracking-[-0.065em] ${isLight ? 'text-[#17191c]' : 'text-white'}`}>
            Build a resume
            <br />
            <span className="bg-gradient-to-r from-[#FFF8EB] via-[#E7B568] to-[#A86F32] bg-clip-text text-transparent">that gets noticed.</span>
          </h1>
          <p className={`mx-auto mt-8 max-w-xl text-base leading-7 sm:mt-9 sm:text-lg ${isLight ? 'text-black/70' : 'text-gray-300'}`}>
            Shape your experience into an ATS-ready story, match with better roles, and move from application to offer with clarity.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4 sm:mt-11">
            <Link to="/signup" className="group rounded-full bg-[#F9A826] px-7 py-4 font-sans text-base font-semibold text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_28px_rgba(249,168,38,0.24)] transition-[background-color,transform,box-shadow] hover:scale-105 hover:bg-[#ffc45c] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_0_36px_rgba(249,168,38,0.4)] active:scale-95">
              Analyze my resume <ArrowUpRight className="ml-1 inline h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <a href="#features" className={`rounded-full border px-7 py-4 font-sans text-base font-medium backdrop-blur-md transition-colors ${isLight ? 'border-black/15 bg-black/5 text-black/70 hover:border-black/30 hover:text-black' : 'border-white/20 bg-black/30 text-white/80 hover:border-white/40 hover:text-white'}`}>
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
