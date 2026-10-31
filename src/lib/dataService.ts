import { Book, DailyJournal, Quote, Trade } from '@/types';
import { INITIAL_BOOKS, INITIAL_QUOTES, INITIAL_TRADES } from './constants';
import { isSupabaseConfigured, supabase } from './supabaseClient';
import { AuthUser } from '@/context/AuthContext';

const STORAGE_KEYS = {
  TRADES: 'pip_journal_trades_v2',
  JOURNALS: 'pip_journal_daily_v2',
  BOOKS: 'pip_journal_books_v2',
  QUOTES: 'pip_journal_quotes_v2',
};

// Local storage helpers
const getLocal = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setLocal = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to write to localStorage', err);
  }
};

/* -------------------------------------------------------------------------- */
/*                                TRADES CRUD                                 */
/* -------------------------------------------------------------------------- */

export async function fetchTrades(user?: AuthUser | null): Promise<Trade[]> {
  // If user is a Guest, show the rich sample demo trades!
  if (user?.isGuest) {
    return getLocal<Trade[]>(`${STORAGE_KEYS.TRADES}_guest`, INITIAL_TRADES);
  }

  // Real authenticated user
  const userId = user?.id;
  const userStorageKey = userId ? `${STORAGE_KEYS.TRADES}_${userId}` : STORAGE_KEYS.TRADES;

  if (isSupabaseConfigured() && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('trade_date', { ascending: false });

      if (!error && data) {
        // Return exactly what is in Supabase (empty [] if new user with no trades)
        return data.map((t: any) => ({
          id: t.id,
          pair: t.pair,
          direction: t.direction,
          entryPrice: Number(t.entry_price),
          exitPrice: t.exit_price ? Number(t.exit_price) : undefined,
          stopLoss: t.stop_loss ? Number(t.stop_loss) : undefined,
          takeProfit: t.take_profit ? Number(t.take_profit) : undefined,
          lotSize: Number(t.lot_size),
          pnl: Number(t.pnl || 0),
          pips: Number(t.pips || 0),
          rrRatio: Number(t.rr_ratio || 0),
          result: t.result,
          session: t.session,
          strategy: t.strategy,
          timeframe: t.timeframe,
          tradingviewUrl: t.tradingview_url,
          screenshotUrl: t.screenshot_url,
          emotion: t.emotion,
          rulesFollowed: Boolean(t.rules_followed),
          notes: t.notes,
          tradeDate: (t.trade_date || '').split('T')[0],
          createdAt: t.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local state:', err);
    }
  }

  // For real accounts locally, default to empty [] until they log their first trade!
  return getLocal<Trade[]>(userStorageKey, []);
}

export async function saveTrade(trade: Trade, user?: AuthUser | null): Promise<Trade> {
  const isGuest = user?.isGuest;
  const userId = user?.id;

  if (isSupabaseConfigured() && supabase && userId && !isGuest) {
    try {
      const payload: any = {
        user_id: userId,
        pair: trade.pair,
        direction: trade.direction,
        entry_price: trade.entryPrice,
        exit_price: trade.exitPrice,
        stop_loss: trade.stopLoss,
        take_profit: trade.takeProfit,
        lot_size: trade.lotSize,
        pnl: trade.pnl,
        pips: trade.pips,
        rr_ratio: trade.rrRatio,
        result: trade.result,
        session: trade.session,
        strategy: trade.strategy,
        timeframe: trade.timeframe,
        tradingview_url: trade.tradingviewUrl,
        screenshot_url: trade.screenshotUrl,
        emotion: trade.emotion,
        rules_followed: trade.rulesFollowed,
        notes: trade.notes,
        trade_date: new Date(trade.tradeDate).toISOString(),
      };

      if (trade.id && !trade.id.startsWith('t-')) {
        payload.id = trade.id;
      }

      const { data, error } = await supabase
        .from('trades')
        .upsert(payload)
        .select()
        .single();

      if (!error && data) {
        return {
          ...trade,
          id: data.id,
        };
      }
    } catch (err) {
      console.warn('Supabase insert failed, saving locally:', err);
    }
  }

  // Fallback to local storage (partitioned by user)
  const userStorageKey = isGuest 
    ? `${STORAGE_KEYS.TRADES}_guest` 
    : userId ? `${STORAGE_KEYS.TRADES}_${userId}` : STORAGE_KEYS.TRADES;

  const current = getLocal<Trade[]>(userStorageKey, isGuest ? INITIAL_TRADES : []);
  const exists = current.findIndex((t) => t.id === trade.id);
  let updated: Trade[];
  if (exists >= 0) {
    updated = [...current];
    updated[exists] = trade;
  } else {
    updated = [trade, ...current];
  }
  setLocal(userStorageKey, updated);
  return trade;
}

export async function deleteTradeById(id: string, user?: AuthUser | null): Promise<boolean> {
  const isGuest = user?.isGuest;
  const userId = user?.id;

  if (isSupabaseConfigured() && supabase && !isGuest) {
    try {
      const { error } = await supabase.from('trades').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase delete failed:', err);
    }
  }

  const userStorageKey = isGuest 
    ? `${STORAGE_KEYS.TRADES}_guest` 
    : userId ? `${STORAGE_KEYS.TRADES}_${userId}` : STORAGE_KEYS.TRADES;

  const current = getLocal<Trade[]>(userStorageKey, isGuest ? INITIAL_TRADES : []);
  const filtered = current.filter((t) => t.id !== id);
  setLocal(userStorageKey, filtered);
  return true;
}

/* -------------------------------------------------------------------------- */
/*                            DAILY JOURNALS & NOTES                          */
/* -------------------------------------------------------------------------- */

export async function fetchDailyJournals(user?: AuthUser | null): Promise<DailyJournal[]> {
  const isGuest = user?.isGuest;
  const userId = user?.id;

  if (isSupabaseConfigured() && supabase && userId && !isGuest) {
    try {
      const { data, error } = await supabase
        .from('daily_journals')
        .select('*')
        .eq('user_id', userId);

      if (!error && data) {
        return data.map((j: any) => ({
          id: j.id,
          journalDate: j.journal_date,
          marketBias: j.market_bias,
          highImpactNews: j.high_impact_news,
          preMarketPlan: j.pre_market_plan,
          postMarketReflection: j.post_market_reflection,
          disciplineScore: j.discipline_score,
          mistakesMade: j.mistakes_made,
          createdAt: j.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase journal fetch failed:', err);
    }
  }

  const userStorageKey = isGuest 
    ? `${STORAGE_KEYS.JOURNALS}_guest` 
    : userId ? `${STORAGE_KEYS.JOURNALS}_${userId}` : STORAGE_KEYS.JOURNALS;

  return getLocal<DailyJournal[]>(userStorageKey, []);
}

export async function saveDailyJournal(journal: DailyJournal, user?: AuthUser | null): Promise<DailyJournal> {
  const isGuest = user?.isGuest;
  const userId = user?.id;

  if (isSupabaseConfigured() && supabase && userId && !isGuest) {
    try {
      const payload: any = {
        user_id: userId,
        journal_date: journal.journalDate,
        market_bias: journal.marketBias,
        high_impact_news: journal.highImpactNews,
        pre_market_plan: journal.preMarketPlan,
        post_market_reflection: journal.postMarketReflection,
        discipline_score: journal.disciplineScore,
        mistakes_made: journal.mistakesMade,
      };

      const { data, error } = await supabase
        .from('daily_journals')
        .upsert(payload, { onConflict: 'journal_date' })
        .select()
        .single();

      if (!error && data) {
        return {
          ...journal,
          id: data.id,
        };
      }
    } catch (err) {
      console.warn('Supabase journal save failed:', err);
    }
  }

  const userStorageKey = isGuest 
    ? `${STORAGE_KEYS.JOURNALS}_guest` 
    : userId ? `${STORAGE_KEYS.JOURNALS}_${userId}` : STORAGE_KEYS.JOURNALS;

  const current = getLocal<DailyJournal[]>(userStorageKey, []);
  const index = current.findIndex((j) => j.journalDate === journal.journalDate);
  let updated: DailyJournal[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = journal;
  } else {
    updated = [journal, ...current];
  }
  setLocal(userStorageKey, updated);
  return journal;
}

/* -------------------------------------------------------------------------- */
/*                          TRADER'S BOOKSHELF CRUD                           */
/* -------------------------------------------------------------------------- */

export async function fetchBooks(): Promise<Book[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((b: any) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          category: b.category,
          coverUrl: b.cover_url,
          summary: b.summary,
          keyTakeaways: b.key_takeaways || [],
          personalNotes: b.personal_notes,
          status: b.status,
          rating: b.rating || 5,
        }));
      }
    } catch (err) {
      console.warn('Supabase books fetch error:', err);
    }
  }

  return getLocal<Book[]>(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
}

export async function saveBook(book: Book): Promise<Book> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const payload: any = {
        title: book.title,
        author: book.author,
        category: book.category,
        cover_url: book.coverUrl,
        summary: book.summary,
        key_takeaways: book.keyTakeaways,
        personal_notes: book.personalNotes,
        status: book.status,
        rating: book.rating,
      };
      if (book.id && !book.id.startsWith('b')) {
        payload.id = book.id;
      }

      const { data, error } = await supabase.from('books').upsert(payload).select().single();
      if (!error && data) {
        return { ...book, id: data.id };
      }
    } catch (err) {
      console.warn('Supabase book upsert error:', err);
    }
  }

  const current = getLocal<Book[]>(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
  const idx = current.findIndex((b) => b.id === book.id);
  let updated: Book[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = book;
  } else {
    updated = [...current, book];
  }
  setLocal(STORAGE_KEYS.BOOKS, updated);
  return book;
}

/* -------------------------------------------------------------------------- */
/*                                   QUOTES                                   */
/* -------------------------------------------------------------------------- */

export async function fetchQuotes(): Promise<Quote[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('quotes').select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase quotes fetch error:', err);
    }
  }
  return INITIAL_QUOTES;
}
