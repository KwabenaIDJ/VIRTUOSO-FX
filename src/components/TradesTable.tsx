'use client';

import React, { useState } from 'react';
import { Trade } from '@/types';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Trash2, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

interface TradesTableProps {
  trades: Trade[];
  onDeleteTrade: (id: string) => Promise<void>;
  onOpenTradeModal: () => void;
}

export const TradesTable: React.FC<TradesTableProps> = ({
  trades,
  onDeleteTrade,
  onOpenTradeModal,
}) => {
  const [search, setSearch] = useState('');
  const [filterResult, setFilterResult] = useState<string>('ALL');
  const [filterSession, setFilterSession] = useState<string>('ALL');

  // Filtered trades
  const filteredTrades = trades.filter((t) => {
    const matchesSearch = 
      t.pair.toLowerCase().includes(search.toLowerCase()) ||
      (t.strategy && t.strategy.toLowerCase().includes(search.toLowerCase())) ||
      (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesResult = filterResult === 'ALL' || t.result === filterResult;
    const matchesSession = filterSession === 'ALL' || t.session === filterSession;

    return matchesSearch && matchesResult && matchesSession;
  });

  const exportCSV = () => {
    if (filteredTrades.length === 0) return;
    const headers = ['Date', 'Pair', 'Direction', 'Entry', 'Exit', 'SL', 'TP', 'Lots', 'P&L', 'Pips', 'RR', 'Result', 'Session', 'Strategy', 'Emotion', 'Notes'];
    const rows = filteredTrades.map((t) => [
      t.tradeDate,
      t.pair,
      t.direction,
      t.entryPrice,
      t.exitPrice || '',
      t.stopLoss || '',
      t.takeProfit || '',
      t.lotSize,
      t.pnl,
      t.pips,
      t.rrRatio,
      t.result,
      t.session,
      t.strategy || '',
      t.emotion || '',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `forex-trades-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
      
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Trade Execution Log</h2>
          <p className="text-xs text-slate-500">Comprehensive history of all positions and performance metrics</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search pair, setup..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none w-44"
            />
          </div>

          {/* Outcome Filter */}
          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            className="text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-turquoise-500 text-slate-700"
          >
            <option value="ALL">All Outcomes</option>
            <option value="WIN">Wins Only</option>
            <option value="LOSS">Losses Only</option>
            <option value="BE">Break-even</option>
          </select>

          {/* Session Filter */}
          <select
            value={filterSession}
            onChange={(e) => setFilterSession(e.target.value)}
            className="text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-turquoise-500 text-slate-700"
          >
            <option value="ALL">All Sessions</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Asian">Asian</option>
          </select>

          {/* Export button */}
          <button
            onClick={exportCSV}
            title="Export CSV"
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Trades Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Pair</th>
              <th className="py-3 px-4">Side</th>
              <th className="py-3 px-4">Entry / Exit</th>
              <th className="py-3 px-4">SL / TP</th>
              <th className="py-3 px-4">Lots</th>
              <th className="py-3 px-4">P&L ($)</th>
              <th className="py-3 px-4">Pips / R:R</th>
              <th className="py-3 px-4">Session / Setup</th>
              <th className="py-3 px-4">Chart</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-3">
                    <p className="text-sm font-semibold text-slate-700">No trades recorded yet.</p>
                    <p className="text-xs text-slate-400">Your journal is clean and ready. Click below to record your first trade.</p>
                    <button
                      onClick={onOpenTradeModal}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                    >
                      <span>+ Log First Trade</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTrades.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                    {t.tradeDate}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {t.pair}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        t.direction === 'BUY'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {t.direction === 'BUY' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{t.direction}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-800 whitespace-nowrap">
                    <span className="font-semibold">{t.entryPrice}</span>
                    {t.exitPrice ? <span className="text-slate-400"> → {t.exitPrice}</span> : ''}
                  </td>

                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    <span>{t.stopLoss || '—'}</span>
                    <span className="text-slate-300"> / </span>
                    <span>{t.takeProfit || '—'}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-800 font-medium whitespace-nowrap">
                    {t.lotSize}
                  </td>

                  <td className="py-3 px-4 font-black whitespace-nowrap">
                    <span className={t.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {t.pnl >= 0 ? `+$${t.pnl.toLocaleString()}` : `-$${Math.abs(t.pnl).toLocaleString()}`}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    <span className={`font-semibold ${t.pips >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {t.pips >= 0 ? `+${t.pips}` : `${t.pips}`}
                    </span>
                    <span className="text-slate-400 text-[11px] ml-1">({t.rrRatio}R)</span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-slate-800 font-semibold">{t.session}</div>
                    <div className="text-[11px] text-turquoise-700 font-medium truncate max-w-[140px]">
                      {t.strategy || '—'}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {t.tradingviewUrl ? (
                      <a
                        href={t.tradingviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-turquoise-700 hover:text-turquoise-900 font-semibold hover:underline"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (confirm(`Delete trade for ${t.pair}?`)) {
                          onDeleteTrade(t.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete Trade"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
