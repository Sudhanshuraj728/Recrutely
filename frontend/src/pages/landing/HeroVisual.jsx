import { motion } from 'framer-motion';
import { EASE } from '../../components/motion/motion.config';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const MONO = "Roboto Mono, monospace";

const CREAM = '#ece7e0';
const GOLD = '#d27732';
const VIOLET = '#9b4a22';

/* The central career line — flows from the document stack up toward the opportunity node. */
const MAIN_PATH =
  'M 700 640 C 780 600, 830 520, 880 430 C 930 340, 900 260, 960 190 C 1000 140, 1060 120, 1140 96';
const ECHO_PATH = 'M 940 660 C 1030 600, 1120 460, 1160 300';

const NODES = [
  { x: 700, y: 640, label: null },
  { x: 880, y: 430, label: 'ATS 91', tone: 'cream' },
  { x: 960, y: 190, label: null, tone: 'gold' },
  { x: 1140, y: 96, label: 'OFFER', tone: 'gold', end: true },
];

/* Resume hairlines inside the front sheet — sparse, curved, soft. */
const RESUMELINES = [
  { d: 'M 720 320 C 860 308, 1010 322, 1100 356', tone: 'line' },
  { d: 'M 720 410 C 880 396, 1030 412, 1108 452', tone: 'line' },
  { d: 'M 720 500 C 880 486, 1020 502, 1090 542', tone: 'gold' },
];

/* Organic scatter — sparse data markers, not a grid. */
const SCATTER = [
  { x: 968, y: 780, o: 0.2 },
  { x: 1160, y: 640, o: 0.24 },
  { x: 1220, y: 420, o: 0.22 },
  { x: 1240, y: 210, o: 0.3 },
  { x: 360, y: 440, o: 0.14 },
  { x: 420, y: 260, o: 0.16 },
  { x: 620, y: 820, o: 0.2 },
  { x: 1030, y: 40, o: 0.3 },
  { x: 470, y: 640, o: 0.16, tone: 'violet' },
  { x: 1320, y: 560, o: 0.26, tone: 'violet' },
];

/* Rays converging on the opportunity node. */
const RAYS = [
  'M 1180 60 L 1144 92',
  'M 1240 140 L 1148 104',
  'M 1080 40 L 1138 88',
  'M 1180 200 L 1144 106',
];

const BARCODE = [0, 9, 18, 27, 36];

/**
 * CareerVisual — the hero artwork for CareerCraft. A single large organic
 * composition that blends into the black canvas: layered resume/document
 * forms, ribbon gestures, one flowing career line and thin converging paths
 * meeting an opportunity node, with restrained gold and a whisper of violet.
 */
