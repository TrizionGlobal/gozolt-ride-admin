'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { adminLogin, logout } from '@/services/auth/auth.service';
import { isAuthSuccess, isAuth2FA } from '@/services/auth/auth.types';
import type { AdminLoginPayload } from '@/services/auth/auth.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setLoading, setTwoFactorState, clearAuth } =
    useAuthStore();

  const login = useCallback(
    async (payload: AdminLoginPayload) => {
      setLoading(true);
      try {
        const response = await adminLogin(payload);

        if (isAuth2FA(response)) {
          // Store credentials for 2FA step
          setTwoFactorState({
            email: payload.email,
            password: payload.password,
            tempToken: response.tempToken,
          });
          router.push('/verify-2fa');
          return;
        }

        if (isAuthSuccess(response)) {
          if (DEV_BYPASS) {
            // In dev mode, store user in localStorage and set a cookie marker
            localStorage.setItem('gozolt-dev-user', JSON.stringify(response.user));
            document.cookie = 'gozolt-dev-authenticated=true; path=/; max-age=86400';
            setUser(response.user);
          } else {
            // Set HTTP-only cookies via API route
            await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                user: response.user,
              }),
            });
            setUser(response.user);
          }
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    },
    [router, setUser, setLoading, setTwoFactorState],
  );

  const verify2FA = useCallback(
    async (totpCode: string) => {
      const twoFactorState = useAuthStore.getState().twoFactorState;
      if (!twoFactorState) {
        throw new Error('No 2FA state found');
      }

      setLoading(true);
      try {
        const response = await adminLogin({
          email: twoFactorState.email,
          password: twoFactorState.password,
          totpCode,
        });

        if (isAuthSuccess(response)) {
          if (DEV_BYPASS) {
            localStorage.setItem('gozolt-dev-user', JSON.stringify(response.user));
            document.cookie = 'gozolt-dev-authenticated=true; path=/; max-age=86400';
            setUser(response.user);
          } else {
            await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                user: response.user,
              }),
            });
            setUser(response.user);
          }
          useAuthStore.getState().clearTwoFactorState();
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    },
    [router, setUser, setLoading],
  );

  const handleLogout = useCallback(async () => {
    try {
      if (DEV_BYPASS) {
        localStorage.removeItem('gozolt-dev-user');
        document.cookie = 'gozolt-dev-authenticated=; path=/; max-age=0';
      } else {
        await logout();
        await fetch('/api/auth/logout', { method: 'POST' });
      }
    } finally {
      clearAuth();
      router.push('/login');
    }
  }, [router, clearAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    verify2FA,
    logout: handleLogout,
  };
}
