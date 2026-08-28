import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { BrandStorySection } from "@/components/BrandStorySection";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { VerificationSection } from "@/components/VerificationSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { MockupsSection } from "@/components/MockupsSection";
import { TwoSidedSection } from "@/components/TwoSidedSection";
import { SafetySection } from "@/components/SafetySection";
import { InvestorSection } from "@/components/InvestorSection";
import { SignupSection } from "@/components/SignupSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AnFund — Kết nối dòng vốn, nâng tầm khát vọng" },
      {
        name: "description",
        content:
          "AnFund là sàn đấu giá vốn hai chiều minh bạch, có kiểm soát — nơi dòng vốn an tâm gặp những khát vọng phát triển.",
      },
      {
        property: "og:title",
        content: "AnFund — Kết nối dòng vốn, nâng tầm khát vọng",
      },
      {
        property: "og:description",
        content:
          "Rồng Việt dẫn vốn vươn khơi: nền tảng kết nối người vay, người cho vay, dữ liệu và niềm tin.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();

  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Bỏ qua điều hướng
      </a>
      <Header />
      <main id="top" tabIndex={-1} className="bg-background">
        <HeroSection />
        <BrandStorySection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <ProcessSection />
        <VerificationSection />
        <BenefitsSection />
        <MockupsSection />
        <TwoSidedSection />
        <SafetySection />
        <InvestorSection />
        <SignupSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
