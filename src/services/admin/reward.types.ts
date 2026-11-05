// --- Tier Benefit Info for Tables ---
export interface TierBenefitInfo {
  tier: string;
  name: string;
  minRides: number;
  color: string;
  badgeBg: string;
  badgeText: string;
  earningRate: string;
  redemptionRate: string;
  benefits: string[];
}

// --- Reward config ---
export interface RewardConfig {
  pointsPerRide: number;
  pointsPerEuro: number;
  coinsPerEuro?: number;
  euroPerPoint: number;
  bronzeThreshold?: number;
  silverThreshold: number;
  goldThreshold: number;
  platinumThreshold: number;
  minRedeemCoins?: number;
  tiers?: TierBenefitInfo[];
}

// --- Update DTO ---
export interface UpdateRewardConfigPayload {
  pointsPerRide?: number;
  pointsPerEuro?: number;
  euroPerPoint?: number;
  bronzeThreshold?: number;
  silverThreshold?: number;
  goldThreshold?: number;
  platinumThreshold?: number;
  minRedeemCoins?: number;
}

// --- Field config for rendering ---
export interface RewardFieldConfig {
  key: keyof UpdateRewardConfigPayload;
  label: string;
  unit: string;
  step?: string;
  readOnly?: boolean;
}

export const POINT_EARNING_FIELDS: RewardFieldConfig[] = [
  { key: 'pointsPerEuro', label: 'GoCoins per € Spent', unit: 'coin/€', step: '1' },
  { key: 'euroPerPoint', label: 'Value per Coin', unit: '€', step: '0.01' },
  { key: 'minRedeemCoins', label: 'Minimum Coins to Redeem', unit: 'coins', step: '10' },
  { key: 'pointsPerRide', label: 'Base Coins per Ride', unit: 'coins', step: '1' },
];

export interface TierFieldConfig {
  key: keyof UpdateRewardConfigPayload;
  label: string;
  dotColor: string;
  labelColor: string;
  unit: string;
  readOnly?: boolean;
}

export const TIER_THRESHOLD_FIELDS: TierFieldConfig[] = [
  {
    key: 'bronzeThreshold',
    label: 'Bronze (Starting Tier)',
    dotColor: '#CD7F32',
    labelColor: 'text-[#CD7F32]',
    unit: 'rides',
    readOnly: true,
  },
  {
    key: 'silverThreshold',
    label: 'Silver',
    dotColor: '#C0C0C0',
    labelColor: 'text-[#E5E7EB]',
    unit: 'rides',
  },
  {
    key: 'goldThreshold',
    label: 'Gold',
    dotColor: '#FACC15',
    labelColor: 'text-[#FACC15]',
    unit: 'rides',
  },
  {
    key: 'platinumThreshold',
    label: 'Platinum',
    dotColor: '#A855F7',
    labelColor: 'text-[#C084FC]',
    unit: 'rides',
  },
];
