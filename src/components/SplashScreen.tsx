"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const DECORATIONS = [
  "/assets/cake/apple-pie.svg",
  "/assets/cake/brown-caramel.svg",
  "/assets/cake/cheesecake.svg",
  "/assets/cake/eclair.svg",
  "/assets/cake/macaron.svg",
  "/assets/cake/madeleine.svg",
  "/assets/cake/pie-fruit.svg",
  "/assets/cake/pudding.svg",
  "/assets/cake/roll-cake.svg",
  "/assets/cake/tiramisu.svg",
];

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after 3.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for fade out animation
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-50 overflow-hidden"
        >
          {/* Glowing aura behind logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] bg-primary-200/40 rounded-full blur-[80px] pointer-events-none"
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}
            className="relative z-10 w-56 sm:w-72 md:w-96"
          >
            <Image
              src="/assets/img/KokiMugi.svg"
              alt="KokiMugi Logo"
              width={400}
              height={400}
              priority
              className="w-full h-auto drop-shadow-2xl"
            />
          </motion.div>

          {/* Floating Decorations (Orbital Burst Pattern) */}
          {DECORATIONS.map((src, index) => {
            // 360 degrees divided by 10 items = 36 degrees apart
            const angle = (index / DECORATIONS.length) * 360;
            // Alternate distance for a dynamic 3D starburst feel
            const isEven = index % 2 === 0;
            // Responsive distance calculation using CSS clamp
            const distance = isEven ? "clamp(100px, 25vw, 220px)" : "clamp(140px, 35vw, 320px)";

            return (
              <div 
                key={src} 
                className="absolute top-1/2 left-1/2 w-0 h-0 z-0 pointer-events-none"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0, y: 0, rotate: -angle - 45 }}
                  animate={{ 
                    opacity: 0.9, 
                    scale: 1, 
                    y: `calc(-1 * ${distance})`, 
                    // Rotate back so the cake stands upright, with a slight playful tilt
                    rotate: -angle + (isEven ? 12 : -12) 
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 14,
                    delay: 0.3 + index * 0.05,
                  }}
                  className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 -ml-8 -mt-8 sm:-ml-10 sm:-mt-10 md:-ml-14 md:-mt-14"
                >
                  <Image
                    src={src}
                    alt="Cake Decoration"
                    fill
                    className="object-contain drop-shadow-[0_10px_20px_rgba(116,77,53,0.15)] animate-float"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  />
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
