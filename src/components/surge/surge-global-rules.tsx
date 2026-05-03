'use client';

import { useState } from 'react';
import { Clock, Zap } from 'lucide-react';
import type { GlobalSurgeRules } from '@/services/admin/surge.types';

interface SurgeGlobalRulesProps {
  initialRules: GlobalSurgeRules;
}

export function SurgeGlobalRules({ initialRules }: SurgeGlobalRulesProps) {
  const [rules, setRules] = useState<GlobalSurgeRules>(initialRules);

  const updateThreshold = (index: number, field: 'ratioMin' | 'ratioMax' | 'multiplier', value: number) => {
    setRules((prev) => {
      const thresholds = [...prev.thresholds];
      thresholds[index] = { ...thresholds[index], [field]: value };
      return { ...prev, thresholds };
    });
  };

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Global Rules</h3>

      {/* Inline settings */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <Clock className="h-4 w-4 text-[#6B7280]" />
            Calculation Frequency
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={1}
              value={rules.calculationFrequency}
              onChange={(e) =>
                setRules((prev) => ({ ...prev, calculationFrequency: parseInt(e.target.value) || 30 }))
              }
              className="w-14 h-8 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-2 text-sm text-white text-center focus:border-[#FACC15] focus:outline-none"
            />
            <span className="text-xs text-[#6B7280]">sec</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <Zap className="h-4 w-4 text-[#6B7280]" />
            Max Surge Cap
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={1}
              value={rules.maxSurgeCap}
              onChange={(e) =>
                setRules((prev) => ({ ...prev, maxSurgeCap: parseInt(e.target.value) || 30 }))
              }
              className="w-14 h-8 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-2 text-sm text-white text-center focus:border-[#FACC15] focus:outline-none"
            />
            <span className="text-xs text-[#6B7280]">x</span>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-[#2A2A2A] my-3" />

      {/* Demand/Supply Thresholds */}
      <p className="text-xs text-[#6B7280] mb-2">Demand/Supply Thresholds</p>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A2A2A]">
            <th className="text-left text-xs text-[#6B7280] font-medium py-1.5 pr-2">
              Ratio
            </th>
            <th className="text-left text-xs text-[#6B7280] font-medium py-1.5">
              Multiplier
            </th>
          </tr>
        </thead>
        <tbody>
          {rules.thresholds.map((t, i) => (
            <tr key={i} className="border-b border-[#2A2A2A]/50">
              <td className="py-1.5 pr-2">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={t.ratioMin}
                    onChange={(e) => updateThreshold(i, 'ratioMin', parseFloat(e.target.value) || 0)}
                    className="w-12 h-7 rounded border border-[#2A2A2A] bg-[#0A0A0A] px-1.5 text-xs text-white text-center focus:border-[#FACC15] focus:outline-none"
                  />
                  <span className="text-xs text-[#6B7280]">–</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={t.ratioMax}
                    onChange={(e) => updateThreshold(i, 'ratioMax', parseFloat(e.target.value) || 0)}
                    className="w-12 h-7 rounded border border-[#2A2A2A] bg-[#0A0A0A] px-1.5 text-xs text-white text-center focus:border-[#FACC15] focus:outline-none"
                  />
                </div>
              </td>
              <td className="py-1.5">
                <span className="text-sm font-medium text-green-400">
                  {t.multiplier.toFixed(1)}x
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
