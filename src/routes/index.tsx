import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
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
      { title: "AnFund — Nơi người vay tốt gặp nguồn vốn cạnh tranh" },
      {
        name: "description",
        content:
          "AnFund (AnVốn) là sàn đấu giá vốn hai chiều, minh bạch và có chọn lọc — kết nối người cần vốn với nguồn vốn cạnh tranh.",
      },
      {
        property: "og:title",
        content: "AnFund — Nơi người vay tốt gặp nguồn vốn cạnh tranh",
      },
      {
        property: "og:description",
        content:
          "Đăng nhu cầu vay một lần, nhận nhiều đề xuất cạnh tranh. Người cho vay chủ động chọn hồ sơ phù hợp khẩu vị rủi ro.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();

  return (
    <>
      <Header />
      <main id="top" className="bg-background">
        <HeroSection />
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
