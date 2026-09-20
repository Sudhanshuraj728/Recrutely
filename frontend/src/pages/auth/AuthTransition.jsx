import { AnimatePresence, motion } from 'framer-motion';
import { Check, LoaderCircle } from 'lucide-react';

export function AuthTransition({ phase, name = '' }) {
  if (!phase) return null;

  const success = phase === 'success';

  return (
    <AnimatePresence>
      <motion.div
        key={phase}
        role="status"
        aria-live="polite"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#050505] text-white"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px]" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(249,168,38,0.1),transparent_68%)] blur-[120px]"
          animate={success ? { scale: 1.15, opacity: 0.35 } : { scale: [1, 1.08, 1], opacity: [0.45, 0.75, 0.45] }}
          transition={success ? { duration: 0.4 } : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {!success && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#F9A826]/80 to-transparent shadow-[0_0_24px_rgba(249,168,38,0.65)]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0.2, 1, 0.2], opacity: [0.15, 0.8, 0.15] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ scale: 0.35, opacity: 0, rotate: -12 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 360, damping: 16 }}
                className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/15 text-[#10B981] shadow-[0_0_42px_rgba(16,185,129,0.3)]"
              >
                <Check className="h-10 w-10" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#F9A826]/30 bg-[#F9A826]/10 text-[#F9A826] shadow-[0_0_42px_rgba(249,168,38,0.18)]"
              >
                <motion.span
                  className="absolute inset-2 rounded-full border border-[#F9A826]/40"
                  animate={{ scale: [0.7, 1.18, 0.7], opacity: [0.8, 0.1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <LoaderCircle className="h-8 w-8" strokeWidth={1.5} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.h1 key={`${phase}-title`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 font-display text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
            {success ? (name ? `Welcome, ${name}!` : 'Welcome back!') : 'Securing your connection...'}
          </motion.h1>
          <motion.p key={`${phase}-copy`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-3 max-w-md text-sm leading-6 text-white/60 sm:text-base">
            {success ? 'Your career workspace is ready. Taking you to your dashboard.' : "This will only take a moment. We're setting up your experience."}
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
