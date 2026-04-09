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
import { ScrollContextProvider } from './components/core/ScrollContext';

export const metadata: Metadata = {
  title: 'Growcad — The Growth Stack That Never Sleeps',
  description: 'Growcad unifies analytics, experiments, and revenue data into one intelligent workspace for modern growth teams.',
  openGraph: {
    title: 'Growcad — The Growth Stack That Never Sleeps',
    description: 'Analytics, experiments, and revenue data. One workspace.',
    type: 'website',
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReducedMotionConfig>
      <ScrollContextProvider>

        {/* Fixed viewport layers */}
        <Splash />
        <TransitionOverlay />
        <Cursor />
        <CursorGlow />
        <GridBackground />
        <NoiseLayer />
        <ScrollFix />

        {/* Fixed navbar */}
        <Navbar />

        {/* Scrollable content */}
        <SmoothScroll>
          <div className="scroll-content selection:bg-violet-500/30">
            <main style={{ paddingTop: 'var(--navbar-h, 64px)' }}>
              {children}
            </main>
            <Footer />
          </div>
        </SmoothScroll>

      </ScrollContextProvider>
    </ReducedMotionConfig>
  );
}
