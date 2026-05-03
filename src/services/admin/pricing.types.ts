import type { VehicleType } from '@/types';

// --- Pricing rule ---
export interface PricingRule {
  id: string;
  vehicleType: VehicleType;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  minimumFare: number;
  bookingFee: number;
  waitTimeFeePerMin: number;
  cancellationFee: number;
  cancellationWindowMins: number;
  createdAt: string;
  updatedAt: string;
}

// --- Update DTO ---
export interface UpdatePricingPayload {
  baseFare?: number;
  perKmRate?: number;
  perMinuteRate?: number;
  minimumFare?: number;
  bookingFee?: number;
  waitTimeFeePerMin?: number;
  cancellationFee?: number;
  cancellationWindowMins?: number;
}

// --- Field config for rendering ---
export interface PricingFieldConfig {
  key: keyof UpdatePricingPayload;
  label: string;
  unit: string;
}

export const FARE_RULE_FIELDS: PricingFieldConfig[] = [
  { key: 'baseFare', label: 'Base Fare', unit: '€' },
  { key: 'perKmRate', label: 'Per Km', unit: '€/km' },
  { key: 'perMinuteRate', label: 'Per Minute', unit: '€/m' },
  { key: 'minimumFare', label: 'Minimum Fare', unit: '€' },
  { key: 'bookingFee', label: 'Booking Fee', unit: '€' },
  { key: 'waitTimeFeePerMin', label: 'Wait Time / Min', unit: '€/m' },
];

export const CANCELLATION_FIELDS: PricingFieldConfig[] = [
  { key: 'cancellationFee', label: 'Cancellation Fee', unit: '€' },
  { key: 'cancellationWindowMins', label: 'Free Cancel Window', unit: 'min' },
];
