'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Loader2, CheckCircle2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRateLimit } from '@/hooks/use-rate-limit';
import { sanitizeInput } from '@/lib/sanitize';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const MAX_RESET_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 300; // 5 minutes

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const { isLocked, remainingLockTime, attempt } = useRateLimit({
    key: 'gozolt_forgot_pw_rate_limit',
    maxAttempts: MAX_RESET_ATTEMPTS,
    lockoutDuration: LOCKOUT_SECONDS,
    windowDuration: LOCKOUT_SECONDS,
  });

  const canSubmit = isValidEmail(email) && !submitting && !isLocked;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      const allowed = attempt();
      if (!allowed) return;

      setSubmitting(true);
      if (DEV_BYPASS) {
        await new Promise((r) => setTimeout(r, 1000));
      }
      setSent(true);
      setSubmitting(false);
    },
    [canSubmit, attempt],
  );

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/gozolt-logo.png" alt="Gozolt" width={160} height={48} className="w-auto h-auto" priority />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-white">Reset Password</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            {sent ? 'Check your inbox' : 'Enter your email to receive a reset link'}
          </p>
        </div>

        {/* Lockout Banner */}
        {isLocked && !sent && (
          <div className="mb-4 flex items-center gap-3 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3">
            <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-400">Too many requests</p>
              <p className="text-xs text-red-400/70 mt-0.5">
                Please wait {formatTime(remainingLockTime)} before trying again
              </p>
            </div>
          </div>
        )}

        {sent ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-[#22C55E]" />
            </div>
            <p className="text-sm text-[#9CA3AF]">
              If an account exists with this email, a reset link has been sent.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-[#FACC15] hover:text-[#EAB308] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                type="email"
                placeholder="admin@gozolt.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 bg-[#0A0A0A] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20"
                disabled={submitting || isLocked}
              />
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
                  Sending...
                </span>
              ) : isLocked ? (
                `Locked (${formatTime(remainingLockTime)})`
              ) : (
                'Send Reset Link'
              )}
            </Button>

            {/* Back to login */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
