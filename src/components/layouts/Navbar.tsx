"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[var(--background)]/85 backdrop-blur-md shadow-sm border-b border-primary-100 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className={`relative transition-all duration-500 ${isScrolled ? "w-10 h-10 md:w-12 md:h-12" : "w-12 h-12 md:w-16 md:h-16"}`}
          >
            <Image
              src="/assets/img/KokiMugi.svg"
              alt="KokiMugi Logo"
              fill
              className="object-contain drop-shadow-sm"
            />
          </div>
        </Link>

        {/* Call to action button */}
        <Button 
          variant="tiramisu" 
          size="sm"
          onClick={() => {
            document.getElementById("recommendation-section")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Coba AI Sekarang
        </Button>
      </div>
    </motion.header>
  );
}
