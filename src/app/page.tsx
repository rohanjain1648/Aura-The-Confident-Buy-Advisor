"use client";

import LenisProvider from "@/components/LenisProvider";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PipelineSection from "@/components/PipelineSection";
import PassportSimulator from "@/components/PassportSimulator";
import VtoShowcaseSection from "@/components/VtoShowcaseSection";
import ProductGridSection from "@/components/ProductGridSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <LenisProvider>
      <div className="relative min-h-screen bg-[#05050a] text-slate-100 selection:bg-rose-500 selection:text-white overflow-x-hidden">
        {/* Dynamic ambient canvas background */}
        <BackgroundCanvas />

        {/* Floating Glass Navigation */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="relative z-10 space-y-12 sm:space-y-24">
          <HeroSection />
          <PipelineSection />
          <PassportSimulator />
          <VtoShowcaseSection />
          <ProductGridSection />
          <ArchitectureSection />
          <FaqSection />
        </main>

        {/* Luxury Glass Footer */}
        <Footer />
      </div>
    </LenisProvider>
  );
}
