"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface IceCreamSandwichButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  flavor?: "vanilla" | "strawberry" | "mint" | "chocolate";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function IceCreamSandwichButton({
  children,
  className,
  flavor = "vanilla",
  size = "md",
  isLoading,
  ...props
}: IceCreamSandwichButtonProps) {
  const sizes = {
    sm: "px-6 py-4 sm:px-8 sm:py-5 text-sm",
    md: "px-8 py-5 sm:px-10 sm:py-6 text-sm sm:text-base",
    lg: "px-10 py-6 sm:px-12 sm:py-7 text-base sm:text-lg",
  };

  const flavors = {
    vanilla: {
      filling: "bg-[#FFFDF5]",
      fillingShadow: "shadow-[inset_0_4px_6px_rgba(230,220,200,0.8),inset_0_-4px_6px_rgba(0,0,0,0.1)]",
      text: "text-[#3D2314] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]",
    },
    strawberry: {
      filling: "bg-[#FFC0CB]",
      fillingShadow: "shadow-[inset_0_4px_6px_rgba(220,160,180,0.8),inset_0_-4px_6px_rgba(0,0,0,0.1)]",
      text: "text-[#8A3A4A] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]",
    },
    mint: {
      filling: "bg-[#B2EBF2]",
      fillingShadow: "shadow-[inset_0_4px_6px_rgba(140,200,210,0.8),inset_0_-4px_6px_rgba(0,0,0,0.1)]",
      text: "text-[#006064] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]",
    },
    chocolate: {
      filling: "bg-[#8D5524]",
      fillingShadow: "shadow-[inset_0_4px_6px_rgba(100,60,20,0.8),inset_0_-4px_6px_rgba(0,0,0,0.3)]",
      text: "text-[#FFDAB9] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]",
    },
  };

  const f = flavors[flavor];
  const s = sizes[size];

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.98, y: 0 }}
      className={cn(
        "relative group rounded-xl font-extrabold tracking-wide border-none outline-none cursor-pointer",
        "shadow-[0_8px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_25px_rgba(0,0,0,0.25)] active:shadow-[0_4px_8px_rgba(0,0,0,0.2)] transition-shadow duration-300",
        isLoading && "opacity-80 cursor-wait",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* 1. Bottom Chocolate Wafer */}
      <div className={cn(
        "absolute inset-0 rounded-xl bg-[#3E2723] transition-colors duration-300 group-hover:brightness-110",
        "shadow-[inset_0_-6px_10px_rgba(30,15,10,0.9),inset_0_2px_4px_rgba(255,255,255,0.1)]"
      )} />
      
      {/* 2. Thick Ice Cream Filling (Moves down slightly when pressed) */}
      <div className={cn(
        "absolute inset-x-0.5 top-[25%] bottom-[12px] transition-transform duration-100 ease-out group-active:translate-y-[4px] group-hover:brightness-105",
        f.filling,
        f.fillingShadow
      )} />

      {/* 3. Top Chocolate Wafer (Moves down more when pressed, squishing the ice cream) */}
      <div className={cn(
        "absolute inset-x-0 top-0 bottom-[35px] rounded-xl bg-[#4E342E] transition-all duration-100 ease-out group-active:translate-y-[8px] group-active:bottom-[27px] group-hover:brightness-110 overflow-hidden",
        "shadow-[inset_0_-4px_8px_rgba(30,15,10,0.7),inset_0_4px_8px_rgba(255,255,255,0.2)]"
      )}>
        
        {/* Wafer Dimples (The classic grid of tiny holes on an ice cream sandwich) */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #1A0D08 2px, transparent 2.5px)', 
               backgroundSize: '16px 16px',
               backgroundPosition: '8px 8px'
             }} 
        />
        
        {/* Glossy Highlight on Top Wafer */}
        <div className="absolute top-0 left-[5%] right-[5%] h-[30%] rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none blur-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* 4. Text Content */}
      <span 
        className={cn(
          "relative z-10 flex items-center justify-center gap-2 transition-transform duration-100 ease-out group-active:translate-y-[8px]",
          s,
          "mb-1", // Visually center the text on the top wafer rather than the whole sandwich
          "text-[#FDFBF7] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
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
