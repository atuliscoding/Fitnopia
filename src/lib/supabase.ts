import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client for development until proper credentials are provided
const createMockClient = () => {
  // Store the mock user state
  let mockUser: any = null;
  let mockSession: any = null;
  
  // Mock storage for user profiles
  const mockUserProfiles: Record<string, any> = {};

  return {
    auth: {
      getSession: async () => {
        return { 
          data: { 
            session: mockSession 
          }, 
          error: null 
        };
      },
      onAuthStateChange: (callback: any) => {
        // If we already have a mock user, trigger the callback
        if (mockUser && mockSession) {
          setTimeout(() => {
            callback('SIGNED_IN', mockSession);
          }, 0);
        }
        
        // Return the subscription object
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => {} 
            } 
          },
          error: null 
        };
      },
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      signInWithPassword: async (credentials: { email: string, password: string }) => {
        // For demo purposes, allow admin login
        if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
          mockUser = { 
            id: 'mock-admin-id', 
            email: 'admin@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          };
          
          mockSession = { 
            access_token: 'mock-token',
            refresh_token: 'mock-refresh-token',
            expires_at: new Date().getTime() + 3600000,
            user: mockUser
          };
          
          // Trigger auth state change
          setTimeout(() => {
            const listeners = (window as any).__SUPABASE_AUTH_LISTENERS;
            if (listeners && typeof listeners === 'function') {
              listeners('SIGNED_IN', mockSession);
            }
          }, 100);
          
          return { 
            data: { 
              user: mockUser, 
              session: mockSession
            }, 
            error: null 
          };
        }
        
        // For demo purposes, allow any login
        const userId = `mock-user-id-${credentials.email.replace(/[^a-zA-Z0-9]/g, '')}`;
        
        mockUser = { 
          id: userId, 
          email: credentials.email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        };
        
        mockSession = { 
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_at: new Date().getTime() + 3600000,
          user: mockUser
        };
        
        // Trigger auth state change
        setTimeout(() => {
          const listeners = (window as any).__SUPABASE_AUTH_LISTENERS;
          if (listeners && typeof listeners === 'function') {
            listeners('SIGNED_IN', mockSession);
          }
        }, 100);
        
        return { 
          data: { 
            user: mockUser, 
            session: mockSession
          }, 
          error: null 
        };
      },
      signOut: async () => {
        mockUser = null;
        mockSession = null;
        
        // Trigger auth state change
        setTimeout(() => {
          const listeners = (window as any).__SUPABASE_AUTH_LISTENERS;
          if (listeners && typeof listeners === 'function') {
            listeners('SIGNED_OUT', null);
          }
        }, 100);
        
        return { error: null };
      }
    },
    from: () => ({
      select: () => ({
        eq: (column: string, value: any) => {
          if (column === 'user_id' && mockUser) {
            // Return user profile if it exists
            const profile = mockUserProfiles[value];
            return {
              single: () => ({ 
                data: profile || null, 
                error: profile ? null : { code: 'PGRST116', message: 'No rows found' } 
              }),
              order: () => ({ data: [], error: null }),
              data: profile ? [profile] : [], 
              error: null
            };
          }
          
          return {
            single: () => ({ data: null, error: null }),
            order: () => ({ data: [], error: null }),
            data: [], 
            error: null
          };
        },
        order: () => ({
          data: [],
          error: null
        }),
        data: [], 
        error: null
      }),
      insert: (data: any) => {
        // Handle user profile creation/update
        if (data.user_id && mockUser) {
          const now = new Date().toISOString();
          const profile = {
            id: data.id || `profile-${Date.now()}`,
            ...data,
            created_at: data.created_at || now,
            updated_at: now
          };
          
          // Store the profile
          mockUserProfiles[data.user_id] = profile;
          
          return {
            select: () => ({
              single: () => ({ data: profile, error: null }),
              eq: () => ({ data: null, error: null }),
              data: [profile], 
              error: null
            }),
            single: () => ({ data: profile, error: null }),
            data: profile, 
            error: null
          };
        }
        
        return {
          select: () => ({
            single: () => ({ data: { id: `mock-id-${Date.now()}` }, error: null }),
            eq: () => ({ data: null, error: null }),
            data: [{ id: `mock-id-${Date.now()}` }], 
            error: null
          }),
          single: () => ({ data: { id: `mock-id-${Date.now()}` }, error: null }),
          data: { id: `mock-id-${Date.now()}` }, 
          error: null
        };
      },
      update: (data: any) => {
        return { 
          eq: (column: string, value: any) => {
            // Handle user profile update
            if (column === 'id' && mockUserProfiles[mockUser?.id]) {
              const profile = mockUserProfiles[mockUser.id];
              const updatedProfile = {
                ...profile,
                ...data,
                updated_at: new Date().toISOString()
              };
              
              // Update the stored profile
              mockUserProfiles[mockUser.id] = updatedProfile;
              
              return { data: updatedProfile, error: null };
            }
            
            return { data: null, error: null };
          },
          match: () => ({ data: null, error: null })
        };
      },
      delete: () => ({ 
        eq: () => ({ data: null, error: null }),
        data: null, 
        error: null 
      }),
      eq: () => ({ data: [], error: null }),
      match: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null })
    })
  };
};

// Store auth listeners for mock client
(window as any).__SUPABASE_AUTH_LISTENERS = null;

// Determine if we should use a real or mock client
const shouldUseMockClient = !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl === 'https://example.supabase.co' || 
  supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example';

// Export the appropriate client
export const supabase = shouldUseMockClient 
  ? createMockClient() 
  : createClient<Database>(supabaseUrl, supabaseAnonKey);

// For mock client, set up global listener registry
if (shouldUseMockClient) {
  // Override onAuthStateChange to store listeners
  const originalOnAuthStateChange = supabase.auth.onAuthStateChange;
  supabase.auth.onAuthStateChange = (callback: any) => {
    (window as any).__SUPABASE_AUTH_LISTENERS = callback;
    return originalOnAuthStateChange(callback);
  };
  
  console.log('Using mock Supabase client. Connect to Supabase to enable full functionality.');
  console.log('For admin access, use email: admin@example.com and password: admin123');
}