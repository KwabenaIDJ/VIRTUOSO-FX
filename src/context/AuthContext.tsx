'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'virtuoso_guest_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if guest user session exists locally
    if (typeof window !== 'undefined') {
      const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
      if (savedGuest) {
        try {
          setUser(JSON.parse(savedGuest));
          setIsLoading(false);
          return;
        } catch {
          // ignore
        }
      }
    }

    // Check Supabase session if configured
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'trader@virtuosofx.com',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Isaac',
            isGuest: false,
          });
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'trader@virtuosofx.com',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Isaac',
            isGuest: false,
          });
        } else {
          // Check if guest
          const savedGuest = typeof window !== 'undefined' ? localStorage.getItem(GUEST_STORAGE_KEY) : null;
          if (savedGuest) {
            setUser(JSON.parse(savedGuest));
          } else {
            setUser(null);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      // Fallback guest login if Supabase client is not ready
      loginAsGuest();
      return {};
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      if (typeof window !== 'undefined') localStorage.removeItem(GUEST_STORAGE_KEY);
      setUser({
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.full_name || email.split('@')[0] || 'Isaac',
        isGuest: false,
      });
    }

    return {};
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      loginAsGuest();
      return { message: 'Signed in as guest trader' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0],
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      if (typeof window !== 'undefined') localStorage.removeItem(GUEST_STORAGE_KEY);
      setUser({
        id: data.user.id,
        email: data.user.email || email,
        name: email.split('@')[0] || 'Isaac',
        isGuest: false,
      });
      return { message: 'Account created! Welcome to Virtuoso FX.' };
    }

    return { message: 'Check your email for confirmation link.' };
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const loginAsGuest = () => {
    const guestUser: AuthUser = {
      id: 'guest-1',
      email: 'isaac@virtuosofx.com',
      name: 'Isaac',
      isGuest: true,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    }
    setUser(guestUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
