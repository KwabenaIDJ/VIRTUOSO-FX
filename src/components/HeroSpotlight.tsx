'use client';

import React from 'react';
import { 
  Bell, 
  Clock, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Award, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface HeroSpotlightProps {
  totalPnl: number;
  winRate: number;
  totalTrades: number;
  onOpenTradeModal: () => void;
  onOpenCalendar: () => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  totalPnl,
  winRate,
  totalTrades,
  onOpenTradeModal,
  onOpenCalendar,
}) => {
  // Determine greeting based on user's current hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {greeting}, Isaac
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here's what's happening in your Forex trading system
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            title="Notifications"
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Spotlight Card (CoffieFX Style) */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0d221a] text-white p-7 sm:p-9 shadow-lg shadow-emerald-950/20 border border-emerald-900/40">
        
        {/* Subtle background trader photo */}
        <img
          src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1600&q=80"
          alt="Trading Desk"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none"
        />

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1e16] via-[#0d261c]/95 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left Text & CTAs */}
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-extrabold tracking-widest uppercase">
              <span className="w-4 h-0.5 bg-emerald-400 rounded-full" />
              <span>INSIDE VIRTUOSO FX JOURNAL</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-[1.15] text-white">
              Trade with <span className="text-emerald-400 italic underline decoration-emerald-500/60 decoration-wavy decoration-2">clarity</span>, not noise.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              Log every trade with discipline. Review your psychological traps, audit your high-probability setups, and protect your capital.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenTradeModal}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all shadow-emerald-950"
              >
                <span>Log Today's Trade</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCalendar}
                className="text-xs sm:text-sm font-bold text-white hover:text-emerald-300 underline underline-offset-4 transition-colors"
              >
                View P&L Calendar
              </button>
            </div>
          </div>

          {/* Right Floating Candlestick Chart Badge (matches the screenshot!) */}
          <div className="hidden sm:flex shrink-0 self-center">
            <div className="bg-[#fcfbf7] text-slate-900 rounded-3xl p-5 border-2 border-slate-900/10 shadow-2xl shadow-emerald-950/60 transform rotate-1 hover:rotate-0 transition-transform duration-300 flex flex-col items-center justify-center w-56">
              
              {/* Candlestick illustration */}
              <div className="w-full flex items-end justify-between h-24 px-2 py-2 relative">
                {/* Dashed key level line */}
                <div className="absolute top-8 left-0 right-0 border-b border-dashed border-emerald-500/70" />

                {/* Candle 1 (Bearish) */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-slate-800" />
                  <div className="w-4 h-9 bg-slate-800 rounded-xs" />
                  <div className="w-0.5 h-3 bg-slate-800" />
                </div>

                {/* Candle 2 (Doji) */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-5 bg-slate-800" />
                  <div className="w-4 h-2 bg-slate-800 rounded-xs" />
                  <div className="w-0.5 h-4 bg-slate-800" />
                </div>

                {/* Candle 3 (Bullish Displacement) */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 bg-emerald-500" />
                  <div className="w-4 h-12 bg-emerald-500 rounded-xs shadow-sm" />
                  <div className="w-0.5 h-2 bg-emerald-500" />
                </div>

                {/* Candle 4 (Bullish Follow-through) */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 bg-emerald-500" />
                  <div className="w-4 h-15 bg-emerald-500 rounded-xs shadow-sm" />
                  <div className="w-0.5 h-1 bg-emerald-500" />
                </div>
              </div>

              <div className="w-full pt-3 mt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-600">Smart Money</span>
                <span className="text-emerald-600">+2.5R Target</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4 Quick Stat Metric Cards (Matching CoffieFX bottom row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: MARKETS NOW */}
        <div className="bg-[#fbfbfa] p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>MARKETS NOW</span>
          </div>
          <div className="text-base font-serif font-bold text-slate-900 leading-snug">
            London & NY Overlap
          </div>
          <p className="text-xs text-slate-500">
            Peak volatility window. Watch EURUSD, GBPUSD, XAUUSD.
          </p>
        </div>

        {/* Card 2: HIGH-IMPACT NEWS */}
        <div className="bg-[#fbfbfa] p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>HIGH-IMPACT NEWS</span>
          </div>
          <div className="text-base font-serif font-bold text-slate-900 leading-snug">
            US CPI & Core Inflation
          </div>
          <p className="text-xs text-slate-500">
            High volatility expected at 8:30 AM EST. Adjust stop loss.
          </p>
        </div>

        {/* Card 3: TRADING PERFORMANCE */}
        <div className="bg-[#fbfbfa] p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>NET P&L THIS MONTH</span>
          </div>
          <div className={`text-base font-serif font-bold leading-snug ${
            totalPnl > 0 ? 'text-emerald-700' : totalPnl < 0 ? 'text-rose-700' : 'text-slate-800'
          }`}>
            {totalPnl > 0 ? `+$${totalPnl.toLocaleString()}` : totalPnl < 0 ? `-$${Math.abs(totalPnl).toLocaleString()}` : '$0.00'}
          </div>
          <p className="text-xs text-slate-500">
            {totalTrades === 0 ? '0 trades logged • Clean slate' : `${winRate}% Win Rate across ${totalTrades} executions`}
          </p>
        </div>

        {/* Card 4: DISCIPLINE RATING */}
        <div className="bg-[#fbfbfa] p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>EXECUTION DISCIPLINE</span>
          </div>
          <div className="text-base font-serif font-bold text-slate-900 leading-snug">
            Flawless Execution
          </div>
          <p className="text-xs text-slate-500">
            Risk strictly $\le$ 1% per position. No revenge trades.
          </p>
        </div>

      </div>

    </div>
  );
};
