'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  TrendingUp, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Activity,
  LineChart,
  Clock
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { signIn, signUp, loginAsGuest } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        const res = await signUp(email.trim(), password);
        if (res.error) {
          setErrorMessage(res.error);
        } else if (res.message) {
          setSuccessMessage(res.message);
        }
      } else {
        const res = await signIn(email.trim(), password);
        if (res.error) {
          setErrorMessage(res.error);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f4ef] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Split Card Container */}
      <div className="w-full max-w-5xl bg-[#fbfbfa] rounded-3xl shadow-2xl shadow-slate-300/60 border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* LEFT / VISUAL FOREX SHOWCASE (5 cols on desktop) */}
        <div className="lg:col-span-5 relative bg-[#0a1e17] text-white p-7 sm:p-9 flex flex-col justify-between overflow-hidden">
          
          {/* Background High-Res Forex Candlestick Chart Image */}
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"
            alt="Forex Trading Workstation"
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105"
          />

          {/* Emerald / Dark Forest Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06140f] via-[#0a1e17]/85 to-[#06140f]/90" />

          {/* Top Brand & Session Status */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950">
                  <TrendingUp className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="font-serif font-black text-lg tracking-tight text-white">
                  Virtuoso <span className="text-emerald-400">FX</span>
                </span>
              </div>

              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Markets Active</span>
              </span>
            </div>

            {/* Live Forex Pairs Ticker Pill */}
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300">
                <span className="flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>MAJOR PAIRS SNAPSHOT</span>
                </span>
                <span className="text-[10px] text-slate-300">London / NY</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/25 p-2 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400">EUR / USD</div>
                  <div className="font-extrabold text-emerald-400">1.08540 <span className="text-[9px] text-emerald-300">+0.38%</span></div>
                </div>
                <div className="bg-black/25 p-2 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400">XAU / USD (Gold)</div>
                  <div className="font-extrabold text-emerald-400">2,742.10 <span className="text-[9px] text-emerald-300">+1.24%</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Floating Candlestick Chart Card */}
          <div className="relative z-10 my-6">
            <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative group">
              <img
                src="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80"
                alt="Candlestick Chart"
                className="w-full h-32 object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3">
                <div className="text-[11px] font-bold text-white flex items-center space-x-1.5">
                  <LineChart className="w-3.5 h-3.5 text-emerald-400" />
                  <span>High Probability Setup: Fair Value Gap Retest</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Mindset Quote */}
          <div className="relative z-10 pt-4 border-t border-white/10 space-y-1">
            <p className="text-xs sm:text-sm font-serif italic text-emerald-100/90 leading-relaxed">
              "You do not need to know what is going to happen next in order to make consistent money."
            </p>
            <p className="text-[11px] font-bold text-emerald-400/80">
              — Mark Douglas, Trading in the Zone
            </p>
          </div>

        </div>

        {/* RIGHT / AUTHENTICATION FORM (7 cols on desktop) */}
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center space-y-6">
          
          <div>
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-emerald-700 block mb-1">
              TRADER OS ACCESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              {isSignUp ? 'Create your Virtuoso account' : 'Sign in to your trading journal'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Log executions, track drawdown, audit mindset traps, and master your edge.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200/70 max-w-xs">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                !isSignUp
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                isSignUp
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2.5 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="donkohjuniori@gmail.com"
                  className="w-full text-sm pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                {!isSignUp && (
                  <span className="text-[11px] text-emerald-700 font-semibold cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#0a1e17] hover:bg-[#122e23] active:bg-[#071712] text-white font-bold text-sm rounded-2xl shadow-md transition-all shadow-emerald-950/20 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating...' : isSignUp ? 'Create Virtuoso Account' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

          {/* Instant Guest Demo Access */}
          <div className="pt-2 border-t border-slate-200/80 space-y-2">
            <button
              type="button"
              onClick={loginAsGuest}
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-2xl transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Instant 1-Click Access as Isaac (Guest Mode)</span>
            </button>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secured with Supabase PostgreSQL Auth & Row Level Security</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
