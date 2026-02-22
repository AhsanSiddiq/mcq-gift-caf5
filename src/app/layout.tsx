import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CAF-5 MCQs | Muhammad Ahsan Siddiq",
  description: "Management Accounting MCQ Practice Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        inter.className, 
        "min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900 relative"
      )}>
        
        {/* Global Branding Watermark - Text */}
        <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden z-0 opacity-[0.03] select-none">
          <div className="text-center font-black text-gray-900 uppercase tracking-[0.2em] -rotate-12 whitespace-nowrap">
            <div className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl mb-2">Muhammad Ahsan Siddiq</div>
            <div className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-[0.4em]">(MAS)</div>
          </div>
        </div>

        {/* Global Branding Watermark - Image */}
        <div className="fixed bottom-0 right-0 sm:-right-10 md:-right-20 w-[200px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[500px] md:h-[600px] pointer-events-none z-0 opacity-[0.12] sm:opacity-[0.15] select-none mix-blend-multiply">
          <div className="relative w-full h-full">
            <Image 
              src="/MAS2.png" 
              alt="MAS Watermark" 
              fill
              className="object-contain object-bottom sm:object-right-bottom grayscale"
              priority
            />
            {/* Fading gradients to blend image into the background cleanly */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#F9FAFB]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#F9FAFB] via-transparent to-transparent"></div>
          </div>
        </div>

        <Header />
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 relative z-10">
          {children}
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
      </body>
    </html>
  );
}
