import { cn } from '../../lib/cn';

const GRAIN_SRC =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">' +
      '<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" /></filter>' +
      '<rect width="100%" height="100%" filter="url(#g)" /></svg>'
  );

/**
 * Noise — subtle full-viewport film-grain overlay (the Saffron texture).
 * A static SVG-turbulence tile composited over the page. Decorative only:
 * pointer-transparent, static (no per-frame filter work), value-free.
 */
export function Noise({ opacity = 0.055, className }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 z-[100]', className)}
      style={{
        backgroundImage: `url("${GRAIN_SRC}")`,
        backgroundSize: '240px 240px',
        mixBlendMode: 'overlay',
        opacity,
      }}
    />
  );
}