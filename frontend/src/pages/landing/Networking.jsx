import { motion } from 'framer-motion';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Reveal } from './Reveal';
import { Section } from './Section';
import { Avatar } from '../../components/ui';

const NODES = [
  { id: 'you', label: 'You', cx: 50, cy: 50, primary: true },
  { id: 'a', label: 'AM', cx: 20, cy: 24 },
  { id: 'b', label: 'JL', cx: 78, cy: 20 },
  { id: 'c', label: 'KZ', cx: 26, cy: 78 },
  { id: 'd', label: 'PM', cx: 80, cy: 74 },
];

const EDGES = [
  ['you', 'a'],
  ['you', 'b'],
  ['you', 'c'],
  ['you', 'd'],
  ['a', 'c'],
  ['b', 'd'],
];

const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));

/**
 * Networking — feature storytelling around relationship intelligence.
 * Left: a connected network graph drawn as a paper card. Right: numbered copy.
 */
export function Networking() {
  return (
    <Section
      align="left"
      eyebrow="Networking"
      title="Turn weak ties into warm intros"
      description="CareerCraft maps your network, surfaces the people most likely to help you reach a role, and drafts the message that gets a reply."
      className="bg-[var(--color-bg-secondary)]/40"
    >
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="order-1 lg:order-2">
          <div className="space-y-8">
            <FeaturePoint
              icon={Users}
              n="01"
              title="Map your network"
              body="See your strongest bridges into teams, hiring managers, and alumni at target companies."
            />
            <FeaturePoint
              icon={MessageSquare}
              n="02"
              title="Messages that land"
              body="Context-aware drafts reference the right mutual contact and the right opening line."
            />
            <FeaturePoint
              icon={TrendingUp}
              n="03"
              title="Track momentum"
              body="Follow warm conversations to reply-rates and intros, all in one place."
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-2 lg:order-1">
          <NetworkCard />
        </Reveal>
      </div>
    </Section>
  );
}

function FeaturePoint({ icon: Icon, n, title, body }) {
  return (
    <div className="flex gap-5">
      <div className="flex shrink-0 flex-col items-center">
        <span className="font-mono text-xs text-[var(--color-primary)]">{n}</span>
        <span aria-hidden="true" className="mt-2 h-px w-8 bg-[var(--color-border-strong)]" />
        <span className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-primary)]/30 text-[var(--color-primary)]">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div>
        <h3 className="text-lg font-medium text-[var(--color-text)]">{title}</h3>
        <p className="mt-1.5 text-base leading-[var(--leading-body)] text-[var(--color-text-muted)]">
          {body}
        </p>
      </div>
    </div>
  );
}

function NetworkCard() {
  const reduce = useReducedMotion();
  const highlight = ['you', 'a', 'd'];

  return (
    <div className="paper overflow-hidden rounded-[var(--radius-4)] shadow-[var(--shadow-floating)]">
      <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
        <p className="text-sm font-semibold text-[var(--color-cream-ink)]">Your network</p>
        <span className="rounded-full bg-[var(--color-cream-ink)] px-3 py-1 font-mono text-xs uppercase tracking-wider text-[var(--color-cream)]">
          3 warm intros
        </span>
      </div>

      {/* Graph */}
      <div className="relative p-5">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          aria-hidden="true"
          style={{ minHeight: 220 }}
        >
          {EDGES.map(([from, to]) => {
            const a = nodeById[from];
            const b = nodeById[to];
            const active = highlight.includes(from) && highlight.includes(to);
            return (
              <motion.line
                key={`${from}-${to}`}
                x1={a.cx}
                y1={a.cy}
                x2={b.cx}
                y2={b.cy}
                stroke={active ? 'var(--color-primary)' : 'rgba(36,16,5,0.25)'}
                strokeWidth={active ? 1.4 : 0.8}
                strokeOpacity={active ? 0.55 : 1}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: reduce ? 0 : 0.8, ease: 'easeOut' }}
              />
            );
          })}

          {NODES.map((n, i) => (
            <motion.circle
              key={n.id}
              cx={n.cx}
              cy={n.cy}
              r={n.primary ? 9 : 6.5}
              fill={n.primary ? 'var(--color-primary)' : 'var(--color-cream)'}
              stroke={n.primary ? 'var(--color-primary)' : 'rgba(36,16,5,0.5)'}
              strokeWidth={n.primary ? 1.5 : 1}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: reduce ? 0 : 0.1 + i * 0.06 }}
            />
          ))}
        </svg>

        {/* Floating contact chip reflecting the message draft */}
        <div className="absolute right-4 top-4 max-w-[12rem] rounded-[var(--radius-3)] border border-black/10 bg-[var(--color-cream)] p-3 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-2">
            <Avatar name="AM" size="sm" />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[var(--color-cream-ink)]">
                Ari Mendoza
              </p>
              <p className="font-mono text-[0.625rem] text-black/50">
                Product · ex-Stripe
              </p>
            </div>
          </div>
          <p className="mt-2 rounded-[var(--radius-2)] bg-[var(--color-cream-muted)] px-2.5 py-2 text-[0.6875rem] text-black/60">
            “Hi Ari — noticing we’re connected 2nd degree through…”
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-black/10 px-6 py-3.5">
        <p className="font-mono text-xs uppercase tracking-wider text-black/45">
          1,284 connections
        </p>
        <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[var(--color-primary-active)]">
          <TrendingUp className="h-3.5 w-3.5" />
          12 new this week
        </p>
      </div>
    </div>
  );
}