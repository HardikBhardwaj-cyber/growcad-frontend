'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Zap, Search, Bell, ChevronRight } from 'lucide-react';
import Reveal from '../motion/Reveal';
import { CONTAINER, SECTION_PY, SCENES, T, DUR, EASE_OUT, staggerDelay, SHADOW, HIERARCHY } from '../../systems/design';

type TabId = 'analytics' | 'growth' | 'users' | 'experiments';

const TABS: { id: TabId; Icon: typeof BarChart2; label: string }[] = [
  { id: 'analytics',   Icon: BarChart2,  label: 'Analytics'   },
  { id: 'growth',      Icon: TrendingUp, label: 'Growth'       },
  { id: 'users',       Icon: Users,      label: 'Users'        },
  { id: 'experiments', Icon: Zap,        label: 'Experiments'  },
];

const BARS: Record<TabId, number[]> = {
  analytics:   [55,42,70,58,84,66,92,74,100,82,96,88],
  growth:      [30,48,42,72,58,86,68,94,78,98,84,100],
  users:       [75,62,68,52,73,58,82,68,90,78,95,100],
  experiments: [38,32,58,52,68,62,78,72,86,80,94,100],
};

const METRICS: Record<TabId, { label: string; val: string; delta: string; up: boolean }[]> = {
  analytics:   [{ label:'Page Views', val:'2.4M',  delta:'+18%',  up:true  }, { label:'Sessions',    val:'840K',  delta:'+12%',  up:true  }, { label:'Bounce',   val:'24%',   delta:'−6%',   up:false }],
  growth:      [{ label:'MRR',        val:'$198K', delta:'+24%',  up:true  }, { label:'ARR',         val:'$2.4M', delta:'+24%',  up:true  }, { label:'Churn',    val:'1.2%',  delta:'−0.3%', up:false }],
  users:       [{ label:'DAU',        val:'84.2K', delta:'+9%',   up:true  }, { label:'MAU',         val:'320K',  delta:'+15%',  up:true  }, { label:'Ret.',     val:'68%',   delta:'+4%',   up:true  }],
  experiments: [{ label:'Live Tests', val:'14',    delta:'',      up:true  }, { label:'Confidence',  val:'97%',   delta:'',      up:true  }, { label:'Uplift',   val:'+8.3%', delta:'',      up:true  }],
};

