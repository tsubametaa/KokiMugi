"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TiramisuButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const CocoaDust = () => {
  // Use a fixed set of coordinates to avoid hydration mismatch, or use a pseudo-random approach.
  // For a reliable UI, we'll generate an array of fixed objects.
  const dustParticles = [
    { t: "10%", l: "15%", s: "2px", o: 0.7 },
    { t: "20%", l: "35%", s: "3px", o: 0.6 },
    { t: "15%", l: "65%", s: "2px", o: 0.8 },
    { t: "30%", l: "85%", s: "3px", o: 0.5 },
    { t: "40%", l: "20%", s: "2px", o: 0.7 },
    { t: "50%", l: "45%", s: "4px", o: 0.4 },
    { t: "60%", l: "75%", s: "2px", o: 0.6 },
    { t: "70%", l: "10%", s: "3px", o: 0.7 },
    { t: "80%", l: "55%", s: "2px", o: 0.8 },
    { t: "85%", l: "30%", s: "3px", o: 0.5 },
    { t: "25%", l: "50%", s: "2px", o: 0.9 },
    { t: "75%", l: "85%", s: "3px", o: 0.6 },
    { t: "10%", l: "80%", s: "2px", o: 0.7 },
    { t: "45%", l: "10%", s: "3px", o: 0.5 },
    { t: "55%", l: "90%", s: "2px", o: 0.8 },
    { t: "90%", l: "70%", s: "3px", o: 0.6 },
    { t: "35%", l: "25%", s: "2px", o: 0.7 },
    { t: "65%", l: "40%", s: "4px", o: 0.4 },
    { t: "5%", l: "40%", s: "2px", o: 0.6 },
    { t: "95%", l: "50%", s: "3px", o: 0.7 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-80 mix-blend-multiply">
      {dustParticles.map((p, i) => (
        <div 
          key={i}
          className="absolute bg-[#4A2E1B] rounded-full"
          style={{
            width: p.s,
            height: p.s,
            top: p.t,
            left: p.l,
            opacity: p.o,
          }}
        />
      ))}
    </div>
  );
};

export function TiramisuButton({
  children,
  className,
  size = "md",
  isLoading,
  ...props
}: TiramisuButtonProps) {
  const sizes = {
    sm: "px-4 py-2 sm:px-5 sm:py-2.5 text-sm",
    md: "px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base",
    lg: "px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg",
  };

  const s = sizes[size];

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.98, y: 0 }}
      className={cn(
        "relative group rounded-xl font-extrabold tracking-wide border-none outline-none overflow-hidden cursor-pointer",
        "shadow-[0_8px_15px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_25px_rgba(0,0,0,0.2)] active:shadow-[0_3px_5px_rgba(0,0,0,0.2)] transition-shadow duration-300",
        isLoading && "opacity-80 cursor-wait",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* 1. Base Ladyfinger/Coffee Layer */}
      <div className="absolute inset-0 rounded-xl bg-[#8B5A2B] shadow-[inset_0_-6px_10px_rgba(92,58,33,0.8),inset_0_4px_8px_rgba(255,255,255,0.2)] transition-colors duration-300 group-hover:brightness-110" />
      
      {/* 2. Mascarpone Cream Container */}
      <div className="absolute inset-0 top-0 bottom-[8px] transition-transform duration-100 ease-out group-active:translate-y-[8px]">
        {/* Cream Body */}
        <div className="absolute inset-x-0 top-0 h-full rounded-xl bg-[#FFFDF0] shadow-[inset_0_-4px_6px_rgba(230,220,190,0.6)] transition-colors duration-300 group-hover:brightness-110 overflow-hidden">
          
          {/* Coffee Soaked edges */}
          <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-[#8B5A2B]/40 to-transparent opacity-60" />

          {/* Cocoa Dusting */}
          <CocoaDust />

          {/* Creamy Wavy Top (Subtle) */}
          <svg className="absolute top-0 left-0 w-full h-3 opacity-20 text-[#D2B48C]" preserveAspectRatio="none" viewBox="0 0 100 10">
            <path d="M0,5 C20,0 30,10 50,5 C70,0 80,10 100,5 L100,0 L0,0 Z" fill="currentColor" />
          </svg>

          {/* Glossy Highlights */}
          <div className="absolute top-1 left-[5%] right-[5%] h-1/4 rounded-full bg-gradient-to-b from-white/80 to-transparent pointer-events-none blur-[2px] opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
        </div>
      </div>
      
      {/* 3. Text Content */}
      <span 
        className={cn(
          "relative z-10 flex items-center justify-center gap-2 transition-transform duration-100 ease-out group-active:translate-y-[8px]",
          s,
          "text-[#4A2E1B] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        )}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </span>
    </motion.button>
  );
}
