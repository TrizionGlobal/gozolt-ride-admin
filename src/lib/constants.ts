import {
  LayoutDashboard,
  Building2,
  Users,
  Car,
  UserCircle,
  FileCheck,
  MapPin,
  CreditCard,
  Zap,
  MessageSquare,
  BarChart3,
  Shield,
  DollarSign,
  FileText,
  Gift,
  Ticket,
  Bell,
  Settings,
  LogOut,
  Lock,
  Camera,
} from 'lucide-react';

export const ROUTES = {
  LOGIN: '/login',
  VERIFY_2FA: '/verify-2fa',
  DASHBOARD: '/',
  SUPPLIER_MANAGEMENT: '/supplier-management',
  DRIVER_MANAGEMENT: '/driver-management',
  VEHICLE_MANAGEMENT: '/vehicle-management',
  USER_MANAGEMENT: '/user-management',
  DOCUMENT_REVIEW: '/document-review',
  // SELFIE_REVIEW: '/selfie-review',
  RIDE_MANAGEMENT: '/ride-management',
  PAYMENTS: '/payments',
  INVOICES: '/invoices',
  // SURGE_CONFIG: '/surge-config',
  // DISPUTES: '/disputes',
  ANALYTICS: '/analytics',
  // AUDIT_LOGS: '/audit-logs',
  // GDPR: '/gdpr',
  PRICING_RULES: '/pricing-rules',
  REWARDS: '/rewards',
  // PROMO_CODES: '/promo-codes',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
} as const;

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Supplier Management', href: ROUTES.SUPPLIER_MANAGEMENT, icon: Building2 },
  { label: 'Driver Management', href: ROUTES.DRIVER_MANAGEMENT, icon: Users },
  { label: 'Vehicle Management', href: ROUTES.VEHICLE_MANAGEMENT, icon: Car },
  { label: 'User Management', href: ROUTES.USER_MANAGEMENT, icon: UserCircle },
  { label: 'Document Review', href: ROUTES.DOCUMENT_REVIEW, icon: FileCheck },
  { label: 'Ride Management', href: ROUTES.RIDE_MANAGEMENT, icon: MapPin },
  { label: 'Payments', href: ROUTES.PAYMENTS, icon: CreditCard },
  { label: 'Invoices', href: ROUTES.INVOICES, icon: FileText },
  { label: 'Analytics', href: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: 'Pricing Rules', href: ROUTES.PRICING_RULES, icon: DollarSign },
  { label: 'Rewards', href: ROUTES.REWARDS, icon: Gift },
  { label: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: Bell },
  { label: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
] as const;

export const SIGNOUT_ITEM = {
  label: 'Sign Out',
  icon: LogOut,
} as const;

export const AUTH_COOKIE_NAME = 'gozolt-access-token';
export const REFRESH_COOKIE_NAME = 'gozolt-refresh-token';
