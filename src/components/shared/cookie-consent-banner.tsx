'use client';

import { useState, useEffect } from 'react';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = sessionStorage.getItem('gozolt-cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2A2A2A] bg-[#141414] px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="text-sm text-[#9CA3AF]">
          <p className="font-medium text-white mb-1">Cookie Preferences</p>
          <p>We use essential cookies for the platform to function. Analytics and marketing cookies are optional.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => { sessionStorage.setItem('gozolt-cookie-consent', 'essential'); setVisible(false); }}
            className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-2 text-sm text-white hover:bg-[#1A1A1A] transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={() => { sessionStorage.setItem('gozolt-cookie-consent', 'all'); setVisible(false); }}
            className="rounded-lg bg-[#FACC15] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5B800] transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
