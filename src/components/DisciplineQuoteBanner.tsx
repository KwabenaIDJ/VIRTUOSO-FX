'use client';

import React, { useState } from 'react';
import { Quote } from '@/types';
import { Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';

interface DisciplineQuoteBannerProps {
  quotes: Quote[];
}

export const DisciplineQuoteBanner: React.FC<DisciplineQuoteBannerProps> = ({ quotes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!quotes || quotes.length === 0) return null;

  const currentQuote = quotes[currentIndex % quotes.length];

  const handleNextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-5 sm:p-6 shadow-md shadow-turquoise-100 mb-6 group">
      
      {/* High Quality Forex Trading Chart Background Image */}
      <img
        src="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1600&q=80"
        alt="Forex Candlestick Charts"
        className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity group-hover:scale-102 transition-transform duration-700 pointer-events-none"
      />

      {/* Turquoise Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-turquoise-900/90 via-turquoise-800/85 to-teal-900/90 pointer-events-none" />

      {/* Subtle background glow */}
      <div className="absolute -right-8 -top-8 w-44 h-44 bg-turquoise-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5 max-w-3xl">
          <div className="p-2.5 bg-white/15 backdrop-blur-md rounded-xl shrink-0 mt-0.5 border border-white/20 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-turquoise-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-turquoise-200 text-[11px] font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trader Mindset Rule • {currentQuote.category}</span>
            </div>
            <p className="text-base sm:text-lg font-medium leading-relaxed italic text-white text-balance">
              "{currentQuote.quote}"
            </p>
            <p className="text-xs text-turquoise-100 mt-1.5 font-bold">
              — {currentQuote.author}
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleNextQuote}
          title="Next Mindset Rule"
          className="self-end md:self-center flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-sm border border-white/25 text-xs font-bold text-white transition-all shrink-0 cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Quote</span>
        </button>
      </div>
    </div>
  );
};
