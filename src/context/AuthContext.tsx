import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any, isAdmin?: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (error) {
        console.error('Exception getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    try {
      // Listen for auth changes
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => {
        if (data && data.subscription) {
          data.subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
      return () => {};
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        return { error: { message: error.message } };
      }
      
      // For development with mock client, simulate successful signup
      if (!data.user && !error) {
        return { error: null };
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An error occurred during sign up' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Special case for admin login in development
      const isAdmin = email === 'admin@example.com' && password === 'admin123';
      if (isAdmin) {
        console.log('Admin login detected');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error: { message: error.message } };
      }
      
      // For development with mock client, simulate successful login
      if (!data.user && !error) {
        // Create a mock user for development
        const mockUser = {
          id: email === 'admin@example.com' ? 'mock-admin-id' : 'mock-user-id',
          email: email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        };
        
        setUser(mockUser as User);
        return { error: null, isAdmin };
      }
      
      return { error: null, isAdmin: data.user?.email === 'admin@example.com' };
    } catch (error: any) {
      console.error('Exception during sign in:', error);
      return { error: { message: error.message || 'An error occurred during sign in' } };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};