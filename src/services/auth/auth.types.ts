import { Role } from '@/types';

export interface AdminLoginPayload {
  email: string;
  password: string;
  totpCode?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthSuccessResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  role: Role;
  user: AuthUser;
}

export interface AuthRequires2FAResponse {
  requiresTwoFactor: true;
  tempToken: string;
}

export type AuthResponse = AuthSuccessResponse | AuthRequires2FAResponse;

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface MessageResponse {
  message: string;
}

export function isAuthSuccess(response: AuthResponse): response is AuthSuccessResponse {
  return 'accessToken' in response;
}

export function isAuth2FA(response: AuthResponse): response is AuthRequires2FAResponse {
  return 'requiresTwoFactor' in response && response.requiresTwoFactor === true;
}
