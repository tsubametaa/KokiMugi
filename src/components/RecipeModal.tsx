"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  Users,
  Flame,
  ChefHat,
  Sparkles,
  ImageOff,
  Check,
} from "lucide-react";
import Image from "next/image";

interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  imagePrompt?: string;
  prepTime: string;
  difficulty: string;
  servings: string;
  ingredients: string[];
  procedure: string[];
}

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (recipe) {
      document.body.style.overflow = "hidden";
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [recipe]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!recipe) return null;

  const lower = recipe.difficulty.toLowerCase();
  const isEasy =
    lower.includes("easy") ||
    lower.includes("mudah") ||
    lower.includes("pemula");
  const isHard =
    lower.includes("hard") ||
    lower.includes("sulit") ||
    lower.includes("lanjut");

  const diffColor = isEasy
    ? "text-emerald-600"
    : isHard
      ? "text-red-500"
      : "text-amber-600";

  const diffBg = isEasy
    ? "bg-emerald-50/40 border-emerald-100/30"
    : isHard
      ? "bg-red-50/40 border-red-100/30"
      : "bg-amber-50/40 border-amber-100/30";

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6"
        style={{
          background: "rgba(116, 77, 53, 0.25)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-lg border border-primary-100/50 bg-white"
        >
          {/* ─── Hero Image ─── */}
          <div className="relative w-full h-60 flex-shrink-0 overflow-hidden bg-primary-50">
            {recipe.imageUrl ? (
              <Image
                src={recipe.imageUrl}
                alt={recipe.name}
                fill
                className="object-cover"
                unoptimized={true}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-primary-50 to-primary-100/50">
                <ImageOff size={24} className="text-primary-300" />
                <p className="text-primary-400 font-semibold text-[11px]">
                  Foto tidak tersedia
                </p>
              </div>
            )}

            {/* Gradient overlay at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-primary-100 shadow-sm flex items-center justify-center text-foreground/70 hover:text-primary-600 transition-colors duration-150 cursor-pointer"
              aria-label="Tutup modal"
            >
              <X size={15} />
            </button>
          </div>

          {/* ─── Scrollable Body ─── */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--color-primary-200) transparent",
            }}
          >
            {/* Title Block */}
            <div className="px-6 sm:px-8 pt-4 pb-4 border-b border-primary-100/40">
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-tight mb-2">
                {recipe.name}
              </h2>
              <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Stats Dashboard */}
            <div className="px-6 sm:px-8 py-4 grid grid-cols-3 gap-3 border-b border-primary-100/40">
              <div className="bg-primary-50/40 border border-primary-100/30 rounded-xl p-2.5 flex items-center gap-3">
                <Clock size={16} className="text-primary-500 shrink-0" />
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-foreground/40 leading-none mb-1">
                    Waktu Prep
                  </p>
                  <p className="text-xs font-bold text-foreground leading-none">
                    {recipe.prepTime}
                  </p>
                </div>
              </div>
              <div className="bg-primary-50/40 border border-primary-100/30 rounded-xl p-2.5 flex items-center gap-3">
                <Users size={16} className="text-primary-500 shrink-0" />
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-foreground/40 leading-none mb-1">
                    Porsi Saji
                  </p>
                  <p className="text-xs font-bold text-foreground leading-none">
                    {recipe.servings}
                  </p>
                </div>
              </div>
              <div className={`border rounded-xl p-2.5 flex items-center gap-3 ${diffBg} border-primary-100/30`}>
                <Flame size={16} className={`${diffColor} shrink-0`} />
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-foreground/40 leading-none mb-1">
                    Tingkat
                  </p>
                  <p className={`text-xs font-bold leading-none ${diffColor}`}>
                    {recipe.difficulty}
                  </p>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="px-6 sm:px-8 py-5 border-b border-primary-100/40">
              <div className="flex items-center gap-2 mb-4">
                <ChefHat size={16} className="text-primary-500" />
                <h3 className="font-extrabold text-foreground text-sm tracking-tight">
                  Daftar Bahan
                </h3>
                <span className="ml-auto text-[10px] font-bold text-foreground/40 bg-primary-50/50 rounded-full px-2 py-0.5 border border-primary-100/50">
                  {recipe.ingredients.length} bahan
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 bg-primary-50/30 border border-primary-100/20 rounded-xl text-xs text-foreground/80 leading-relaxed"
                  >
                    <Check size={12} className="text-primary-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedure */}
            <div className="px-6 sm:px-8 py-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-primary-500" />
                <h3 className="font-extrabold text-foreground text-sm tracking-tight">
                  Cara Membuat
                </h3>
                <span className="ml-auto text-[10px] font-bold text-foreground/40 bg-primary-50/50 rounded-full px-2 py-0.5 border border-primary-100/50">
                  {recipe.procedure.length} langkah
                </span>
              </div>
              <div className="space-y-2.5">
                {recipe.procedure.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3 bg-primary-50/10 border border-primary-100/10 rounded-xl text-xs text-foreground/80 leading-relaxed"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-[10px] font-black flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="flex-1 pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer closing button */}
          <div className="px-6 sm:px-8 py-3.5 border-t border-primary-100/40 bg-primary-50/20 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-colors duration-150 cursor-pointer shadow-sm"
            >
              Tutup Resep
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
