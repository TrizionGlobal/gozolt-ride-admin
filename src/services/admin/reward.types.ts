// --- Reward config ---
export interface RewardConfig {
  pointsPerRide: number;
  pointsPerEuro: number;
  euroPerPoint: number;
  silverThreshold: number;
  goldThreshold: number;
  platinumThreshold: number;
}

// --- Update DTO ---
export interface UpdateRewardConfigPayload {
  pointsPerRide?: number;
  pointsPerEuro?: number;
  euroPerPoint?: number;
  silverThreshold?: number;
  goldThreshold?: number;
  platinumThreshold?: number;
}

// --- Field config for rendering ---
export interface RewardFieldConfig {
  key: keyof UpdateRewardConfigPayload;
  label: string;
  unit: string;
  step?: string;
}

export const POINT_EARNING_FIELDS: RewardFieldConfig[] = [
  { key: 'pointsPerRide', label: 'Points per Ride', unit: 'pts', step: '1' },
  { key: 'pointsPerEuro', label: 'Points per € Spent', unit: 'pts/€', step: '1' },
  { key: 'euroPerPoint', label: 'Value per Point', unit: '€', step: '0.01' },
];

export interface TierFieldConfig {
  key: keyof UpdateRewardConfigPayload;
  label: string;
  dotColor: string;
  labelColor: string;
  unit: string;
}

export const TIER_THRESHOLD_FIELDS: TierFieldConfig[] = [
  { key: 'silverThreshold', label: 'Silver', dotColor: '#9CA3AF', labelColor: 'text-[#9CA3AF]', unit: 'pts' },
  { key: 'goldThreshold', label: 'Gold', dotColor: '#FACC15', labelColor: 'text-[#FACC15]', unit: 'pts' },
  { key: 'platinumThreshold', label: 'Platinum', dotColor: '#A855F7', labelColor: 'text-[#A855F7]', unit: 'pts' },
];
