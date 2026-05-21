"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChefHat,
  Clock,
  Users,
  Flame,
  RotateCcw,
  ImageOff,
  Eye,
  BookOpen,
  Check,
} from "lucide-react";
import Image from "next/image";
import { generateRecipes } from "@/app/actions/recipe";
import RecipeModal from "@/components/RecipeModal";
import { Button } from "@/components/ui/Button";


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

const FLOATING_ITEMS = [
  {
    src: "/assets/cake/apple-pie.svg",
    left: "8%",
    top: "15%",
    size: 80,
  },
  {
    src: "/assets/cake/macaron.svg",
    left: "82%",
    top: "10%",
    size: 60,
  },
  {
    src: "/assets/cake/eclair.svg",
    left: "15%",
    top: "55%",
    size: 75,
  },
  {
    src: "/assets/cake/cheesecake.svg",
    left: "78%",
    top: "60%",
    size: 90,
  },
  {
    src: "/assets/cake/madeleine.svg",
    left: "5%",
    top: "85%",
    size: 65,
  },
  {
    src: "/assets/cake/tiramisu.svg",
    left: "88%",
    top: "85%",
    size: 85,
  },
  {
    src: "/assets/cake/pie-fruit.svg",
    left: "35%",
    top: "90%",
    size: 100,
  },
  {
    src: "/assets/cake/roll-cake.svg",
    left: "65%",
    top: "15%",
    size: 95,
  },
];

const MYSTERY_CARDS = [
  {
    icon: "/assets/cake/macaron.svg",
    title: "Resep Misteri #1",
    desc: "Menunggu AI untuk memecahkan kombinasi rasa yang paling sempurna...",
  },
  {
    icon: "/assets/cake/tiramisu.svg",
    title: "Resep Misteri #2",
    desc: "Mahakarya manis yang mungkin belum pernah Anda bayangkan sebelumnya...",
  },
  {
    icon: "/assets/cake/eclair.svg",
    title: "Resep Misteri #3",
    desc: "Keajaiban di setiap gigitannya. Berikan instruksi Anda untuk membuka rahasianya!",
  },
];

