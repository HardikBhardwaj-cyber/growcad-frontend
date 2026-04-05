'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Reveal from '../motion/Reveal';
import { CONTAINER, T } from '../../systems/design';

const COLS = {
  Product:    ['Features', 'Pricing', 'Changelog', 'Roadmap', 'API Docs'],
  Company:    ['About', 'Blog', 'Careers', 'Press Kit'],
  Developers: ['Documentation', 'SDKs', 'GitHub', 'Status Page'],
  Legal:      ['Privacy', 'Terms', 'Security', 'Cookies'],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05] pb-12 pt-20">
      {/* Top gradient line */}
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
        {/* ── Top row: Brand + Newsletter ── */}
        <Reveal className="mb-16">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            {/* Brand */}
            <div className="max-w-[280px]">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-[9px] bg-gradient-to-br from-violet-500 to-blue-600 shadow-[0_0_14px_rgba(139,92,246,0.35)]" />
                <span className="text-[13.5px] font-semibold tracking-[-0.01em] text-white">Growcad</span>
              </div>
              <p className="text-[13.5px] leading-[1.7] text-white/32">
                The operating system for modern growth teams.
                Analytics, experiments, and revenue — in one place.
              </p>
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
                  className="w-52 rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-2.5 text-[13px] text-white placeholder:text-white/20 outline-none transition-all duration-250 focus:border-violet-500/45 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.13)]"
                />
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 36px rgba(139,92,246,0.45)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={T.fast}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_22px_rgba(139,92,246,0.25)]"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Link columns ── */}
        <Reveal delay={0.08} className="mb-16">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {Object.entries(COLS).map(([col, links]) => (
              <div key={col}>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/22">
                  {col}
                </p>
                <ul className="space-y-2.5" role="list">
                  {links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-[13px] text-white/36 transition-colors duration-200 hover:text-white/72"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Bottom bar ── */}
        <Reveal delay={0.14}>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-8 text-[12px] text-white/22 sm:flex-row">
            <p>© {new Date().getFullYear()} Growcad, Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-55" />
                <span className="relative flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span>All systems operational</span>
            </div>
            <p>Built with precision ✦</p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
