import type { Metadata } from 'next';
import SmoothScroll from './components/core/SmoothScroll';
import Cursor from './components/core/Cursor';
import CursorGlow from './components/effects/CursorGlow';
import GridBackground from './components/effects/GridBackground';
import NoiseLayer from './components/effects/NoiseLayer';
import TransitionOverlay from './components/core/TransitionOverlay';
import ScrollFix from './components/core/ScrollFix';
import ReducedMotionConfig from './components/core/ReducedMotionConfig';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Splash from './components/core/Splash';

export const metadata: Metadata = {
  title: 'Growcad — The Growth Stack That Never Sleeps',
  description:
    'Growcad unifies analytics, experiments, and revenue data into one intelligent workspace for modern growth teams.',
  openGraph: {
    title: 'Growcad — The Growth Stack That Never Sleeps',
    description: 'Analytics, experiments, and revenue data. One workspace.',
    type: 'website',
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReducedMotionConfig>
      {/* Splash loader */}
      <Splash />

      {/* Page wipe transition */}
      <TransitionOverlay />

      {/* Custom cursor (desktop only) */}
      <Cursor />

      {/* Cursor ambient glow */}
      <CursorGlow />

      {/* Persistent grid bg */}
      <GridBackground />

      {/* Film grain depth layer */}
      <NoiseLayer />

      {/* Route scroll reset */}
      <ScrollFix />

      {/* Smooth scrolling via Lenis */}
      <SmoothScroll>
        <div className="relative min-h-screen bg-[#070709] text-white selection:bg-violet-500/30">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </SmoothScroll>
    </ReducedMotionConfig>
  );
}
