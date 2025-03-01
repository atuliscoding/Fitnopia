import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client for development until proper credentials are provided
const createMockClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ 
        data: { subscription: { unsubscribe: () => {} } },
        error: null 
      }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({ data: null, error: null }),
          order: () => ({ data: [], error: null }),
          data: [], 
          error: null
        }),
        order: () => ({
          data: [],
          error: null
        }),
        data: [], 
        error: null
      }),
      insert: () => ({
        select: () => ({
          single: () => ({ data: { id: `mock-id-${Date.now()}` }, error: null })
        }),
        single: () => ({ data: { id: `mock-id-${Date.now()}` }, error: null }),
        data: { id: `mock-id-${Date.now()}` }, 
        error: null
      }),
      update: () => ({ 
        eq: () => ({ data: null, error: null }),
        match: () => ({ data: null, error: null })
      }),
      delete: () => ({ data: null, error: null }),
      eq: () => ({ data: [], error: null }),
      match: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null })
    })
  };
};

// Determine if we should use a real or mock client
const shouldUseMockClient = !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl === 'https://example.supabase.co' || 
  supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example';

// Export the appropriate client
export const supabase = shouldUseMockClient 
  ? createMockClient() 
  : createClient<Database>(supabaseUrl, supabaseAnonKey);

// Log a message if using mock client
if (shouldUseMockClient) {
  console.log('Using mock Supabase client. Connect to Supabase to enable full functionality.');
}