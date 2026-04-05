import Hero from './components/sections/Hero';
import Value from './components/sections/Value';
import Trust from './components/sections/Trust';
import DashboardPreview from './components/sections/DashboardPreview';
import Testimonials from './components/sections/Testimonials';
import Pricing from './components/sections/Pricing';
import CTA from './components/sections/CTA';

/**
 * Growcad landing page — scroll narrative structure
 *
 * Scene 1 → Hero        "Hook" — first 3 seconds = "this is different"
 * Scene 2 → Value       "Problem/Solution" — here's what you've been missing
 * Scene 3 → Trust       "Proof" — others already switched
 * Scene 4 → Product     "System" — see it work
 * Scene 5 → Proof       "Validation" — hear from real users
 * Scene 6 → Pricing     "Decision" — simple choice
 * Scene 7 → CTA         "Conversion" — "I want this"
 *
 * Each section has data-scene for scroll-story orchestration.
 * Scene-to-scene transitions are handled by CSS section connectors in globals.css.
 */
export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Scene 1: Hook */}
      <Hero />

      {/* Scene 2: Problem/Value */}
      <Value />

      {/* Scene 3: Social proof numbers + logos */}
      <Trust />

      {/* Scene 4: Product demonstration */}
      <DashboardPreview />

      {/* Scene 5: Testimonials */}
      <Testimonials />

      {/* Scene 6: Pricing decision */}
      <Pricing />

      {/* Scene 7: Final conversion */}
      <CTA />
    </div>
  );
}
