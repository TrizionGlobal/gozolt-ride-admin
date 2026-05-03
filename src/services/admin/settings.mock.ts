import type {
  AdminUser,
  SystemConfigItem,
  LanguageConfig,
  Integration,
  FeeConfig,
} from './settings.types';

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'admin-uuid-001',
    firstName: 'John',
    lastName: 'attard',
    email: 'john@rideapp.mt',
    role: 'ADMIN',
    _adminRole: 'super_admin',
    totpEnabled: true,
    _lastLogin: '2024-01-15T14:30:00Z',
    status: 'ACTIVE',
    createdAt: '2023-06-01T00:00:00Z',
  },
  {
    id: 'admin-uuid-002',
    firstName: 'Maria',
    lastName: 'Borg',
    email: 'maria@rideapp.mt',
    role: 'ADMIN',
    _adminRole: 'admin',
    totpEnabled: true,
    _lastLogin: '2024-01-15T12:15:00Z',
    status: 'ACTIVE',
    createdAt: '2023-07-15T00:00:00Z',
  },
  {
    id: 'admin-uuid-003',
    firstName: 'Paul',
    lastName: 'vella',
    email: 'paul@rideapp.mt',
    role: 'ADMIN',
    _adminRole: 'admin',
    totpEnabled: false,
    _lastLogin: '2024-01-14T09:00:00Z',
    status: 'ACTIVE',
    createdAt: '2023-08-20T00:00:00Z',
  },
  {
    id: 'admin-uuid-004',
    firstName: 'Sarah',
    lastName: 'camilleri',
    email: 'sarah@rideapp.mt',
    role: 'ADMIN',
    _adminRole: 'viewer',
    totpEnabled: false,
    _lastLogin: '2024-01-14T09:00:00Z',
    status: 'ACTIVE',
    createdAt: '2023-09-10T00:00:00Z',
  },
];

export const mockSystemConfig: SystemConfigItem[] = [
  {
    key: 'maintenance_mode',
    title: 'Maintenance Mode',
    description: 'Disables all ride requests and shows maintenance page',
    icon: 'Wrench',
    type: 'toggle',
    value: false,
  },
  {
    key: 'rate_limiting',
    title: 'API Rate Limiting',
    description: '100req/min',
    icon: 'Zap',
    type: 'configure',
    value: '100req/min',
  },
  {
    key: 'websocket_heartbeat',
    title: 'WebSocket Heartbeat',
    description: '30s',
    icon: 'Radio',
    type: 'configure',
    value: '30s',
  },
  {
    key: 'background_jobs',
    title: 'Background Jobs',
    description: 'Running (12 active)',
    icon: 'Settings',
    type: 'configure',
    value: 'Running (12 active)',
  },
];

export const mockLanguageConfig: LanguageConfig = {
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'mt', 'it'],
};

export const mockIntegrations: Integration[] = [
  { id: 'int-1', name: 'Google Maps', icon: 'MapPin', status: 'connected' },
  { id: 'int-2', name: 'Stripe', icon: 'CreditCard', status: 'connected' },
  { id: 'int-3', name: 'Firebase', icon: 'Flame', status: 'connected' },
  { id: 'int-4', name: 'Twilio', icon: 'Phone', status: 'error' },
  { id: 'int-5', name: 'AWS SES', icon: 'Mail', status: 'connected' },
  { id: 'int-6', name: 'Sentry', icon: 'Bug', status: 'disconnected' },
];

export const mockFeeConfig: FeeConfig = {
  bookingFee: 1.50,
  cancellationFee: 4.00,
  waitTimeFeePerMin: 0.30,
  minimumFare: 6.00,
  _scheduledPremium: 1.50,
};
