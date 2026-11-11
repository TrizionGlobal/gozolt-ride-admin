'use client';

import React, { useState } from 'react';
import { TrendingUp, Coins, Award, Layers, Pencil, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RewardConfig, UpdateRewardConfigPayload } from '@/services/admin/reward.types';
import { toast } from 'sonner';

interface GoCoinsRulesHeaderProps {
  config: RewardConfig;
  saving?: boolean;
  onSave: (payload: UpdateRewardConfigPayload) => Promise<boolean | undefined>;
}

export function GoCoinsRulesHeader({
  config,
  saving = false,
  onSave,
}: GoCoinsRulesHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    pointsPerEuro: config.pointsPerEuro ?? 1,
    minRedeemCoins: config.minRedeemCoins ?? 200,
    pointsPerRide: config.pointsPerRide ?? 0,
  });

  const handleEditClick = () => {
    setEditValues({
      pointsPerEuro: config.pointsPerEuro ?? 1,
      minRedeemCoins: config.minRedeemCoins ?? 200,
      pointsPerRide: config.pointsPerRide ?? 0,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    const payload: UpdateRewardConfigPayload = {
      pointsPerEuro: editValues.pointsPerEuro,
      minRedeemCoins: editValues.minRedeemCoins,
      pointsPerRide: editValues.pointsPerRide,
    };

    const success = await onSave(payload);
    if (success) {
      toast.success('GoCoins platform rules updated successfully');
      setIsEditing(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 shadow-sm space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-[#FACC15]" />
          <div>
            <h2 className="text-base font-semibold text-white">GoCoins Platform Rules</h2>
            <p className="text-xs text-[#9CA3AF]">
              Global earning rates and redemption thresholds applicable platform-wide
            </p>
          </div>
        </div>

        {isEditing ? (
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
              {saving ? 'Saving...' : 'Save Rules'}
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={handleEditClick}
            className="h-8 text-xs bg-[#FACC15] text-black hover:bg-[#E5B800] font-medium"
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Edit Rules
          </Button>
        )}
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Earning Rate */}
        <div className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#9CA3AF]">GoCoins per € Spent</span>
            <div className="w-8 h-8 rounded-lg bg-[#FACC15]/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-[#FACC15]" />
            </div>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1.5 mt-1">
              <input
                type="number"
                step="1"
                min="1"
                value={editValues.pointsPerEuro}
                onChange={(e) =>
                  setEditValues((p) => ({ ...p, pointsPerEuro: parseInt(e.target.value) || 0 }))
                }
                className="w-20 h-8 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-2 text-sm text-white text-right focus:border-[#FACC15] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-xs text-[#9CA3AF]">coin / €</span>
            </div>
          ) : (
            <div className="text-xl font-bold text-white mt-1">
              {config.pointsPerEuro ?? 1}{' '}
              <span className="text-xs font-normal text-[#9CA3AF]">coin / €</span>
            </div>
          )}
          <span className="text-[11px] text-[#6B7280] mt-2">Earned on all completed bookings</span>
        </div>

        {/* Card 2: Min Redemption */}
        <div className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#9CA3AF]">Minimum to Redeem</span>
            <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
              <Coins className="h-4 w-4 text-[#22C55E]" />
            </div>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1.5 mt-1">
              <input
                type="number"
                step="10"
                min="0"
                value={editValues.minRedeemCoins}
                onChange={(e) =>
                  setEditValues((p) => ({ ...p, minRedeemCoins: parseInt(e.target.value) || 0 }))
                }
                className="w-20 h-8 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-2 text-sm text-white text-right focus:border-[#22C55E] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-xs text-[#9CA3AF]">coins</span>
            </div>
          ) : (
            <div className="text-xl font-bold text-white mt-1">
              {config.minRedeemCoins ?? 200}{' '}
              <span className="text-xs font-normal text-[#9CA3AF]">coins</span>
            </div>
          )}
          <span className="text-[11px] text-[#6B7280] mt-2">Minimum wallet credit threshold</span>
        </div>

        {/* Card 3: Base Coins per Ride */}
        <div className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#9CA3AF]">Base Coins per Ride</span>
            <div className="w-8 h-8 rounded-lg bg-[#60A5FA]/10 flex items-center justify-center">
              <Award className="h-4 w-4 text-[#60A5FA]" />
            </div>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1.5 mt-1">
              <input
                type="number"
                step="1"
                min="0"
                value={editValues.pointsPerRide}
                onChange={(e) =>
                  setEditValues((p) => ({ ...p, pointsPerRide: parseInt(e.target.value) || 0 }))
                }
                className="w-20 h-8 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-2 text-sm text-white text-right focus:border-[#60A5FA] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-xs text-[#9CA3AF]">coins</span>
            </div>
          ) : (
            <div className="text-xl font-bold text-white mt-1">
              {config.pointsPerRide ?? 0}{' '}
              <span className="text-xs font-normal text-[#9CA3AF]">coins</span>
            </div>
          )}
          <span className="text-[11px] text-[#6B7280] mt-2">Flat bonus awarded on completion</span>
        </div>

        {/* Card 4: Qualifying Scope */}
        <div className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#9CA3AF]">Qualifying Services</span>
            <div className="w-8 h-8 rounded-lg bg-[#A855F7]/10 flex items-center justify-center">
              <Layers className="h-4 w-4 text-[#A855F7]" />
            </div>
          </div>
          <div className="text-base font-bold text-white mt-1">
            All 5 Services
          </div>
          <span className="text-[11px] text-[#6B7280] mt-2">Cabs, Rentals, Bikes, Transfers & QS</span>
        </div>
      </div>
    </div>
  );
}

