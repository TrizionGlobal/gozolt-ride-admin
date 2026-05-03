import type { VehicleType } from '@/types';

// --- Admin User ---
export type AdminRole = 'super_admin' | 'admin' | 'viewer';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN';
  _adminRole: AdminRole;
  totpEnabled: boolean;
  _lastLogin: string | null;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

// --- System Config ---
export type SystemConfigType = 'toggle' | 'configure';

export interface SystemConfigItem {
  key: string;
  title: string;
  description: string;
  icon: string;
  type: SystemConfigType;
  value: string | boolean;
}

// --- Language Config ---
export interface LanguageConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
}

export interface LanguageOption {
  code: string;
  label: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'mt', label: 'Maltese' },
  { code: 'it', label: 'Italian' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'es', label: 'Spanish' },
];

// --- Integration ---
export type IntegrationStatus = 'connected' | 'error' | 'disconnected';

export interface Integration {
  id: string;
  name: string;
  icon: string;
  status: IntegrationStatus;
  description?: string;
}

// --- Fee Config ---
export interface FeeConfig {
  bookingFee: number;
  cancellationFee: number;
  waitTimeFeePerMin: number;
  minimumFare: number;
  _scheduledPremium: number;
}

export interface FeeFieldConfig {
  key: keyof FeeConfig;
  label: string;
  description: string;
}

export const FEE_FIELDS: FeeFieldConfig[] = [
  { key: 'bookingFee', label: 'Booking Fee', description: 'Added to every ride' },
  { key: 'cancellationFee', label: 'Cancellation Fee', description: 'Charged after free window' },
  { key: 'waitTimeFeePerMin', label: 'Wait Time Fee', description: 'Per minute after arrival' },
  { key: 'minimumFare', label: 'Minimum Fare', description: 'Lowest possible fare' },
  { key: '_scheduledPremium', label: 'Scheduled Ride Premium', description: 'Added for pre-booked rides' },
];

// --- Vehicle type display ---
export const VEHICLE_TYPE_DISPLAY: Record<string, string> = {
  ECONOMY: 'Economy',
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
  XL: 'XL',
  ELECTRIC: 'Electric',
};

// --- Fare config table columns ---
export interface FareConfigColumn {
  key: 'baseFare' | 'perKmRate' | 'perMinuteRate' | 'minimumFare';
  label: string;
}

export const FARE_CONFIG_COLUMNS: FareConfigColumn[] = [
  { key: 'baseFare', label: 'BASE RATE' },
  { key: 'perKmRate', label: 'PER KM' },
  { key: 'perMinuteRate', label: 'PER MIN' },
  { key: 'minimumFare', label: 'MIN FARE' },
];

// --- Admin role display ---
export const ADMIN_ROLE_DISPLAY: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  viewer: 'Viewer',
};

export const ADMIN_ROLE_COLOR: Record<AdminRole, string> = {
  super_admin: 'bg-[#FACC15]/20 text-[#FACC15]',
  admin: 'bg-[#3B82F6]/20 text-[#3B82F6]',
  viewer: 'bg-[#6B7280]/20 text-[#9CA3AF]',
};

// --- Tab definitions ---
export type SettingsTab = 'fare-config' | 'fees' | 'admin-users' | 'system' | 'language' | 'integrations';

export interface SettingsTabConfig {
  id: SettingsTab;
  label: string;
}

export const SETTINGS_TABS: SettingsTabConfig[] = [
  { id: 'fare-config', label: 'Fare config' },
  { id: 'fees', label: 'Fees' },
  { id: 'admin-users', label: 'Admin Users' },
  { id: 'system', label: 'System' },
  { id: 'language', label: 'Language' },
  { id: 'integrations', label: 'Integrations' },
];
