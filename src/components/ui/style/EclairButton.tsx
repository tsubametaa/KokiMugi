"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface EclairButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  flavor?: "chocolate" | "strawberry" | "caramel";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Sprinkles = ({ f }: { f: any }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-90">
    <div className={cn("absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full shadow-sm", f.sprinkle1)} />
    <div className={cn("absolute top-[30%] left-[22%] w-1 h-1 rounded-full shadow-sm", f.sprinkle2)} />
    <div className={cn("absolute top-[15%] left-[30%] w-2 h-1 rounded-full rotate-45 shadow-sm", f.sprinkle1)} />
    <div className={cn("absolute top-[40%] left-[38%] w-1 h-1 rounded-full shadow-sm", f.sprinkle2)} />
    <div className={cn("absolute top-[25%] left-[48%] w-1.5 h-1.5 rounded-full shadow-sm", f.sprinkle1)} />
    <div className={cn("absolute top-[10%] left-[55%] w-2 h-1 rounded-full -rotate-12 shadow-sm", f.sprinkle2)} />
    <div className={cn("absolute top-[35%] left-[65%] w-1 h-1 rounded-full shadow-sm", f.sprinkle1)} />
    <div className={cn("absolute top-[20%] left-[75%] w-1.5 h-1 rounded-full rotate-45 shadow-sm", f.sprinkle2)} />
    <div className={cn("absolute top-[40%] left-[82%] w-1.5 h-1.5 rounded-full shadow-sm", f.sprinkle1)} />
    <div className={cn("absolute top-[15%] left-[90%] w-1 h-1 rounded-full shadow-sm", f.sprinkle2)} />
  </div>
);

export function EclairButton({
  children,
  className,
  flavor = "chocolate",
  size = "md",
  isLoading,
  ...props
}: EclairButtonProps) {
  // Eclair flavors mapped to CSS classes
  const flavors = {
    chocolate: {
      dough: "bg-[#E5B57A] shadow-[inset_0_-6px_10px_rgba(184,123,62,0.6),inset_0_4px_8px_rgba(255,255,255,0.5)]",
      icingBg: "bg-[#3D1C04]",
      icingFill: "text-[#3D1C04]",
      drizzle: "#2A1201",
      sprinkle1: "bg-[#E6C594]",
      sprinkle2: "bg-[#D4A373]",
      text: "text-[#FDFBF7] drop-shadow-md",
    },
    strawberry: {
      dough: "bg-[#E5B57A] shadow-[inset_0_-6px_10px_rgba(184,123,62,0.6),inset_0_4px_8px_rgba(255,255,255,0.5)]",
      icingBg: "bg-[#E86A80]",
      icingFill: "text-[#E86A80]",
      drizzle: "#C44B60",
      sprinkle1: "bg-white",
      sprinkle2: "bg-[#FFD1D9]",
      text: "text-white drop-shadow-md",
    },
    caramel: {
      dough: "bg-[#E5B57A] shadow-[inset_0_-6px_10px_rgba(184,123,62,0.6),inset_0_4px_8px_rgba(255,255,255,0.5)]",
      icingBg: "bg-[#D4813B]",
      icingFill: "text-[#D4813B]",
      drizzle: "#A65A20",
      sprinkle1: "bg-[#FFF3E0]",
      sprinkle2: "bg-[#FFE0B2]",
      text: "text-[#FDFBF7] drop-shadow-md",
    },
  };

  const sizes = {
    sm: "px-4 py-2 sm:px-5 sm:py-2.5 text-sm",
    md: "px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base",
    lg: "px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg",
  };

  const f = flavors[flavor];
  const s = sizes[size];

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.98, y: 0 }}
      className={cn(
        "relative group rounded-[2rem] font-extrabold tracking-wide border-none outline-none overflow-hidden cursor-pointer",
        "shadow-[0_8px_15px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_25px_rgba(0,0,0,0.2)] active:shadow-[0_3px_5px_rgba(0,0,0,0.2)] transition-shadow duration-300",
        isLoading && "opacity-80 cursor-wait",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* 1. Base Dough */}
      <div className={cn("absolute inset-0 rounded-[2rem] transition-colors duration-300 group-hover:brightness-110", f.dough)} />
      
      {/* 2. Icing Container (Moves down when pressed for a 3D effect) */}
      <div className="absolute inset-0 top-0 bottom-[6px] transition-transform duration-100 ease-out group-active:translate-y-[6px]">
        {/* Icing Body */}
        <div className={cn("absolute inset-x-0 top-0 h-[65%] rounded-t-[2rem] transition-colors duration-300 group-hover:brightness-110", f.icingBg)}>
          
          {/* Icing Drips Edge */}
          <svg className={cn("absolute top-full left-0 w-full h-3 sm:h-4 -mt-[1px] pointer-events-none transition-colors duration-300 group-hover:brightness-110", f.icingFill)} preserveAspectRatio="none" viewBox="0 0 100 10">
            <path d="M0,0 C10,12 15,0 25,6 C35,12 40,0 50,7 C60,12 65,0 75,6 C85,12 90,0 100,5 L100,0 Z" fill="currentColor" />
          </svg>

          {/* Drizzles */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M 10,-10 Q 20,60 30,120" stroke={f.drizzle} strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 25,-10 Q 40,80 45,120" stroke={f.drizzle} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 45,-10 Q 55,50 65,120" stroke={f.drizzle} strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 65,-10 Q 80,90 85,120" stroke={f.drizzle} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 80,-10 Q 95,70 100,120" stroke={f.drizzle} strokeWidth="5" fill="none" strokeLinecap="round" />
          </svg>

          {/* Sprinkles */}
          <Sprinkles f={f} />

          {/* Glossy Highlights */}
          <div className="absolute top-1 left-[10%] right-[10%] h-1/3 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none blur-[1px] opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Hover Shine Overlay */}
          <div className="absolute inset-0 rounded-t-[2rem] bg-white/0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" />
        </div>
      </div>
      
      {/* 3. Text Content (Moves down with the icing) */}
      <span 
        className={cn(
          "relative z-10 flex items-center justify-center gap-2 transition-transform duration-100 ease-out group-active:translate-y-[6px]",
          s,
          f.text
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
