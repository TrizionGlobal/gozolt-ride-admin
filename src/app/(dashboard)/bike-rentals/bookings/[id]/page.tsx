'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getBikeRentalBookingDetails } from '@/hooks/use-admin-bike-rentals';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function AdminBikeRentalBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Status helper functions
  const getStatusBadgeClass = (b: any): string => {
    const ext = b.extensionRequests?.[0];
    if (ext?.status === 'APPROVED') return 'border-[#8B5CF6]/20 bg-[#8B5CF6]/10 text-[#8B5CF6]';
    if (ext?.status === 'CANCELLED') return 'border-[#F97316]/20 bg-[#F97316]/10 text-[#F97316]';
    if (ext?.status === 'REJECTED') return 'border-[#EF4444]/20 bg-[#EF4444]/10 text-[#EF4444]';
    if (b.status === 'COMPLETED') return 'border-[#22C55E]/20 bg-[#22C55E]/10 text-[#22C55E]';
    if (b.status === 'ACTIVE') return 'border-[#3B82F6]/20 bg-[#3B82F6]/10 text-[#3B82F6]';
    if (b.status === 'CONFIRMED') return 'border-[#FACC15]/20 bg-[#FACC15]/10 text-[#FACC15]';
    if (b.status === 'PENDING_APPROVAL') return 'border-[#F97316]/20 bg-[#F97316]/10 text-[#F97316]';
    if (b.status === 'CANCELLED' || b.status === 'REJECTED') return 'border-[#EF4444]/20 bg-[#EF4444]/10 text-[#EF4444]';
    return 'border-[#6B7280]/20 bg-[#6B7280]/10 text-[#6B7280]';
  };

  const getStatusLabel = (b: any): string => {
    const ext = b.extensionRequests?.[0];
    let s = b.status || '';
    if (ext?.status === 'APPROVED') s = 'Extended';
    else if (ext?.status === 'CANCELLED') s = 'Ext. Cancelled';
    else if (ext?.status === 'REJECTED') s = 'Ext. Rejected';
    else if (s === 'ACTIVE') s = 'On Rent';
    else if (s === 'CANCELLED') s = 'User Cancelled';
    
    return s.replace(/_/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  useEffect(() => {
    if (bookingId) {
      setLoading(true);
      getBikeRentalBookingDetails(bookingId)
        .then(data => {
          setBooking(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [bookingId]);

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

      {/* Content */}
      <div className="text-white space-y-6">
        {/* Top Summary */}
        <div className="flex justify-between items-start bg-[#111111] p-6 rounded-xl border border-[#27272A]">
          <div>
            <h3 className="text-xl font-semibold text-white">{booking.bike?.name}</h3>
            <p className="text-sm text-[#A1A1AA] mt-1">Bike ID: CR-{booking.bike?.id.substring(0, 8).toUpperCase()} | Category: {booking.bike?.category?.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}</p>
            {booking.bike?.supplier && (
              <p className="text-sm text-[#A1A1AA] mt-1">Supplier: <span className="font-medium text-white">{booking.bike.supplier.companyName}</span></p>
            )}
          </div>
          <div className="text-right">
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusBadgeClass(booking)}`}>
              {getStatusLabel(booking)}
            </span>
          </div>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-2 gap-6">
          
          {/* Customer Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Customer Details</h4>
            <div className="bg-[#111111] p-5 rounded-xl border border-[#27272A] text-sm space-y-3">
              <div className="flex justify-between"><span className="text-[#A1A1AA]">Name:</span> <span className="font-medium">{booking.user?.firstName} {booking.user?.lastName}</span></div>
              <div className="flex justify-between"><span className="text-[#A1A1AA]">Mobile:</span> <span className="font-medium">{booking.user?.phone || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-[#A1A1AA]">Email:</span> <span className="font-medium">{booking.user?.email || 'N/A'}</span></div>
            </div>
          </div>

          {/* Rental Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Rental Details</h4>
            <div className="bg-[#111111] p-5 rounded-xl border border-[#27272A] text-sm space-y-3">
              <div className="flex justify-between"><span className="text-[#A1A1AA]">Pickup Date & Time:</span> <span className="font-medium">{formatDate(booking.startDate)}</span></div>
              <div className="flex justify-between"><span className="text-[#A1A1AA]">Pickup Location:</span> <span className="font-medium truncate max-w-[200px]" title={booking.pickupLocation}>{booking.pickupLocation}</span></div>
              <div className="flex justify-between"><span className="text-[#A1A1AA]">Return Date & Time:</span> <span className="font-medium">{formatDate(booking.endDate)}</span></div>
              <div className="flex justify-between"><span className="text-[#A1A1AA]">Return Location:</span> <span className="font-medium truncate max-w-[200px]" title={booking.dropoffLocation}>{booking.dropoffLocation}</span></div>
              <div className="flex justify-between"><span className="text-[#A1A1AA]">Delivery Option:</span> <span className="font-medium">{booking.deliveryType?.replace('_', ' ')}</span></div>
            </div>
          </div>

          {/* Pricing & Payment Details */}
          <div className="col-span-2 space-y-4">
            <h4 className="font-semibold text-white text-lg">Payment Details</h4>
            <div className="bg-[#111111] p-5 rounded-xl border border-[#27272A] text-sm space-y-3">
              {(() => {
                const start = new Date(booking.startDate);
                const end = new Date(booking.endDate);
                let d = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                if (d < 1) d = 1;

                const bikeRate = Number(booking.bikeTotal || (booking.bike?.pricePerDay * d) || 0);

                return (
                  <>
                    <div className="flex justify-between"><span className="text-[#A1A1AA]">Bike Rate:</span> <span className="font-medium">€{bikeRate.toFixed(2)}</span></div>
                    
                    {booking.isFlexible && (
                      <div className="flex justify-between"><span className="text-[#A1A1AA]">Stay Flexible:</span> <span className="font-medium">€{Number(booking.flexibleTotal || 0).toFixed(2)}</span></div>
                    )}

                    {/* Protection Package */}
                    {booking.selectedPackage && (
                      <div className="flex justify-between">
                        <span className="text-[#A1A1AA]">{booking.selectedPackage.name || 'Protection Package'}:</span> 
                        <span className="font-medium">€{Number(booking.packagesTotal || 0).toFixed(2)}</span>
                      </div>
                    )}

                    {/* Delivery & Taxes */}
                    {(() => {
                      const fee = Number(booking.deliveryFee || 0);
                      if (fee <= 0) return null;
                      
                      const pickup = booking.pickupLocation || 'Self Pickup';
                      const dropoff = booking.dropoffLocation || pickup;
                      
                      const hasCustomPickup = pickup !== 'Self Pickup';
                      const hasCustomDropoff = dropoff !== 'Self Pickup' && dropoff !== pickup;
                      
                      if (hasCustomPickup && hasCustomDropoff) {
                        return (
                          <>
                            <div className="flex justify-between"><span className="text-[#A1A1AA]">Pickup Fee:</span> <span className="font-medium">€{(fee * 0.89).toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-[#A1A1AA]">Dropoff Fee:</span> <span className="font-medium">€{(fee * 0.11).toFixed(2)}</span></div>
                          </>
                        );
                      } else if (hasCustomPickup) {
                        return <div className="flex justify-between"><span className="text-[#A1A1AA]">Pickup Fee:</span> <span className="font-medium">€{fee.toFixed(2)}</span></div>;
                      } else if (hasCustomDropoff) {
                        return <div className="flex justify-between"><span className="text-[#A1A1AA]">Dropoff Fee:</span> <span className="font-medium">€{fee.toFixed(2)}</span></div>;
                      } else {
                        return <div className="flex justify-between"><span className="text-[#A1A1AA]">Delivery Fee:</span> <span className="font-medium">€{fee.toFixed(2)}</span></div>;
                      }
                    })()}
                    {Number(booking.taxes) > 0 && (
                      <div className="flex justify-between"><span className="text-[#A1A1AA]">Taxes:</span> <span className="font-medium">€{Number(booking.taxes || 0).toFixed(2)}</span></div>
                    )}

                    <div className="flex justify-between font-bold pt-3 border-t border-[#27272A]">
                      <span className="text-white">Grand Total:</span> 
                      <span className="text-[#FACC15]">€{Number(booking.grandTotal || 0).toFixed(2)}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
          
          {/* Documents */}
          <div className="col-span-2 space-y-4">
            <h4 className="font-semibold text-white text-lg">Documents</h4>
            {(booking.drivingLicenceUrl || booking.nationalIdUrl) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.drivingLicenceUrl && (
                  <div className="bg-[#111111] p-5 rounded-xl border border-[#27272A] text-sm flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white font-medium capitalize">Driving License</span>
                      <span className="text-[#A1A1AA] text-xs">Uploaded document</span>
                    </div>
                    <a href={booking.drivingLicenceUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#27272A] text-white rounded-lg hover:bg-[#3F3F46] text-sm font-medium transition-colors border border-[#3F3F46] text-center inline-block">
                      View Document
                    </a>
                  </div>
                )}
                {booking.nationalIdUrl && (
                  <div className="bg-[#111111] p-5 rounded-xl border border-[#27272A] text-sm flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white font-medium capitalize">National ID</span>
                      <span className="text-[#A1A1AA] text-xs">Uploaded document</span>
                    </div>
                    <a href={booking.nationalIdUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#27272A] text-white rounded-lg hover:bg-[#3F3F46] text-sm font-medium transition-colors border border-[#3F3F46] text-center inline-block">
                      View Document
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#111111] p-5 rounded-xl border border-[#27272A] text-sm text-[#A1A1AA]">
                No documents uploaded.
              </div>
            )}
          </div>
          
          {/* Extensions */}
          {booking.extensionRequests && booking.extensionRequests.length > 0 && (
            <div className="col-span-2 space-y-4">
              <h4 className="font-semibold text-white text-lg">Extensions</h4>
              <div className="bg-[#111111] p-5 rounded-xl border border-[#27272A] text-sm space-y-3">
                {booking.extensionRequests.map((ext: any) => {
                  const getExtBadgeClass = (s: string) => {
                    if (s === 'APPROVED') return 'border-[#8B5CF6]/20 bg-[#8B5CF6]/10 text-[#8B5CF6]';
                    if (s === 'CANCELLED') return 'border-[#F97316]/20 bg-[#F97316]/10 text-[#F97316]';
                    if (s === 'REJECTED') return 'border-[#EF4444]/20 bg-[#EF4444]/10 text-[#EF4444]';
                    if (s === 'PENDING') return 'border-[#FACC15]/20 bg-[#FACC15]/10 text-[#FACC15]';
                    return 'border-[#3F3F46] bg-[#27272A] text-white';
                  };
                  return (
                    <div key={ext.id} className="flex flex-col gap-2 pb-3 border-b border-[#27272A] last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white">To {formatDate(ext.newEndDate)}</span>
                        <span className={`px-2 py-1 text-xs border rounded-md uppercase ${getExtBadgeClass(ext.status)}`}>{ext.status}</span>
                      </div>
                      <div className="flex justify-between text-[#A1A1AA]">
                        <span>Added Cost:</span>
                        <span>€{ext.additionalCost}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
