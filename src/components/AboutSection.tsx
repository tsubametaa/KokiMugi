"use client";

import { motion, Variants } from "framer-motion";
import { MessageSquare, Wand2, ChefHat } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Ceritakan Idenya",
    description:
      "Ketik bahan yang kamu punya atau sebutkan jenis kue impianmu. Tidak ada batasan untuk berkreasi!",
    icon: MessageSquare,
  },
  {
    id: "02",
    title: "AI Meracik Resep",
    description:
      "KokiMugi akan menganalisis inputmu dan meracik resep khusus yang presisi, lengkap dengan panduan lengkap.",
    icon: Wand2,
  },
  {
    id: "03",
    title: "Mulai Memanggang",
    description:
      "Ikuti panduan langkah demi langkah yang sangat mudah. Saatnya mengubah resep ajaib menjadi mahakarya!",
    icon: ChefHat,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
};

const itemVariants: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const cardVariantsDesktop: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function AboutSection() {
  return (
    <section className="relative w-full py-24 px-6 md:px-12 bg-accent overflow-hidden">
      {/* Wave Divider at the top */}
      <div className="absolute top-0 left-0 w-full z-20 pointer-events-none leading-[0]">
        <img
          src="/assets/wave/wave.svg"
          alt="Wave top decoration"
          className="w-full h-[80px] md:h-[120px] object-cover object-top"
        />
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background to-transparent opacity-30 z-10" />
      <div className="absolute -left-20 top-20 w-64 h-64 rounded-full bg-white/30 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-20 w-80 h-80 rounded-full bg-white/30 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm md:text-base font-bold text-primary-500 uppercase tracking-widest mb-3">
            How It Works
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-foreground">
            Sihir AI di Dapur Anda
          </h3>
          <p className="mt-5 text-foreground/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Hanya butuh tiga langkah sederhana untuk mengubah imajinasi liar
            Anda menjadi kue lezat yang nyata. Biarkan AI kami yang mengurus
            perhitungan rumitnya!
          </p>
        </motion.div>

        {/* ── MOBILE LAYOUT (timeline per reference design) ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="md:hidden relative"
        >
          {/* Vertical dashed line aligned to icon centers */}
          <div className="absolute left-[1.4rem] top-5 bottom-5 border-l-[2px] border-dashed border-primary-300 z-0" />

          <div className="flex flex-col gap-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-5 relative z-10"
                >
                  {/* Icon Circle */}
                  <div className="flex-shrink-0 w-[2.8rem] h-[2.8rem] rounded-full bg-white border-[2.5px] border-primary-200 shadow-[0_4px_16px_rgba(116,77,53,0.12)] flex items-center justify-center">
                    <Icon
                      size={18}
                      strokeWidth={2.5}
                      className="text-primary-400"
                    />
                  </div>

                  {/* Text */}
                  <div className="pt-1">
                    <h4 className="text-lg font-bold text-foreground leading-snug">
                      {step.title}
                    </h4>
                    <p className="text-sm text-foreground/60 mt-1.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Desktop Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="hidden md:block relative mt-12"
        >
          {/* Connecting Line */}
          <div className="absolute top-[48px] left-[15%] right-[15%] h-0.5 border-t-[3px] border-dashed border-primary-200 z-0" />

          <div className="grid md:grid-cols-3 md:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={cardVariantsDesktop}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Number Bubble */}
                  <div className="w-24 h-24 rounded-full bg-white border-[6px] border-white shadow-[0_10px_30px_rgba(116,77,53,0.1)] flex items-center justify-center mb-8 z-10 relative group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-primary-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 origin-center" />
                    <span className="relative z-10 text-4xl font-black text-primary-300 group-hover:text-primary-500 transition-colors">
                      {step.id}
                    </span>
                    {/* Floating mini icon badge */}
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-primary-400 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-white/50 shadow-[0_8px_30px_rgba(116,77,53,0.06)] group-hover:shadow-[0_20px_40px_rgba(116,77,53,0.12)] transition-all duration-300 group-hover:-translate-y-2 w-full">
                    <h4 className="text-2xl font-bold text-foreground mb-4">
                      {step.title}
                    </h4>
                    <p className="text-foreground/70 font-medium leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
