'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { VehicleStatusBadge } from './vehicle-status-badge';
import { VehicleTypeBadge } from './vehicle-type-badge';
import { VehicleActionsMenu } from './vehicle-actions-menu';
import type { VehicleListItem } from '@/services/admin/vehicle.types';

const FUEL_TYPE_DISPLAY: Record<string, string> = {
  PETROL: 'Petrol',
  DIESEL: 'Diesel',
  ELECTRIC: 'Electric',
  HYBRID: 'Hybrid',
  LPG: 'LPG',
};

interface VehicleTableRowProps {
  vehicle: VehicleListItem;
  onSuspend: (id: string) => void;
  onReject: (id: string) => void;
  onRefetch: () => void;
}

export function VehicleTableRow({ vehicle, onSuspend, onReject, onRefetch }: VehicleTableRowProps) {
  const driverName = vehicle.assignment
    ? `${vehicle.assignment.driver.firstName} ${vehicle.assignment.driver.lastName}`
    : null;
  const inspectionDate = vehicle._computed?.inspectionDate ?? '—';

  return (
    <TableRow className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50 transition-colors">
      {/* Plate */}
      <TableCell className="text-sm text-[#9CA3AF] font-mono">
        {vehicle.plateNumber}
      </TableCell>

      {/* Vehicle (make + model / year + color) */}
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            {vehicle.make} {vehicle.model}
          </span>
          <span className="text-xs text-[#6B7280]">
            {vehicle.year} &middot; {vehicle.color}
          </span>
        </div>
      </TableCell>

      {/* Type */}
      <TableCell>
        <VehicleTypeBadge type={vehicle.type} fuelType={vehicle.fuelType} />
      </TableCell>

      {/* Driver */}
      <TableCell className="text-sm text-white">
        {driverName ? (
          driverName
        ) : (
          <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-[11px] font-medium text-blue-400 border border-blue-500/30">
            Not Assigned
          </span>
        )}
      </TableCell>

      {/* Supplier */}
      <TableCell className="text-sm text-[#9CA3AF]">
        {vehicle.supplier.companyName}
      </TableCell>

      {/* Status */}
      <TableCell>
        <VehicleStatusBadge status={vehicle.status} />
      </TableCell>

      {/* Fuel */}
      <TableCell className="text-sm text-[#9CA3AF]">
        {FUEL_TYPE_DISPLAY[vehicle.fuelType] ?? vehicle.fuelType}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <VehicleActionsMenu
          vehicleId={vehicle.id}
          vehicleName={`${vehicle.make} ${vehicle.model}`}
          plateNumber={vehicle.plateNumber}
          status={vehicle.status}
          supplierName={vehicle.supplier.companyName}
          driverName={driverName}
          onSuspend={() => onSuspend(vehicle.id)}
          onReject={() => onReject(vehicle.id)}
          onRefetch={onRefetch}
        />
      </TableCell>
    </TableRow>
  );
}
