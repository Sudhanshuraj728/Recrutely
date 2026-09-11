import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { cn } from '../../lib/cn';

/**
 * StageTrack — the sticky viewport stage foundation (Saffron-style
 * storytelling). A tall scroll track keeps the full-screen inner stage
 * pinned while `children` (called with `scrollYProgress`) change as the
 * user scrolls. Progress goes 0 → 1 across the track.
 */
export function StageTrack({ height = '300vh', children, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={ref} className={cn('relative', className)} style={{ height }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {typeof children === 'function' ? children(scrollYProgress) : children}
      </div>
    </div>
  );
}