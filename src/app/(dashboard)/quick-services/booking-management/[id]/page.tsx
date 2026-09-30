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

  let features = {};
  try {
    if (typeof booking.options === 'string') features = JSON.parse(booking.options);
    else if (booking.options && typeof booking.options === 'object') features = booking.options;
  } catch (e) {}

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-[#27272A] pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="rounded-lg border border-[#27272A] bg-[#111111] p-2 text-white hover:bg-[#1A1A1A] transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Booking Details</h1>
            <p className="text-sm text-[#A1A1AA]">ID: {bookingId}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Supplier */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="bg-[#111111] rounded-xl border border-[#27272A] p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-white text-lg mb-4">Supplier Info</h3>
                {booking.supplier ? (
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
                ) : (
                  <div className="text-[#A1A1AA] text-sm">
                    No supplier assigned yet.
                  </div>
                )}
              </div>
              
              {!booking.supplier && booking.status === 'PENDING' && (
                <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                  <p className="text-xs text-[#A1A1AA] mb-2 font-medium">Assign a Supplier</p>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 rounded-md border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                    >
                      <option value="">Select supplier...</option>
                      {suppliers.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.companyName} ({s.email})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssign}
                      disabled={assigning || !selectedSupplier}
                      className="flex items-center justify-center rounded-md bg-amber-500 px-3 py-1.5 text-sm font-bold text-black hover:bg-amber-600 disabled:opacity-50 transition-colors"
                    >
                      {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    </button>
                  </div>
                  {assignError && <p className="text-red-400 text-xs mt-2">{assignError}</p>}
                </div>
              )}
            </div>
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
          
          <div className="bg-[#111111] rounded-xl border border-[#27272A] p-5">
            <h3 className="font-semibold text-white text-lg mb-4">Features Selection</h3>
            {Object.keys(features).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(features).map(([key, val]) => (
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
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Upfront Fee:</span>
                <span className="text-white font-medium">€{Number(booking.upfrontFee || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">{getExpertVisitName(booking.serviceTitle || '')}:</span>
                <span className="text-white font-medium">€{getQuickServiceHourlyRate(booking.serviceTitle || '').toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Materials Included:</span>
                <span className="text-white font-medium">€{Number(booking.materialCost || 0).toFixed(2)}</span>
              </div>
              {Number(booking.discountAmount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">GoCoins Discount:</span>
                  <span className="text-[#FACC15] font-medium">-€{Number(booking.discountAmount).toFixed(2)}</span>
                </div>
              )}
              {booking.estimatedPrice && (
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Estimated Spare Price:</span>
                  <span className="text-white font-medium">{booking.estimatedPrice}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#27272A] pt-3 font-bold">
                <span className="text-white">Total Amount:</span>
                <span className="text-[#FACC15]">€{Number(booking.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
            {booking.paymentMethodType && (
              <div className="mt-4 pt-4 border-t border-[#27272A]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A1AA]">Payment Method:</span>
                  <span className="text-white font-medium uppercase">{booking.paymentMethodType}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-[#A1A1AA]">Payment Status:</span>
                  <span className="text-white font-medium uppercase">{booking.paymentStatus}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
