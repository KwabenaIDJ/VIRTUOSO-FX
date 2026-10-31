'use client';

import React, { useState, useEffect } from 'react';
import { Trade, TradeDirection, TradeResult, TradingSession } from '@/types';
import { FOREX_PAIRS, STRATEGY_PRESETS, TRADING_SESSIONS, EMOTIONS } from '@/lib/constants';
import { 
  X, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert,
  Save
} from 'lucide-react';

interface TradeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTrade: (trade: Trade) => Promise<void>;
  initialDate?: string;
}

export const TradeFormModal: React.FC<TradeFormModalProps> = ({
  isOpen,
  onClose,
  onSaveTrade,
  initialDate,
}) => {
  const [pair, setPair] = useState('EURUSD');
  const [customPair, setCustomPair] = useState('');
  const [direction, setDirection] = useState<TradeDirection>('BUY');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [exitPrice, setExitPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [lotSize, setLotSize] = useState<string>('1.0');
  const [manualPnl, setManualPnl] = useState<string>('');
  const [result, setResult] = useState<TradeResult>('WIN');
  const [session, setSession] = useState<TradingSession>('London');
  const [strategy, setStrategy] = useState(STRATEGY_PRESETS[0]);
  const [timeframe, setTimeframe] = useState('M15');
  const [tradingviewUrl, setTradingviewUrl] = useState('');
  const [emotion, setEmotion] = useState(EMOTIONS[0]);
  const [rulesFollowed, setRulesFollowed] = useState(true);
  const [notes, setNotes] = useState('');
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialDate) {
      setTradeDate(initialDate);
    }
  }, [initialDate, isOpen]);

  if (!isOpen) return null;

  // Auto-calculation of Pips and R:R
  const numEntry = parseFloat(entryPrice) || 0;
  const numExit = parseFloat(exitPrice) || 0;
  const numSL = parseFloat(stopLoss) || 0;
  const numTP = parseFloat(takeProfit) || 0;
  const numLots = parseFloat(lotSize) || 1.0;

  const currentPair = customPair.trim() || pair;
  const isJpyPair = currentPair.toUpperCase().includes('JPY');
  const isGold = currentPair.toUpperCase().includes('XAU') || currentPair.toUpperCase().includes('GOLD');

  const pipMultiplier = isJpyPair ? 100 : isGold ? 10 : 10000;

  let calculatedPips = 0;
  if (numEntry > 0 && numExit > 0) {
    if (direction === 'BUY') {
      calculatedPips = Math.round((numExit - numEntry) * pipMultiplier * 10) / 10;
    } else {
      calculatedPips = Math.round((numEntry - numExit) * pipMultiplier * 10) / 10;
    }
  }

  let calculatedRR = 0;
  if (numEntry > 0 && numSL > 0) {
    const riskDiff = Math.abs(numEntry - numSL);
    if (riskDiff > 0) {
      if (numExit > 0) {
        const gainDiff = direction === 'BUY' ? numExit - numEntry : numEntry - numExit;
        calculatedRR = Math.round((gainDiff / riskDiff) * 100) / 100;
      } else if (numTP > 0) {
        const gainDiff = Math.abs(numTP - numEntry);
        calculatedRR = Math.round((gainDiff / riskDiff) * 100) / 100;
      }
    }
  }

  // Estimated P&L if not manually specified ($10 per pip per standard lot for EURUSD)
  const estimatedPnl = manualPnl !== '' 
    ? parseFloat(manualPnl) || 0 
    : Math.round(calculatedPips * 10 * numLots);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numEntry) {
      alert('Please provide at least an entry price.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newTrade: Trade = {
        id: `t-${Date.now()}`,
        pair: currentPair,
        direction,
        entryPrice: numEntry,
        exitPrice: numExit > 0 ? numExit : undefined,
        stopLoss: numSL > 0 ? numSL : undefined,
        takeProfit: numTP > 0 ? numTP : undefined,
        lotSize: numLots,
        pnl: estimatedPnl,
        pips: calculatedPips,
        rrRatio: calculatedRR,
        result: estimatedPnl > 0 ? 'WIN' : estimatedPnl < 0 ? 'LOSS' : 'BE',
        session,
        strategy,
        timeframe,
        tradingviewUrl: tradingviewUrl.trim() || undefined,
        emotion,
        rulesFollowed,
        notes: notes.trim() || undefined,
        tradeDate,
      };

      await onSaveTrade(newTrade);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-turquoise-100 text-turquoise-800 rounded-xl">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Log New Forex Trade</h2>
              <p className="text-xs text-slate-500">Record execution, technical strategy, and emotional state</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Pair & Direction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Currency Pair
              </label>
              <select
                value={pair}
                onChange={(e) => {
                  setPair(e.target.value);
                  setCustomPair('');
                }}
                className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 focus:border-turquoise-500 outline-none bg-white font-semibold text-slate-900"
              >
                {FOREX_PAIRS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Direction
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('BUY')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 border ${
                    direction === 'BUY'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-emerald-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>BUY / LONG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('SELL')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 border ${
                    direction === 'SELL'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-rose-50'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>SELL / SHORT</span>
                </button>
              </div>
            </div>
          </div>

          {/* Trade Execution Prices */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Entry Price *
              </label>
              <input
                type="number"
                step="any"
                required
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="1.08500"
                className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Stop Loss (SL)
              </label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="1.08250"
                className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Take Profit (TP)
              </label>
              <input
                type="number"
                step="any"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="1.09000"
                className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Exit Price
              </label>
              <input
                type="number"
                step="any"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                placeholder="1.08950"
                className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none font-medium"
              />
            </div>
          </div>

          {/* Lot Size, Date, Manual P&L override */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Lot Size (Contracts)
              </label>
              <input
                type="number"
                step="0.01"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                placeholder="1.0"
                className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Trade Date
              </label>
              <input
                type="date"
                value={tradeDate}
                onChange={(e) => setTradeDate(e.target.value)}
                className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Realized Net P&L ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={manualPnl}
                onChange={(e) => setManualPnl(e.target.value)}
                placeholder={estimatedPnl !== 0 ? String(estimatedPnl) : 'Auto calculated'}
                className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none font-medium"
              />
            </div>
          </div>

          {/* Auto Calculation Preview Banner */}
          <div className="p-3 bg-turquoise-50 border border-turquoise-200 rounded-xl flex items-center justify-around text-xs">
            <div>
              <span className="text-slate-500 block">Calculated Pips:</span>
              <span className={`font-bold text-sm ${calculatedPips >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {calculatedPips >= 0 ? `+${calculatedPips}` : `${calculatedPips}`} pips
              </span>
            </div>
            <div className="h-7 w-px bg-turquoise-200" />
            <div>
              <span className="text-slate-500 block">Planned / Realized R:R:</span>
              <span className="font-bold text-sm text-turquoise-800">
                {calculatedRR > 0 ? `${calculatedRR}R` : '—'}
              </span>
            </div>
            <div className="h-7 w-px bg-turquoise-200" />
            <div>
              <span className="text-slate-500 block">Est. Net Profit:</span>
              <span className={`font-bold text-sm ${estimatedPnl >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {estimatedPnl >= 0 ? `+$${estimatedPnl}` : `-$${Math.abs(estimatedPnl)}`}
              </span>
            </div>
          </div>

          {/* Session, Timeframe, Strategy Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Trading Session
              </label>
              <select
                value={session}
                onChange={(e: any) => setSession(e.target.value)}
                className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none bg-white"
              >
                {TRADING_SESSIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none bg-white"
              >
                <option value="M1">M1 (1 Min)</option>
                <option value="M5">M5 (5 Mins)</option>
                <option value="M15">M15 (15 Mins)</option>
                <option value="H1">H1 (1 Hour)</option>
                <option value="H4">H4 (4 Hours)</option>
                <option value="D1">D1 (Daily)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Strategy / Setup
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none bg-white"
              >
                {STRATEGY_PRESETS.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TradingView Link Integration */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center justify-between">
              <span>TradingView Chart Snapshot Link</span>
              {tradingviewUrl && (
                <a
                  href={tradingviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-turquoise-700 hover:underline flex items-center space-x-1"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </label>
            <input
              type="url"
              value={tradingviewUrl}
              onChange={(e) => setTradingviewUrl(e.target.value)}
              placeholder="https://www.tradingview.com/x/..."
              className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Psychology & Discipline Tracker */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Emotional State
                </label>
                <select
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  className="text-xs p-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-turquoise-500"
                >
                  {EMOTIONS.map((em) => (
                    <option key={em} value={em}>{em}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer mt-2 sm:mt-0">
                <input
                  type="checkbox"
                  checked={rulesFollowed}
                  onChange={(e) => setRulesFollowed(e.target.checked)}
                  className="w-4 h-4 rounded text-turquoise-600 focus:ring-turquoise-500 accent-turquoise-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  Followed my trading plan strictly
                </span>
              </label>
            </div>
          </div>

          {/* Rationale / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Trade Execution Rationale & Reflection
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why did you take this setup? What did price action confirm before entry?"
              className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-5 py-2 bg-turquoise-600 hover:bg-turquoise-700 active:bg-turquoise-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all shadow-turquoise-200 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Save Trade'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
