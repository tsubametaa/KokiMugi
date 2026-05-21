import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "KokiMugi - AI Cake Recommendations",
  description: "Discover the best cake recommendations and recipes tailored just for you, powered by AI.",
};

import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased h-full`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;

                // 1. Silence THREE.Clock deprecation warnings
                var originalWarn = console.warn;
                console.warn = function() {
                  var argsStr = Array.prototype.slice.call(arguments).join(' ');
                  if (argsStr.indexOf('THREE.Clock') !== -1) {
                    return;
                  }
                  originalWarn.apply(console, arguments);
                };

                var originalError = console.error;
                console.error = function() {
                  var argsStr = Array.prototype.slice.call(arguments).join(' ');
                  if (argsStr.indexOf('THREE.Clock') !== -1) {
                    return;
                  }
                  originalError.apply(console, arguments);
                };

                // 2. Silence HMR Turbopack chunk error rejections
                window.addEventListener('unhandledrejection', function(event) {
                  if (
                    event.reason &&
                    event.reason.message &&
                    event.reason.message.indexOf('No link element found for chunk') !== -1
                  ) {
                    event.preventDefault();
                  }
                });

                // 3. Silence HMR DOM removeChild null errors
                window.addEventListener('error', function(event) {
                  if (
                    event.message &&
                    event.message.indexOf('removeChild') !== -1 &&
                    (event.message.indexOf('null') !== -1 || event.message.indexOf('undefined') !== -1)
                  ) {
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                      event.preventDefault();
                    }
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
