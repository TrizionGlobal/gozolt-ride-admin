'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  MapPin,
  Star,
  Car,
  Building2,
  Banknote,
  CreditCard,
  Coins,
  TrendingUp,
  Hash,
  User,
  FileText,
  ExternalLink,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { driverService } from '@/services/admin/driver.service';
import { getDriverStatusDisplay } from '@/services/admin/driver.types';
import type { DriverDetail, DriverDetailExtended } from '@/services/admin/driver.types';
import { toast } from 'sonner';

type Tab = 'profile' | 'supplier' | 'earnings' | 'documents';

interface DriverDetailDrawerProps {
  driverId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DriverDetailDrawer({ driverId, open, onOpenChange }: DriverDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [driver, setDriver] = useState<DriverDetail | null>(null);
  const [extended, setExtended] = useState<DriverDetailExtended | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (driverId && open) {
      setLoading(true);
      setActiveTab('profile');
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
  const statusDisplay = driver ? getDriverStatusDisplay(driver.status, driver.isOnline, !!driver.vehicleAssignment) : null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'Driver Profile', icon: <User className="h-3.5 w-3.5" /> },
    { key: 'supplier', label: 'Supplier Details', icon: <Building2 className="h-3.5 w-3.5" /> },
    { key: 'earnings', label: 'Earnings', icon: <DollarSign className="h-3.5 w-3.5" /> },
    { key: 'documents', label: 'Driver Documents', icon: <FileText className="h-3.5 w-3.5" /> },
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
                  {Number(driver.avgRating || 0).toFixed(1)}
                </span>
                {driver.supplier && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {driver.supplier.companyName}
                  </span>
                )}
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

