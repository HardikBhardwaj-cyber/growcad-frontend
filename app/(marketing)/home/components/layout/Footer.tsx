'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Reveal from '../motion/Reveal';
import { CONTAINER, T, DUR, EASE_OUT } from '../../systems/design';

const COLS = {
  Product:    ['Features', 'Pricing', 'Changelog', 'Roadmap', 'API Docs'],
  Company:    ['About', 'Blog', 'Careers', 'Press Kit'],
  Developers: ['Documentation', 'SDKs', 'GitHub', 'Status Page'],
  Legal:      ['Privacy', 'Terms', 'Security', 'Cookies'],
};

const TRUST_BADGES = [
  { label: 'SOC 2 + GDPR' },
  { label: '99.99% uptime' },
  { label: '4K+ teams' },
];

// ── Underline-grow link — left→right on hover ──────────────────────────────
function FooterLink({ href = '#', children }: { href?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-block text-[13px] text-white/36 transition-colors duration-[180ms] hover:text-white/72"
    >
      {children}
      {/* Underline grows left→right */}
      <span
        className="absolute -bottom-px left-0 h-px w-0 bg-white/28 transition-[width] duration-[220ms] ease-out group-hover:w-full"
      />
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05] pb-12 pt-20">

      {/* Gradient separator — soft visual break from CTA */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <div className="h-px w-[640px] bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />
      </div>

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(109,40,217,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className={CONTAINER.page}>

        {/* ── Top row: Brand + Newsletter ─────────────────────────────────── */}
        <Reveal className="mb-16">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">

            {/* Brand block */}
            <div className="max-w-[300px]">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-[9px] bg-gradient-to-br from-violet-500 to-blue-600 shadow-[0_0_14px_rgba(139,92,246,0.35)]" />
                <span className="text-[13.5px] font-semibold tracking-[-0.01em] text-white">Growcad</span>
              </div>
              <p className="mb-5 text-[13.5px] leading-[1.72] text-white/32">
                The analytics, A/B testing, and revenue workspace your whole team
                will actually open.
              </p>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                {TRUST_BADGES.map((b) => (
                  <span
                    key={b.label}
                    className="inline-flex items-center rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10.5px] text-white/28"
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="shrink-0">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/28">
                Stay in the loop
              </p>
              <div className="flex items-stretch gap-2">
                <input
                  type="email"
                  placeholder="you@company.com"
                  aria-label="Email for newsletter"
                  className="w-52 rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-2.5 text-[13px] text-white placeholder:text-white/20 outline-none transition-all duration-[180ms] focus:border-violet-500/45 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.13)]"
                />
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 36px rgba(139,92,246,0.45)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_22px_rgba(139,92,246,0.25)]"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <div className="mb-14 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

        {/* ── Link columns ─────────────────────────────────────────────────── */}
        <Reveal delay={0.06} className="mb-14">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {Object.entries(COLS).map(([col, links], colIdx) => (
              <div key={col}>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/22">
                  {col}
                </p>
                <ul className="space-y-2.5" role="list">
                  {links.map((l, linkIdx) => (
                    <motion.li
                      key={l}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.28,
                        delay: colIdx * 0.04 + linkIdx * 0.03,
                        ease: EASE_OUT,
                      }}
                    >
                      <FooterLink>{l}</FooterLink>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Bottom bar ───────────────────────────────────────────────────── */}
        <Reveal delay={0.12}>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-8 text-[12px] text-white/22 sm:flex-row">
            <p>© {new Date().getFullYear()} Growcad, Inc. All rights reserved.</p>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-55" />
                <span className="relative flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span>All systems operational</span>
            </div>

            {/* Brand line */}
            <p className="text-white/18">
              Built with precision{' '}
              <span className="text-violet-400/50">✦</span>
            </p>
          </div>
        </Reveal>

      </div>
    </footer>
  );
}
