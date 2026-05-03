'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

export function TwoFactorForm() {
  const router = useRouter();
  const { verify2FA, isLoading } = useAuth();
  const twoFactorState = useAuthStore((s) => s.twoFactorState);

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no 2FA state
  useEffect(() => {
    if (!twoFactorState) {
      router.replace('/login');
    }
  }, [twoFactorState, router]);

  // Auto-focus first input
  useEffect(() => {
    if (!useBackupCode) {
      inputRefs.current[0]?.focus();
    }
  }, [useBackupCode]);

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;

      const newDigits = [...digits];
      newDigits[index] = value.slice(-1);
      setDigits(newDigits);

      // Auto-advance to next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all 6 digits are filled
      if (value && index === 5 && newDigits.every((d) => d !== '')) {
        handleSubmitCode(newDigits.join(''));
      }
    },
    [digits],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;

    const newDigits = [...Array(6)].map((_, i) => pasted[i] || '');
    setDigits(newDigits);

    // Focus the next empty input or last
    const nextEmpty = newDigits.findIndex((d) => d === '');
    const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if all digits pasted
    if (pasted.length === 6) {
      handleSubmitCode(pasted);
    }
  }, []);

  const handleSubmitCode = async (code: string) => {
    try {
      await verify2FA(code);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invalid code. Please try again.');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (useBackupCode) {
        if (!backupCode.trim()) return;
        await handleSubmitCode(backupCode.trim());
      } else {
        const code = digits.join('');
        if (code.length !== 6) return;
        await handleSubmitCode(code);
      }
    },
    [digits, backupCode, useBackupCode],
  );

  if (!twoFactorState) return null;

  return (
    <div className="w-full max-w-[420px]">
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/gozolt-logo.png" alt="Gozolt" width={160} height={48} priority />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-white">Admin Portal</h1>
        </div>

        {/* 2FA Banner */}
        <div className="rounded-lg border border-[#D4A843] bg-[#0A0A0A] p-4 mb-6">
          <h2 className="text-sm font-semibold text-white text-center">
            Two-Factor Authentication
          </h2>
          <p className="text-xs text-[#9CA3AF] text-center mt-1">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {useBackupCode ? (
            <Input
              type="text"
              placeholder="Enter backup code"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value)}
              className="h-11 bg-[#0A0A0A] border-[#2A2A2A] text-white text-center placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20"
              disabled={isLoading}
              autoFocus
            />
          ) : (
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                  className="w-11 h-13 text-center text-lg font-semibold rounded-md border border-[#2A2A2A] bg-[#0A0A0A] text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 disabled:opacity-50 transition-colors"
                />
              ))}
            </div>
          )}

          {/* Verify Button */}
          <Button
            type="submit"
            disabled={isLoading || (useBackupCode ? !backupCode.trim() : digits.some((d) => !d))}
            className="w-full h-11 bg-[#FACC15] text-black font-semibold hover:bg-[#EAB308] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify & Continue'
            )}
          </Button>
        </form>

        {/* Toggle backup code mode */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              setBackupCode('');
              setDigits(['', '', '', '', '', '']);
            }}
            className="text-sm text-[#FACC15] hover:text-[#EAB308] transition-colors"
          >
            {useBackupCode ? 'Use authenticator code instead' : 'Use backup code instead'}
          </button>
        </div>

        {/* Footer Warning */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#6B7280]">
          <AlertTriangle className="h-3 w-3" />
          <span>Unauthorized access is monitored and recorded</span>
        </div>
      </div>
    </div>
  );
}
