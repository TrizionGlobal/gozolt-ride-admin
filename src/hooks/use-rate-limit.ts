'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface RateLimitConfig {
  /** Unique key for localStorage persistence */
  key: string;
  /** Maximum number of attempts before lockout */
  maxAttempts: number;
  /** Lockout duration in seconds */
  lockoutDuration: number;
  /** Time window in seconds within which attempts are counted */
  windowDuration: number;
}

interface RateLimitState {
  attempts: number;
  lockedUntil: number | null;
}

interface UseRateLimitReturn {
  /** Whether the user is currently locked out */
  isLocked: boolean;
  /** Remaining lockout time in seconds */
  remainingLockTime: number;
  /** Number of attempts made in the current window */
  attemptCount: number;
  /** Record a new attempt; returns true if allowed, false if locked */
  attempt: () => boolean;
  /** Reset the rate limiter */
  reset: () => void;
}

function getStoredState(key: string): RateLimitState {
  if (typeof window === 'undefined') {
    return { attempts: 0, lockedUntil: null };
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { attempts: 0, lockedUntil: null };
    return JSON.parse(raw) as RateLimitState;
  } catch {
    return { attempts: 0, lockedUntil: null };
  }
}

function setStoredState(key: string, state: RateLimitState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // Storage full or unavailable - fail silently
  }
}

export function useRateLimit(config: RateLimitConfig): UseRateLimitReturn {
  const { key, maxAttempts, lockoutDuration, windowDuration } = config;

  const [state, setState] = useState<RateLimitState>(() => getStoredState(key));
  const [remainingLockTime, setRemainingLockTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate if currently locked
  const isLocked = state.lockedUntil !== null && Date.now() < state.lockedUntil;

  // Sync remaining lock time countdown
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!state.lockedUntil) {
      setRemainingLockTime(0);
      return;
    }

    const updateRemaining = () => {
      const remaining = Math.max(0, Math.ceil((state.lockedUntil! - Date.now()) / 1000));
      setRemainingLockTime(remaining);

      if (remaining <= 0) {
        // Lockout expired - reset
        const newState: RateLimitState = { attempts: 0, lockedUntil: null };
        setState(newState);
        setStoredState(key, newState);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    updateRemaining();
    timerRef.current = setInterval(updateRemaining, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.lockedUntil, key]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = getStoredState(key);
    // If lockout has expired, reset
    if (stored.lockedUntil && Date.now() >= stored.lockedUntil) {
      const newState: RateLimitState = { attempts: 0, lockedUntil: null };
      setState(newState);
      setStoredState(key, newState);
    } else {
      setState(stored);
    }
  }, [key]);

  const attempt = useCallback((): boolean => {
    const current = getStoredState(key);

    // Check if still locked
    if (current.lockedUntil && Date.now() < current.lockedUntil) {
      return false;
    }

    // If lock expired, reset first
    if (current.lockedUntil && Date.now() >= current.lockedUntil) {
      const newState: RateLimitState = { attempts: 0, lockedUntil: null };
      setState(newState);
      setStoredState(key, newState);
      // Allow this attempt on fresh state
      const freshState: RateLimitState = { attempts: 1, lockedUntil: null };
      setState(freshState);
      setStoredState(key, freshState);
      return true;
    }

    const newAttempts = current.attempts + 1;

    if (newAttempts >= maxAttempts) {
      // Lock the user out
      const lockedUntil = Date.now() + lockoutDuration * 1000;
      const newState: RateLimitState = { attempts: newAttempts, lockedUntil };
      setState(newState);
      setStoredState(key, newState);
      return false;
    }

    const newState: RateLimitState = { attempts: newAttempts, lockedUntil: null };
    setState(newState);
    setStoredState(key, newState);
    return true;
  }, [key, maxAttempts, lockoutDuration]);

  const reset = useCallback(() => {
    const newState: RateLimitState = { attempts: 0, lockedUntil: null };
    setState(newState);
    setStoredState(key, newState);
    setRemainingLockTime(0);
  }, [key]);

  return {
    isLocked,
    remainingLockTime,
    attemptCount: state.attempts,
    attempt,
    reset,
  };
}
