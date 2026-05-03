// --- Enums ---
export type NotificationChannel = 'PUSH' | 'EMAIL' | 'SMS' | 'IN_APP';
export type CampaignAudience = 'ALL' | 'ALL_USERS' | 'ALL_DRIVERS' | 'ALL_SUPPLIERS' | 'SPECIFIC_USERS';
export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED' | 'CANCELLED';
export type NotificationType = 'SYSTEM' | 'PROMOTION' | 'PAYMENT' | 'DOCUMENT_EXPIRY' | 'RIDE_UPDATE' | 'GENERAL';

export type ChannelTab = 'all' | 'push' | 'email' | 'sms' | 'in_app' | 'scheduled';

// --- Campaign ---
export interface NotificationCampaign {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  channels: NotificationChannel[];
  targetAudience: CampaignAudience;
  targetUserIds: string[];
  targetRoles: string[];
  status: CampaignStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  failedCount: number;
  data: Record<string, unknown> | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// --- Create payload ---
export interface CreateCampaignPayload {
  title: string;
  body: string;
  type: NotificationType;
  channels: NotificationChannel[];
  targetAudience: CampaignAudience;
  targetUserIds?: string[];
  scheduledAt: string | null;
}

// --- Stats ---
export interface NotificationStats {
  sentToday: number;
  pushDeliveryRate: number;
  emailOpenRate: number;
  scheduledCount: number;
}

// --- Channel badge ---
const SINGLE_CHANNEL_BADGE: Record<NotificationChannel, { label: string; color: string }> = {
  PUSH: { label: 'Push', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  EMAIL: { label: 'Email', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  SMS: { label: 'SMS', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  IN_APP: { label: 'In App', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
};

export function getChannelBadge(channels: NotificationChannel[]): { label: string; color: string } {
  if (channels.length === 1) return SINGLE_CHANNEL_BADGE[channels[0]];
  const label = channels.map((c) => SINGLE_CHANNEL_BADGE[c]?.label).join(' + ');
  if (channels.includes('PUSH') && channels.includes('EMAIL'))
    return { label, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
  if (channels.includes('PUSH') && channels.includes('IN_APP'))
    return { label, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
  if (channels.includes('EMAIL') && channels.includes('IN_APP'))
    return { label, color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' };
  return { label, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
}

// --- Status badge ---
export const CAMPAIGN_STATUS_STYLES: Record<CampaignStatus, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-gray-500/20 text-gray-400' },
  SCHEDULED: { label: 'Scheduled', color: 'bg-yellow-500/20 text-yellow-400' },
  SENDING: { label: 'Sending', color: 'bg-blue-500/20 text-blue-400' },
  SENT: { label: 'Sent', color: 'bg-green-500/20 text-green-400' },
  FAILED: { label: 'Failed', color: 'bg-red-500/20 text-red-400' },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-500/20 text-gray-400' },
};

// --- Audience display ---
export const AUDIENCE_DISPLAY: Record<CampaignAudience, string> = {
  ALL: 'All',
  ALL_USERS: 'All User',
  ALL_DRIVERS: 'All Drivers',
  ALL_SUPPLIERS: 'All Suppliers',
  SPECIFIC_USERS: 'Specific Users',
};

export function getAudienceDisplay(campaign: NotificationCampaign): string {
  if (campaign.targetAudience === 'SPECIFIC_USERS') {
    const count = campaign.targetUserIds?.length || campaign.sentCount;
    const roleLabel =
      campaign.targetRoles?.[0] === 'DRIVER'
        ? 'Drivers'
        : campaign.targetRoles?.[0] === 'SUPPLIER'
          ? 'Suppliers'
          : 'Users';
    return `${count} ${roleLabel}`;
  }
  return AUDIENCE_DISPLAY[campaign.targetAudience] || campaign.targetAudience;
}

// --- Campaign icon ---
export function getCampaignIconConfig(title: string): { icon: string; color: string } {
  const t = title.toLowerCase();
  if (t.includes('surge') || t.includes('warning') || t.includes('alert'))
    return { icon: 'AlertTriangle', color: 'text-yellow-400 bg-yellow-500/20' };
  if (t.includes('earning') || t.includes('payment') || t.includes('promo') || t.includes('payout'))
    return { icon: 'Euro', color: 'text-green-400 bg-green-500/20' };
  if (t.includes('document') || t.includes('expir'))
    return { icon: 'FileText', color: 'text-yellow-400 bg-yellow-500/20' };
  if (t.includes('maintenance') || t.includes('service'))
    return { icon: 'Wrench', color: 'text-gray-400 bg-gray-500/20' };
  if (t.includes('rating'))
    return { icon: 'AlertTriangle', color: 'text-red-400 bg-red-500/20' };
  return { icon: 'Bell', color: 'text-blue-400 bg-blue-500/20' };
}

// --- Tab config ---
export interface ChannelTabConfig {
  key: ChannelTab;
  label: string;
  hasIndicator: boolean;
}

export const CHANNEL_TABS: ChannelTabConfig[] = [
  { key: 'all', label: 'All', hasIndicator: false },
  { key: 'push', label: 'Push', hasIndicator: false },
  { key: 'email', label: 'Email', hasIndicator: false },
  { key: 'sms', label: 'SMS', hasIndicator: false },
  { key: 'in_app', label: 'In-App', hasIndicator: false },
  { key: 'scheduled', label: 'Scheduled', hasIndicator: true },
];

// --- Audience options for compose ---
export const AUDIENCE_OPTIONS: { value: CampaignAudience; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ALL_USERS', label: 'All Users' },
  { value: 'ALL_DRIVERS', label: 'All Drivers' },
  { value: 'ALL_SUPPLIERS', label: 'All Suppliers' },
  { value: 'SPECIFIC_USERS', label: 'Specific Users' },
];

// --- Channel options for compose ---
export const CHANNEL_OPTIONS: { value: NotificationChannel; label: string }[] = [
  { value: 'PUSH', label: 'Push' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'IN_APP', label: 'In-App' },
];
