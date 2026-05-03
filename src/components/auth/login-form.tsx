'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useRateLimit } from '@/hooks/use-rate-limit';
import { sanitizeInput } from '@/lib/sanitize';
import { toast } from 'sonner';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;
const WARNING_THRESHOLD = 3;

export function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { isLocked, remainingLockTime, attemptCount, attempt, reset } = useRateLimit({
    key: 'gozolt_login_rate_limit',
    maxAttempts: MAX_LOGIN_ATTEMPTS,
    lockoutDuration: LOCKOUT_SECONDS,
    windowDuration: 300,
  });

  const emailValid = isValidEmail(email);
  const passwordValid = password.length >= 8;
  const canSubmit = emailValid && passwordValid && !submitting && !isLocked;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      setSubmitting(true);
      try {
        const sanitizedEmail = sanitizeInput(email);
        await login({ email: sanitizedEmail, password });
        reset();
      } catch (err) {
        const allowed = attempt();
        if (!allowed) {
          toast.error(`Too many failed attempts. Locked out for ${LOCKOUT_SECONDS} seconds.`);
        } else {
          toast.error(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
        }
      } finally {
        setSubmitting(false);
      }
    },
    [email, password, canSubmit, login, attempt, reset],
  );

  const remainingAttempts = MAX_LOGIN_ATTEMPTS - attemptCount;
  const showWarning = attemptCount >= WARNING_THRESHOLD && !isLocked;

  return (
    <div className="w-full max-w-[420px]">
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/gozolt-logo.png" alt="Gozolt" width={160} height={48} priority />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-white">Admin Portal</h1>
          <p className="text-sm text-[#6B7280] mt-1">Secure authentication required</p>
        </div>

        {/* Lockout Banner */}
        {isLocked && (
          <div className="mb-4 flex items-center gap-3 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3">
            <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-400">Account temporarily locked</p>
              <p className="text-xs text-red-400/70 mt-0.5">
                Too many failed attempts. Try again in {remainingLockTime}s
              </p>
            </div>
          </div>
        )}

        {/* Remaining Attempts Warning */}
        {showWarning && (
          <div className="mb-4 flex items-center gap-3 rounded-md border border-[#FACC15]/30 bg-[#FACC15]/10 px-4 py-3">
            <AlertTriangle className="h-5 w-5 text-[#FACC15] shrink-0" />
            <p className="text-sm text-[#FACC15]">
              {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining before lockout
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            <Input
              type="email"
              placeholder="admin@gozolt.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className="pl-10 pr-10 h-11 bg-[#0A0A0A] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20"
              disabled={submitting || isLocked}
            />
            {emailTouched && email.length > 0 && emailValid && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#22C55E]" />
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 8 Characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11 bg-[#0A0A0A] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20"
              disabled={submitting || isLocked}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-11 bg-[#FACC15] text-black font-semibold hover:bg-[#EAB308] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </span>
            ) : isLocked ? (
              `Locked (${remainingLockTime}s)`
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Footer Warning */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#6B7280]">
          <AlertTriangle className="h-3 w-3" />
          <span>Unauthorized access is monitored and recorded</span>
        </div>
      </div>
    </div>
  );
}
