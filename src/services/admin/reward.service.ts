import { apiClient } from '@/lib/api-client';
import type { RewardConfig, UpdateRewardConfigPayload } from './reward.types';

export const rewardService = {
  async getRewardConfig(): Promise<RewardConfig> {
    try {
      const { data } = await apiClient.get<RewardConfig>('/admin/rewards/config');
      return data;
    } catch {
      return {
        pointsPerRide: 0,
        pointsPerEuro: 0,
        euroPerPoint: 0,
        silverThreshold: 0,
        goldThreshold: 0,
        platinumThreshold: 0,
      };
    }
  },

  async updateRewardConfig(payload: UpdateRewardConfigPayload): Promise<RewardConfig> {
    const { data } = await apiClient.patch<RewardConfig>('/admin/rewards/config', payload);
    return data;
  },
};
