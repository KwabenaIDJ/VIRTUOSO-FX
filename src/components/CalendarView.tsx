'use client';

import React, { useState } from 'react';
import { DailyJournal, Trade } from '@/types';
import { 
  ChevronLeft, 
  ChevronRight, 
  DollarSign, 
  Percent, 
  CheckCircle, 
  Calendar as CalendarIcon, 
  FileText,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';

interface CalendarViewProps {
  trades: Trade[];
  journals: DailyJournal[];
  onSelectDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  trades,
  journals,
  onSelectDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Map trades and journals by "YYYY-MM-DD"
  const tradesByDate: Record<string, Trade[]> = {};
  trades.forEach((trade) => {
    const d = trade.tradeDate;
    if (!tradesByDate[d]) tradesByDate[d] = [];
    tradesByDate[d].push(trade);
  });

  const journalsByDate: Record<string, DailyJournal> = {};
  journals.forEach((j) => {
    journalsByDate[j.journalDate] = j;
  });

  // Calculate current month statistics
  const currentMonthTrades = trades.filter((t) => {
    const d = new Date(t.tradeDate);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const monthPnl = currentMonthTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalMonthTrades = currentMonthTrades.length;
  const monthWins = currentMonthTrades.filter((t) => t.result === 'WIN').length;
  const monthLosses = currentMonthTrades.filter((t) => t.result === 'LOSS').length;
  const monthWinRate = totalMonthTrades > 0 ? Math.round((monthWins / totalMonthTrades) * 100) : 0;

  // Day ratio
  let winningDays = 0;
  let losingDays = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTrades = tradesByDate[dStr] || [];
    if (dayTrades.length > 0) {
      const net = dayTrades.reduce((s, t) => s + (t.pnl || 0), 0);
      if (net > 0) winningDays++;
      else if (net < 0) losingDays++;
    }
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const formatDateKey = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      
      {/* Compact Performance Summary Chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Month P&L</span>
            <span className={`text-lg font-black ${
              monthPnl > 0 ? 'text-emerald-600' : monthPnl < 0 ? 'text-rose-600' : 'text-slate-800'
            }`}>
              {monthPnl > 0 ? `+$${monthPnl.toLocaleString()}` : monthPnl < 0 ? `-$${Math.abs(monthPnl).toLocaleString()}` : '$0.00'}
            </span>
          </div>
          <div className={`p-2 rounded-lg ${monthPnl >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Win Rate</span>
            <span className="text-lg font-black text-slate-900">{monthWinRate}%</span>
          </div>
          <div className="p-2 rounded-lg bg-turquoise-50 text-turquoise-700">
            <Percent className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Day Record</span>
            <span className="text-lg font-black text-slate-900">
              <span className="text-emerald-600">{winningDays}W</span>
              <span className="text-slate-300 mx-1">/</span>
              <span className="text-rose-600">{losingDays}L</span>
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Trades</span>
            <span className="text-lg font-black text-slate-900">{totalMonthTrades}</span>
          </div>
          <div className="p-2 rounded-lg bg-turquoise-50 text-turquoise-700">
            <Activity className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Grid: Compact Calendar (left 8 cols) & Forex Market Sidebar (right 4 cols) on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* COMPACT CALENDAR CARD */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-turquoise-100 text-turquoise-800 rounded-lg">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {monthName} <span className="text-turquoise-600">{year}</span>
              </h3>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={goToToday}
                className="px-2 py-1 text-[11px] font-semibold rounded border border-slate-200 hover:border-turquoise-400 text-slate-600 hover:text-turquoise-700 transition-colors"
              >
                Today
              </button>
              <button
                onClick={prevMonth}
                className="p-1 rounded-md border border-slate-200 hover:bg-white hover:text-turquoise-700 text-slate-600"
                title="Prev Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 rounded-md border border-slate-200 hover:bg-white hover:text-turquoise-700 text-slate-600"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week banner */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 text-center py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {weekDays.map((d, i) => (
              <div key={d} className={i === 0 || i === 6 ? 'text-slate-400' : 'text-slate-700'}>
                {d}
              </div>
            ))}
          </div>

          {/* Compact Calendar Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
            
            {/* Prev month fill */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="min-h-[52px] sm:min-h-[62px] p-1.5 bg-slate-50/40 text-slate-300 text-[11px]"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = formatDateKey(dayNum);
              const dayTrades = tradesByDate[dateStr] || [];
              const dayJournal = journalsByDate[dateStr];
              const hasTrades = dayTrades.length > 0;
              const isToday = dateStr === todayStr;

              const dayNetPnl = dayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
              const wins = dayTrades.filter((t) => t.result === 'WIN').length;
              const losses = dayTrades.filter((t) => t.result === 'LOSS').length;

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => onSelectDate(dateStr)}
                  className={`min-h-[52px] sm:min-h-[62px] p-1 sm:p-1.5 transition-all cursor-pointer relative group flex flex-col justify-between ${
                    isToday ? 'bg-turquoise-50/40' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-turquoise-600 text-white'
                          : 'text-slate-700 group-hover:text-turquoise-700'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {dayJournal && (
                      <span title="Journal notes recorded" className="text-turquoise-600">
                        <FileText className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {hasTrades ? (
                    <div className="mt-1">
                      <div
                        className={`text-[10px] sm:text-[11px] font-extrabold px-1 py-0.5 rounded text-center truncate ${
                          dayNetPnl > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : dayNetPnl < 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {dayNetPnl >= 0 ? `+$${dayNetPnl}` : `-$${Math.abs(dayNetPnl)}`}
                      </div>
                      <div className="text-[9px] text-slate-400 font-semibold text-center mt-0.5">
                        {wins}W - {losses}L
                      </div>
                    </div>
                  ) : (
                    <div className="h-3" />
                  )}
                </div>
              );
            })}

            {/* Trailing days */}
            {(() => {
              const totalCells = firstDayOfMonth + daysInMonth;
              const remaining = (7 - (totalCells % 7)) % 7;
              return Array.from({ length: remaining }).map((_, i) => (
                <div
                  key={`next-${i}`}
                  className="min-h-[52px] sm:min-h-[62px] p-1.5 bg-slate-50/40 text-slate-300 text-[11px]"
                >
                  {i + 1}
                </div>
              ));
            })()}

          </div>

          <div className="px-3 py-2 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Tip: Click on any date to open the Daily Journal & Notes</span>
            <span className="font-semibold text-turquoise-700">Virtuoso FX Calendar</span>
          </div>

        </div>

        {/* FOREX TRADING DESK SIDEBAR (Images & Market Insights) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          {/* Forex Visual Hero Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 group h-44">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80"
              alt="Forex Trading Workstation"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent p-4 flex flex-col justify-end text-white">
              <div className="flex items-center space-x-1.5 text-turquoise-300 text-[10px] font-bold tracking-widest uppercase mb-1">
                <Clock className="w-3 h-3" />
                <span>Forex Session Focus</span>
              </div>
              <h4 className="text-sm font-bold leading-snug">
                London & New York Overlap
              </h4>
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                Highest volatility & volume window. Strict risk control on major pairs: EURUSD, GBPUSD, XAUUSD.
              </p>
            </div>
          </div>

          {/* Quick Major Currency Pairs Watch */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="uppercase tracking-wider">Major Forex Pairs</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Markets Active</span>
              </span>
            </div>

            <div className="space-y-2">
              {[
                { pair: 'EUR / USD', name: 'Euro / US Dollar', spread: '0.8 pips', bias: 'Bullish Bias' },
                { pair: 'GBP / USD', name: 'British Pound / USD', spread: '1.1 pips', bias: 'Break & Retest' },
                { pair: 'XAU / USD', name: 'Gold / US Dollar', spread: '1.5 pips', bias: 'Order Block FVG' },
                { pair: 'USD / JPY', name: 'US Dollar / Yen', spread: '0.9 pips', bias: 'Trend Continuation' },
              ].map((item) => (
                <div
                  key={item.pair}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-turquoise-50/50 border border-slate-100 hover:border-turquoise-200 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-extrabold text-slate-900">{item.pair}</div>
                    <div className="text-[10px] text-slate-400">{item.name}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-turquoise-700 bg-white px-2 py-0.5 rounded border border-turquoise-200">
                      {item.bias}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.spread}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
