import { BackgroundBlobs } from "@/components/marketing/BackgroundBlobs";
import { Footer } from "@/components/marketing/Footer";
import { FeaturesStory } from "@/components/marketing/FeaturesStory";
import { HeroV2 } from "@/components/marketing/HeroV2";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { ProofStats } from "@/components/marketing/ProofStats";
import { Testimonials } from "@/components/marketing/Testimonials";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <BackgroundBlobs />
      <HeroV2 />
      <ProofStats />
      <HowItWorks />
      <FeaturesStory />
      <Testimonials />
      <PricingTeaser />
      <Footer />
    </div>
  );
}
