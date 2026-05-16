"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background pt-20 pb-8 overflow-hidden">
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 w-full leading-[0] z-0">
        <img
          src="/assets/wave/wave-gallery.svg"
          alt="Wave divider"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
        <p className="text-foreground/60 text-sm font-medium tracking-tight">
          &copy; {currentYear} KokiMugi by{" "}
          <a
            href="https://www.utaaa.my.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary-500 transition-colors duration-300"
          >
            Utaaa
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
