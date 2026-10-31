-- ==============================================================================
-- FOREX TRADING JOURNAL - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. TRADES TABLE
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pair VARCHAR(20) NOT NULL,
    direction VARCHAR(4) NOT NULL CHECK (direction IN ('BUY', 'SELL', 'LONG', 'SHORT')),
    entry_price NUMERIC(14, 5) NOT NULL,
    exit_price NUMERIC(14, 5),
    stop_loss NUMERIC(14, 5),
    take_profit NUMERIC(14, 5),
    lot_size NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    pnl NUMERIC(12, 2) DEFAULT 0.0,
    pips NUMERIC(10, 1) DEFAULT 0.0,
    rr_ratio NUMERIC(6, 2) DEFAULT 0.0,
    result VARCHAR(10) CHECK (result IN ('WIN', 'LOSS', 'BE', 'OPEN')),
    session VARCHAR(20) CHECK (session IN ('London', 'New York', 'Asian', 'Overlap', 'Other')),
    strategy VARCHAR(100),
    timeframe VARCHAR(10),
    tradingview_url TEXT,
    screenshot_url TEXT,
    emotion VARCHAR(50),
    rules_followed BOOLEAN DEFAULT TRUE,
    notes TEXT,
    trade_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for speedy calendar and analytics queries
CREATE INDEX IF NOT EXISTS idx_trades_date ON trades(trade_date);
CREATE INDEX IF NOT EXISTS idx_trades_user_date ON trades(user_id, trade_date);

-- 2. DAILY JOURNALS & NOTES TABLE (Linked to Calendar Days)
CREATE TABLE IF NOT EXISTS daily_journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    journal_date DATE NOT NULL,
    market_bias VARCHAR(20) CHECK (market_bias IN ('Bullish', 'Bearish', 'Neutral', 'Range-bound')),
    high_impact_news TEXT,
    pre_market_plan TEXT,
    post_market_reflection TEXT,
    discipline_score INT CHECK (discipline_score BETWEEN 1 AND 10),
    mistakes_made TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, journal_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_journals_date ON daily_journals(journal_date);

-- 3. TRADER'S LIBRARY (BOOKS & STUDY NOTES)
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Psychology', 'Fundamental', 'Technical')),
    cover_url TEXT,
    summary TEXT,
    key_takeaways TEXT[],
    personal_notes TEXT,
    status VARCHAR(20) DEFAULT 'Reading' CHECK (status IN ('Want to Read', 'Reading', 'Completed')),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. DISCIPLINE & MINDSET QUOTES TABLE
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote TEXT NOT NULL,
    author VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Discipline'
);

-- Enable Row Level Security (RLS)
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage their own records
CREATE POLICY "Users can manage their own trades"
ON trades FOR ALL
USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can manage their daily journals"
ON daily_journals FOR ALL
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Books and quotes can be viewed by all users
CREATE POLICY "Allow public read of books"
ON books FOR SELECT
USING (true);

CREATE POLICY "Allow public read of quotes"
ON quotes FOR SELECT
USING (true);

-- Insert sample foundational books
INSERT INTO books (title, author, category, summary, key_takeaways, status, rating) VALUES
(
    'Trading in the Zone',
    'Mark Douglas',
    'Psychology',
    'The undisputed classic on master traders psychology and risk mindset.',
    ARRAY[
        'Anything can happen in the market at any time.',
        'You do not need to know what is going to happen next to make money.',
        'Accept the risk completely before entering any trade.',
        'Every moment in the market is unique.'
    ],
    'Completed',
    5
),
(
    'The Mental Game of Trading',
    'Jared Tendler',
    'Psychology',
    'A step-by-step system for diagnosing and fixing mental game leaks like FOMO, greed, and revenge trading.',
    ARRAY[
        'Emotions are signals, not the root cause of trading mistakes.',
        'Map your tilt progression from mild frustration to full blown revenge trading.',
        'The Inchworm concept: build your floor higher instead of just pushing your peak.'
    ],
    'Reading',
    5
),
(
    'Reminiscences of a Stock Operator',
    'Edwin Lefèvre',
    'Technical',
    'Fictionalized biography of Jesse Livermore, legendary tape reader and market operator.',
    ARRAY[
        'It was never my thinking that made the big money for me. It was always my sitting.',
        'The market does not beat them. They beat themselves.',
        'Never average down on a losing position.'
    ],
    'Completed',
    5
),
(
    'Currency Trading and Intermarket Analysis',
    'Ashraf Laïdi',
    'Fundamental',
    'How bond yields, commodity prices, and central bank interest rate differentials drive FX pairs.',
    ARRAY[
        'Interest rate differentials are the primary medium-term driver of exchange rates.',
        'Watch Gold and Crude Oil for commodity currency hints (CAD, AUD, NZD).',
        'Central bank balance sheet expansion determines long-term currency devaluation.'
    ],
    'Want to Read',
    4
);

-- Insert initial discipline quotes
INSERT INTO quotes (quote, author, category) VALUES
('The market is a device for transferring money from the impatient to the patient.', 'Warren Buffett', 'Patience'),
('You do not need to know what is going to happen next in order to make money.', 'Mark Douglas', 'Mindset'),
('If you can not take a small loss, sooner or later you will take the mother of all losses.', 'Ed Seykota', 'Risk Management'),
('Do more of what works and less of what does not.', 'Steve Clark', 'Strategy'),
('The goal of a successful trader is to make the best trades. Money is secondary.', 'Alexander Elder', 'Execution'),
('Amateurs focus on how much money they can make. Professionals focus on how much they could lose.', 'Paul Tudor Jones', 'Risk Management');