        {/* Step Progress Tracker */}
        {!loading && driver && (
          <div className="bg-[#1A1A1A]/40 border border-[#2A2A2A] rounded-lg p-3 my-1 flex items-center justify-between text-xs">
            <div className="flex flex-col items-center flex-1 relative">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center border font-semibold text-xs ${
                driver.status !== 'NEW_DRIVER' && driver.status !== 'SUPPLIER_SUSPENDED'
                  ? 'bg-green-500/20 border-green-500/30 text-green-400'
                  : driver.status === 'NEW_DRIVER'
                  ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400 animate-pulse'
                  : 'bg-gray-500/20 border-gray-500/30 text-gray-400'
              }`}>
                1
              </div>
              <span className="mt-1 text-[10px] font-medium text-center">Supplier Review</span>
              <span className="text-[9px] text-[#6B7280] text-center">
                {driver.status === 'NEW_DRIVER' ? 'Pending' : driver.status === 'SUPPLIER_SUSPENDED' ? 'Suspended' : 'Approved'}
              </span>
            </div>
            
            <div className="h-[2px] bg-[#2A2A2A] flex-1 -mt-4 mx-2" />

            <div className="flex flex-col items-center flex-1 relative">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center border font-semibold text-xs ${
                driver.status === 'ADMIN_APPROVED' || driver.status === 'VEHICLE_ASSIGNED' || driver.status === 'ACTIVE' || driver.status === 'SUSPENDED' || driver.status === 'ADMIN_SUSPENDED' || driver.status === 'SUPPLIER_SUSPENDED'
                  ? 'bg-green-500/20 border-green-500/30 text-green-400'
                  : driver.status === 'SUPPLIER_APPROVED'
                  ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400 animate-pulse'
                  : 'bg-gray-500/20 border-gray-500/30 text-gray-400'
              }`}>
                2
              </div>
              <span className="mt-1 text-[10px] font-medium text-center">Admin Approval</span>
              <span className="text-[9px] text-[#6B7280] text-center">
                {driver.status === 'NEW_DRIVER'
                  ? 'Waiting'
                  : driver.status === 'SUPPLIER_APPROVED'
                  ? 'Pending'
                  : driver.status === 'ADMIN_SUSPENDED' || driver.status === 'SUPPLIER_SUSPENDED'
                  ? 'Suspended'
                  : 'Approved'}
              </span>
            </div>

            <div className="h-[2px] bg-[#2A2A2A] flex-1 -mt-4 mx-2" />

            <div className="flex flex-col items-center flex-1 relative">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center border font-semibold text-xs ${
                !!driver.vehicleAssignment || driver.status === 'VEHICLE_ASSIGNED'
                  ? 'bg-green-500/20 border-green-500/30 text-green-400'
                  : (driver.status === 'ADMIN_APPROVED' || (driver.status === 'ACTIVE' && !driver.vehicleAssignment))
                  ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400 animate-pulse'
                  : 'bg-gray-500/20 border-gray-500/30 text-gray-400'
              }`}>
                3
              </div>
              <span className="mt-1 text-[10px] font-medium text-center">Vehicle Assign</span>
              <span className="text-[9px] text-[#6B7280] text-center">
                {!!driver.vehicleAssignment || driver.status === 'VEHICLE_ASSIGNED'
                  ? 'Assigned'
                  : (driver.status === 'ADMIN_APPROVED' || (driver.status === 'ACTIVE' && !driver.vehicleAssignment))
                  ? 'Pending'
                  : driver.status === 'ADMIN_SUSPENDED' || driver.status === 'SUPPLIER_SUSPENDED'
                  ? 'Suspended'
                  : 'Waiting'}
              </span>
            </div>
          </div>
        )}

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

          {/* Profile Tab */}
          {!loading && driver && activeTab === 'profile' && (
            <div className="py-4 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Full Name</p>
                    <p className="text-sm text-white font-medium">{fullName}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Phone</p>
                    <p className="text-sm text-white font-medium">{driver.phone || 'N/A'}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Email</p>
                    <p className="text-sm text-white font-medium">{driver.email || 'N/A'}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Registration Date</p>
                    <p className="text-sm text-white font-medium">{formatDate(driver.createdAt)}</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Documents Tab */}
          {!loading && driver && activeTab === 'documents' && (
            <div className="py-4 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Uploaded Documents
                </h3>
                {driver.documents && driver.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {driver.documents.map((doc: any) => (
                      <div key={doc.id} className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm font-medium text-white line-clamp-1" title={doc.type}>{doc.type}</p>
                            <p className="text-[10px] text-[#6B7280]">{doc.fileName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-white flex-1"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1.5" /> View File
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#6B7280] bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 text-center">
                    No documents uploaded.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Supplier Details Tab */}
          {!loading && driver && activeTab === 'supplier' && (
            <div className="py-4 space-y-6">
              {driver.supplier ? (
                <div>
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Supplier Information
                  </h3>
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                    <p className="text-sm text-white font-medium">{driver.supplier.companyName}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
                  No supplier information available.
                </div>
              )}

              {/* Vehicle Assignment */}
              {driver.vehicleAssignment && (
                <div>
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Assigned Vehicle
                  </h3>
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-[#6B7280]">Vehicle</p>
                      <p className="text-sm text-white">{driver.vehicleAssignment.vehicle.make} {driver.vehicleAssignment.vehicle.model} ({driver.vehicleAssignment.vehicle.year})</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Plate Number</p>
                      <p className="text-sm text-white font-mono bg-[#1A1A1A] inline-block px-1.5 rounded">{driver.vehicleAssignment.vehicle.plateNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Color</p>
                      <p className="text-sm text-white">{driver.vehicleAssignment.vehicle.color}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Type</p>
                      <p className="text-sm text-white capitalize">{driver.vehicleAssignment.vehicle.type}</p>
                    </div>
                  </div>
                </div>
              )}
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
                  <p className="text-lg font-semibold text-white">&euro;{(extended.earnings?.totalEarnings ?? 0).toLocaleString()}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <Banknote className="h-3 w-3" /> Cash Earnings
                  </div>
                  <p className="text-lg font-semibold text-white">&euro;{(extended.earnings?.cashEarnings ?? 0).toLocaleString()}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <CreditCard className="h-3 w-3" /> Card Earnings
                  </div>
                  <p className="text-lg font-semibold text-white">&euro;{(extended.earnings?.cardEarnings ?? 0).toLocaleString()}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <Coins className="h-3 w-3" /> Tip Earnings
                  </div>
                  <p className="text-lg font-semibold text-white">&euro;{(extended.earnings?.tipEarnings ?? 0).toLocaleString()}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <Hash className="h-3 w-3" /> Tip Count
                  </div>
                  <p className="text-lg font-semibold text-white">{extended.earnings?.tipCount ?? 0}</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                    <MapPin className="h-3 w-3" /> Rides Completed
                  </div>
                  <p className="text-lg font-semibold text-white">{extended.earnings?.ridesCompleted ?? 0}</p>
                </div>
              </div>
            </div>
          )}


        </div>
      </DialogContent>
    </Dialog>
  );
}
