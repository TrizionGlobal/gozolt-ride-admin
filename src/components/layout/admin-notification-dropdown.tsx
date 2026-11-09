'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Wrench, Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn, formatDateTime } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useAdminSocket } from '@/hooks/use-admin-socket';
import {
  adminQuickServicesNotificationsService,
  AdminQuickServiceNotificationItem,
} from '@/services/admin/quick-services-notifications.service';

function formatTimeAgo(dateInput: string | Date | undefined): string {
  if (!dateInput) return 'just now';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

function getBookingRef(item: AdminQuickServiceNotificationItem): string {
  if (item.data?.bookingReference) {
    const ref = item.data.bookingReference;
    return ref.startsWith('GZ-') ? ref : `GZ-${ref}`;
  }
  if (item.data?.bookingId) {
    return `GZ-QS-${item.data.bookingId.substring(0, 8).toUpperCase()}`;
  }
  const match = item.body?.match(/(?:GZ-)?QS-([A-Za-z0-9]{8})/i);
  if (match) {
    return `GZ-QS-${match[1].toUpperCase()}`;
  }
  return 'GZ-QS-BOOKING';
}

function getUserName(item: AdminQuickServiceNotificationItem): string {
  if (item.data?.userName) return item.data.userName;
  const match = item.body?.match(/from\s+([^.]+)/i);
  if (match && match[1]) return match[1].trim();
  return 'Customer';
}

function formatScheduleDate(dateValue: string | Date | undefined): string | null {
  if (!dateValue) return null;
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return null;
  return formatDateTime(d);
}

export function AdminNotificationDropdown() {
  const router = useRouter();
  const { setActiveModule } = useSidebarStore();
  const { socket } = useAdminSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AdminQuickServiceNotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initialFetchDone = useRef(false);

  // Fetch notifications once on initial mount
  const fetchInitialData = useCallback(async () => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;
    setIsLoading(true);
    try {
      const [notifsRes, countRes] = await Promise.all([
        adminQuickServicesNotificationsService.getNotifications(1, 30),
        adminQuickServicesNotificationsService.getUnreadCount(),
      ]);
      const list = notifsRes.data || [];
      setNotifications(list);
      const computedUnread = list.filter((n) => !n.isRead).length;
      setUnreadCount(countRes?.unreadCount ?? computedUnread);
    } catch (error) {
      console.error('Failed to load initial admin quick services notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch only ONCE on mount — do not call API every time user clicks the icon
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Listen to socket for real-time quick service notifications
  useEffect(() => {
    if (!socket) return;

    const handleIncomingNotif = (notif: any) => {
      if (!notif) return;
      const data = notif.data || {};
      const bookingId = data.bookingId;
      const bookingRef =
        data.bookingReference ||
        (bookingId ? `GZ-QS-${bookingId.substring(0, 8).toUpperCase()}` : undefined);

      const formattedNotif: AdminQuickServiceNotificationItem = {
        id: notif.id || `notif_${Date.now()}`,
        title: notif.title || 'New Quick Service Booking',
        body: notif.body || 'New booking received',
        type: notif.type || 'SYSTEM',
        isRead: false,
        createdAt: notif.createdAt || new Date().toISOString(),
        data: {
          ...data,
          bookingReference: bookingRef,
        },
      };

      setNotifications((prev) => {
        if (prev.some((n) => n.id === formattedNotif.id)) {
          return prev;
        }
        return [formattedNotif, ...prev];
      });
      setUnreadCount((prev) => prev + 1);

      toast.info(formattedNotif.title, {
        description: `Booking ${bookingRef || ''} received from ${data.userName || 'Customer'}`,
        duration: 5000,
      });
    };

    socket.on('notification:quick_service', handleIncomingNotif);

    return () => {
      socket.off('notification:quick_service', handleIncomingNotif);
    };
  }, [socket]);

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await adminQuickServicesNotificationsService.markRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Mark single notification as read
  const handleMarkRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    try {
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      await adminQuickServicesNotificationsService.markRead([id]);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Navigate to booking details
  const handleViewDetails = (notification: AdminQuickServiceNotificationItem) => {
    handleMarkRead(notification.id, notification.isRead);
    setIsOpen(false);
    setActiveModule('QUICK_SERVICES');

    const bookingId = notification.data?.bookingId;
    if (bookingId) {
      router.push(`/quick-services/booking-management/${bookingId}`);
    } else {
      router.push('/quick-services/booking-management');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex items-center justify-center p-2 rounded-lg text-[#71717A] hover:text-white hover:bg-[#1A1A1A] transition-colors cursor-pointer"
        aria-label="Quick Services Notifications"
        title="Quick Services Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold leading-none text-black bg-[#FACC15] rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#27272A] bg-[#111111] shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272A] bg-[#0A0A0A]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/20">
                <Wrench className="h-2.5 w-2.5" />
                Quick Services
              </span>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-[#FACC15] hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto divide-y divide-[#27272A]">
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FACC15] border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="h-8 w-8 text-[#3F3F46] mb-2" />
                <p className="text-sm text-[#71717A]">No quick service notifications yet</p>
                <p className="text-xs text-[#52525B] mt-1">
                  New customer bookings will appear here in real time.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const bookingRef = getBookingRef(item);
                const userName = getUserName(item);
                const schedule = formatScheduleDate(item.data?.bookingDate);
                const location = item.data?.location;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleMarkRead(item.id, item.isRead)}
                    className={cn(
                      'group relative p-3.5 hover:bg-[#1A1A1A] transition-colors cursor-pointer',
                      !item.isRead ? 'bg-[#18181A]' : 'bg-[#111111]'
                    )}
                  >
                    {/* Unread indicator */}
                    {!item.isRead && (
                      <div className="absolute left-2 top-4 h-2 w-2 rounded-full bg-[#FACC15]" />
                    )}

                    <div className="pl-3">
                      {/* Title & Time */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4
                          className={cn(
                            'text-xs font-semibold leading-snug',
                            !item.isRead ? 'text-white' : 'text-[#D4D4D8]'
                          )}
                        >
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-[#71717A] whitespace-nowrap">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>

                      {/* Service & Category Tag */}
                      {item.data?.serviceCategory && (
                        <div className="my-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#27272A] text-[#E4E4E7] border border-[#3F3F46]">
                            {item.data.serviceCategory}
                            {item.data?.serviceTitle ? ` • ${item.data.serviceTitle}` : ''}
                          </span>
                        </div>
                      )}

                      {/* Restructured Short Booking Details */}
                      <div className="space-y-1 text-xs mt-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-[#FACC15]">{bookingRef}</span>
                          <span className="text-[#52525B]">•</span>
                          <span className="text-[#D4D4D8]">{userName}</span>
                        </div>

                        {schedule && (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#A1A1AA]">
                            <Calendar className="h-3.5 w-3.5 text-[#71717A] shrink-0" />
                            <span>{schedule}</span>
                          </div>
                        )}

                        {location && (
                          <div className="flex items-start gap-1.5 text-[11px] text-[#A1A1AA]">
                            <MapPin className="h-3.5 w-3.5 text-[#71717A] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{location}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="mt-2.5 flex items-center justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(item);
                          }}
                          className="text-xs px-2.5 py-1 bg-[#1F1F22] hover:bg-[#27272A] text-[#FACC15] font-medium rounded-md border border-[#FACC15]/30 hover:border-[#FACC15] transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-[#27272A] bg-[#0A0A0A] text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#71717A] hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