export default function DashboardPreview() {
  const [tab, setTab] = useState<TabId>('analytics');
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 88%', 'center 48%'] });

  // Spring-smoothed cinematic entry
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.90, 1]);
  const rawOp    = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const rawY     = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const scale    = useSpring(rawScale, { damping: 22, stiffness: 120 });
  const entryY   = useSpring(rawY,     { damping: 22, stiffness: 120 });

  const bars = BARS[tab];
  const mets = METRICS[tab];

  return (
    <section
      ref={sectionRef}
      data-scene={SCENES.product}
      className={`relative overflow-hidden ${SECTION_PY.lg}`}
    >
      <div className="section-divider" />

      {/* Center ambient */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(109,40,217,0.05) 0%, transparent 68%)',
          filter: 'blur(100px)',
        }}
      />

      <div className={CONTAINER.page}>
        {/* Header — visual hierarchy enforced */}
        <Reveal className="mb-16 text-center">
          <p className="scene-label mb-4">Product</p>
          <h2
            className="mb-5 font-bold leading-[1.1] tracking-[-0.028em]"
            style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)' }}
          >
            <span className="text-white">One workspace.</span>
            <br />
            <span className="text-white/28">Infinite clarity.</span>
          </h2>
          <p className="mx-auto max-w-md text-[15px] leading-relaxed text-white/36">
            Switch between views without switching tools.
            Every growth signal, always in focus.
          </p>
        </Reveal>

        {/* Dashboard — spring entry tied to scroll */}
        <motion.div
          style={{ scale, opacity: rawOp, y: entryY }}
          className="will-both"
        >
          {/* Outer glow + shadow ring */}
          <div
            className="pointer-events-none absolute -inset-px rounded-[23px] blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.13), rgba(59,130,246,0.09), rgba(139,92,246,0.06))',
              zIndex: -1,
            }}
          />

          <div
            className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0a0a0e]"
            style={{ boxShadow: SHADOW.dashCard }}
          >
            {/* Top reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />

            {/* Chrome bar */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.05] bg-white/[0.015] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/55" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/55" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/55" />
              </div>
              <div className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-white/[0.04] px-4 py-[7px]">
                <Search size={11} className="text-white/22" />
                <span className="text-[11px] text-white/22">app.growcad.io/dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <Bell size={14} className="text-white/22" />
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500" />
              </div>
            </div>

            <div className="flex min-h-[490px]">
              {/* Sidebar */}
              <div className="hidden w-48 flex-shrink-0 flex-col gap-1 border-r border-white/[0.05] bg-white/[0.008] p-4 sm:flex">
                <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] ${HIERARCHY.muted}`}>
                  Views
                </p>
                {TABS.map((t) => (
                  <motion.button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={[
                      'group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] font-medium text-left transition-colors duration-150',
                      tab === t.id
                        ? 'bg-violet-500/13 text-violet-300 border border-violet-500/18'
                        : 'text-white/30 hover:bg-white/[0.04] hover:text-white/62',
                    ].join(' ')}
                    whileHover={tab === t.id ? undefined : { x: 2 }}
                    transition={T.micro}
                  >
                    <t.Icon size={13} className={tab === t.id ? 'text-violet-400' : ''} />
                    {t.label}
                    {tab === t.id && (
                      <ChevronRight size={11} className="ml-auto text-violet-400/60" />
                    )}
                  </motion.button>
                ))}

                {/* Saved views — tertiary (lower hierarchy) */}
                <div className="mt-5 border-t border-white/[0.05] pt-4">
                  <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] ${HIERARCHY.muted}`}>
                    Saved
                  </p>
                  {['Weekly KPIs', 'Retention', 'Q2 Review'].map((l) => (
                    <button
                      key={l}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[11.5px] text-white/20 hover:text-white/42 transition-colors duration-150"
                    >
                      <span className="h-1 w-1 flex-shrink-0 rounded-full bg-white/14" />
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main panel */}
              <div className="flex-1 p-6">
                {/* Panel header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className={`text-[14px] font-semibold capitalize ${HIERARCHY.primary}`}>
                      {tab}
                    </h3>
                    <p className={`text-[11.5px] ${HIERARCHY.muted}`}>
                      Last 30 days · Auto-refreshed
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Live badge — primary indicator */}
                    <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping-slow absolute h-full w-full rounded-full bg-emerald-400 opacity-55" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400">Live</span>
                    </div>
                    <button className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[11px] text-white/32 hover:text-white/55 transition-colors duration-150">
                      Export
                    </button>
                  </div>
                </div>

                {/* Metrics — animate on tab switch */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`m-${tab}`}
                    className="mb-6 grid grid-cols-3 gap-3"
                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                    exit={{   opacity: 0, y: -8,  filter: 'blur(4px)' }}
                    transition={{ duration: DUR.FAST, ease: EASE_OUT }}
                  >
                    {mets.map((m, i) => (
                      <motion.div
                        key={m.label}
                        className="rounded-[13px] border border-white/[0.06] bg-white/[0.028] p-3.5"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: DUR.FAST }}
                      >
                        <p className={`text-[10px] ${HIERARCHY.muted}`}>{m.label}</p>
                        <p className={`mt-0.5 text-[15px] font-bold leading-tight ${HIERARCHY.primary}`}>
                          {m.val}
                        </p>
                        {m.delta && (
                          <p className={`mt-1 text-[10px] font-semibold ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {m.delta}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Chart — morph on tab switch */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`c-${tab}`}
                    className="overflow-hidden rounded-[14px] border border-white/[0.05] bg-white/[0.018] p-4"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1   }}
                    exit={{   opacity: 0, scale: 0.98 }}
                    transition={{ duration: DUR.FAST, ease: EASE_OUT }}
                  >
                    <div className="flex items-end gap-[3px]" style={{ height: 100 }}>
                      {bars.map((h, i) => (
                        <motion.div
                          key={`${tab}-${i}`}
                          className="flex-1 rounded-t-[2px]"
                          style={{
                            background: i >= bars.length - 4
                              ? 'linear-gradient(to top, #7c3aed, #3b82f6)'
                              : 'rgba(255,255,255,0.058)',
                          }}
                          initial={{ scaleY: 0, originY: '100%' }}
                          animate={{ scaleY: 1 }}
                          transition={{
                            delay: i * 0.022,
                            duration: DUR.FAST + (h / 100) * 0.18,
                            ease: EASE_OUT,
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-2.5 flex justify-between">
                      {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m) => (
                        <span key={m} className={`text-[8px] ${HIERARCHY.muted}`}>{m}</span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
