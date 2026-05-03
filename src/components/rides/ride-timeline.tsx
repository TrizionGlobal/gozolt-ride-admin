'use client';

import {
  ClipboardList,
  UserCheck,
  MapPin,
  CheckCircle2,
  Car,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RideDetail } from '@/services/admin/ride.types';

interface RideTimelineProps {
  detail: RideDetail;
}

interface TimelineEvent {
  icon: React.ElementType;
  label: string;
  timestamp: string | null;
  color: string;
}

function buildEvents(detail: RideDetail): TimelineEvent[] {
  const driverName = detail.driver
    ? `${detail.driver.firstName} ${detail.driver.lastName}`
    : '';

  return [
    {
      icon: ClipboardList,
      label: 'Ride Requested',
      timestamp: detail.requestedAt,
      color: 'text-blue-400 bg-blue-400/20',
    },
    {
      icon: UserCheck,
      label: driverName ? `Driver Assigned ${driverName}` : 'Driver Assigned',
      timestamp: detail.acceptedAt,
      color: 'text-purple-400 bg-purple-400/20',
    },
    {
      icon: MapPin,
      label: 'Driver En Route to Pickup',
      timestamp: detail.acceptedAt,
      color: 'text-yellow-400 bg-yellow-400/20',
    },
    {
      icon: CheckCircle2,
      label: 'Arrived at Pickup',
      timestamp: detail.arrivedAt,
      color: 'text-green-400 bg-green-400/20',
    },
    {
      icon: Car,
      label: 'Ride Started',
      timestamp: detail.startedAt,
      color: 'text-emerald-400 bg-emerald-400/20',
    },
    {
      icon: Star,
      label: 'Ride Completed',
      timestamp: detail.completedAt,
      color: 'text-[#FACC15] bg-[#FACC15]/20',
    },
  ];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function RideTimeline({ detail }: RideTimelineProps) {
  const events = buildEvents(detail);

  // Find the last event with a timestamp (that's the "current" one)
  let lastActiveIdx = -1;
  events.forEach((e, i) => {
    if (e.timestamp) lastActiveIdx = i;
  });

  return (
    <div className="space-y-0">
      <p className="text-sm font-medium text-white mb-3">Timeline</p>
      <div className="space-y-0">
        {events.map((event, i) => {
          const isActive = event.timestamp !== null;
          const isCurrent = i === lastActiveIdx;
          const Icon = event.icon;

          return (
            <div key={i} className="flex gap-3">
              {/* Vertical line + icon */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full shrink-0',
                    isActive ? event.color : 'text-[#4B5563] bg-[#1A1A1A]',
                    isCurrent && 'ring-2 ring-[#FACC15]/30',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                {i < events.length - 1 && (
                  <div className={cn('w-px h-6', isActive ? 'bg-[#2A2A2A]' : 'bg-[#1A1A1A]')} />
                )}
              </div>

              {/* Label + time */}
              <div className="pb-4 min-w-0">
                <p
                  className={cn(
                    'text-sm leading-7',
                    isActive ? 'text-white' : 'text-[#4B5563]',
                  )}
                >
                  {event.label}
                </p>
                {event.timestamp && (
                  <p className="text-xs text-[#6B7280]">{formatTime(event.timestamp)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
