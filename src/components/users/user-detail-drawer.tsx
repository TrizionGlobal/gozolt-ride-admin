'use client';

import { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Star,
  Calendar,
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

import { userService } from '@/services/admin/user.service';
import { getUserStatusDisplay } from '@/services/admin/user.types';
import type { UserDetail } from '@/services/admin/user.types';
import { toast } from 'sonner';

type Tab = 'overview';

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
  ];



  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
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
                  {Number(user.avgRating ?? 0).toFixed(1)}
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


        </div>
      </DialogContent>
    </Dialog>
  );
}
