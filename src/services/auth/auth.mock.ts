import { Role } from '@/types';
import type { AuthSuccessResponse, AuthRequires2FAResponse } from './auth.types';

export const authMockData = {
  loginSuccess: {
    accessToken: 'mock-jwt-access-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    refreshToken: 'mock-refresh-a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    expiresIn: '15m',
    role: Role.ADMIN,
    user: {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      email: 'admin@gozolt.in',
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.ADMIN,
    },
  } satisfies AuthSuccessResponse,

  loginRequires2FA: {
    requiresTwoFactor: true as const,
    tempToken: 'mock-temp-token-for-2fa-verification',
  } satisfies AuthRequires2FAResponse,
};
