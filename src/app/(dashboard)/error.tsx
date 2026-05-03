'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error('[Dashboard Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-[#2A2A2A] bg-[#141414] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>

        <h2 className="text-lg font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-sm text-[#6B7280] mb-6">
          An unexpected error occurred while loading this page. Please try again.
        </p>

        {error.digest && (
          <p className="text-xs text-[#6B7280] mb-4 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md bg-[#FACC15] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#EAB308] transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
