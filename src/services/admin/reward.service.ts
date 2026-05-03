import { apiClient } from '@/lib/api-client';
import { mockRewardConfig } from './reward.mock';
import type { RewardConfig, UpdateRewardConfigPayload } from './reward.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const rewardService = {
  async getRewardConfig(): Promise<RewardConfig> {
    if (DEV_BYPASS) {
      await delay(300);
      return { ...mockRewardConfig };
    }
    const { data } = await apiClient.get<RewardConfig>('/admin/rewards/config');
    return data;
  },

  async updateRewardConfig(payload: UpdateRewardConfigPayload): Promise<RewardConfig> {
    if (DEV_BYPASS) {
      await delay(500);
      Object.assign(mockRewardConfig, payload);
      return { ...mockRewardConfig };
    }
    const { data } = await apiClient.patch<RewardConfig>('/admin/rewards/config', payload);
    return data;
  },
};
