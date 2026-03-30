import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Trust from "../components/Trust";
import SocialProof from "../components/SocialProof";
import CTA from "../components/CTA";

export default function Page() {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      <Trust />
      <SocialProof />
      <CTA />
    </main>
  );
}