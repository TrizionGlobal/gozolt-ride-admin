'use client';

import {
  X,
  Plane,
  Clock,
  User,
  MapPin,
  Car,
  CheckCircle,
  CreditCard,
  Building2,
  Key,
  Shield,
  AlertCircle,
  Users,
  UserCheck,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { AdminBooking } from '@/app/(dashboard)/airport-transfers/bookings/page';

interface TransferBookingDetailsModalProps {
  booking: AdminBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

function getStatusDotColor(status?: string | null): string {
  if (!status) return 'bg-gray-400';
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-400';
    case 'CANCELLED':
    case 'REFUNDED':
      return 'bg-red-400';
    case 'IN_PROGRESS':
    case 'ON_TRIP':
      return 'bg-blue-400';
    case 'CONFIRMED':
    case 'DRIVER_ASSIGNED':
      return 'bg-yellow-400';
    default:
      return 'bg-gray-400';
  }
}

export function TransferBookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: TransferBookingDetailsModalProps) {
  if (!isOpen || !booking) return null;

  const isRound = booking.transferType === 'ROUND_TRIP';

  // Helper parser for special requests metadata
  const parseField = (field: string): string => {
    if (!booking.specialRequests) return '';
    const regex = new RegExp(`${field}\\s*:\\s*([^|]+)`, 'i');
    const match = booking.specialRequests.match(regex);
    return match ? match[1].trim() : '';
  };

  const whatsapp = parseField('WhatsApp') || parseField('Phone');
  const nationality = parseField('Nationality');
  const airline = parseField('Airline');
  const terminal = parseField('Terminal');
  const sign = parseField('Meet & Greet Sign') || parseField('Sign');
  const instructions = parseField('Meet Instructions') || parseField('Meeting Instructions');
  const assistance = parseField('Special Assistance') || parseField('Assistance');
  const hasMeetGreet = !!(sign || instructions || assistance);

  const fullName =
    booking.leadPassengerName ||
    `${booking.user?.firstName || ''} ${booking.user?.lastName || ''}`.trim() ||
    'Passenger';
  const phone = booking.leadPassengerPhone || booking.user?.phone || '';
  const email = booking.leadPassengerEmail || booking.user?.email || '';
  const adults = booking.adults || 1;
  const children = booking.children || 0;
  const infants = booking.infants || 0;
  const luggage = (booking.standardLuggage || 0) + (booking.largeLuggage || 0);

  const passengerRows: { icon: string; label: string; value: string }[] = [
    { icon: '👤', label: 'Primary passenger', value: fullName },
    ...(phone ? [{ icon: '📞', label: 'Phone', value: phone }] : []),
    ...(email ? [{ icon: '✉️', label: 'Email', value: email }] : []),
    ...(whatsapp ? [{ icon: '💬', label: 'WhatsApp', value: whatsapp }] : []),
    ...(nationality ? [{ icon: '🌍', label: 'Nationality', value: nationality }] : []),
  ];

  const passengerStr = [
    `${adults} Adult${adults !== 1 ? 's' : ''}`,
    ...(children ? [`${children} Child${children !== 1 ? 'ren' : ''}`] : []),
    ...(infants ? [`${infants} Infant${infants !== 1 ? 's' : ''}`] : []),
  ].join(', ');

  const flightRows = [
    ...(booking.flightNumber
      ? [
        {
          icon: '🛬',
          label: 'Incoming flight',
          value: booking.flightNumber,
          badge: true,
          badgeColor: 'text-blue-300 bg-blue-500/15 border-blue-500/30',
        },
      ]
      : []),
    ...(booking.returnFlightNumber
      ? [
        {
          icon: '🛫',
          label: 'Return flight',
          value: booking.returnFlightNumber,
          badge: true,
          badgeColor: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30',
        },
      ]
      : []),
    ...(airline ? [{ icon: '✈️', label: 'Airline', value: airline, badge: false, badgeColor: '' }] : []),
    ...(terminal ? [{ icon: '🏢', label: 'Terminal', value: terminal, badge: false, badgeColor: '' }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-[#27272A] bg-[#111111] p-6 shadow-2xl my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#27272A] pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-[#FCD223] bg-[#FCD223]/10 px-2.5 py-1 rounded-md border border-[#FCD223]/20">
                {booking.bookingReference}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${isRound
                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}
              >
                {isRound ? 'ROUND TRIP TRANSFER' : 'ONE WAY TRANSFER'}
              </span>
              {booking.flightNumber && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Plane className="h-3 w-3" /> Flight {booking.flightNumber}
                </span>
              )}
            </div>
            <p className="text-xs text-[#71717A] mt-2">
              Booking Placed: {formatDateTime(booking.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:text-white hover:bg-[#27272A] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 space-y-4 py-4 text-sm overflow-y-auto pr-1">
          {/* Status & Fare */}
          <div className="bg-[#18181B] p-4 rounded-xl border border-[#27272A]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#71717A] uppercase font-semibold">
                  {isRound ? 'First Trip Status' : 'Transfer Status'}
                </p>
                <div className="mt-1 font-semibold text-white flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${getStatusDotColor(booking.status)} inline-block`} />
                  {booking.status ? booking.status.replace(/_/g, ' ') : 'CONFIRMED'}
                </div>
                {isRound && (
                  <div className="mt-2 pt-2 border-t border-[#27272A]">
                    <p className="text-xs text-[#71717A] uppercase font-semibold">Return Trip Status</p>
                    <div className="mt-1 font-semibold text-white flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusDotColor(
                          booking.returnStatus || booking.status
                        )} inline-block`}
                      />
                      {(booking.returnStatus || booking.status || 'CONFIRMED').replace(/_/g, ' ')}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-[#71717A] uppercase font-semibold">Total Fare</p>
                <div className="mt-1 text-lg font-bold text-emerald-400">
                  {booking.currency === 'EUR' || !booking.currency ? '€' : booking.currency}{' '}
                  {Number(booking.grandTotal || 0).toFixed(2)}
                </div>
                {Number(booking.extrasFee || 0) > 0 && (
                  <p className="text-[11px] text-[#FCD223] font-medium mt-0.5">
                    Incl. VAT (Platform): {booking.currency === 'EUR' || !booking.currency ? '€' : booking.currency}{' '}
                    {Number(booking.extrasFee).toFixed(2)}
                  </p>
                )}
                {isRound && (
                  <span className="inline-block mt-2 text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Round Trip (First & Return)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Outbound / First Trip Route */}
          <div className="bg-[#18181B] p-4 rounded-xl border border-[#27272A] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {isRound ? 'First Trip Route' : 'Transfer Journey'}
              </p>
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#FCD223]" />
                {formatDateTime(booking.pickupDateTime)}
              </span>
            </div>

            <div className="space-y-2 pt-1 border-t border-[#27272A] text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#71717A] block font-medium">Meet & Pick Up Passenger at:</span>
                  <span className="text-white font-medium">{booking.pickupLocation || 'Pickup location'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#71717A] block font-medium">Drive to & Drop Off at:</span>
                  <span className="text-white font-medium">{booking.dropoffLocation || 'Drop-off destination'}</span>
                </div>
              </div>
            </div>

            {booking.flightNumber && (
              <div className="pt-2 border-t border-[#27272A] text-xs flex items-center gap-2 text-blue-400">
                <Plane className="h-3.5 w-3.5" />
                <span>
                  Flight Arrival / Departure: <strong>{booking.flightNumber}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Return Trip Route (if Round Trip) */}
          {isRound && (
            <div className="bg-[#18181B] p-4 rounded-xl border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-indigo-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  Return Trip Route
                </p>
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3 text-indigo-400" />
                  {formatDateTime(booking.returnDateTime)}
                </span>
              </div>

              <div className="space-y-2 pt-1 border-t border-[#27272A] text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#71717A] block font-medium">Meet & Pick Up Passenger at:</span>
                    <span className="text-white font-medium">
                      {booking.dropoffLocation || 'Return pickup location'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <MapPin className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#71717A] block font-medium">Drive to & Drop Off at:</span>
                    <span className="text-white font-medium">{booking.pickupLocation || 'Return destination'}</span>
                  </div>
                </div>
              </div>

              {booking.returnFlightNumber && (
                <div className="pt-2 border-t border-[#27272A] text-xs flex items-center gap-2 text-indigo-400">
                  <Plane className="h-3.5 w-3.5" />
                  <span>
                    Return Flight: <strong>{booking.returnFlightNumber}</strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Passenger & Contact */}
          <div className="bg-[#18181B] rounded-xl border border-[#27272A] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#27272A] flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-[#FCD223]" />
              <p className="text-xs text-[#FCD223] uppercase font-bold tracking-wider">Passenger & Contact</p>
            </div>
            <div className="divide-y divide-[#27272A]">
              {passengerRows.map((row, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-3">
                  <div className="flex items-center gap-2 text-[#71717A] text-xs shrink-0">
                    <span className="text-sm">{row.icon}</span>
                    <span>{row.label}</span>
                  </div>
                  <span className="text-white text-xs font-medium text-right truncate max-w-[55%]" title={row.value}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-[#27272A] flex gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs bg-[#27272A] text-gray-200 px-3 py-1.5 rounded-full">
                <User className="h-3 w-3 text-[#FCD223]" /> {passengerStr}
              </span>
              {luggage > 0 && (
                <span className="flex items-center gap-1.5 text-xs bg-[#27272A] text-gray-200 px-3 py-1.5 rounded-full">
                  🧳 {luggage} Bag{luggage !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Flight & Meet Details */}
          {(flightRows.length > 0 || hasMeetGreet) && (
            <div className="bg-[#18181B] rounded-xl border border-[#27272A] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#27272A] flex items-center gap-2">
                <Plane className="h-3.5 w-3.5 text-[#FCD223]" />
                <p className="text-xs text-[#FCD223] uppercase font-bold tracking-wider">Flight & Meet Details</p>
              </div>

              {flightRows.length > 0 && (
                <div className="divide-y divide-[#27272A]">
                  {flightRows.map((row, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-3">
                      <div className="flex items-center gap-2 text-[#71717A] text-xs shrink-0">
                        <span className="text-sm">{row.icon}</span>
                        <span>{row.label}</span>
                      </div>
                      {row.badge ? (
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-md border font-mono ${row.badgeColor}`}
                        >
                          {row.value}
                        </span>
                      ) : (
                        <span className="text-white text-xs font-medium">{row.value}</span>
                      )}
                    </div>
                  ))}
                  {hasMeetGreet && (
                    <div className="flex items-center justify-between px-4 py-2.5 gap-3">
                      <div className="flex items-center gap-2 text-[#71717A] text-xs shrink-0">
                        <span className="text-sm">🤝</span>
                        <span>Meet & Greet</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        ✔ Included
                      </span>
                    </div>
                  )}
                </div>
              )}

              {hasMeetGreet && (
                <div className="p-3 space-y-2 border-t border-[#27272A]">
                  {sign && (
                    <div className="bg-[#111111] rounded-lg border border-[#27272A] px-3 py-2.5 flex items-start gap-2.5">
                      <span className="text-xl leading-none mt-0.5">🪧</span>
                      <div>
                        <div className="text-[10px] uppercase font-semibold text-[#71717A] tracking-wide">
                          Driver Welcome Sign
                        </div>
                        <div className="text-sm text-white font-semibold mt-0.5">&quot;{sign}&quot;</div>
                      </div>
                    </div>
                  )}
                  {instructions && (
                    <div className="bg-[#111111] rounded-lg border border-[#27272A] px-3 py-2.5 flex items-start gap-2.5">
                      <span className="text-xl leading-none mt-0.5">🚶</span>
                      <div>
                        <div className="text-[10px] uppercase font-semibold text-[#71717A] tracking-wide">
                          Meeting Instructions
                        </div>
                        <div className="text-xs text-white font-medium mt-0.5">{instructions}</div>
                      </div>
                    </div>
                  )}
                  {assistance && (
                    <div className="bg-[#111111] rounded-lg border border-[#27272A] px-3 py-2.5 flex items-start gap-2.5">
                      <span className="text-xl leading-none mt-0.5">♿</span>
                      <div>
                        <div className="text-[10px] uppercase font-semibold text-[#71717A] tracking-wide">
                          Special Assistance & Requirements
                        </div>
                        <div className="text-xs text-white font-medium mt-0.5">{assistance}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Vehicle & Supplier Details */}
          <div className="bg-[#18181B] rounded-xl border border-[#27272A] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#27272A] flex items-center gap-2">
              <Car className="h-3.5 w-3.5 text-[#FCD223]" />
              <p className="text-xs text-[#FCD223] uppercase font-bold tracking-wider">
                Vehicle & Supplier Details
              </p>
            </div>
            <div className="p-3 space-y-2">
              {/* Assigned Vehicle */}
              <div className="bg-[#111111] rounded-lg border border-[#27272A] px-3 py-2.5 flex items-center gap-3">
                <span className="text-2xl">🚐</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-semibold text-[#71717A] tracking-wide">
                    Assigned Vehicle
                  </div>
                  <div className="text-sm text-white font-semibold mt-0.5 truncate">
                    {booking.vehicle?.make
                      ? `${booking.vehicle.make} ${booking.vehicle.model || ''}`.trim()
                      : 'Standard Vehicle'}
                  </div>
                  <span className="text-[10px] font-mono bg-[#27272A] px-2 py-0.5 rounded text-gray-300 mt-1 inline-block">
                    {booking.vehicle?.registrationNo || booking.vehicle?.vehicleType || 'Registration N/A'}
                  </span>
                </div>
              </div>

              {/* Assigned Driver & Magic Link Task Details (Matching Supplier Portal) */}
              <div className="bg-[#111111] rounded-lg border border-[#27272A] p-3 space-y-3">
                <div className="flex items-center gap-2 border-b border-[#27272A] pb-2">
                  <UserCheck className="h-4 w-4 text-[#FCD223]" />
                  <span className="text-xs uppercase font-bold text-[#FCD223] tracking-wider">
                    Assigned Driver &amp; Task Details
                  </span>
                </div>

                {(() => {
                  const outboundTask =
                    booking.tasks?.find((t) => t.tripLeg === 'OUTBOUND') ||
                    (!isRound && booking.tasks?.length ? booking.tasks[0] : null);
                  const returnTask = booking.tasks?.find((t) => t.tripLeg === 'RETURN');

                  const renderTaskCard = (title: string, task: any, driver: any) => (
                    <div className="bg-[#18181B] rounded-lg border border-[#27272A] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {title}
                        </span>
                        {task ? (
                          task.selfAssigned ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                              Self Assigned (Supplier)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              Worker Assigned
                            </span>
                          )
                        ) : driver ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            Fleet Driver
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#27272A] text-gray-400 border border-[#3F3F46]">
                            {booking.status === 'PENDING_APPROVAL' || booking.status === 'PENDING'
                              ? 'Pending Confirmation'
                              : 'Unassigned'}
                          </span>
                        )}
                      </div>

                      {task ? (
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between text-gray-300">
                            <span className="text-gray-500">Assigned Driver:</span>
                            <span className="font-semibold text-white">
                              {task.assignedToName} {task.selfAssigned && '(Supplier)'}
                            </span>
                          </div>
                          {task.assignedToEmail && (
                            <div className="flex justify-between text-gray-300">
                              <span className="text-gray-500">Email:</span>
                              <span className="font-mono text-gray-200">{task.assignedToEmail}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-gray-300">
                            <span className="text-gray-500">Assigned At:</span>
                            <span className="text-gray-300">{formatDateTime(task.createdAt)}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span className="text-gray-500">Task Status:</span>
                            <span className={task.isUsed ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                              {task.isUsed ? '✓ Completed' : 'Active (Magic Link Sent)'}
                            </span>
                          </div>
                        </div>
                      ) : driver ? (
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between text-gray-300">
                            <span className="text-gray-500">Driver Name:</span>
                            <span className="font-semibold text-white">
                              {driver.firstName} {driver.lastName}
                            </span>
                          </div>
                          {driver.phone && (
                            <div className="flex justify-between text-gray-300">
                              <span className="text-gray-500">Phone:</span>
                              <span className="text-gray-200">{driver.phone}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">
                          {booking.status === 'PENDING_APPROVAL' || booking.status === 'PENDING'
                            ? 'Transfer request is pending confirmation. Driver can be assigned once confirmed.'
                            : 'No worker or driver has been assigned to this trip yet.'}
                        </div>
                      )}
                    </div>
                  );

                  if (isRound) {
                    return (
                      <div className="space-y-2">
                        {renderTaskCard('First Trip', outboundTask, booking.driver)}
                        {renderTaskCard('Return Trip', returnTask, null)}
                      </div>
                    );
                  }

                  return renderTaskCard('Transfer Trip', outboundTask, booking.driver);
                })()}
              </div>

              {/* Supplier Partner */}
              {booking.supplier && (
                <div className="bg-[#111111] rounded-lg border border-[#27272A] px-3 py-2.5 flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-blue-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase font-semibold text-[#71717A] tracking-wide">
                      Supplier Partner
                    </div>
                    <div className="text-sm text-white font-semibold mt-0.5 truncate">
                      {booking.supplier?.companyName || 'Independent Supplier'}
                    </div>
                    {booking.supplier?.phone && (
                      <span className="text-xs text-gray-400 mt-0.5 block">{booking.supplier.phone}</span>
                    )}
                    {booking.supplier?.email && (
                      <span className="text-xs text-gray-500 font-mono block">{booking.supplier.email}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Audit Details */}
          {/* <div className="bg-[#18181B] p-4 rounded-xl border border-[#27272A] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#FCD223] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-[#FCD223]" /> Payment Details
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle className="h-3 w-3" /> {booking.paymentStatus || 'PAID'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#27272A] text-xs">
              <div>
                <span className="text-[#71717A] block">Payment Method:</span>
                <span className="text-white font-medium">{booking.paymentMethod || 'CARD'}</span>
              </div>
              {booking.stripePaymentIntentId && (
                <div>
                  <span className="text-[#71717A] block">Stripe Ref:</span>
                  <span className="text-gray-300 font-mono truncate block" title={booking.stripePaymentIntentId}>
                    {booking.stripePaymentIntentId}
                  </span>
                </div>
              )}
            </div>

            {Number(booking.basePrice || 0) > 0 && (
              <div className="flex gap-4 text-xs text-gray-400 pt-2 border-t border-[#27272A]">
                <span>
                  Base: {booking.currency || 'EUR'} {Number(booking.basePrice).toFixed(2)}
                </span>
                {Number(booking.extrasFee || 0) > 0 && <span>Extras: +{Number(booking.extrasFee).toFixed(2)}</span>}
                {Number(booking.discountAmount || 0) > 0 && (
                  <span className="text-emerald-400">Discount: -{Number(booking.discountAmount).toFixed(2)}</span>
                )}
              </div>
            )}
          </div> */}

          {/* Cancellation Reason if cancelled */}
          {booking.cancellationReason && (
            <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl text-xs text-red-400 space-y-1">
              <span className="font-semibold uppercase tracking-wider block text-[10px]">Cancellation Reason</span>
              <p className="italic text-gray-200">{booking.cancellationReason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#27272A] pt-4 mt-2 shrink-0">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#27272A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#3F3F46] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
