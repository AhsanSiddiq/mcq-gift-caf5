import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <BookOpen className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight text-gray-900">CAF-5 MCQs</span>
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-widest leading-none">Management Accounting</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 sm:border-r sm:border-gray-300 sm:pr-5">
            <Image 
              src="/MAS1.png" 
              alt="Muhammad Ahsan Siddiq" 
              width={32} 
              height={32} 
              className="rounded-full object-cover border border-gray-200"
            />
            <span className="hidden sm:inline text-sm font-medium text-gray-700">Muhammad Ahsan Siddiq</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">CAF-5</span>
        </div>

      </div>
    </header>
  );
}
