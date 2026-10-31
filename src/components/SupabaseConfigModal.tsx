'use client';

import React, { useState } from 'react';
import { Database, CheckCircle, Copy, Check, ExternalLink, X, ShieldAlert } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const isConnected = isSupabaseConfigured();

  if (!isOpen) return null;

  const copyEnvSample = () => {
    const text = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl ${isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Supabase Database Integration</h2>
              <p className="text-xs text-slate-500">PostgreSQL cloud storage for your Forex journal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600">
          
          {/* Status Box */}
          <div className={`p-4 rounded-xl border flex items-center space-x-3 ${
            isConnected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isConnected ? (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-sm block">Supabase Connected & Active</span>
                  <span>Trades, daily journals, and library notes are syncing directly to your PostgreSQL database.</span>
                </div>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold text-sm block">Running in Local Storage Mode</span>
                  <span>The app works locally in your browser. To sync across all devices, connect your free Supabase project below.</span>
                </div>
              </>
            )}
          </div>

          {/* Setup Steps */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">
              How to Connect Supabase (3 Simple Steps):
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Step 1: Create a Supabase Project</span>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-turquoise-700 hover:underline flex items-center space-x-1"
                  >
                    <span>supabase.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p>Sign up or log in to Supabase and create a new project (e.g. "Forex-Journal").</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">
                  <span>Step 2: Run Database Schema</span>
                </div>
                <p>
                  Open your Supabase <strong>SQL Editor</strong> and execute the SQL file included in this project at:
                </p>
                <code className="block bg-white p-2 rounded border border-slate-300 font-mono text-slate-800 text-[11px]">
                  supabase/schema.sql
                </code>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Step 3: Add Keys to .env.local</span>
                  <button
                    onClick={copyEnvSample}
                    className="text-turquoise-700 hover:underline flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy Template'}</span>
                  </button>
                </div>
                <p>
                  Go to <strong>Project Settings → API</strong> in Supabase. Copy your URL and anon public key into <code className="text-slate-800 font-mono">.env.local</code> in this project folder:
                </p>
                <pre className="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-[11px] overflow-x-auto font-mono">
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
                </pre>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-turquoise-600 hover:bg-turquoise-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
