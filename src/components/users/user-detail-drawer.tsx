'use client';

import { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  CreditCard,
  Shield,
  Star,
  Calendar,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Gift,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { userService } from '@/services/admin/user.service';
import { getUserStatusDisplay } from '@/services/admin/user.types';
import type { UserDetail } from '@/services/admin/user.types';
import { toast } from 'sonner';

type Tab = 'overview' | 'rides' | 'payments' | 'gdpr';

interface UserDetailDrawerProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDrawer({ userId, open, onOpenChange }: UserDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId && open) {
      setLoading(true);
      setActiveTab('overview');
      userService
        .getUserDetail(userId)
        .then(setUser)
        .catch(() => toast.error('Failed to load user details'))
        .finally(() => setLoading(false));
    } else {
      setUser(null);
    }
  }, [userId, open]);

  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown User'
    : '';

  const statusDisplay = user ? getUserStatusDisplay(user.status) : null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <User className="h-3.5 w-3.5" /> },
    { key: 'rides', label: 'Rides', icon: <MapPin className="h-3.5 w-3.5" /> },
    { key: 'payments', label: 'Payments', icon: <CreditCard className="h-3.5 w-3.5" /> },
    { key: 'gdpr', label: 'GDPR', icon: <Shield className="h-3.5 w-3.5" /> },
  ];

  const handleExportData = async () => {
    if (!userId) return;
    try {
      const data = await userService.exportUserData(userId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_export_${userId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('User data exported successfully');
    } catch {
      toast.error('Failed to export user data');
    }
  };

  const handleDeleteAccount = () => {
    toast.info('Delete account request submitted (mock). Account will be reviewed for deletion.');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const rideStatusColor = (status: string) => {
    if (status === 'COMPLETED') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (status === 'CANCELLED') return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  const paymentStatusColor = (status: string) => {
    if (status === 'COMPLETED') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (status === 'REFUNDED') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (status === 'FAILED') return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-[#2A2A2A] text-white sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">
            {loading ? 'Loading...' : fullName}
          </DialogTitle>
          <DialogDescription className="text-[#6B7280]">
            {user ? `${user.email ?? 'No email'} | ${user.phone ?? 'No phone'}` : 'Loading user details...'}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#2A2A2A] pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-md transition-colors ${
                activeTab === tab.key
                  ? 'text-[#FACC15] border-b-2 border-[#FACC15] bg-[#1A1A1A]'
                  : 'text-[#6B7280] hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-1" style={{ maxHeight: 'calc(85vh - 180px)' }}>
          {loading && (
            <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
              Loading...
            </div>
          )}

          {!loading && user && activeTab === 'overview' && (
            <div className="space-y-4 py-2">
              {/* Status + Rating row */}
              <div className="flex items-center gap-3">
                {statusDisplay && (
                  <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium border ${statusDisplay.className}`}>
                    {statusDisplay.label}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-sm text-white">
                  <Star className="h-3.5 w-3.5 fill-[#FACC15] text-[#FACC15]" />
                  {user.avgRating.toFixed(1)}
                </span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <Mail className="h-3 w-3" /> Email
                  </div>
                  <p className="text-sm text-white truncate">{user.email ?? '---'}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <Phone className="h-3 w-3" /> Phone
                  </div>
                  <p className="text-sm text-white">{user.phone ?? '---'}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <MapPin className="h-3 w-3" /> Location
                  </div>
                  <p className="text-sm text-white">{user.city ?? '---'}, {user.country}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <Calendar className="h-3 w-3" /> Joined
                  </div>
                  <p className="text-sm text-white">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              {/* Addresses */}
              {user.addresses.length > 0 && (
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <p className="text-xs text-[#6B7280] mb-2">Saved Addresses</p>
                  <div className="space-y-1.5">
                    {user.addresses.map((addr, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-[#FACC15] font-medium w-12">{addr.label}</span>
                        <span className="text-xs text-[#9CA3AF]">{addr.address}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reward Account */}
              {user.rewardAccount && (
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-2">
                    <Gift className="h-3 w-3" /> Reward Account
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#FACC15] font-medium">{user.rewardAccount.tier}</span>
                    <span className="text-xs text-[#9CA3AF]">
                      {user.rewardAccount.currentPoints.toLocaleString()} / {user.rewardAccount.totalPoints.toLocaleString()} pts
                    </span>
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-white">{user._count.rides}</p>
                  <p className="text-xs text-[#6B7280]">Total Rides</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-white">{user._count.payments}</p>
                  <p className="text-xs text-[#6B7280]">Total Payments</p>
                </div>
              </div>
            </div>
          )}

          {!loading && user && activeTab === 'rides' && (
            <div className="py-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">ID</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Date</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Route</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Fare</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Tip</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.recentRides.map((ride) => (
                    <TableRow key={ride.id} className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50">
                      <TableCell className="text-xs text-[#9CA3AF] font-mono">{ride.displayId}</TableCell>
                      <TableCell className="text-xs text-[#9CA3AF]">{formatDate(ride.date)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-white truncate max-w-[140px]">{ride.pickup}</span>
                          <span className="text-xs text-[#6B7280] truncate max-w-[140px]">{ride.dropoff}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-white">&euro;{ride.fare.toFixed(2)}</TableCell>
                      <TableCell className="text-xs text-[#9CA3AF]">
                        {ride.tip !== null ? `\u20AC${ride.tip.toFixed(2)}` : '---'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium border ${rideStatusColor(ride.status)}`}>
                          {ride.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {user.recentRides.length === 0 && (
                <p className="text-center text-sm text-[#6B7280] py-8">No rides found</p>
              )}
            </div>
          )}

          {!loading && user && activeTab === 'payments' && (
            <div className="py-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Amount</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Method</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Date</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Linked Ride</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.recentPayments.map((payment) => (
                    <TableRow key={payment.id} className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50">
                      <TableCell className="text-xs text-white font-medium">&euro;{payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-xs text-[#9CA3AF]">{payment.method}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium border ${paymentStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-[#9CA3AF]">{formatDateTime(payment.date)}</TableCell>
                      <TableCell className="text-xs text-[#9CA3AF] font-mono">{payment.rideDisplayId ?? '---'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {user.recentPayments.length === 0 && (
                <p className="text-center text-sm text-[#6B7280] py-8">No payments found</p>
              )}
            </div>
          )}

          {!loading && user && activeTab === 'gdpr' && (
            <div className="space-y-4 py-2">
              {/* Consent Preferences */}
              <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3">Consent Preferences</h4>
                {user.consentPreferences ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-[#6B7280]" />
                        <span className="text-sm text-[#9CA3AF]">Email Communications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={user.consentPreferences.email} disabled size="sm" />
                        <span className="text-xs text-[#6B7280]">
                          {user.consentPreferences.email ? 'Opted In' : 'Opted Out'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-[#6B7280]" />
                        <span className="text-sm text-[#9CA3AF]">SMS Notifications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={user.consentPreferences.sms} disabled size="sm" />
                        <span className="text-xs text-[#6B7280]">
                          {user.consentPreferences.sms ? 'Opted In' : 'Opted Out'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-[#6B7280]" />
                        <span className="text-sm text-[#9CA3AF]">Push Notifications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={user.consentPreferences.push} disabled size="sm" />
                        <span className="text-xs text-[#6B7280]">
                          {user.consentPreferences.push ? 'Opted In' : 'Opted Out'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#6B7280]">No consent preferences recorded</p>
                )}
              </div>

              {/* Processing Restriction Status */}
              <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3">Processing Restriction</h4>
                <div className="flex items-center gap-2">
                  {user.processingRestricted ? (
                    <>
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <span className="text-sm text-amber-400">Processing Restricted</span>
                      {user.processingRestrictedAt && (
                        <span className="text-xs text-[#6B7280] ml-2">
                          since {formatDate(user.processingRestrictedAt)}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">No Restrictions</span>
                    </>
                  )}
                </div>
              </div>

              {/* GDPR Actions */}
              <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3">Data Actions</h4>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportData}
                    className="w-full justify-start bg-[#141414] border-[#2A2A2A] text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A]"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export User Data (GDPR)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteAccount}
                    className="w-full justify-start bg-[#141414] border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Request Account Deletion
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
