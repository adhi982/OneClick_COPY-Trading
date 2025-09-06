// Supabase Configuration for OneClick Copy Trading Platform
// This file sets up the Supabase client with proper configuration

import { createClient } from '@supabase/supabase-js';

// Environment variables validation
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client-side Supabase client configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'oneclick-trading@1.0.0'
    }
  }
});

// Server-side Supabase client (only for server-side operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'X-Client-Info': 'oneclick-trading-admin@1.0.0'
      }
    }
  }
);

// Real-time subscription helpers
export const realtimeSubscriptions = {
  // Subscribe to trading signals for specific channels
  subscribeToChannelSignals: (channelId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`signals-${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trading_signals',
          filter: `channel_id=eq.${channelId}`
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to community posts
  subscribeToCommunityPosts: (callback: (payload: any) => void) => {
    return supabase
      .channel('community-posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts'
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to user notifications
  subscribeToUserNotifications: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to live price updates (if using Supabase for market data)
  subscribeToMarketData: (symbols: string[], callback: (payload: any) => void) => {
    return supabase
      .channel('market-data')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'market_data'
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to trade updates
  subscribeToUserTrades: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`trades-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `follower_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }
};

// Database helper functions
export const supabaseHelpers = {
  // Get user profile with Firebase UID
  getUserByFirebaseUID: async (firebaseUID: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUID)
      .single();
    
    return { data, error };
  },

  // Create or update user profile
  upsertUserProfile: async (firebaseUID: string, userData: any) => {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        firebase_uid: firebaseUID,
        ...userData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'firebase_uid'
      })
      .select()
      .single();
    
    return { data, error };
  },

  // Get user's active subscriptions
  getUserSubscriptions: async (userId: string) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        premium_channels (
          id,
          name,
          description,
          pricing_monthly,
          creator_id,
          users!premium_channels_creator_id_fkey (
            display_name,
            avatar_url
          )
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active');
    
    return { data, error };
  },

  // Get channel's trading signals
  getChannelSignals: async (channelId: string, limit = 50) => {
    const { data, error } = await supabase
      .from('trading_signals')
      .select(`
        *,
        users!trading_signals_creator_id_fkey (
          display_name,
          avatar_url
        )
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  // Get user's portfolio with performance data
  getUserPortfolio: async (userId: string) => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();
    
    return { data, error };
  },

  // Get community posts with pagination
  getCommunityPosts: async (page = 1, limit = 20, filters?: any) => {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        users!community_posts_user_id_fkey (
          display_name,
          avatar_url,
          verification_badge
        ),
        post_likes (count)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (filters?.postType) {
      query = query.eq('post_type', filters.postType);
    }

    if (filters?.channelId) {
      query = query.eq('channel_id', filters.channelId);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .limit(limit);
    
    return { data, error, count };
  }
};

// Type definitions for better TypeScript support
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          firebase_uid: string;
          wallet_address?: string;
          username?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string;
          bio?: string;
          country?: string;
          timezone?: string;
          email_verified: boolean;
          phone_verified: boolean;
          verification_badge: boolean;
          account_status: string;
          subscription_tier: string;
          total_followers: number;
          total_following: number;
          trading_experience: string;
          risk_tolerance: string;
          preferred_assets: any;
          social_links: any;
          achievements: any;
          notification_settings: any;
          privacy_settings: any;
          created_at: string;
          updated_at: string;
          last_login_at?: string;
        };
        Insert: {
          firebase_uid: string;
          wallet_address?: string;
          username?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string;
          bio?: string;
          country?: string;
          timezone?: string;
          email_verified?: boolean;
          phone_verified?: boolean;
          verification_badge?: boolean;
          account_status?: string;
          subscription_tier?: string;
          total_followers?: number;
          total_following?: number;
          trading_experience?: string;
          risk_tolerance?: string;
          preferred_assets?: any;
          social_links?: any;
          achievements?: any;
          notification_settings?: any;
          privacy_settings?: any;
        };
        Update: {
          firebase_uid?: string;
          wallet_address?: string;
          username?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string;
          bio?: string;
          country?: string;
          timezone?: string;
          email_verified?: boolean;
          phone_verified?: boolean;
          verification_badge?: boolean;
          account_status?: string;
          subscription_tier?: string;
          total_followers?: number;
          total_following?: number;
          trading_experience?: string;
          risk_tolerance?: string;
          preferred_assets?: any;
          social_links?: any;
          achievements?: any;
          notification_settings?: any;
          privacy_settings?: any;
          updated_at?: string;
          last_login_at?: string;
        };
      };
      // Add other table types as needed
    };
  };
}

export default supabase;