// Recipe Card Component with internal tab navigation
function RecipeCard({
  recipe,
  index,
  onOpenModal,
}: {
  recipe: Recipe;
  index: number;
  onOpenModal: (recipe: Recipe) => void;
}) {
  const [activeTab, setActiveTab] = useState<"info" | "ingredients" | "procedure">("info");

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
    ? "bg-emerald-50 border-emerald-100"
    : isHard
      ? "bg-red-50 border-red-100"
      : "bg-amber-50 border-amber-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.35,
        ease: "easeOut",
      }}
      className="bg-white rounded-3xl border border-primary-100/50 overflow-hidden flex flex-col h-[560px] transition-all duration-300 hover:shadow-md cursor-default"
    >
      {/* ── Food Image ── */}
      <div
        className="relative w-full h-[160px] overflow-hidden cursor-pointer bg-primary-50/50"
        onClick={() => onOpenModal(recipe)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpenModal(recipe)}
        aria-label={`Lihat detail resep ${recipe.name}`}
      >
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105 animate-fade-in"
            unoptimized={true}
            onError={() => {
              console.error(`Failed to load image for ${recipe.name}`);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-primary-50 to-primary-100/50">
            <ImageOff size={22} className="text-primary-300" />
            <p className="text-primary-400 text-[10px] font-semibold">
              Foto tidak tersedia
            </p>
          </div>
        )}
        
        {/* Difficulty Badge overlay on image */}
        <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${diffColor} ${diffBg} shadow-sm z-10`}>
          {recipe.difficulty}
        </span>
      </div>

      {/* ── Card Body ── */}
      <div className="p-5 flex flex-col flex-1 overflow-hidden">
        {/* Title */}
        <button
          onClick={() => onOpenModal(recipe)}
          className="text-left mb-1.5 focus:outline-none cursor-pointer"
          aria-label={`Buka detail resep ${recipe.name}`}
        >
          <h3 className="text-lg font-black text-foreground tracking-tight leading-tight hover:text-primary-600 transition-colors duration-150 line-clamp-1">
            {recipe.name}
          </h3>
        </button>

        {/* Description */}
        <p className="text-foreground/60 text-xs leading-relaxed line-clamp-2 mb-4 h-[36px] overflow-hidden">
          {recipe.description}
        </p>

        {/* Tabs Bar Selector */}
        <div className="flex border-b border-primary-100/50 mb-3 text-[11px] font-bold text-foreground/50">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-1.5 px-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1 -mb-[1px] ${
              activeTab === "info"
                ? "border-primary-500 text-primary-600 font-extrabold"
                : "border-transparent hover:text-primary-500"
            }`}
          >
            <BookOpen size={11} />
            Info
          </button>
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`py-1.5 px-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1 -mb-[1px] ${
              activeTab === "ingredients"
                ? "border-primary-500 text-primary-600 font-extrabold"
                : "border-transparent hover:text-primary-500"
            }`}
          >
            <ChefHat size={11} />
            Bahan
          </button>
          <button
            onClick={() => setActiveTab("procedure")}
            className={`py-1.5 px-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1 -mb-[1px] ${
              activeTab === "procedure"
                ? "border-primary-500 text-primary-600 font-extrabold"
                : "border-transparent hover:text-primary-500"
            }`}
          >
            <Sparkles size={11} />
            Langkah
          </button>
        </div>

        {/* Scrollable Content Box */}
        <div className="flex-1 overflow-y-auto pr-1 mb-4 text-xs">
          {activeTab === "info" && (
            <div className="h-full flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-primary-50/40 border border-primary-100/30 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                  <Clock size={14} className="text-primary-500 mb-0.5 shrink-0" />
                  <span className="text-[9px] uppercase font-bold text-foreground/40 tracking-wider">Waktu</span>
                  <span className="text-[11px] font-bold text-foreground mt-0.5 truncate max-w-full">{recipe.prepTime}</span>
                </div>
                <div className="bg-primary-50/40 border border-primary-100/30 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                  <Users size={14} className="text-primary-500 mb-0.5 shrink-0" />
                  <span className="text-[9px] uppercase font-bold text-foreground/40 tracking-wider">Porsi</span>
                  <span className="text-[11px] font-bold text-foreground mt-0.5 truncate max-w-full">{recipe.servings}</span>
                </div>
                <div className="bg-primary-50/40 border border-primary-100/30 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                  <Flame size={14} className={`${diffColor} mb-0.5 shrink-0`} />
                  <span className="text-[9px] uppercase font-bold text-foreground/40 tracking-wider">Tingkat</span>
                  <span className={`text-[11px] font-bold mt-0.5 truncate max-w-full ${diffColor}`}>{recipe.difficulty}</span>
                </div>
              </div>
              
              <div className="bg-primary-50/20 border border-primary-100/20 rounded-xl p-2.5 flex-1 flex items-center justify-center">
                <p className="text-[11px] text-foreground/60 leading-relaxed italic text-center font-medium">
                  "Resep dirancang khusus oleh AI dengan perpaduan rasa dan takaran yang seimbang."
                </p>
              </div>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-1.5">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-foreground/80 leading-relaxed">
                    <Check size={11} className="text-primary-500 mt-0.5 shrink-0" />
                    <span>{ingredient}</span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-foreground/40 italic">Bahan tidak tersedia</p>
              )}
            </div>
          )}

          {activeTab === "procedure" && (
            <div className="space-y-2">
              {recipe.procedure && recipe.procedure.length > 0 ? (
                recipe.procedure.map((step, i) => (
                  <div key={i} className="flex gap-2 text-[11px] text-foreground/80 leading-relaxed">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-[9px] font-black flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="flex-1 pt-0.5">{step}</span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-foreground/40 italic">Langkah tidak tersedia</p>
              )}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onOpenModal(recipe)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-colors duration-200 cursor-pointer shadow-sm"
        >
          <Eye size={13} />
          Buka Resep Lengkap
        </button>
      </div>
    </motion.div>
  );
}

// Main Recommendation Section
export default function RecommendationSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recipe[] | null>(null);
  const [userInput, setUserInput] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleGetRecommendations = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    setRecommendations(null);

    try {
      const result = await generateRecipes(userInput);
      if (result.success && result.data) {
        const recipes = result.data as Recipe[];
        setRecommendations(recipes);
        setIsLoading(false);
      } else {
        const errorMsg = result.error || "Kesalahan tak dikenal";

        if (
          errorMsg.includes("sibuk") ||
          errorMsg.includes("high demand") ||
          errorMsg.includes("503")
        ) {
          alert(
            "⏳ Server AI sedang sibuk karena banyak permintaan.\n\n" +
              "Silakan coba lagi dalam beberapa detik. Kami menggunakan beberapa model AI sebagai backup untuk memastikan layanan tetap berjalan.",
          );
        } else {
          alert("Gagal memuat resep: " + errorMsg);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert(
        "Terjadi kesalahan sistem saat menghubungi AI.\n\n" +
          "Silakan coba lagi dalam beberapa saat.",
      );
      setIsLoading(false);
    }
  };

  const handleOpenModal = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedRecipe(null);
  }, []);

  return (
    <>
      {/* Recipe Detail Modal */}
      <RecipeModal recipe={selectedRecipe} onClose={handleCloseModal} />

      <section
        id="recommendation-section"
        className="min-h-screen py-24 px-4 sm:px-6 relative z-20 bg-primary-50"
      >
        {/* Wave Top Layer */}
        <div className="absolute top-0 left-0 w-full z-0 pointer-events-none leading-[0]">
          <img
            src="/assets/wave/wave.svg"
            alt="Wave decoration"
            className="w-full h-auto object-cover object-top"
          />
        </div>

        {/* Static Background Watermarks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {FLOATING_ITEMS.map((item, i) => (
            <div
              key={i}
              className="absolute opacity-[0.06] filter grayscale"
              style={{
                left: item.left,
                top: item.top,
                width: item.size * 0.9,
                height: item.size * 0.9,
              }}
            >
              <Image
                src={item.src}
                alt="Cake Decoration Watermark"
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto relative z-10 pt-20">
          {/* ── Section Header ── */}
          <div className="text-center mb-16 relative">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight"
            >
              Minta AI Meracik Resep
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-foreground/70 text-base max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
            >
              Ketikkan keinginan Anda, dan biarkan kecerdasan buatan KokiMugi
              mencari kombinasi bahan dan teknik memanggang yang sempurna untuk
              Anda.
            </motion.p>

            {/* AI Prompt Command Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto bg-white border border-primary-200/50 rounded-full p-1.5 pl-5 flex items-center gap-3 shadow-[0_8px_25px_rgba(116,77,53,0.04)] relative overflow-hidden"
            >
              <div className="flex-1 flex items-center gap-2.5 relative z-10 overflow-hidden">
                <Sparkles className="text-primary-500 shrink-0" size={20} />
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading) {
                      handleGetRecommendations();
                    }
                  }}
                  placeholder="Apa yang ingin Anda buat hari ini? (Contoh: Macaron Perancis)"
                  className="w-full bg-transparent border-none outline-none font-medium text-foreground placeholder:text-foreground/40 text-sm cursor-text"
                  suppressHydrationWarning
                />
              </div>

              <Button
                variant="eclair"
                flavor="chocolate"
                size="sm"
                isLoading={isLoading}
                onClick={handleGetRecommendations}
                disabled={!userInput.trim() || isLoading}
                className="shrink-0 relative z-10 cursor-pointer"
              >
                {!isLoading && <Sparkles size={14} className="shrink-0" />}
                Generate AI
              </Button>
            </motion.div>
          </div>

          {/* ── Content Area ── */}
          <AnimatePresence mode="wait">
            {/* Empty State */}
            {!recommendations && !isLoading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {MYSTERY_CARDS.map((card, index) => (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-md border border-primary-100 rounded-2xl p-6 h-[320px] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 hover:shadow-md hover:bg-white cursor-default"
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary-100/30 rounded-full blur-2xl" />

                    <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                      <Image
                        src={card.icon}
                        alt="Mystery Cake"
                        fill
                        className="object-contain opacity-10 filter grayscale"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-sm border border-primary-100">
                          <span className="text-xl font-bold text-primary-500">
                            ?
                          </span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2 text-center relative z-10">
                      {card.title}
                    </h3>
                    <p className="text-center text-foreground/60 text-xs font-medium leading-relaxed px-2 relative z-10">
                      {card.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24"
              >
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                  <span className="absolute inset-0 border-3 border-primary-100 rounded-full" />
                  <span className="absolute inset-0 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <ChefHat size={28} className="text-primary-500" />
                </div>
                <p className="text-lg font-bold text-primary-600">
                  Menyiapkan keajaiban dari oven...
                </p>
                <p className="text-xs text-primary-400 mt-1 font-medium">
                  Resep & foto AI sedang dibuat
                </p>
              </motion.div>
            )}

            {/* Results */}
            {recommendations && !isLoading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.map((rec, index) => (
                    <RecipeCard
                      key={rec.id}
                      recipe={rec}
                      index={index}
                      onOpenModal={handleOpenModal}
                    />
                  ))}
                </div>

                {/* Regenerate Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={handleGetRecommendations}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-primary-200 text-primary-600 font-bold text-xs shadow-sm hover:bg-primary-50 active:scale-98 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    Coba Rekomendasi Lain
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wave Bottom Layer */}
        <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none leading-[0]">
          <img
            src="/assets/wave/wave-rec.svg"
            alt="Wave decoration"
            className="w-full h-auto object-cover object-bottom"
          />
        </div>
      </section>
    </>
  );
}

