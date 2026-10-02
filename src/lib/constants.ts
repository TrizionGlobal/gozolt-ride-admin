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
  Key,
} from 'lucide-react';

export const ROUTES = {
  LOGIN: '/login',
  VERIFY_2FA: '/verify-2fa',
  DASHBOARD: '/dashboard',
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
  CAR_RENTALS: '/car-rentals',
  BIKE_RENTALS: '/bike-rentals',

  AIRPORT_TRANSFERS_DASHBOARD:
    '/airport-transfers/dashboard',

  QUICK_SERVICES_DASHBOARD:
    '/quick-services/dashboard',
  QUICK_SERVICES_SUPPLIERS:
    '/quick-services/supplier-management',
  QUICK_SERVICES_USERS:
    '/quick-services/user-management',
  QUICK_SERVICES_BOOKINGS:
    '/quick-services/booking-management',
  QUICK_SERVICES_PAYMENTS:
    '/quick-services/payments',
  QUICK_SERVICES_PRICING_RULES:
    '/quick-services/pricing-rules',
  QUICK_SERVICES_ANALYTICS:
    '/quick-services/analytics',

  FOOD_GROCERIES_DASHBOARD:
    '/food-groceries/dashboard',
} as const;

export const CAB_SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Supplier Management', href: ROUTES.SUPPLIER_MANAGEMENT, icon: Building2 },
  { label: 'Driver Management', href: ROUTES.DRIVER_MANAGEMENT, icon: Users },
  { label: 'Vehicle Management', href: ROUTES.VEHICLE_MANAGEMENT, icon: Car },
  { label: 'User Management', href: ROUTES.USER_MANAGEMENT, icon: UserCircle },
  { label: 'Document Review', href: ROUTES.DOCUMENT_REVIEW, icon: FileCheck },
  { label: 'Ride Management', href: ROUTES.RIDE_MANAGEMENT, icon: MapPin },
  { label: 'Payments & Settlements', href: ROUTES.PAYMENTS, icon: CreditCard },
  { label: 'Invoices', href: ROUTES.INVOICES, icon: FileText },
  { label: 'Analytics', href: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: 'Pricing Rules', href: ROUTES.PRICING_RULES, icon: DollarSign },
  { label: 'Rewards', href: ROUTES.REWARDS, icon: Gift },
  { label: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: Bell },
  { label: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
] as const;

export const RENTAL_SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/car-rentals/dashboard', icon: LayoutDashboard },
  { label: 'Car Rentals', href: ROUTES.CAR_RENTALS, icon: Key },
  { label: 'Supplier Management', href: '/car-rentals/supplier-management', icon: Building2 },
  { label: 'Payments & Settlements', href: '/car-rentals/payments', icon: CreditCard },
  { label: 'Analytics', href: '/car-rentals/analytics', icon: BarChart3 },
] as const;

export const BIKE_RENTAL_SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/bike-rentals/dashboard', icon: LayoutDashboard },
  { label: 'Bike Rentals', href: ROUTES.BIKE_RENTALS, icon: Key },
  { label: 'Supplier Management', href: '/bike-rentals/supplier-management', icon: Building2 },
  { label: 'Payments & Settlements', href: '/bike-rentals/payments', icon: CreditCard },
  { label: 'Analytics', href: '/bike-rentals/analytics', icon: BarChart3 },
] as const;

export const AIRPORT_TRANSFER_SIDEBAR_ITEMS = [
  {
    label: 'Dashboard',
    href: ROUTES.AIRPORT_TRANSFERS_DASHBOARD,
    icon: LayoutDashboard,
  },
] as const;

export const QUICK_SERVICES_SIDEBAR_ITEMS = [
  {
    label: 'Dashboard',
    href: ROUTES.QUICK_SERVICES_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Supplier Management',
    href: ROUTES.QUICK_SERVICES_SUPPLIERS,
    icon: Building2,
  },
  {
    label: 'Booking Management',
    href: ROUTES.QUICK_SERVICES_BOOKINGS,
    icon: FileText,
  },
  {
    label: 'Payments & Settlements',
    href: ROUTES.QUICK_SERVICES_PAYMENTS,
    icon: CreditCard,
  },
  {
    label: 'Pricing Rules',
    href: ROUTES.QUICK_SERVICES_PRICING_RULES,
    icon: DollarSign,
  },
  {
    label: 'Analytics',
    href: ROUTES.QUICK_SERVICES_ANALYTICS,
    icon: BarChart3,
  },
] as const;

export const FOOD_GROCERY_SIDEBAR_ITEMS = [
  {
    label: 'Dashboard',
    href: ROUTES.FOOD_GROCERIES_DASHBOARD,
    icon: LayoutDashboard,
  },
] as const;

export const SIGNOUT_ITEM = {
  label: 'Sign Out',
  icon: LogOut,
} as const;

export const AUTH_COOKIE_NAME = 'gozolt-access-token';
export const REFRESH_COOKIE_NAME = 'gozolt-refresh-token';
