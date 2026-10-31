'use client';

import React from 'react';
import { 
  Calendar as CalendarIcon, 
  BookOpen, 
  LineChart, 
  Calculator, 
  Plus, 
  Database, 
  TableProperties,
  TrendingUp
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'calendar' | 'trades' | 'books' | 'tradingview' | 'calculator';
  setActiveTab: (tab: 'calendar' | 'trades' | 'books' | 'tradingview' | 'calculator') => void;
  onOpenTradeModal: () => void;
  onOpenSupabaseModal: () => void;
  isDbConnected: boolean;
  totalPnl: number;
  winRate: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTradeModal,
  onOpenSupabaseModal,
  isDbConnected,
  totalPnl,
  winRate,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-turquoise-600 flex items-center justify-center text-white shadow-md shadow-turquoise-200">
              <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Virtuoso <span className="text-turquoise-600">FX</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-turquoise-50 text-turquoise-700 rounded-full border border-turquoise-200">
                Journal & Discipline OS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-turquoise-50 text-turquoise-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('trades')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'trades'
                  ? 'bg-turquoise-50 text-turquoise-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TableProperties className="w-4 h-4" />
              <span>Trade Log</span>
            </button>

            <button
              onClick={() => setActiveTab('books')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'books'
                  ? 'bg-turquoise-50 text-turquoise-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Trader's Library</span>
            </button>

            <button
              onClick={() => setActiveTab('tradingview')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'tradingview'
                  ? 'bg-turquoise-50 text-turquoise-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LineChart className="w-4 h-4" />
              <span>TradingView</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'calculator'
                  ? 'bg-turquoise-50 text-turquoise-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Position Calc</span>
            </button>
          </nav>

          {/* Quick Stats & Actions */}
          <div className="flex items-center space-x-3">
            {/* Supabase Status Button */}
            <button
              onClick={onOpenSupabaseModal}
              title="Supabase Database Status"
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                isDbConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isDbConnected ? 'Supabase Active' : 'Connect Supabase'}
              </span>
            </button>

            {/* Quick Metrics */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500">P&L:</span>
              <span className={`font-semibold ${totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {totalPnl >= 0 ? `+$${totalPnl.toLocaleString()}` : `-$${Math.abs(totalPnl).toLocaleString()}`}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Win Rate:</span>
              <span className="font-semibold text-turquoise-700">{winRate}%</span>
            </div>

            {/* New Trade Button */}
            <button
              onClick={onOpenTradeModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-turquoise-600 hover:bg-turquoise-700 active:bg-turquoise-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-all shadow-turquoise-200 hover:shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Log Trade</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden border-t border-slate-100 py-2 space-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'calendar' ? 'bg-turquoise-50 text-turquoise-700' : 'text-slate-600'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('trades')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'trades' ? 'bg-turquoise-50 text-turquoise-700' : 'text-slate-600'
            }`}
          >
            Trade Log
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'books' ? 'bg-turquoise-50 text-turquoise-700' : 'text-slate-600'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveTab('tradingview')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'tradingview' ? 'bg-turquoise-50 text-turquoise-700' : 'text-slate-600'
            }`}
          >
            TradingView
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'calculator' ? 'bg-turquoise-50 text-turquoise-700' : 'text-slate-600'
            }`}
          >
            Calculator
          </button>
        </div>

      </div>
    </header>
  );
};
