'use client';

import React, { useState, useEffect } from 'react';
import { DailyJournal, Trade } from '@/types';
import { 
  X, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Plus, 
  Save, 
  CheckCircle2, 
  Target, 
  BookOpen, 
  Sparkles,
  Award
} from 'lucide-react';

interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string; // YYYY-MM-DD
  trades: Trade[];
  journal?: DailyJournal;
  onSaveJournal: (journal: DailyJournal) => Promise<void>;
  onOpenNewTradeForDate: (dateStr: string) => void;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  trades,
  journal,
  onSaveJournal,
  onOpenNewTradeForDate,
}) => {
  const [activeTab, setActiveTab] = useState<'trades' | 'strategy' | 'notes'>('trades');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states for Daily Journal
  const [marketBias, setMarketBias] = useState<'Bullish' | 'Bearish' | 'Neutral' | 'Range-bound'>('Bullish');
  const [highImpactNews, setHighImpactNews] = useState('');
  const [preMarketPlan, setPreMarketPlan] = useState('');
  const [postMarketReflection, setPostMarketReflection] = useState('');
  const [disciplineScore, setDisciplineScore] = useState<number>(8);
  const [strategyNotes, setStrategyNotes] = useState('');

  useEffect(() => {
    if (journal) {
      setMarketBias(journal.marketBias || 'Bullish');
      setHighImpactNews(journal.highImpactNews || '');
      setPreMarketPlan(journal.preMarketPlan || '');
      setPostMarketReflection(journal.postMarketReflection || '');
      setDisciplineScore(journal.disciplineScore || 8);
    } else {
      setMarketBias('Bullish');
      setHighImpactNews('');
      setPreMarketPlan('');
      setPostMarketReflection('');
      setDisciplineScore(8);
      setStrategyNotes('');
    }
    setSaveSuccess(false);
  }, [journal, dateStr]);

  if (!isOpen) return null;

  // Day metrics
  const dayPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const wins = trades.filter((t) => t.result === 'WIN').length;
  const losses = trades.filter((t) => t.result === 'LOSS').length;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveJournal({
        id: journal?.id || `dj-${dateStr}`,
        journalDate: dateStr,
        marketBias,
        highImpactNews,
        preMarketPlan,
        postMarketReflection,
        disciplineScore,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-turquoise-100 text-turquoise-800 rounded-xl">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </h2>
              <div className="flex items-center space-x-3 text-xs mt-0.5">
                <span className={`font-semibold ${dayPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Net P&L: {dayPnl >= 0 ? `+$${dayPnl.toLocaleString()}` : `-$${Math.abs(dayPnl).toLocaleString()}`}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">
                  {trades.length} {trades.length === 1 ? 'Trade' : 'Trades'} ({wins}W / {losses}L)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('trades')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'trades'
                ? 'border-turquoise-600 text-turquoise-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Daily Trades ({trades.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('strategy')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'strategy'
                ? 'border-turquoise-600 text-turquoise-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Strategy Journal</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-turquoise-600 text-turquoise-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Pre & Post Notes</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: DAILY TRADES */}
          {activeTab === 'trades' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Execution Records for this Date
                </h3>
                <button
                  onClick={() => onOpenNewTradeForDate(dateStr)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-turquoise-600 hover:bg-turquoise-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Trade Here</span>
                </button>
              </div>

              {trades.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500 text-sm">No trades logged on this day.</p>
                  <button
                    onClick={() => onOpenNewTradeForDate(dateStr)}
                    className="mt-3 inline-flex items-center space-x-1.5 text-xs font-semibold text-turquoise-700 hover:text-turquoise-800 underline"
                  >
                    <span>Click here to record a trade</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {trades.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-turquoise-300 transition-colors shadow-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                              t.direction === 'BUY'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {t.direction}
                          </span>
                          <span className="font-bold text-slate-900 text-base">{t.pair}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {t.session} Session
                          </span>
                          {t.strategy && (
                            <span className="text-xs px-2 py-0.5 rounded bg-turquoise-50 text-turquoise-800 border border-turquoise-200 font-medium">
                              {t.strategy}
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-base font-extrabold ${
                              t.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {t.pnl >= 0 ? `+$${t.pnl.toLocaleString()}` : `-$${Math.abs(t.pnl).toLocaleString()}`}
                          </span>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {t.pips >= 0 ? `+${t.pips} pips` : `${t.pips} pips`} • R:R {t.rrRatio}R
                          </div>
                        </div>
                      </div>

                      {/* Trade Prices Details */}
                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400 block">Entry:</span>
                          <span className="font-semibold text-slate-800">{t.entryPrice}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Stop Loss:</span>
                          <span className="font-semibold text-slate-800">{t.stopLoss || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Take Profit:</span>
                          <span className="font-semibold text-slate-800">{t.takeProfit || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Lot Size:</span>
                          <span className="font-semibold text-slate-800">{t.lotSize} lots</span>
                        </div>
                      </div>

                      {/* Trade Notes & TradingView Link */}
                      {t.notes && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg">
                          "{t.notes}"
                        </p>
                      )}

                      {t.tradingviewUrl && (
                        <div className="pt-1">
                          <a
                            href={t.tradingviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs text-turquoise-700 hover:text-turquoise-900 font-semibold"
                          >
                            <span>View Chart Snapshot on TradingView</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STRATEGY JOURNAL */}
          {activeTab === 'strategy' && (
            <div className="space-y-4">
              <div className="p-4 bg-turquoise-50/70 border border-turquoise-200 rounded-xl text-xs text-turquoise-900 space-y-1">
                <span className="font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-turquoise-700" />
                  <span>Strategy & Setup Auditing</span>
                </span>
                <p>
                  Document how your technical models performed today. Did liquidity sweeps hold? Was price respecting fair value gaps?
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Setups Traded & Technical Behavior
                </label>
                <textarea
                  rows={6}
                  value={preMarketPlan}
                  onChange={(e) => setPreMarketPlan(e.target.value)}
                  placeholder="e.g. Traded the M15 FVG on EURUSD following the Asian sweep. The reaction was immediate. Need to avoid taking entries right before high-impact red folder news."
                  className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-turquoise-500 focus:border-turquoise-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    High-Impact News & Catalysts
                  </label>
                  <input
                    type="text"
                    value={highImpactNews}
                    onChange={(e) => setHighImpactNews(e.target.value)}
                    placeholder="e.g. US CPI at 8:30 AM EST, ECB rate statement"
                    className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 focus:border-turquoise-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Market Bias
                  </label>
                  <select
                    value={marketBias}
                    onChange={(e: any) => setMarketBias(e.target.value)}
                    className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 focus:border-turquoise-500 outline-none bg-white"
                  >
                    <option value="Bullish">Bullish</option>
                    <option value="Bearish">Bearish</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Range-bound">Range-bound</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTES & PSYCHOLOGY REVIEW */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Post-Market Reflection & Psychology Audit
                </label>
                <textarea
                  rows={5}
                  value={postMarketReflection}
                  onChange={(e) => setPostMarketReflection(e.target.value)}
                  placeholder="How was my emotional discipline today? Did I follow rules? Did I feel FOMO? What is one thing I will improve tomorrow?"
                  className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-turquoise-500 focus:border-turquoise-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Discipline Score Slider */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-turquoise-600" />
                    <span>Discipline & Rule Adherence Score:</span>
                  </span>
                  <span className="text-sm font-extrabold text-turquoise-700 bg-white px-2.5 py-0.5 rounded-md border border-turquoise-200">
                    {disciplineScore} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={disciplineScore}
                  onChange={(e) => setDisciplineScore(Number(e.target.value))}
                  className="w-full accent-turquoise-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>1 - Disastrous / Broke all rules</span>
                  <span>5 - Average</span>
                  <span>10 - Flawless Execution</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {saveSuccess && (
              <span className="flex items-center space-x-1 text-emerald-600 font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Journal saved successfully</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-1.5 px-4 py-2 bg-turquoise-600 hover:bg-turquoise-700 active:bg-turquoise-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all shadow-turquoise-200 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Journal Notes'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
