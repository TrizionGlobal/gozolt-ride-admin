'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  MapPin,
  Clock,
  Camera,
  Star,
  Calendar,
  Car,
  Building2,
  CheckCircle2,
  XCircle,
  Banknote,
  CreditCard,
  Coins,
  TrendingUp,
  Hash,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { driverService } from '@/services/admin/driver.service';
import { getDriverStatusDisplay } from '@/services/admin/driver.types';
import type { DriverDetail, DriverDetailExtended } from '@/services/admin/driver.types';
import { toast } from 'sonner';

type Tab = 'earnings' | 'rides' | 'shifts' | 'verifications';

interface DriverDetailDrawerProps {
  driverId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DriverDetailDrawer({ driverId, open, onOpenChange }: DriverDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('earnings');
  const [driver, setDriver] = useState<DriverDetail | null>(null);
  const [extended, setExtended] = useState<DriverDetailExtended | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (driverId && open) {
      setLoading(true);
      setActiveTab('earnings');
      Promise.all([
        driverService.getDriverDetail(driverId),
        driverService.getDriverDetailExtended(driverId),
      ])
        .then(([detail, ext]) => {
          setDriver(detail);
          setExtended(ext);
        })
        .catch(() => toast.error('Failed to load driver details'))
        .finally(() => setLoading(false));
    } else {
      setDriver(null);
      setExtended(null);
    }
  }, [driverId, open]);

  const fullName = driver ? `${driver.firstName} ${driver.lastName}` : '';
  const statusDisplay = driver ? getDriverStatusDisplay(driver.status, driver.isOnline) : null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'earnings', label: 'Earnings', icon: <DollarSign className="h-3.5 w-3.5" /> },
    { key: 'rides', label: 'Rides', icon: <MapPin className="h-3.5 w-3.5" /> },
    { key: 'shifts', label: 'Shifts', icon: <Clock className="h-3.5 w-3.5" /> },
    { key: 'verifications', label: 'Verifications', icon: <Camera className="h-3.5 w-3.5" /> },
  ];

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

  const formatDuration = (minutes: number | null) => {
    if (minutes === null) return 'In progress';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const rideStatusColor = (status: string) => {
    if (status === 'COMPLETED') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (status === 'CANCELLED') return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-[#2A2A2A] text-white sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white text-lg flex items-center gap-3">
            {loading ? 'Loading...' : fullName}
            {statusDisplay && !loading && (
              <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium border ${statusDisplay.className}`}>
                {statusDisplay.label}
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-[#6B7280]">
            {driver ? (
              <span className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[#FACC15] text-[#FACC15]" />
                  {driver.avgRating.toFixed(1)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {driver.supplier.companyName}
                </span>
                {driver.vehicleAssignment && (
                  <span className="inline-flex items-center gap-1">
                    <Car className="h-3 w-3" />
                    {driver.vehicleAssignment.vehicle.make} {driver.vehicleAssignment.vehicle.model} ({driver.vehicleAssignment.vehicle.plateNumber})
                  </span>
                )}
              </span>
            ) : (
              'Loading driver details...'
            )}
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

          {/* Earnings Tab */}
          {!loading && extended && activeTab === 'earnings' && (
            <div className="py-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <TrendingUp className="h-3 w-3" /> Total Earnings
                  </div>
                  <p className="text-lg font-semibold text-white">&euro;{extended.earnings.totalEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <Banknote className="h-3 w-3" /> Cash Earnings
                  </div>
                  <p className="text-lg font-semibold text-white">&euro;{extended.earnings.cashEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <CreditCard className="h-3 w-3" /> Card Earnings
                  </div>
                  <p className="text-lg font-semibold text-white">&euro;{extended.earnings.cardEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <Coins className="h-3 w-3" /> Tip Earnings
                  </div>
                  <p className="text-lg font-semibold text-white">&euro;{extended.earnings.tipEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <Hash className="h-3 w-3" /> Tip Count
                  </div>
                  <p className="text-lg font-semibold text-white">{extended.earnings.tipCount}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <MapPin className="h-3 w-3" /> Rides Completed
                  </div>
                  <p className="text-lg font-semibold text-white">{extended.earnings.ridesCompleted}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rides Tab */}
          {!loading && extended && activeTab === 'rides' && (
            <div className="py-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">ID</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Date</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Route</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Rider</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Fare</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Tip</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extended.recentRides.map((ride) => (
                    <TableRow key={ride.id} className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50">
                      <TableCell className="text-xs text-[#9CA3AF] font-mono">{ride.displayId}</TableCell>
                      <TableCell className="text-xs text-[#9CA3AF]">{formatDate(ride.date)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-white truncate max-w-[120px]">{ride.pickup}</span>
                          <span className="text-xs text-[#6B7280] truncate max-w-[120px]">{ride.dropoff}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-[#9CA3AF]">{ride.riderName}</TableCell>
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
              {extended.recentRides.length === 0 && (
                <p className="text-center text-sm text-[#6B7280] py-8">No rides found</p>
              )}
            </div>
          )}

          {/* Shifts Tab */}
          {!loading && extended && activeTab === 'shifts' && (
            <div className="py-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Start</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">End</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-medium">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extended.shifts.map((shift) => (
                    <TableRow key={shift.id} className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50">
                      <TableCell className="text-xs text-white">{formatDateTime(shift.startedAt)}</TableCell>
                      <TableCell className="text-xs text-[#9CA3AF]">
                        {shift.endedAt ? formatDateTime(shift.endedAt) : (
                          <span className="inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium border bg-green-500/20 text-green-400 border-green-500/30">
                            ACTIVE
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-[#9CA3AF]">{formatDuration(shift.durationMinutes)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {extended.shifts.length === 0 && (
                <p className="text-center text-sm text-[#6B7280] py-8">No shifts found</p>
              )}
            </div>
          )}

          {/* Verifications Tab */}
          {!loading && extended && activeTab === 'verifications' && (
            <div className="space-y-3 py-2">
              {extended.selfieVerifications.map((v, i) => (
                <div
                  key={i}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${v.isMatch ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {v.isMatch ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white">
                        {v.isMatch ? 'Match Verified' : 'Match Failed'}
                      </p>
                      <p className="text-xs text-[#6B7280]">{formatDateTime(v.verifiedAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${v.confidence >= 80 ? 'text-green-400' : v.confidence >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {v.confidence.toFixed(1)}%
                    </p>
                    <p className="text-xs text-[#6B7280]">Confidence</p>
                  </div>
                </div>
              ))}
              {extended.selfieVerifications.length === 0 && (
                <p className="text-center text-sm text-[#6B7280] py-8">No verifications found</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
