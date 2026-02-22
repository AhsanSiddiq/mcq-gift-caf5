import React from "react";
import Image from "next/image";
import { Linkedin, Facebook, Instagram, Mail, Youtube, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        
        {/* Top Section: Video Resources */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center shadow-sm p-4 bg-gray-50 rounded-xl border border-gray-200 uppercase tracking-widest text-sm sm:text-base">Key CA & CFAP Strategies</h3>
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
               <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/hzkd6RutgyI" 
                  title="CA CFAP Strategy" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
               />
            </div>
            <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
               <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/oR2VUTb-nag" 
                  title="CA CFAP Guidelines" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
               />
            </div>
          </div>
        </div>

        {/* Branding Divider */}
        <div className="w-full h-px bg-gray-200 mb-12"></div>

        {/* Bottom Section: Branding & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Author Branding */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm shrink-0">
               <Image 
                 src="/MAS2.png" 
                 alt="Muhammad Ahsan Siddiq" 
                 width={64} 
                 height={64} 
                 className="object-cover w-full h-full"
               />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Curated & Taught By</p>
              <h4 className="text-xl font-bold text-gray-900 leading-none">Muhammad Ahsan Siddiq</h4>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-3">
            <SocialLink href="https://linkedin.com/in/ahsansiddiq01" icon={<Linkedin className="w-5 h-5"/>} label="LinkedIn" />
            <SocialLink href="https://facebook.com/ahsansiddiq25" icon={<Facebook className="w-5 h-5"/>} label="Facebook" />
            <SocialLink href="https://instagram.com/ahsansiddiq25" icon={<Instagram className="w-5 h-5"/>} label="Instagram" />
            <SocialLink href="https://wa.me/qr/3YFCB4ZUMCBOF1" icon={<MessageCircle className="w-5 h-5"/>} label="WhatsApp" />
            <SocialLink href="mailto:ahsansiddiq01@gmail.com" icon={<Mail className="w-5 h-5"/>} label="Email" />
            <SocialLink href="https://www.youtube.com/@AhsanSiddiq" icon={<Youtube className="w-5 h-5"/>} label="YouTube" />
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 text-center text-sm text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} Muhammad Ahsan Siddiq. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
      aria-label={label}
      title={label}
    >
      {icon}
    </a>
  );
}
