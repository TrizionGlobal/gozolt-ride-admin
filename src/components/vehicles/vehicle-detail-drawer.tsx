'use client';

import { useState, useEffect } from 'react';
import {
  Car,
  FileText,
  User,
  Building,
  Settings,
  Calendar,
  Eye,
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
import { Badge } from '@/components/ui/badge';
import { vehicleService } from '@/services/admin/vehicle.service';
import { getVehicleStatusDisplay } from '@/services/admin/vehicle.types';
import type { VehicleDetail } from '@/services/admin/vehicle.types';
import { toast } from 'sonner';

type Tab = 'overview' | 'documents' | 'supplier' | 'driver';

interface VehicleDetailDrawerProps {
  vehicleId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VehicleDetailDrawer({ vehicleId, open, onOpenChange }: VehicleDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicleId && open) {
      setLoading(true);
      setActiveTab('overview');
      vehicleService
        .getVehicleDetail(vehicleId)
        .then(setVehicle)
        .catch(() => toast.error('Failed to load vehicle details'))
        .finally(() => setLoading(false));
    } else {
      setVehicle(null);
    }
  }, [vehicleId, open]);

  const fullName = vehicle
    ? `${vehicle.make} ${vehicle.model} (${vehicle.year})`
    : 'Unknown Vehicle';

  const statusDisplay = vehicle ? getVehicleStatusDisplay(vehicle.status) : null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Car className="h-3.5 w-3.5" /> },
    { key: 'documents', label: 'Documents', icon: <FileText className="h-3.5 w-3.5" /> },
    { key: 'driver', label: 'Assigned Driver', icon: <User className="h-3.5 w-3.5" /> },
    { key: 'supplier', label: 'Supplier', icon: <Building className="h-3.5 w-3.5" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-[#2A2A2A] text-white sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white text-lg flex items-center gap-2">
            {loading ? 'Loading...' : fullName}
            {statusDisplay && (
              <Badge variant="outline" className={statusDisplay.className}>
                {statusDisplay.label}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-[#6B7280]">
            {vehicle ? `Plate: ${vehicle.plateNumber} | VIN: ${vehicle.vin || 'N/A'}` : 'Loading vehicle details...'}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#2A2A2A] pb-0 mt-2">
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

          {/* Overview Tab */}
          {!loading && vehicle && activeTab === 'overview' && (
            <div className="py-4 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Type</p>
                    <p className="text-sm text-white font-medium capitalize">{vehicle.type}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Fuel</p>
                    <p className="text-sm text-white font-medium capitalize">{vehicle.fuelType}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Color</p>
                    <p className="text-sm text-white font-medium">{vehicle.color}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Seats</p>
                    <p className="text-sm text-white font-medium">{vehicle.seats}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {!loading && vehicle && activeTab === 'documents' && (
            <div className="py-4 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Uploaded Documents
                </h3>
                {vehicle.documents && vehicle.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vehicle.documents.map((doc: any) => (
                      <div key={doc.id} className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm font-medium text-white line-clamp-1" title={doc.type}>{doc.type.replace('_', ' ')}</p>
                            <p className="text-[10px] text-[#6B7280]">{doc.fileName || 'Document File'}</p>
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

          {/* Driver Tab */}
          {!loading && vehicle && activeTab === 'driver' && (
            <div className="py-4 space-y-6">
              {vehicle.assignment && vehicle.assignment.driver ? (
                <div>
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Assigned Driver
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">Name</p>
                      <p className="text-sm text-white font-medium">{vehicle.assignment.driver.firstName} {vehicle.assignment.driver.lastName}</p>
                    </div>
                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">Phone</p>
                      <p className="text-sm text-white font-medium">{vehicle.assignment.driver.phone || 'N/A'}</p>
                    </div>
                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">Driver ID</p>
                      <p className="text-sm text-[#FACC15] font-medium">{vehicle.assignment.driver.driverId}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
                  No driver currently assigned.
                </div>
              )}
            </div>
          )}

          {/* Supplier Tab */}
          {!loading && vehicle && activeTab === 'supplier' && (
            <div className="py-4 space-y-6">
              {vehicle.supplier ? (
                <div>
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Supplier Details
                  </h3>
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Company Name</p>
                    <p className="text-sm text-white font-medium">{vehicle.supplier.companyName}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
                  No supplier information available.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
