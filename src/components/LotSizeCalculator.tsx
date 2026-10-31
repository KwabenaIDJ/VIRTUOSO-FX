'use client';

import React, { useState } from 'react';
import { Calculator, ShieldCheck, DollarSign, AlertCircle, Percent } from 'lucide-react';

export const LotSizeCalculator: React.FC = () => {
  const [balance, setBalance] = useState<string>('10000');
  const [riskPercent, setRiskPercent] = useState<string>('1');
  const [stopLossPips, setStopLossPips] = useState<string>('20');
  const [pairType, setPairType] = useState<'standard' | 'jpy' | 'gold'>('standard');

  const numBalance = parseFloat(balance) || 0;
  const numRiskPercent = parseFloat(riskPercent) || 0;
  const numSL = parseFloat(stopLossPips) || 0;

  // Dollar amount risked
  const cashAtRisk = Math.round((numBalance * (numRiskPercent / 100)) * 100) / 100;

  // Pip value per standard lot (100,000 units)
  // For standard pairs (EURUSD, GBPUSD): 1 pip = $10/lot
  // For Gold (XAUUSD): 1 pip (0.10) = $10/lot, or 1 point ($1) = $100
  // For USDJPY: ~ $6.50 - $7.50 depending on rate
  const pipValuePerStandardLot = pairType === 'jpy' ? 6.7 : pairType === 'gold' ? 10 : 10;

  let calculatedLots = 0;
  if (numSL > 0 && cashAtRisk > 0) {
    calculatedLots = Math.round((cashAtRisk / (numSL * pipValuePerStandardLot)) * 100) / 100;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-turquoise-700 font-bold text-xs uppercase tracking-wider mb-1">
          <Calculator className="w-4 h-4" />
          <span>Risk & Position Sizing Tool</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900">Forex Lot Size Calculator</h2>
        <p className="text-xs text-slate-500 mt-1">
          Never blow an account by guessing lot sizes. Calculate exact contract lots based on strict risk percentage.
        </p>
      </div>

      {/* Main Calculator Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Account Balance */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Account Capital / Balance ($)</span>
              <DollarSign className="w-4 h-4 text-turquoise-600" />
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="10000"
              className="w-full text-base font-bold p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-turquoise-500 outline-none"
            />
          </div>

          {/* Risk Percentage */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Risk Percentage (%)</span>
              <Percent className="w-4 h-4 text-turquoise-600" />
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                step="0.1"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                placeholder="1"
                className="w-full text-base font-bold p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-turquoise-500 outline-none"
              />
              {/* Quick risk buttons */}
              {[0.5, 1.0, 2.0].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiskPercent(String(r))}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${
                    parseFloat(riskPercent) === r
                      ? 'bg-turquoise-600 text-white border-turquoise-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          {/* Stop Loss in Pips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Stop Loss Size (Pips)
            </label>
            <input
              type="number"
              step="0.5"
              value={stopLossPips}
              onChange={(e) => setStopLossPips(e.target.value)}
              placeholder="20"
              className="w-full text-base font-bold p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-turquoise-500 outline-none"
            />
          </div>

          {/* Asset Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Instrument Type
            </label>
            <select
              value={pairType}
              onChange={(e: any) => setPairType(e.target.value)}
              className="w-full text-sm font-semibold p-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-turquoise-500 outline-none"
            >
              <option value="standard">Standard Majors (EURUSD, GBPUSD, AUDUSD)</option>
              <option value="jpy">JPY Crosses (USDJPY, EURJPY, GBPJPY)</option>
              <option value="gold">Gold (XAUUSD)</option>
            </select>
          </div>
        </div>

        {/* Results Banner */}
        <div className="p-6 bg-gradient-to-br from-turquoise-50 to-teal-50 border border-turquoise-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-turquoise-800">
              Maximum Recommended Position Size:
            </span>
            <div className="text-4xl font-black text-turquoise-900">
              {calculatedLots} <span className="text-lg font-bold text-turquoise-700">Lots</span>
            </div>
            <p className="text-xs text-slate-500">
              Units: {(calculatedLots * 100000).toLocaleString()} base currency
            </p>
          </div>

          <div className="h-px sm:h-16 w-full sm:w-px bg-turquoise-200" />

          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Total Cash at Risk:
            </span>
            <div className="text-3xl font-black text-rose-600">
              ${cashAtRisk.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">
              Strictly {numRiskPercent}% of your capital
            </p>
          </div>
        </div>

        {/* Safety Rule Notice */}
        <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
          <ShieldCheck className="w-5 h-5 text-turquoise-600 shrink-0 mt-0.5" />
          <p>
            <strong>Golden Rule of Risk:</strong> If your calculated lot size exceeds your broker's margin or psychological comfort level, decrease your risk percentage to 0.5% or widen your timeframe. Never trade larger to make back previous losses.
          </p>
        </div>

      </div>

    </div>
  );
};
