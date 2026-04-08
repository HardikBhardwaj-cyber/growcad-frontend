import Hero from './components/sections/Hero';
import Value from './components/sections/Value';
import Trust from './components/sections/Trust';
import DashboardPreview from './components/sections/DashboardPreview';
import Testimonials from './components/sections/Testimonials';
import Pricing from './components/sections/Pricing';
import CTA from './components/sections/CTA';

/**
 * Growcad landing page — scroll narrative
 *
 * Scene 1 → Hero         "Hook"
 * Scene 2 → Value        "Problem/Solution"
 * Scene 3 → Trust        "Social proof numbers"
 * Scene 4 → Dashboard    "Product demonstration"
 * Scene 5 → Testimonials "Validation"
 * Scene 6 → Pricing      "Decision"
 * Scene 7 → CTA          "Conversion"
 *
 * IMPORTANT: The wrapper div must NOT have overflow-hidden.
 * overflow-hidden on this container clips sections and Footer.
 * Each section handles its own overflow where needed (e.g. carousels).
 */
export default function HomePage() {
  return (
    <div className="relative w-full">
      <Hero />
      <Value />
      <Trust />
      <DashboardPreview />
      <Testimonials />
      <Pricing />
      <CTA />
    </div>
  );
}
