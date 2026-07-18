import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ModulesShowcase } from "@/components/marketing/ModulesShowcase";
import { Capabilities } from "@/components/marketing/Capabilities";
import { Stats } from "@/components/marketing/Stats";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Faq } from "@/components/marketing/Faq";
import { NewsletterCta } from "@/components/marketing/NewsletterCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ModulesShowcase />
      <Capabilities />
      <Stats />
      <Testimonials />
      <Faq />
      <NewsletterCta />
    </>
  );
}
