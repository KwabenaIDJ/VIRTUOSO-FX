export type TradeDirection = 'BUY' | 'SELL';
export type TradeResult = 'WIN' | 'LOSS' | 'BE' | 'OPEN';
export type TradingSession = 'London' | 'New York' | 'Asian' | 'Overlap' | 'Other';
export type BookCategory = 'Psychology' | 'Fundamental' | 'Technical';
export type BookStatus = 'Want to Read' | 'Reading' | 'Completed';

export interface Trade {
  id: string;
  pair: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize: number;
  pnl: number;
  pips: number;
  rrRatio: number;
  result: TradeResult;
  session: TradingSession;
  strategy?: string;
  timeframe?: string;
  tradingviewUrl?: string;
  screenshotUrl?: string;
  emotion?: string;
  rulesFollowed: boolean;
  notes?: string;
  tradeDate: string; // ISO date string YYYY-MM-DD
  createdAt?: string;
}

export interface DailyJournal {
  id: string;
  journalDate: string; // YYYY-MM-DD
  marketBias?: 'Bullish' | 'Bearish' | 'Neutral' | 'Range-bound';
  highImpactNews?: string;
  preMarketPlan?: string;
  postMarketReflection?: string;
  disciplineScore?: number; // 1 to 10
  mistakesMade?: string[];
  createdAt?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  coverUrl?: string;
  summary: string;
  keyTakeaways: string[];
  personalNotes?: string;
  status: BookStatus;
  rating: number; // 1 to 5
}

export interface Quote {
  id: string;
  quote: string;
  author: string;
  category: string;
}
