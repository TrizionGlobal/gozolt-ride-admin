import type { RewardConfig } from './reward.types';

export const mockRewardConfig: RewardConfig = {
  pointsPerRide: 10,
  pointsPerEuro: 2,
  euroPerPoint: 0.01,
  silverThreshold: 500,
  goldThreshold: 2000,
  platinumThreshold: 5000,
};
