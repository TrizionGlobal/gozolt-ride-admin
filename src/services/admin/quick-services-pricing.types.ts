export interface QuickServicePricingRule {
  id: string;
  serviceKey: string;
  minHourlyRate: number;
  upfrontFee: number;
  materialCost: number;
  pickupFee: number;
  estimatedSparePrice: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateQuickServicePricingDto {
  minHourlyRate?: number;
  upfrontFee?: number;
  materialCost?: number;
  pickupFee?: number;
  estimatedSparePrice?: string | null;
}
