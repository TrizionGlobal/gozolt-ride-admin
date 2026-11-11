'use client';

import React, { useState } from 'react';
import { Award, Pencil, X, Save, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { RewardConfig, UpdateRewardConfigPayload } from '@/services/admin/reward.types';
import { toast } from 'sonner';

interface MembershipTiersTableProps {
  config: RewardConfig;
  saving?: boolean;
  onSave?: (payload: UpdateRewardConfigPayload) => Promise<boolean | undefined>;
}

export function MembershipTiersTable({ config, saving = false, onSave }: MembershipTiersTableProps) {
  const pointsPerEuro = config.pointsPerEuro ?? 1;
  const silverThreshold = config.silverThreshold ?? 101;
  const goldThreshold = config.goldThreshold ?? 251;
  const platinumThreshold = config.platinumThreshold ?? 501;

  const bronzeRate = Number(config.bronzeRedemptionRate ?? config.tierRedemptionRates?.BRONZE ?? 1.0);
  const silverRate = Number(config.silverRedemptionRate ?? config.tierRedemptionRates?.SILVER ?? 3.0);
  const goldRate = Number(config.goldRedemptionRate ?? config.tierRedemptionRates?.GOLD ?? 5.0);
  const platinumRate = Number(config.platinumRedemptionRate ?? config.tierRedemptionRates?.PLATINUM ?? 7.0);

  const [isEditing, setIsEditing] = useState(false);
  const [editThresholds, setEditThresholds] = useState({
    silver: silverThreshold,
    gold: goldThreshold,
    platinum: platinumThreshold,
  });
  const [editRates, setEditRates] = useState({
    bronze: bronzeRate,
    silver: silverRate,
    gold: goldRate,
    platinum: platinumRate,
  });

  const handleEditClick = () => {
    setEditThresholds({
      silver: silverThreshold,
      gold: goldThreshold,
      platinum: platinumThreshold,
    });
    setEditRates({
      bronze: bronzeRate,
      silver: silverRate,
      gold: goldRate,
      platinum: platinumRate,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!onSave) return;
    const payload: UpdateRewardConfigPayload = {
      silverThreshold: editThresholds.silver,
      goldThreshold: editThresholds.gold,
      platinumThreshold: editThresholds.platinum,
      bronzeRedemptionRate: editRates.bronze,
      silverRedemptionRate: editRates.silver,
      goldRedemptionRate: editRates.gold,
      platinumRedemptionRate: editRates.platinum,
    };

    const success = await onSave(payload);
    if (success) {
      toast.success('Membership tier rules updated successfully');
      setIsEditing(false);
    }
  };

  const tierRows = [
    {
      key: 'BRONZE',
      name: 'Bronze',
      badgeLetter: 'B',
      color: '#CD7F32',
      badgeBg: 'rgba(205, 127, 50, 0.15)',
      badgeText: '#CD7F32',
      minBookings: 0,
      minBookingsLabel: '0 bookings (Starting tier)',
      isBase: true,
      rate: bronzeRate,
      perCoin: bronzeRate / 100,
    },
    {
      key: 'SILVER',
      name: 'Silver',
      badgeLetter: 'S',
      color: '#C0C0C0',
      badgeBg: 'rgba(192, 192, 192, 0.15)',
      badgeText: '#E5E7EB',
      minBookings: silverThreshold,
      minBookingsLabel: `${silverThreshold} completed bookings`,
      isBase: false,
      rate: silverRate,
      perCoin: silverRate / 100,
    },
    {
      key: 'GOLD',
      name: 'Gold',
      badgeLetter: 'G',
      color: '#FACC15',
      badgeBg: 'rgba(250, 204, 21, 0.15)',
      badgeText: '#FACC15',
      minBookings: goldThreshold,
      minBookingsLabel: `${goldThreshold} completed bookings`,
      isBase: false,
      rate: goldRate,
      perCoin: goldRate / 100,
    },
    {
      key: 'PLATINUM',
      name: 'Platinum',
      badgeLetter: 'P',
      color: '#A855F7',
      badgeBg: 'rgba(168, 85, 247, 0.15)',
      badgeText: '#C084FC',
      minBookings: platinumThreshold,
      minBookingsLabel: `${platinumThreshold} completed bookings`,
      isBase: false,
      rate: platinumRate,
      perCoin: platinumRate / 100,
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
          <p className="text-xs text-[#9CA3AF] mt-1">
            Qualifying bookings apply across all 5 services: Cabs, Car Rentals, Bike Rentals, Airport Transfers & Quick Services
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSave && (
            isEditing ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={saving}
                  className="h-8 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A]"
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="h-8 text-xs bg-[#FACC15] text-black hover:bg-[#E5B800] font-medium"
                >
                  <Save className="mr-1 h-3.5 w-3.5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={handleEditClick}
                className="h-8 text-xs bg-[#FACC15] text-black hover:bg-[#E5B800] font-medium"
              >
                <Pencil className="mr-1 h-3.5 w-3.5" />
                Edit Tiers
              </Button>
            )
          )}
          <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-transparent font-medium text-xs px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] mr-1.5 animate-pulse" />
            Live Synced
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
                Qualifying Bookings
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-3.5">
                Earning Rate
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-3.5">
                Redemption Rate
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-3.5">
                Value per Coin
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-3.5 text-right pr-5">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tierRows.map((t) => {
              const currentRate = isEditing
                ? t.key === 'BRONZE' ? editRates.bronze
                  : t.key === 'SILVER' ? editRates.silver
                  : t.key === 'GOLD' ? editRates.gold
                  : editRates.platinum
                : t.rate;

              const currentPerCoin = currentRate / 100;

              return (
                <TableRow
                  key={t.key}
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
                        {t.badgeLetter}
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
                          {t.isBase ? 'Default User Tier' : `Tier ${t.key}`}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Qualifying Bookings */}
                  <TableCell className="py-4">
                    {isEditing && !t.isBase ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="1"
                          min="1"
                          value={
                            t.key === 'SILVER'
                              ? editThresholds.silver
                              : t.key === 'GOLD'
                              ? editThresholds.gold
                              : editThresholds.platinum
                          }
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (t.key === 'SILVER') setEditThresholds((p) => ({ ...p, silver: val }));
                            if (t.key === 'GOLD') setEditThresholds((p) => ({ ...p, gold: val }));
                            if (t.key === 'PLATINUM') setEditThresholds((p) => ({ ...p, platinum: val }));
                          }}
                          className="w-20 h-8 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-2 text-sm text-white text-right focus:border-[#FACC15] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs text-[#9CA3AF]">bookings</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {t.isBase ? '0 bookings' : `${t.minBookings} bookings`}
                        </span>
                        <span className="text-xs text-[#6B7280]">
                          {t.isBase ? 'Activated on signup' : `From booking #${t.minBookings} onwards`}
                        </span>
                      </div>
                    )}
                  </TableCell>

                  {/* Earning Rate */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-[#FACC15]" />
                      <span className="text-sm font-medium text-white">
                        {pointsPerEuro} {pointsPerEuro === 1 ? 'GoCoin' : 'GoCoins'} / €1
                      </span>
                    </div>
                    <span className="text-xs text-[#6B7280]">All 5 services</span>
                  </TableCell>

                  {/* Redemption Rate */}
                  <TableCell className="py-4">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-[#22C55E] font-semibold">€</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0.1"
                          value={currentRate}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            if (t.key === 'BRONZE') setEditRates((p) => ({ ...p, bronze: val }));
                            if (t.key === 'SILVER') setEditRates((p) => ({ ...p, silver: val }));
                            if (t.key === 'GOLD') setEditRates((p) => ({ ...p, gold: val }));
                            if (t.key === 'PLATINUM') setEditRates((p) => ({ ...p, platinum: val }));
                          }}
                          className="w-20 h-8 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-2 text-sm text-white text-right focus:border-[#22C55E] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs text-[#9CA3AF]">/ 100 coins</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#22C55E]">
                          100 Coins = €{currentRate.toFixed(2)}
                        </span>
                        <span className="text-xs text-[#6B7280]">Tier-based rate</span>
                      </div>
                    )}
                  </TableCell>

                  {/* Value per Coin */}
                  <TableCell className="py-4">
                    <span className="text-sm font-medium text-[#22C55E]">
                      €{currentPerCoin.toFixed(2)}{' '}
                      <span className="text-xs text-[#6B7280] font-normal">/ coin</span>
                    </span>
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
    </div>
  );
}
