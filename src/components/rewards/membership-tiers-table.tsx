'use client';

import React from 'react';
import { Award, CheckCircle2, ShieldCheck, Sparkles, TrendingUp, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { RewardConfig } from '@/services/admin/reward.types';

interface MembershipTiersTableProps {
  config: RewardConfig;
}

export function MembershipTiersTable({ config }: MembershipTiersTableProps) {
  const pointsPerEuro = config.pointsPerEuro ?? 1;
  const euroPerPoint = config.euroPerPoint ?? 0.01;
  const silverThreshold = config.silverThreshold ?? 26;
  const goldThreshold = config.goldThreshold ?? 51;
  const platinumThreshold = config.platinumThreshold ?? 101;
  const minRedeemCoins = config.minRedeemCoins ?? 200;

  // Derive dynamic tier data matching the live user app rules
  const tiers = config.tiers && config.tiers.length > 0 ? config.tiers : [
    {
      tier: 'BRONZE',
      name: 'Bronze',
      minRides: 0,
      color: '#CD7F32',
      badgeBg: 'rgba(205, 127, 50, 0.15)',
      badgeText: '#CD7F32',
      earningRate: `Earn ${pointsPerEuro} coin for every €1 spent`,
      redemptionRate: `100 Coins = €${(euroPerPoint * 100).toFixed(2)}`,
      benefits: [
        `Earn ${pointsPerEuro} coin for every €1 spent`,
        'Bronze loyalty status',
        `Redemption rate: 100 Coins = €${(euroPerPoint * 100).toFixed(2)}`,
      ],
    },
    {
      tier: 'SILVER',
      name: 'Silver',
      minRides: silverThreshold,
      color: '#C0C0C0',
      badgeBg: 'rgba(192, 192, 192, 0.15)',
      badgeText: '#E5E7EB',
      earningRate: `Earn ${pointsPerEuro} coin for every €1 spent`,
      redemptionRate: `100 Coins = €${(euroPerPoint * 100).toFixed(2)}`,
      benefits: [
        `Earn ${pointsPerEuro} coin for every €1 spent`,
        'Silver loyalty status',
        `Redemption rate: 100 Coins = €${(euroPerPoint * 100).toFixed(2)}`,
      ],
    },
    {
      tier: 'GOLD',
      name: 'Gold',
      minRides: goldThreshold,
      color: '#FACC15',
      badgeBg: 'rgba(250, 204, 21, 0.15)',
      badgeText: '#FACC15',
      earningRate: `Earn ${pointsPerEuro} coin for every €1 spent`,
      redemptionRate: `100 Coins = €${(euroPerPoint * 100).toFixed(2)}`,
      benefits: [
        `Earn ${pointsPerEuro} coin for every €1 spent`,
        'Gold loyalty status',
        `Redemption rate: 100 Coins = €${(euroPerPoint * 100).toFixed(2)}`,
      ],
    },
    {
      tier: 'PLATINUM',
      name: 'Platinum',
      minRides: platinumThreshold,
      color: '#A855F7',
      badgeBg: 'rgba(168, 85, 247, 0.15)',
      badgeText: '#C084FC',
      earningRate: `Earn ${pointsPerEuro} coin for every €1 spent`,
      redemptionRate: `100 Coins = €${(euroPerPoint * 100).toFixed(2)}`,
      benefits: [
        `Earn ${pointsPerEuro} coin for every €1 spent`,
        'Platinum loyalty status',
        `Redemption rate: 100 Coins = €${(euroPerPoint * 100).toFixed(2)}`,
      ],
    },
  ];

  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden shadow-sm">
      {/* Table Header / Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-[#2A2A2A]">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#FACC15]" />
            <h2 className="text-lg font-semibold text-white">Membership Tiers & Rules Matrix</h2>
          </div>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Live tier qualification, earning ratios, and redemption rates synchronized with the User App
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-transparent font-medium text-xs px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] mr-1.5 animate-pulse" />
            Live Synced
          </Badge>
          <Badge className="bg-[#1F1F1F] text-[#9CA3AF] border-[#2A2A2A] font-medium text-xs px-2.5 py-1">
            4 Loyalty Tiers
          </Badge>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#1A1A1A]/60">
            <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-3.5 pl-5">
                Tier Level
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-3.5">
                Qualification Requirement
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-3.5">
                Earning Rate
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-3.5">
                Redemption Rate
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-3.5">
                Key Benefits & Perks
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-3.5 text-right pr-5">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers.map((t) => {
              const isBase = t.minRides === 0;
              return (
                <TableRow
                  key={t.tier}
                  className="border-b border-[#2A2A2A]/40 hover:bg-[#1A1A1A]/40 transition-colors"
                >
                  {/* Tier Name & Badge */}
                  <TableCell className="py-4 pl-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border"
                        style={{
                          backgroundColor: t.badgeBg,
                          borderColor: `${t.color}40`,
                          color: t.badgeText,
                        }}
                      >
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white text-sm">
                            {t.name}
                          </span>
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: t.color }}
                          />
                        </div>
                        <span className="text-xs text-[#6B7280]">
                          {isBase ? 'Default User Tier' : `Tier ${t.tier}`}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Qualification Requirement */}
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {isBase ? '0 completed rides' : `${t.minRides} completed rides`}
                      </span>
                      <span className="text-xs text-[#6B7280] mt-0.5">
                        {isBase
                          ? 'Activated immediately upon signup'
                          : `Unlocks from ride #${t.minRides} onwards`}
                      </span>
                    </div>
                  </TableCell>

                  {/* Earning Rate */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-[#FACC15]" />
                      <span className="text-sm font-medium text-white">
                        {pointsPerEuro} {pointsPerEuro === 1 ? 'GoCoin' : 'GoCoins'} / €1
                      </span>
                    </div>
                    <span className="text-xs text-[#6B7280]">
                      Applicable on all 5 services
                    </span>
                  </TableCell>

                  {/* Redemption Rate */}
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#22C55E]">
                        100 Coins = €{(euroPerPoint * 100).toFixed(2)}
                      </span>
                      <span className="text-xs text-[#6B7280] mt-0.5">
                        Flat rate across all tiers
                      </span>
                    </div>
                  </TableCell>

                  {/* Key Benefits */}
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1 max-w-md">
                      {t.benefits && t.benefits.length > 0 ? (
                        t.benefits.map((b, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-[#D1D5DB]">
                            <CheckCircle2
                              className="h-3.5 w-3.5 shrink-0"
                              style={{ color: t.color }}
                            />
                            <span>{b}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-[#D1D5DB]">
                          <CheckCircle2
                            className="h-3.5 w-3.5 shrink-0 text-[#22C55E]"
                          />
                          <span>Earn 1 coin for every €1 spent</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-4 text-right pr-5">
                    <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-transparent font-medium text-xs">
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Program Summary Footer */}
      <div className="p-4 bg-[#0F0F0F] border-t border-[#2A2A2A] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#9CA3AF]">
        <div className="flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-[#FACC15] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white block mb-0.5">Universal Earning</span>
            <span>Earns 1 GoCoin per €1 spent across Cabs, Car Rentals, Bike Rentals, Airport Transfers & Quick Services.</span>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-[#22C55E] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white block mb-0.5">Transparent Redemption</span>
            <span>Default rate is 100 GoCoins = €1.00 wallet credit. Minimum redemption threshold is {minRedeemCoins} GoCoins.</span>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-[#60A5FA] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white block mb-0.5">Activity & Expiry</span>
            <span>Tiers upgrade automatically after reaching qualifying rides. Coins expire after 6 months of account inactivity.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

