# Virtuoso FX — Forex Trading Journal & Discipline OS

A clean, modern Forex trading journaling web application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL)**. Styled in a crisp **turquoise and white light theme**.

---

## Features

1. **Interactive P&L Calendar:**
   - Visual monthly calendar displaying daily Net P&L (green/red badges), win/loss ratios, and executed trade counts.
   - Click any date to open the **Day Details Drawer** featuring:
     - **Daily Trade Journal:** Detailed list of positions taken that day.
     - **Strategy Journal:** Technical model and confluence documentation.
     - **Daily Notes:** Pre-market bias, high-impact news catalysts, post-market reflection, and 1–10 discipline rating.

2. **Trader's Library:**
   - Curated reading list divided into **Psychology**, **Fundamental Analysis**, and **Technical Analysis**.
   - Core takeaways for classics like *Trading in the Zone*, *The Mental Game of Trading*, and *Reminiscences of a Stock Operator*.
   - Interactive study notes editor where you can write and store your personal lessons for each book.

3. **Discipline & Mindset Atmosphere:**
   - Prominent rotating discipline quotes from master traders (Mark Douglas, Warren Buffett, Ed Seykota, Jared Tendler).
   - Rules adherence checklists before logging trades.

4. **TradingView Integration:**
   - Embedded real-time interactive TradingView charting workstation.
   - One-click launcher to open any currency pair (`EURUSD`, `GBPUSD`, `XAUUSD`, etc.) on TradingView.
   - Attach and preview TradingView chart snapshot links (`https://www.tradingview.com/x/...`) directly in your trade logs.

5. **Trade Execution Log & Export:**
   - Searchable, filterable table by currency pair, outcome (Win, Loss, Break-even), and trading session (London, NY, Asian).
   - One-click CSV export for offline backup and spreadsheet analysis.

6. **Forex Position Size & Risk Calculator:**
   - Calculate exact contract lots based on account balance, risk percentage, and stop loss pips.

---

## Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supabase Database Connection

The application is fully functional right out of the box with browser persistence (localStorage). When you are ready to sync your trades and notes across devices with Supabase:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this project, paste its contents into the Supabase SQL editor, and click **Run**.
4. In Supabase, go to **Project Settings → API** and copy:
   - **Project URL**
   - **Anon / Public Key**
5. Create or edit `.env.local` in this project folder:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
6. Restart your development server (`npm run dev`). The status indicator in the top navbar will switch to **"Supabase Active"**.
