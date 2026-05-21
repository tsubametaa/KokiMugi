"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);

  // Update progress bar and check arrow visibility
  const updateScrollState = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    
    // Progress calculation
    const maxScroll = scrollWidth - clientWidth;
    setIsScrollable(maxScroll > 0);
    
    if (maxScroll > 0) {
      const progress = (scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);
    }

    // Arrow visibility threshold checks
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < maxScroll - 10);
  };

  useEffect(() => {
    // Initial check on mount
    updateScrollState();
    
    // Add resize event to handle changes in screen size
    window.addEventListener("resize", updateScrollState);
    
    // Check again after a short delay to ensure images/layout are settled
    const timer = setTimeout(updateScrollState, 500);

    return () => {
      window.removeEventListener("resize", updateScrollState);
      clearTimeout(timer);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Multiplier to speed up drag scroll
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const { clientWidth } = carouselRef.current;
    const scrollAmount = clientWidth * 0.75;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

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

      <div className="relative w-full pb-16 group/carousel">
        {/* Floating Navigation Buttons - Desktop Only */}
        <div className="absolute inset-y-0 left-4 md:left-[8vw] z-20 flex items-center pointer-events-none">
          <button
            onClick={() => scroll("left")}
            className={`w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center backdrop-blur-md shadow-lg pointer-events-auto transition-all hover:scale-110 active:scale-95 cursor-pointer duration-300 ${
              showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll Left"
            suppressHydrationWarning
          >
            <ChevronLeft className="w-6 h-6 pointer-events-none" />
          </button>
        </div>

        <div className="absolute inset-y-0 right-4 md:right-[8vw] z-20 flex items-center pointer-events-none">
          <button
            onClick={() => scroll("right")}
            className={`w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center backdrop-blur-md shadow-lg pointer-events-auto transition-all hover:scale-110 active:scale-95 cursor-pointer duration-300 ${
              showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll Right"
            suppressHydrationWarning
          >
            <ChevronRight className="w-6 h-6 pointer-events-none" />
          </button>
        </div>

        {/* Scroll Container */}
        <div
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onScroll={updateScrollState}
          className="overflow-x-auto scrollbar-none flex gap-6 md:gap-8 px-6 md:px-[10vw] py-4 select-none cursor-grab active:cursor-grabbing"
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
                className="flex-shrink-0 flex flex-col w-[260px] md:w-[320px] group cursor-pointer"
              >
                {/* Image Container with Zoom effect */}
                <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-accent-dark/50 border border-accent/10 transition-all duration-500 group-hover:border-accent/30 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    draggable="false"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  />
                  {/* Soft overlay gradient to ground the image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80 pointer-events-none" />
                </div>

                {/* Typography details below the card */}
                <div className="mt-4 px-2 flex flex-col">
                  <span className="text-primary-300 font-extrabold uppercase tracking-widest text-[10px] md:text-xs">
                    {item.sub}
                  </span>
                  <h4 className="text-lg md:text-xl font-bold leading-tight mt-1.5 text-accent transition-colors duration-300 group-hover:text-primary-100">
                    {item.title}
                  </h4>
                  {/* Sleek expanding divider line */}
                  <div className="h-[2px] bg-accent/20 mt-3 rounded-full w-8 transition-all duration-500 ease-out group-hover:w-16 group-hover:bg-primary-300" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll Progress Bar Indicator */}
        {isScrollable && (
          <div className="max-w-xs mx-auto mt-8 px-6">
            <div className="h-1 w-full bg-accent/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-150 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Swipe Hint */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center items-center gap-2 text-accent/50 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase pointer-events-none">
          <span>&larr;</span> GESER ATAU TARIK <span>&rarr;</span>
        </div>
      </div>
    </section>
  );
}

