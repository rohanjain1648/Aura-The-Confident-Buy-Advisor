"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Cpu, Eye, ShoppingBag } from "lucide-react";
import Magnetic from "./Magnetic";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto rounded-full transition-all duration-500 flex items-center justify-between px-6 py-3 ${
          scrolled
            ? "bg-white/85 border border-neutral-200/90 shadow-lg shadow-neutral-900/5 backdrop-blur-2xl"
            : "bg-white/60 border border-neutral-200/60 shadow-sm backdrop-blur-md"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-600 p-[1.5px] shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-neutral-950 font-sans">
                AURA
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 font-semibold">
                YouCam AI
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 hidden sm:inline font-medium">
              The Confident-Buy Advisor
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-neutral-600">
          <a href="#pipeline" className="hover:text-neutral-950 transition-colors flex items-center gap-1.5 hover:scale-105">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>3-API Pipeline</span>
          </a>
          <a href="#simulator" className="hover:text-neutral-950 transition-colors flex items-center gap-1.5 hover:scale-105">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Skin Passport</span>
          </a>
          <a href="#vto" className="hover:text-neutral-950 transition-colors flex items-center gap-1.5 hover:scale-105">
            <Eye className="w-4 h-4 text-sky-600" />
            <span>VTO Tech</span>
          </a>
          <a href="#pdp" className="hover:text-neutral-950 transition-colors flex items-center gap-1.5 hover:scale-105">
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>Storefront</span>
          </a>
          <a href="#faq" className="hover:text-neutral-950 transition-colors hover:scale-105">
            FAQ
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Magnetic strength={0.3}>
            <Link
              href="/onboarding"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-purple-600/25 hover:shadow-lg hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
            >
              <span>Analyze Skin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
