'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { hydrateFromSession } = useAuthStore();

  useEffect(() => {
    hydrateFromSession();
  }, [hydrateFromSession]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      {children}
    </div>
  );
}
