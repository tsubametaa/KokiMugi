"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const images = [
  {
    src: "/assets/gallery/cheesecake.webp",
    title: "Cheesecake",
    sub: "Creamy & Rich",
  },
  {
    src: "/assets/gallery/chocolate.webp",
    title: "Triple Chocolate",
    sub: "Deep Cocoa",
  },
  {
    src: "/assets/gallery/couplecake.webp",
    title: "Romantic Duo",
    sub: "Wedding Special",
  },
  {
    src: "/assets/gallery/icecream.webp",
    title: "Ice Cream Sandwich",
    sub: "Handcrafted",
  },
  {
    src: "/assets/gallery/lioncake.webp",
    title: "Lion King Cake",
    sub: "Kids Birthday",
  },
  {
    src: "/assets/gallery/macaron.webp",
    title: "Rainbow Macarons",
    sub: "French Style",
  },
  {
    src: "/assets/gallery/madeleine.webp",
    title: "Classic Madeleine",
    sub: "Buttery Shells",
  },
  {
    src: "/assets/gallery/pinata.webp",
    title: "Pinata Surprise",
    sub: "Interactive Cake",
  },
];

export default function GallerySection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState(0);

  useEffect(() => {
    const updateConstraints = () => {
      if (carouselRef.current) {
        setDragConstraints(
          carouselRef.current.scrollWidth - carouselRef.current.offsetWidth,
        );
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    // Add a small delay to ensure images load and layout is computed
    setTimeout(updateConstraints, 500);

    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  return (
    <section className="py-24 bg-accent-dark overflow-hidden relative">
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-primary-300 font-bold uppercase tracking-[0.2em] text-xs md:text-sm mb-3">
            Inspirasi Tanpa Batas
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-accent tracking-tighter">
            Galeri Ide KokiMugi
          </h3>
          <p className="mt-4 text-accent/80 font-medium max-w-xl mx-auto">
            Geser untuk menjelajahi ribuan mahakarya yang bisa Anda ciptakan.
            Temukan desain sempurna untuk momen spesial Anda!
          </p>
          <div className="w-24 h-1 bg-accent/30 mx-auto mt-6 rounded-full" />
        </motion.div>
      </div>

      <div className="relative w-full pb-16">
        <motion.div
          ref={carouselRef}
          className="cursor-grab active:cursor-grabbing overflow-hidden"
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -dragConstraints }}
            dragElastic={0.1}
            className="flex gap-6 md:gap-10 px-6 md:px-[10vw]"
          >
            {images.map((item, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="flex-shrink-0 relative w-[280px] md:w-[350px] aspect-square rounded-[2rem] overflow-hidden group bg-primary-50 border-4 border-accent/10"
                >
                  {/* Background Image */}
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Text Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none">
                    <p className="text-primary-300 font-bold uppercase tracking-widest text-xs mb-2">
                      {item.sub}
                    </p>
                    <h4 className="text-white text-2xl font-black leading-tight">
                      {item.title}
                    </h4>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Swipe Hint */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center items-center gap-2 text-accent/60 text-sm font-bold tracking-widest animate-pulse">
          <span>&larr;</span> GESER <span>&rarr;</span>
        </div>
      </div>
    </section>
  );
}
