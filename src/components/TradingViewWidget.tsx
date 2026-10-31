'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, LineChart, Search, Sparkles } from 'lucide-react';

const POPULAR_SYMBOLS = [
  { label: 'EUR/USD', symbol: 'FX:EURUSD' },
  { label: 'GBP/USD', symbol: 'FX:GBPUSD' },
  { label: 'USD/JPY', symbol: 'FX:USDJPY' },
  { label: 'Gold (XAU/USD)', symbol: 'OANDA:XAUUSD' },
  { label: 'US 30 (Dow)', symbol: 'CURRENCYCOM:US30' },
  { label: 'AUD/USD', symbol: 'FX:AUDUSD' },
  { label: 'BTC/USD', symbol: 'COINBASE:BTCUSD' },
];

export const TradingViewWidget: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('FX:EURUSD');
  const [customSymbol, setCustomSymbol] = useState('');
  const [snapshotUrl, setSnapshotUrl] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous container content
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).TradingView && containerRef.current) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: customSymbol.trim() || selectedSymbol,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f8fafc',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          hide_side_toolbar: false,
        });
      }
    };

    containerRef.current.appendChild(script);
  }, [selectedSymbol, customSymbol]);

  const cleanSymbolName = (customSymbol.trim() || selectedSymbol).replace('FX:', '').replace('OANDA:', '').replace('CURRENCYCOM:', '').replace('COINBASE:', '');
  const externalTvLink = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(customSymbol.trim() || selectedSymbol)}`;

  return (
    <div className="space-y-6">
      
      {/* Header and Quick Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-turquoise-700 font-bold text-xs uppercase tracking-wider mb-1">
            <LineChart className="w-4 h-4" />
            <span>Real-Time Market Analysis</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">TradingView Chart Workstation</h2>
          <p className="text-xs text-slate-500 mt-1">
            Conduct multi-timeframe price action analysis or copy chart snapshot links for your trade log.
          </p>
        </div>

        {/* External TradingView Link */}
        <a
          href={externalTvLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-turquoise-600 hover:bg-turquoise-700 active:bg-turquoise-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all shadow-turquoise-200"
        >
          <span>Open {cleanSymbolName} on TradingView</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Symbol Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
          Quick Pairs:
        </span>
        {POPULAR_SYMBOLS.map((item) => (
          <button
            key={item.symbol}
            onClick={() => {
              setSelectedSymbol(item.symbol);
              setCustomSymbol('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              selectedSymbol === item.symbol && !customSymbol
                ? 'bg-turquoise-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Live TradingView Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm overflow-hidden">
        <div 
          id="tradingview_chart_container" 
          ref={containerRef} 
          className="w-full h-[620px] rounded-xl overflow-hidden"
        />
      </div>

      {/* TradingView Snapshot Embed Helper */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-turquoise-600" />
          <span>Test TradingView Chart Snapshot Link</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={snapshotUrl}
            onChange={(e) => setSnapshotUrl(e.target.value)}
            placeholder="Paste your TradingView chart snapshot (e.g. https://www.tradingview.com/x/abc1234/)"
            className="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none"
          />
          {snapshotUrl && (
            <a
              href={snapshotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-turquoise-50 text-turquoise-700 border border-turquoise-200 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 hover:bg-turquoise-100"
            >
              <span>View Snapshot</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

    </div>
  );
};
