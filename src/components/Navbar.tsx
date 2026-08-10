"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowRight, Layers, Cpu, Eye, ShoppingBag } from "lucide-react";
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
        className={`max-w-7xl mx-auto rounded-full transition-all duration-500 flex items-center justify-between px-6 py-3.5 ${
          scrolled
            ? "glass-panel bg-black/70 border-white/15 shadow-2xl shadow-purple-950/20 backdrop-blur-2xl"
            : "glass-panel bg-black/30 border-white/10 backdrop-blur-md"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-rose-500 to-indigo-600 p-[1px] shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                AURA
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                YouCam AI
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              The Confident-Buy Advisor
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#pipeline" className="hover:text-white transition-colors flex items-center gap-1.5 hover:scale-105">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>3-API Pipeline</span>
          </a>
          <a href="#simulator" className="hover:text-white transition-colors flex items-center gap-1.5 hover:scale-105">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Skin Passport</span>
          </a>
          <a href="#vto" className="hover:text-white transition-colors flex items-center gap-1.5 hover:scale-105">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>VTO Tech</span>
          </a>
          <a href="#pdp" className="hover:text-white transition-colors flex items-center gap-1.5 hover:scale-105">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>PDP Verdicts</span>
          </a>
          <a href="#faq" className="hover:text-white transition-colors hover:scale-105">
            FAQ
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Magnetic strength={0.3}>
            <Link
              href="/onboarding"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:brightness-110 transition-all duration-300 group"
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
