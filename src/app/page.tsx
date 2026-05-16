"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Hero3D from "@/components/Hero3D";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import RecommendationSection from "@/components/RecommendationSection";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <div
        className={`w-full transition-opacity duration-1000 ${
          showSplash ? "opacity-0 h-screen overflow-hidden" : "opacity-100"
        }`}
      >
        <Hero3D />
        <AboutSection />
        <RecommendationSection />
        <GallerySection />
      </div>
    </main>
  );
}
