'use client';

import type { ZoneRules } from '@/services/admin/surge.types';

interface SurgeZoneRulesProps {
  rules: ZoneRules;
}

export function SurgeZoneRules({ rules }: SurgeZoneRulesProps) {
  return (
    <div className="rounded-md border border-[#2A2A2A] bg-[#0A0A0A] p-4 mt-3">
      <p className="text-sm font-medium text-white mb-2">Zone Rules</p>
      <ul className="space-y-1.5 text-sm text-[#9CA3AF]">
        <li className="flex items-start gap-2">
          <span className="text-[#6B7280] mt-1">·</span>
          Surge multiplier: {rules.surgeMultiplier}
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#6B7280] mt-1">·</span>
          Min drivers before surge: {rules.minDrivers}
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#6B7280] mt-1">·</span>
          Max multiplier cap: {rules.maxCap}x
        </li>
      </ul>
    </div>
  );
}
