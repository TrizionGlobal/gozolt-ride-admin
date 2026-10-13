'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle2, XCircle, UserPlus, Loader2 } from 'lucide-react';
import { getQuickServiceBookingDetails, useActiveSuppliers } from '@/hooks/use-admin-quick-services';
import { apiClient as adminApi } from '@/lib/api-client';
import { getExpertVisitName, getQuickServiceHourlyRate } from '@/lib/quick-services-pricing';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function AdminQuickServiceBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Assign supplier state
  const suppliers = useActiveSuppliers();
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');

  const fetchBooking = () => {
    setLoading(true);
    getQuickServiceBookingDetails(bookingId)
      .then(data => {
        setBooking(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (bookingId) fetchBooking();
  }, [bookingId]);

  const handleAssign = async () => {
    if (!selectedSupplier) {
      setAssignError('Please select a supplier');
      return;
    }
    
    setAssigning(true);
    setAssignError('');
    try {
      await adminApi.post(`/quick-services/admin/assign/${bookingId}`, {
        supplierId: selectedSupplier
      });
      fetchBooking(); // Refresh the booking details
    } catch (error: any) {
      console.error('Failed to assign:', error);
      setAssignError(error?.response?.data?.message || 'Failed to assign supplier');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FACC15] border-t-transparent" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white">Booking not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-[#FACC15] hover:underline">
          Go back to bookings
        </button>
      </div>
    );
  }

  // Parse JSON objects safely
  let addOns = [];
  try {
    if (typeof booking.addOns === 'string') addOns = JSON.parse(booking.addOns);
    else if (Array.isArray(booking.addOns)) addOns = booking.addOns;
  } catch (e) {}

  let features: any = {};
  try {
    if (typeof booking.options === 'string') features = JSON.parse(booking.options);
    else if (booking.options && typeof booking.options === 'object') features = booking.options;
  } catch (e) {}

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="rounded-lg border border-[#27272A] bg-[#111111] p-2 text-white hover:bg-[#1A1A1A] transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Booking Details</h1>
            <p className="text-sm text-[#A1A1AA]">ID: {bookingId}</p>
          </div>
        </div>
        
        {!booking.supplier && booking.status === 'PENDING' && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white whitespace-nowrap">Assign a Supplier:</span>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <select
                  className="w-48 rounded-md border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                >
                  <option value="">Select supplier...</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.companyName}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={assigning || !selectedSupplier}
                  className="flex items-center justify-center rounded-md bg-amber-500 px-4 py-1.5 text-sm font-bold text-black hover:bg-amber-600 disabled:opacity-50 transition-colors"
                >
                  {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  <span className="ml-2 hidden sm:inline">Assign</span>
                </button>
              </div>
              {assignError && <p className="text-red-400 text-xs mt-1 text-right">{assignError}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Supplier */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`grid grid-cols-1 ${booking.supplier ? 'md:grid-cols-2' : ''} gap-6`}>
            <div className="bg-[#111111] rounded-xl border border-[#27272A] p-5">
              <h3 className="font-semibold text-white text-lg mb-4">Customer Info</h3>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[#A1A1AA] text-xs">Name</span>
                  <span className="text-white font-medium">{booking.userName || `${booking.user?.firstName} ${booking.user?.lastName}`}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#A1A1AA] text-xs">Email</span>
                  <span className="text-white font-medium">{booking.userEmail || booking.user?.email || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#A1A1AA] text-xs">Phone</span>
                  <span className="text-white font-medium">{booking.userPhone || booking.user?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {booking.supplier && (
              <div className="bg-[#111111] rounded-xl border border-[#27272A] p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-white text-lg mb-4">Supplier Info</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-[#A1A1AA] text-xs">Company Name</span>
                      <span className="text-white font-medium">{booking.supplier.companyName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#A1A1AA] text-xs">Contact Email</span>
                      <span className="text-white font-medium">{booking.supplier.email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#A1A1AA] text-xs">Contact Phone</span>
                      <span className="text-white font-medium">{booking.supplier.contactPhone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#111111] rounded-xl border border-[#27272A] p-5">
            <h3 className="font-semibold text-white text-lg mb-4">Service Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[#A1A1AA] text-xs">Service Category</span>
                <span className="text-white font-medium">{booking.serviceCategory}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#A1A1AA] text-xs">Scheduled Time</span>
                <span className="text-white font-medium">{formatDate(booking.bookingDate)}</span>
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-[#A1A1AA] text-xs">Location</span>
                <span className="text-white font-medium">{booking.location || 'N/A'}</span>
              </div>
            </div>
          </div>

          {(booking.requirements || (booking.images && booking.images.length > 0)) && (
            <div className="bg-[#111111] rounded-xl border border-[#27272A] p-5">
              <h3 className="font-semibold text-white text-lg mb-4">Additional Details</h3>
              <div className="space-y-4">
                {booking.requirements && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[#A1A1AA] text-xs">Requirements / Issue Description</span>
                    <p className="text-white text-sm bg-[#1A1A1A] p-3 rounded-md border border-[#27272A] whitespace-pre-wrap">
                      {booking.requirements}
                    </p>
                  </div>
                )}
                {booking.images && booking.images.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[#A1A1AA] text-xs">Attached Photos</span>
                    <div className="flex gap-3 flex-wrap">
                      {booking.images.map((img: string, idx: number) => (
                        <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="block relative h-20 w-20 rounded-md overflow-hidden border border-[#27272A] hover:border-[#FACC15] transition-colors">
                          <img src={img} alt={`Attachment ${idx + 1}`} className="object-cover w-full h-full" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {(features.startedAt || features.endedAt || features.finalDurationHrs !== undefined) && (
            <div className="bg-[#111111] rounded-xl border border-[#27272A] p-5">
              <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FACC15]" />
                Work Timing & Duration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.startedAt && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[#A1A1AA] text-xs">Work Started</span>
                    <span className="text-white font-medium">{formatDate(features.startedAt)}</span>
                  </div>
                )}
                {features.endedAt && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[#A1A1AA] text-xs">Work Ended</span>
                    <span className="text-white font-medium">{formatDate(features.endedAt)}</span>
                  </div>
                )}
                {features.finalDurationHrs !== undefined && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[#A1A1AA] text-xs">Billed Duration</span>
                    <span className="text-[#FACC15] font-medium">{Math.max(1, Math.ceil(Number(features.finalDurationHrs)))} hour(s)</span>
                  </div>
                )}
                {features.finalHourlyCost !== undefined && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[#A1A1AA] text-xs">Service Charge</span>
                    <span className="text-emerald-400 font-medium">€{Number(features.finalHourlyCost).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-[#111111] rounded-xl border border-[#27272A] p-5">
            <h3 className="font-semibold text-white text-lg mb-4">Features Selection</h3>
            {Object.keys(features).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(features)
                  .filter(([key]) => {
                    const norm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return !['isvalidated', 'validationpin', 'beautytreatmentssubtotal', 'startedat', 'endedat', 'finalhourlycost', 'finaldurationhrs', 'durationhours', 'durationminutes', 'hourlyrate', 'serviceamount', 'alreadypaid', 'upfrontfee', 'materialcost', 'issuedescription', 'requirements'].includes(norm);
                  })
                  .map(([key, val]) => (
                  <div key={key} className="flex flex-col gap-1 border-b border-[#27272A] pb-3 last:border-0 last:pb-0">
                    <span className="text-[#A1A1AA] font-medium">{key}</span>
                    {Array.isArray(val) ? (
                      <div className="flex flex-col gap-2 mt-1">
                        {val.map((item: any, i: number) => (
                          <div key={i} className="bg-[#1A1A1A] p-3 rounded-md border border-[#27272A]">
                            {typeof item === 'object' && item !== null ? (
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(item).filter(([_, v]) => v != null && v !== '').map(([k, v]) => (
                                  <div key={k} className="flex flex-col">
                                    <span className="text-[#71717A] text-xs uppercase tracking-wider">{k}</span>
                                    <span className="text-white text-sm">{String(v)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-white text-sm">• {String(item)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-white font-medium text-sm">
                        {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[#A1A1AA] text-sm">No features selected.</div>
            )}
          </div>
          
          {addOns.length > 0 && (
            <div className="bg-[#111111] rounded-xl border border-[#27272A] p-5">
              <h3 className="font-semibold text-white text-lg mb-4">Add-ons Selection</h3>
              <div className="space-y-3">
                {addOns.map((addon: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-[#A1A1AA]">{addon.name}:</span>
                    <span className="text-white font-medium">
                      {addon.price !== undefined && addon.price !== null
                        ? `€${Number(addon.price).toFixed(2)}`
                        : `${addon.count} item(s)`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Status */}
        <div className="space-y-6">
          <div className="bg-[#111111] rounded-xl border border-[#27272A] p-5">
            <h3 className="font-semibold text-white text-lg mb-4">Status</h3>
            {(() => {
              let colorClass = 'bg-gray-900/40 text-gray-400 border-gray-800';
              let Icon = Clock;
              let displayStatus = booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase() : 'Unknown';

              if (booking.status === 'COMPLETED') {
                colorClass = 'bg-green-900/40 text-green-400 border-green-800';
                Icon = CheckCircle2;
                displayStatus = 'Completed';
              } else if (booking.status === 'ASSIGNED') {
                colorClass = 'bg-blue-900/40 text-blue-400 border-blue-800';
                Icon = CheckCircle2;
                displayStatus = 'Assigned';
              } else if (booking.status === 'IN_PROGRESS') {
                colorClass = 'bg-purple-900/40 text-purple-400 border-purple-800';
                Icon = Clock;
                displayStatus = 'In Progress';
              } else if (booking.status === 'PENDING') {
                colorClass = 'bg-yellow-900/40 text-yellow-400 border-yellow-800';
                Icon = Clock;
                displayStatus = 'Pending';
              } else if (booking.status === 'CANCELLED') {
                colorClass = 'bg-red-900/40 text-red-400 border-red-800';
                Icon = XCircle;
                displayStatus = 'Cancelled';
              }

              return (
                <div className="flex justify-start">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-sm font-medium ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                    {displayStatus}
                  </span>
                </div>
              );
            })()}
          </div>

          <div className="bg-[#111111] rounded-xl border border-[#27272A] p-5">
            <h3 className="font-semibold text-white text-lg mb-4">Payment Summary</h3>
            <div className="space-y-3 text-sm">
              {/* 1. Already Paid Online Section */}
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#A1A1AA] font-semibold block mb-1">
                  Already Paid Online
                </span>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Upfront Booking Fee:</span>
                  <span className="text-white font-medium">€{Number(booking.upfrontFee || 0).toFixed(2)}</span>
                </div>
                {Number(booking.materialCost || 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Materials Included:</span>
                    <span className="text-white font-medium">€{Number(booking.materialCost || 0).toFixed(2)}</span>
                  </div>
                )}
                {Number(booking.discountAmount) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">GoCoins Discount:</span>
                    <span className="text-[#FACC15] font-medium">-€{Number(booking.discountAmount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t border-white/10 font-medium text-xs">
                  <span className="text-gray-300">Total Settled Online:</span>
                  <span className="text-emerald-400 font-bold">
                    €{(Number(booking.upfrontFee || 0) + Number(booking.materialCost || 0) - Number(booking.discountAmount || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 2. Service Amount Section */}
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#A1A1AA] font-semibold block mb-1">
                  Service Work Charge
                </span>
                {(booking.serviceCategory?.toLowerCase().includes('beauty') || booking.serviceCategory?.toLowerCase().includes('wellness') || booking.serviceTitle?.toLowerCase().includes('beauty') || booking.serviceTitle?.toLowerCase().includes('wellness')) ? (
                  <div className="flex justify-between items-center">
                    <span className="text-[#A1A1AA]">Selected Treatments:</span>
                    <span className="text-emerald-400 font-bold">
                      €{Number(features.beautyTreatmentsSubtotal || 0).toFixed(2)}
                    </span>
                  </div>
                ) : features.finalDurationHrs !== undefined ? (
                  <div className="flex justify-between items-center">
                    <span className="text-[#A1A1AA]">
                      {getExpertVisitName(booking.serviceTitle || '')} ({Number(features.finalDurationHrs).toFixed(1)} hrs):
                    </span>
                    <span className="text-emerald-400 font-bold">
                      €{Number(features.finalHourlyCost || 0).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-[#A1A1AA]">{getExpertVisitName(booking.serviceTitle || '')} (Rate):</span>
                    <span className="text-white font-medium">€{getQuickServiceHourlyRate(booking.serviceTitle || '').toFixed(2)} / hr</span>
                  </div>
                )}
              </div>

              {/* 3. Estimated Spare Price (Informational Only) */}
              {booking.estimatedPrice && (
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-amber-500/5 border border-amber-500/15 text-xs">
                  <span className="text-[#A1A1AA]">Estimated Spare Price:</span>
                  <div className="text-right">
                    <span className="text-amber-400 font-medium block">{booking.estimatedPrice}</span>
                    <span className="text-[10px] text-gray-400 block">(Estimate only, not included in total)</span>
                  </div>
                </div>
              )}

              {/* 4. Payment Breakdown (Separated, Not Combined) */}
              <div className="pt-2 border-t border-[#27272A] space-y-2.5">
                {booking.status === 'COMPLETED' ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1AA]">Already Paid Online:</span>
                      <span className="text-emerald-400 font-semibold">
                        €{(Number(booking.upfrontFee || 0) + Number(booking.materialCost || 0) - Number(booking.discountAmount || 0)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1AA]">Service Amount:</span>
                      <span className="text-white font-semibold">
                        €{Number(features.finalHourlyCost || (Number(booking.totalAmount || 0) - (Number(booking.upfrontFee || 0) + Number(booking.materialCost || 0)))).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                      <span>Service Charge Status:</span>
                      <span>Paid (€{Number(features.finalHourlyCost || (Number(booking.totalAmount || 0) - (Number(booking.upfrontFee || 0) + Number(booking.materialCost || 0)))).toFixed(2)})</span>
                    </div>
                  </>
                ) : booking.status === 'AWAITING_PAYMENT' ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1AA]">Already Paid Online:</span>
                      <span className="text-emerald-400 font-semibold">
                        €{(Number(booking.upfrontFee || 0) + Number(booking.materialCost || 0) - Number(booking.discountAmount || 0)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1AA]">Service Amount:</span>
                      <span className="text-amber-400 font-semibold">
                        €{Number(features.finalHourlyCost || Math.max(0, Number(booking.totalAmount || 0) - (Number(booking.upfrontFee || 0) + Number(booking.materialCost || 0) - Number(booking.discountAmount || 0)))).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-sm text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                      <span>Service Amount Due:</span>
                      <span className="text-base">
                        €{Number(features.finalHourlyCost || Math.max(0, Number(booking.totalAmount || 0) - (Number(booking.upfrontFee || 0) + Number(booking.materialCost || 0) - Number(booking.discountAmount || 0)))).toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between font-bold text-base">
                      <span className="text-white">Amount Paid Online:</span>
                      <span className="text-[#FACC15]">
                        €{(Number(booking.upfrontFee || 0) + Number(booking.materialCost || 0) - Number(booking.discountAmount || 0)).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#71717A] italic">
                      Service charge is separate and will be billed upon completion.
                    </p>
                  </>
                )}

                {booking.status === 'CANCELLED' && booking.paymentStatus === 'PARTIALLY_REFUNDED' && (
                  <div className="flex justify-between text-red-400 mt-2 text-xs">
                    <span>Refunded (Materials):</span>
                    <span className="font-bold">-€{Number(booking.materialCost || 0).toFixed(2)}</span>
                  </div>
                )}
                {booking.status === 'CANCELLED' && booking.paymentStatus === 'PARTIALLY_REFUNDED' && (
                  <div className="flex justify-between text-green-400 font-bold text-xs">
                    <span>Platform Retained (Upfront Fee):</span>
                    <span>€{Number(booking.upfrontFee || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* 5. Payment Method & Status */}
              <div className="mt-4 pt-3 border-t border-[#27272A] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Payment Method:</span>
                  <span className="text-white font-medium uppercase">{booking.paymentMethodType || 'CARD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Payment Status:</span>
                  <span className={`font-semibold uppercase ${
                    booking.status === 'COMPLETED' ? 'text-emerald-400' :
                    booking.status === 'AWAITING_PAYMENT' ? 'text-amber-400' : 'text-blue-400'
                  }`}>
                    {booking.status === 'COMPLETED' ? 'PAID (COMPLETED)' :
                     booking.status === 'AWAITING_PAYMENT' ? 'PARTIALLY PAID (AWAITING SERVICE FEE)' :
                     (booking.paymentStatus || 'PAID (UPFRONT)')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
