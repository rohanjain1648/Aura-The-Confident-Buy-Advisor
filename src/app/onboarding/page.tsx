import OnboardingCapture from '@/components/OnboardingCapture';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc] text-neutral-900 selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <header className="p-6 sm:px-12 flex items-center justify-between border-b border-neutral-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-950 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            </div>
          </div>
          <span className="font-extrabold text-base tracking-tight text-neutral-950">AURA</span>
        </div>

        <Link
          href="/shop"
          className="text-xs font-bold text-neutral-500 hover:text-neutral-950 transition"
        >
          Skip to Shop &rarr;
        </Link>
      </header>

      {/* Main Content Area with Ambient Glow */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-gradient-to-tr from-rose-200/40 via-purple-200/30 to-sky-200/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative z-10 w-full py-8">
          <OnboardingCapture />
        </div>
      </main>
    </div>
  );
}
