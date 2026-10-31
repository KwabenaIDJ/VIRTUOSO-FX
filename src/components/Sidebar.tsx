'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  Calendar as CalendarIcon, 
  TableProperties, 
  BookOpen, 
  LineChart, 
  Calculator, 
  Database, 
  TrendingUp, 
  LogOut,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'calendar' | 'trades' | 'books' | 'tradingview' | 'calculator';
  setActiveTab: (tab: 'home' | 'calendar' | 'trades' | 'books' | 'tradingview' | 'calculator') => void;
  onOpenTradeModal: () => void;
  onOpenSupabaseModal: () => void;
  isDbConnected: boolean;
  totalPnl: number;
  winRate: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTradeModal,
  onOpenSupabaseModal,
  isDbConnected,
  totalPnl,
  winRate,
}) => {
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar & Journal', icon: CalendarIcon },
    { id: 'trades', label: 'Trade Log', icon: TableProperties },
    { id: 'books', label: "Trader's Library", icon: BookOpen },
    { id: 'tradingview', label: 'TradingView', icon: LineChart },
    { id: 'calculator', label: 'Position Calc', icon: Calculator },
  ] as const;

  const displayName = user?.name || user?.email?.split('@')[0] || 'Isaac';
  const displayEmail = user?.email || 'donkohjuniori@gmail.com';

  return (
    <aside className="w-64 bg-[#0a1e17] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-[#143026] select-none">
      
      {/* Top Brand Logo */}
      <div>
        <div className="p-6 flex items-center space-x-3 border-b border-[#143026]">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white flex items-center space-x-1">
              <span>Virtuoso</span>
              <span className="text-emerald-400">FX</span>
            </div>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-emerald-400/80">
              Journal & Discipline
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#f5f4ef] text-slate-900 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Supabase status & User profile */}
      <div className="p-4 border-t border-[#143026] space-y-3">
        {/* Quick Log Action */}
        <button
          onClick={onOpenTradeModal}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-extrabold text-sm rounded-2xl shadow-md transition-all shadow-emerald-950"
        >
          <span>+ Log New Trade</span>
        </button>

        {/* Supabase Status Pill */}
        <button
          onClick={onOpenSupabaseModal}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 border border-white/10 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-[11px]">
              {isDbConnected ? 'Supabase Active' : 'Connect DB'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">PostgreSQL</span>
        </button>

        {/* User Profile Card with Sign Out */}
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {displayName.charAt(0)}
              </div>
              <div className="truncate">
                <div className="font-bold text-slate-200 leading-tight truncate">{displayName}</div>
                <div className="text-[10px] text-emerald-400 truncate">{displayEmail}</div>
              </div>
            </div>
          </div>

          <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">
              {user?.isGuest ? 'Guest Trader' : 'Verified Member'}
            </span>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-1 text-slate-300 hover:text-rose-400 transition-colors font-semibold"
              title="Sign Out"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign out</span>
            </button>
          </div>
        </div>

      </div>

    </aside>
  );
};