export function CareerVisual() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0"
      initial={reduce ? false : { opacity: 0, scale: 0.985 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, ease: EASE.out }}
    >
      <svg
        className="hero-drift h-full w-full"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="pv-shade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#000" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pv-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.11" />
            <stop offset="62%" stopColor={GOLD} stopOpacity="0.03" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pv-violet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.07" />
            <stop offset="60%" stopColor={VIOLET} stopOpacity="0.02" />
            <stop offset="100%" stopColor={VIOLET} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pv-deep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Deep shadows + restrained blooms */}
        <ellipse cx="760" cy="430" rx="500" ry="410" fill="url(#pv-shade)" />
        <ellipse cx="760" cy="780" rx="480" ry="180" fill="url(#pv-deep)" />
        <ellipse cx="1000" cy="300" rx="400" ry="360" fill="url(#pv-bloom)" />
        <ellipse cx="340" cy="520" rx="320" ry="300" fill="url(#pv-violet)" />

        {/* Broad organic ribbons */}
        <path
          d="M -80 700 C 300 600, 640 780, 1000 640 C 1180 570, 1300 540, 1500 610"
          fill="none"
          stroke={CREAM}
          strokeWidth="60"
          strokeLinecap="round"
          opacity="0.04"
        />
        <path
          d="M 300 -80 C 560 120, 800 60, 1120 200 C 1240 270, 1340 320, 1520 360"
          fill="none"
          stroke={CREAM}
          strokeWidth="70"
          strokeLinecap="round"
          opacity="0.035"
        />

        {/* Layered document stack — back sheet */}
        <path
          d="M 720 90 C 920 70, 1160 100, 1300 170 C 1330 430, 1310 660, 1258 760 C 1120 790, 900 770, 760 730 C 720 620, 690 300, 720 90 Z"
          fill={CREAM}
          fillOpacity="0.05"
          stroke={CREAM}
          strokeOpacity="0.12"
          strokeWidth="1"
        />
        {/* Layered document stack — middle sheet */}
        <path
          d="M 520 200 C 700 160, 940 200, 1080 320 C 1130 470, 1110 600, 1060 660 C 950 660, 800 630, 720 580 C 640 480, 610 300, 520 200 Z"
          fill={CREAM}
          fillOpacity="0.075"
          stroke={CREAM}
          strokeOpacity="0.14"
          strokeWidth="1"
        />
        {/* Layered document stack — front sheet */}
        <path
          d="M 620 150 C 800 130, 1020 150, 1160 230 C 1190 420, 1175 590, 1125 680 C 1010 710, 820 690, 700 660 C 650 550, 620 280, 620 150 Z"
          fill={CREAM}
          fillOpacity="0.11"
          stroke={CREAM}
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        <path
          d="M 620 150 C 800 130, 1020 150, 1160 230"
          fill="none"
          stroke={GOLD}
          strokeWidth="1.4"
          strokeOpacity="0.45"
        />
        {/* Folded corner cue */}
        <path
          d="M 1160 230 L 1160 344 L 1046 230 Z"
          fill="none"
          stroke={GOLD}
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Resume hairlines */}
        {RESUMELINES.map((l, i) => (
          <path
            key={i}
            d={l.d}
            fill="none"
            stroke={l.tone === 'gold' ? GOLD : CREAM}
            strokeWidth="1"
            strokeOpacity={l.tone === 'gold' ? 0.45 : 0.2}
          />
        ))}

        {/* ATS barcode + label near the sheet */}
        <g className="float-y" transform="translate(676 228)" opacity="0.45">
          {BARCODE.map((dx, i) => (
            <line key={dx} x1={dx} y1="0" x2={dx} y2={18 - i * 2} stroke={CREAM} strokeWidth="1.4" />
          ))}
          <text x="44" y="14" fill={CREAM} fontFamily={MONO} fontSize="11" letterSpacing="2">
            ATS
          </text>
        </g>

        {/* Acceptance check */}
        <g className="float-y" transform="translate(700 640)" style={{ animationDelay: '-5s' }} opacity="0.5">
          <circle r="10" fill="none" stroke={GOLD} strokeWidth="1" />
          <path d="M -4 1 l 3 3 l 6 -7" fill="none" stroke={GOLD} strokeWidth="1.2" />
        </g>

        {/* Echo career line */}
        <path d={ECHO_PATH} fill="none" stroke={CREAM} strokeWidth="1" strokeDasharray="1 10" opacity="0.14" />
        {/* Violet breath along the echo */}
        <circle cx="1160" cy="300" r="3" fill={VIOLET} opacity="0.55" />

        {/* The career path — draws in once */}
        <motion.path
          d={MAIN_PATH}
          fill="none"
          stroke={GOLD}
          strokeWidth="1.8"
          opacity={reduce ? 0.85 : undefined}
          initial={reduce ? undefined : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: EASE.out }}
        />
        {/* Traveling signal pulse */}
        <motion.path
          d={MAIN_PATH}
          fill="none"
          stroke={GOLD}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeDasharray="7 440"
          className="signal-flow"
          opacity="0.85"
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 0.85 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 0.6 }}
        />

        {/* Converging opportunity rays */}
        {RAYS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={GOLD}
            strokeWidth="1"
            opacity="0.25"
            initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
            whileInView={reduce ? undefined : { pathLength: 1, opacity: 0.25 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.4 + i * 0.08, ease: EASE.out }}
          />
        ))}

        {/* Scatter */}
        {SCATTER.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.7" fill={p.tone === 'violet' ? VIOLET : CREAM} opacity={p.o} />
        ))}

        {/* Nodes */}
        {NODES.map((n, i) => (
          <g key={i}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={n.end ? 5.5 : n.tone === 'gold' ? 4.5 : 3.5}
              fill={GOLD}
              stroke="#150604"
              strokeWidth="1.8"
              initial={reduce ? undefined : { opacity: 0, scale: 0.6 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 + i * 0.2, ease: EASE.out }}
            />
            {n.end && (
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="12"
                fill="none"
                stroke={GOLD}
                strokeWidth="0.8"
                opacity="0.4"
                initial={reduce ? undefined : { scale: 0.4, opacity: 0 }}
                whileInView={reduce ? undefined : { scale: 1, opacity: 0.4 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 1.6, ease: EASE.out }}
              />
            )}
            {n.label && (
              <text
                x={n.x + (n.end ? 18 : 16)}
                y={n.y - 10}
                fill={n.tone === 'gold' ? GOLD : CREAM}
                fontFamily={MONO}
                fontSize={n.tone === 'gold' ? 12 : 10.5}
                letterSpacing="2"
                opacity={n.tone === 'gold' ? 0.85 : 0.5}
              >
                {n.label}
              </text>
            )}
          </g>
        ))}

        {/* Floating fragments */}
        <g className="float-y" opacity="0.5" style={{ animationDelay: '-3s' }}>
          <text x="1000" y="360" fill={CREAM} fontFamily={MONO} fontSize="10.5" letterSpacing="2">
            +5 SKILLS
          </text>
        </g>
        <g className="float-y" opacity="0.75" style={{ animationDelay: '-7s' }}>
          <text x="640" y="130" fill={GOLD} fontFamily={MONO} fontSize="11" letterSpacing="2">
            96% MATCH
          </text>
        </g>
        {/* Terminal spark */}
        <g className="float-y" transform="translate(1214 84)" opacity="0.7">
          <path d="M -9 0 L 9 0 M 0 -9 L 0 9" stroke={GOLD} strokeWidth="1" />
        </g>
      </svg>
    </motion.div>
  );
}