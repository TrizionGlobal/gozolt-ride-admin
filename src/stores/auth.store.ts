'use client';

import { create } from 'zustand';
import type { AuthUser } from '@/services/auth/auth.types';

interface TwoFactorState {
  email: string;
  password: string;
  tempToken: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  twoFactorState: TwoFactorState | null;

  setUser: (user: AuthUser) => void;
  setLoading: (loading: boolean) => void;
  setTwoFactorState: (state: TwoFactorState) => void;
  clearTwoFactorState: () => void;
  clearAuth: () => void;
  hydrateFromSession: () => Promise<void>;
}

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  twoFactorState: null,

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  setTwoFactorState: (twoFactorState) => set({ twoFactorState }),

  clearTwoFactorState: () => set({ twoFactorState: null }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      twoFactorState: null,
    }),

  hydrateFromSession: async () => {
    try {
      if (DEV_BYPASS) {
        // In dev bypass mode, check localStorage for simulated session
        const stored = localStorage.getItem('gozolt-dev-user');
        if (stored) {
          const user = JSON.parse(stored) as AuthUser;
          set({ user, isAuthenticated: true, isLoading: false });
          return;
        }
        set({ isLoading: false });
        return;
      }

      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
