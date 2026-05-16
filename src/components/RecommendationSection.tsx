"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChefHat,
  Clock,
  Users,
  ChevronDown,
  Flame,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { generateRecipes } from "@/app/actions/recipe";

interface Recipe {
  id: string;
  name: string;
  description: string;
  image?: string;
  prepTime: string;
  difficulty: string;
  servings: string;
  ingredients: string[];
  procedure: string[];
}

// Accordion Component
function Accordion({
  title,
  items,
  isList = false,
  icon: Icon,
}: {
  title: string;
  items: string[];
  isList?: boolean;
  icon: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-primary-100/60 last:border-0 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3.5 text-left focus:outline-none group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-xl text-primary-500 group-hover:bg-primary-100 transition-colors">
            <Icon size={18} />
          </div>
          <span className="font-bold text-foreground text-[15px] group-hover:text-primary-600 transition-colors">
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-primary-300 group-hover:text-primary-500"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pb-5 pt-1 px-1">
              {isList ? (
                <ol className="list-decimal list-outside ml-5 space-y-3 text-foreground/80 text-[13px]">
                  {items.map((item, i) => (
                    <li key={i} className="pl-2 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="space-y-3 text-foreground/80 text-[13px]">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-300 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FLOATING_ITEMS = [
  {
    src: "/assets/cake/apple-pie.svg",
    left: "8%",
    top: "15%",
    delay: 0,
    duration: 18,
    size: 90,
  },
  {
    src: "/assets/cake/macaron.svg",
    left: "82%",
    top: "10%",
    delay: 2,
    duration: 22,
    size: 70,
  },
  {
    src: "/assets/cake/eclair.svg",
    left: "15%",
    top: "55%",
    delay: 1,
    duration: 20,
    size: 85,
  },
  {
    src: "/assets/cake/cheesecake.svg",
    left: "78%",
    top: "60%",
    delay: 3,
    duration: 24,
    size: 100,
  },
  {
    src: "/assets/cake/madeleine.svg",
    left: "5%",
    top: "85%",
    delay: 0.5,
    duration: 19,
    size: 75,
  },
  {
    src: "/assets/cake/tiramisu.svg",
    left: "88%",
    top: "85%",
    delay: 2.5,
    duration: 23,
    size: 95,
  },
  {
    src: "/assets/cake/pie-fruit.svg",
    left: "35%",
    top: "90%",
    delay: 4,
    duration: 21,
    size: 110,
  },
  {
    src: "/assets/cake/roll-cake.svg",
    left: "65%",
    top: "15%",
    delay: 1.5,
    duration: 25,
    size: 105,
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

export default function RecommendationSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recipe[] | null>(
    null,
  );
  const [userInput, setUserInput] = useState("");

  const handleGetRecommendations = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);

    try {
      const result = await generateRecipes(userInput);
      if (result.success && result.data) {
        setRecommendations(result.data);
      } else {
        alert(
          "Gagal memuat resep: " + (result.error || "Kesalahan tak dikenal"),
        );
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat menghubungi AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="recommendation-section" className="min-h-screen py-24 px-4 sm:px-6 relative z-20 bg-primary-50">
      {/* Wave Top Layer connecting from AboutSection */}
      <div className="absolute top-0 left-0 w-full z-0 pointer-events-none leading-[0]">
        <img
          src="/assets/wave/wave.svg"
          alt="Wave decoration"
          className="w-full h-auto object-cover object-top"
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {FLOATING_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            className="absolute opacity-15 filter blur-[2px] transition-opacity duration-1000"
            style={{
              left: item.left,
              top: item.top,
              width: item.size,
              height: item.size,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            }}
          >
            <Image
              src={item.src}
              alt="Floating Cake Decoration"
              fill
              className="object-contain"
            />
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10 pt-20">
        <div className="text-center mb-16 relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight"
          >
            Minta AI Meracik Resep
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 text-lg max-w-2xl mx-auto mb-10 font-medium"
          >
            Ketikkan keinginan Anda, dan biarkan kecerdasan buatan KokiMugi
            mencari kombinasi bahan dan teknik memanggang yang sempurna untuk
            Anda.
          </motion.p>

          {/* AI Prompt Command Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border-2 border-white rounded-full p-2 pl-6 flex items-center gap-4 shadow-[0_8px_30px_rgba(116,77,53,0.1)] relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-60 skew-x-12"
              animate={{ x: ["-200%", "300%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />

            <div className="flex-1 flex items-center gap-3 relative z-10 overflow-hidden">
              <Sparkles className="text-primary-500 shrink-0" size={24} />
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
                className="w-full bg-transparent border-none outline-none font-medium text-foreground placeholder:text-foreground/30 text-sm md:text-base"
                suppressHydrationWarning
              />
            </div>

            <Button
              onClick={handleGetRecommendations}
              isLoading={isLoading}
              disabled={!userInput.trim() || isLoading}
              flavor="chocolate"
              size="md"
              className="shrink-0 relative z-10 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Menganalisis..." : "Generate AI"}
            </Button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!recommendations && !isLoading && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {MYSTERY_CARDS.map((card, index) => (
                <div
                  key={index}
                  className="bg-white/50 backdrop-blur-md border-2 border-dashed border-primary-200/80 rounded-3xl p-8 h-[380px] flex flex-col items-center justify-center relative overflow-hidden group hover:bg-white/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-default"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex flex-col items-center w-full h-full pt-4">
                    {/* Glowing background behind image */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />

                    <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                      <Image
                        src={card.icon}
                        alt="Mystery Cake"
                        fill
                        className="object-contain opacity-20 filter grayscale blur-[2px] group-hover:blur-[1px] transition-all duration-500 scale-90 group-hover:scale-100"
                      />
                      {/* Floating Question Mark */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.5 + index * 0.2,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="bg-white/90 backdrop-blur-md rounded-full w-14 h-14 flex items-center justify-center shadow-[0_8px_15px_rgba(214,100,93,0.2)] border border-primary-100 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-3xl font-black text-primary-500 drop-shadow-sm">
                            ?
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 text-center">
                      {card.title}
                    </h3>
                    <p className="text-center text-foreground/60 text-sm font-medium leading-relaxed px-2">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 border-4 border-primary-100 rounded-full animate-ping opacity-20" />
                <div className="absolute inset-2 border-4 border-primary-200 rounded-full animate-spin border-t-primary-500" />
                <div className="absolute inset-0 flex items-center justify-center text-primary-500">
                  <ChefHat size={40} className="animate-bounce" />
                </div>
              </div>
              <p className="text-xl font-bold text-primary-600 animate-pulse">
                Menyiapkan keajaiban dari oven...
              </p>
            </motion.div>
          )}

          {recommendations && !isLoading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.2 }}
              className="flex flex-col gap-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(116,77,53,0.06)] border border-primary-100/50 overflow-hidden relative flex flex-col group hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(116,77,53,0.1)] transition-all duration-400"
                  >
                    {/* Decorative Header Background */}
                    <div className="bg-gradient-to-b from-primary-50 to-white w-full p-6 sm:p-8 pb-10 relative overflow-hidden border-b-[2px] border-dashed border-primary-200/60">
                      {/* Soft background blobs */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200/30 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-125" />
                      <div className="absolute top-10 -left-10 w-32 h-32 bg-secondary-100/20 rounded-full blur-2xl pointer-events-none transition-transform duration-700 group-hover:scale-150" />

                      <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-3 leading-tight relative z-10 tracking-tight">
                        {rec.name}
                      </h3>
                      <p className="text-foreground/70 text-[13px] sm:text-sm font-medium leading-relaxed relative z-10">
                        {rec.description}
                      </p>
                    </div>

                    {/* Stats Row - overlapping the dashed border beautifully */}
                    <div className="flex justify-center -mt-6 relative z-20 px-6 sm:px-8">
                      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(116,77,53,0.06)] border border-primary-50 p-2.5 flex w-full justify-between items-center divide-x divide-primary-50">
                        <div className="flex-1 flex flex-col items-center group/stat hover:scale-105 transition-transform">
                          <Clock size={16} className="text-primary-400 mb-1" />
                          <span className="text-[9px] uppercase tracking-wider text-foreground/40 font-bold">
                            Waktu
                          </span>
                          <span className="text-[13px] font-bold text-foreground mt-0.5">
                            {rec.prepTime}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col items-center group/stat hover:scale-105 transition-transform">
                          <Flame size={16} className="text-secondary-400 mb-1" />
                          <span className="text-[9px] uppercase tracking-wider text-foreground/40 font-bold">
                            Level
                          </span>
                          <span className="text-[13px] font-bold text-foreground mt-0.5">
                            {rec.difficulty}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col items-center group/stat hover:scale-105 transition-transform">
                          <Users size={16} className="text-blue-400 mb-1" />
                          <span className="text-[9px] uppercase tracking-wider text-foreground/40 font-bold">
                            Porsi
                          </span>
                          <span className="text-[13px] font-bold text-foreground mt-0.5">
                            {rec.servings}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Body */}
                    <div className="p-6 sm:p-8 pt-5 flex-grow flex flex-col gap-1 bg-white relative z-10">
                      <Accordion
                        title="Daftar Bahan"
                        items={rec.ingredients}
                        icon={ChefHat}
                      />
                      <Accordion
                        title="Cara Membuat"
                        items={rec.procedure}
                        isList={true}
                        icon={Sparkles}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Regenerate Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleGetRecommendations}
                  disabled={isLoading}
                  className="group flex items-center gap-2.5 px-6 py-3 rounded-full bg-white border-2 border-primary-200 text-primary-600 font-bold text-sm shadow-sm hover:shadow-md hover:border-primary-400 hover:bg-primary-50 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw
                    size={16}
                    className="transition-transform duration-500 group-hover:-rotate-180"
                  />
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
  );
}
