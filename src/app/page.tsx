'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Book, DailyJournal, Quote, Trade } from '@/types';
import { 
  fetchBooks, 
  fetchDailyJournals, 
  fetchQuotes, 
  fetchTrades, 
  saveBook, 
  saveDailyJournal, 
  saveTrade, 
  deleteTradeById 
} from '@/lib/dataService';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { Sidebar } from '@/components/Sidebar';
import { HeroSpotlight } from '@/components/HeroSpotlight';
import { DisciplineQuoteBanner } from '@/components/DisciplineQuoteBanner';
import { CalendarView } from '@/components/CalendarView';
import { DayDetailsModal } from '@/components/DayDetailsModal';
import { TradeFormModal } from '@/components/TradeFormModal';
import { TradesTable } from '@/components/TradesTable';
import { BooksLibrary } from '@/components/BooksLibrary';
import { TradingViewWidget } from '@/components/TradingViewWidget';
import { LotSizeCalculator } from '@/components/LotSizeCalculator';
import { SupabaseConfigModal } from '@/components/SupabaseConfigModal';
import { LoginView } from '@/components/LoginView';
import { Menu, X, TrendingUp } from 'lucide-react';

export default function Home() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'trades' | 'books' | 'tradingview' | 'calculator'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data states
  const [trades, setTrades] = useState<Trade[]>([]);
  const [journals, setJournals] = useState<DailyJournal[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modals state
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeModalDate, setTradeModalDate] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const isDbConnected = isSupabaseConfigured();

  // Load user data
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setDataLoading(true);
      try {
        const [loadedTrades, loadedJournals, loadedBooks, loadedQuotes] = await Promise.all([
          fetchTrades(user),
          fetchDailyJournals(user),
          fetchBooks(),
          fetchQuotes(),
        ]);
        setTrades(loadedTrades);
        setJournals(loadedJournals);
        setBooks(loadedBooks);
        setQuotes(loadedQuotes);
      } catch (err) {
        console.error('Failed to load user data:', err);
      } finally {
        setDataLoading(false);
      }
    }
    loadData();
  }, [user]);

  // If checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f5f4ef] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-serif font-bold text-slate-700">Virtuoso FX</p>
        </div>
      </div>
    );
  }

  // If user is not signed in, show Login Screen
  if (!user) {
    return <LoginView />;
  }

  // Handlers
  const handleSaveTrade = async (newTrade: Trade) => {
    const saved = await saveTrade(newTrade, user);
    setTrades((prev) => {
      const idx = prev.findIndex((t) => t.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
  };

  const handleDeleteTrade = async (id: string) => {
    await deleteTradeById(id, user);
    setTrades((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveJournal = async (journal: DailyJournal) => {
    const saved = await saveDailyJournal(journal, user);
    setJournals((prev) => {
      const idx = prev.findIndex((j) => j.journalDate === saved.journalDate);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
  };

  const handleSaveBook = async (book: Book) => {
    const saved = await saveBook(book);
    setBooks((prev) => {
      const idx = prev.findIndex((b) => b.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
  };

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsDayDetailsOpen(true);
  };

  // Metrics
  const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalWins = trades.filter((t) => t.result === 'WIN').length;
  const winRate = trades.length > 0 ? Math.round((totalWins / trades.length) * 100) : 0;

  // Selected date trades & journal
  const dayTrades = selectedDate ? trades.filter((t) => t.tradeDate === selectedDate) : [];
  const dayJournal = selectedDate ? journals.find((j) => j.journalDate === selectedDate) : undefined;

  return (
    <div className="min-h-screen flex bg-[#f5f4ef] text-slate-900 font-sans">
      
      {/* Desktop Left Sidebar (CoffieFX layout) */}
      <div className="hidden md:flex shrink-0 sticky top-0 h-screen overflow-y-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenTradeModal={() => {
            setTradeModalDate(new Date().toISOString().split('T')[0]);
            setIsTradeModalOpen(true);
          }}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          isDbConnected={isDbConnected}
          totalPnl={totalPnl}
          winRate={winRate}
        />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a1e17] text-white sticky top-0 z-40 border-b border-[#143026]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-serif font-black text-lg tracking-tight">Virtuoso FX</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setTradeModalDate(new Date().toISOString().split('T')[0]);
                setIsTradeModalOpen(true);
              }}
              className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-sm"
            >
              + Trade
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a1e17] border-b border-[#143026] p-4 text-white space-y-1">
            <div className="p-3 border-b border-white/10 mb-2 flex items-center justify-between text-xs">
              <span className="font-bold truncate max-w-[200px]">{user.email}</span>
              <button
                onClick={() => signOut()}
                className="text-rose-400 font-semibold text-xs"
              >
                Sign out
              </button>
            </div>
            {[
              { id: 'home', label: 'Home' },
              { id: 'calendar', label: 'Calendar & Journal' },
              { id: 'trades', label: 'Trade Log' },
              { id: 'books', label: "Trader's Library" },
              { id: 'tradingview', label: 'TradingView Chart' },
              { id: 'calculator', label: 'Position Calculator' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeTab === item.id ? 'bg-[#f5f4ef] text-slate-950' : 'text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-8">
          
          {dataLoading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">Loading your trade records...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: HOME */}
              {activeTab === 'home' && (
                <div className="space-y-8">
                  {/* Hero Spotlight Header + 4 Quick Cards */}
                  <HeroSpotlight
                    totalPnl={totalPnl}
                    winRate={winRate}
                    totalTrades={trades.length}
                    onOpenTradeModal={() => {
                      setTradeModalDate(new Date().toISOString().split('T')[0]);
                      setIsTradeModalOpen(true);
                    }}
                    onOpenCalendar={() => setActiveTab('calendar')}
                  />

                  {/* Discipline Mindset Quote Banner */}
                  <DisciplineQuoteBanner quotes={quotes} />

                  {/* Calendar & Day Journal Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-serif font-bold text-slate-900">
                        Trading Calendar & Daily Review
                      </h3>
                      <button
                        onClick={() => setActiveTab('calendar')}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
                      >
                        Full Calendar View →
                      </button>
                    </div>

                    <CalendarView
                      trades={trades}
                      journals={journals}
                      onSelectDate={handleSelectDate}
                    />
                  </div>

                  {/* Recent Trades Table Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-serif font-bold text-slate-900">
                        Recent Executed Positions
                      </h3>
                      <button
                        onClick={() => setActiveTab('trades')}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
                      >
                        Full Trade Log →
                      </button>
                    </div>

                    <TradesTable
                      trades={trades.slice(0, 5)}
                      onDeleteTrade={handleDeleteTrade}
                      onOpenTradeModal={() => {
                        setTradeModalDate(new Date().toISOString().split('T')[0]);
                        setIsTradeModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CALENDAR & DAILY JOURNAL */}
              {activeTab === 'calendar' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900">P&L Calendar & Strategy Journal</h2>
                    <p className="text-xs text-slate-500 mt-1">Track day-to-day profit, win rates, and daily pre/post-market debriefs.</p>
                  </div>

                  <CalendarView
                    trades={trades}
                    journals={journals}
                    onSelectDate={handleSelectDate}
                  />
                </div>
              )}

              {/* TAB 3: TRADES LOG */}
              {activeTab === 'trades' && (
                <TradesTable
                  trades={trades}
                  onDeleteTrade={handleDeleteTrade}
                  onOpenTradeModal={() => {
                    setTradeModalDate(new Date().toISOString().split('T')[0]);
                    setIsTradeModalOpen(true);
                  }}
                />
              )}

              {/* TAB 4: TRADER'S LIBRARY */}
              {activeTab === 'books' && (
                <BooksLibrary
                  books={books}
                  onSaveBook={handleSaveBook}
                />
              )}

              {/* TAB 5: TRADINGVIEW */}
              {activeTab === 'tradingview' && (
                <TradingViewWidget />
              )}

              {/* TAB 6: POSITION CALCULATOR */}
              {activeTab === 'calculator' && (
                <LotSizeCalculator />
              )}
            </>
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/70 bg-[#fbfbfa] py-6 px-6 text-xs text-slate-500 mt-12">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-serif font-bold text-slate-700">
              Virtuoso <span className="text-emerald-700">FX</span> • Elite Forex Trading OS
            </span>
            <div className="flex items-center space-x-3 text-slate-400">
              <button
                onClick={() => setIsSupabaseModalOpen(true)}
                className="text-emerald-700 font-semibold hover:underline"
              >
                Supabase Settings
              </button>
              <span>•</span>
              <span>Trade with clarity, not noise.</span>
            </div>
          </div>
        </footer>

      </div>

      {/* MODALS */}
      {selectedDate && (
        <DayDetailsModal
          isOpen={isDayDetailsOpen}
          onClose={() => {
            setIsDayDetailsOpen(false);
            setSelectedDate(null);
          }}
          dateStr={selectedDate}
          trades={dayTrades}
          journal={dayJournal}
          onSaveJournal={handleSaveJournal}
          onOpenNewTradeForDate={(d) => {
            setIsDayDetailsOpen(false);
            setTradeModalDate(d);
            setIsTradeModalOpen(true);
          }}
        />
      )}

      <TradeFormModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        onSaveTrade={handleSaveTrade}
        initialDate={tradeModalDate}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

    </div>
  );
}
