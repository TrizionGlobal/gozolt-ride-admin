'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCarRentalBookingDetails } from '@/hooks/use-admin-car-rentals';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function AdminCarRentalBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      setLoading(true);
      getCarRentalBookingDetails(bookingId)
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
            <h3 className="text-xl font-semibold text-white">{booking.vehicle?.name}</h3>
            <p className="text-sm text-[#A1A1AA] mt-1">Vehicle ID: CR-{booking.vehicle?.id.substring(0, 8).toUpperCase()} | Category: {booking.vehicle?.category?.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}</p>
            {booking.vehicle?.supplier && (
              <p className="text-sm text-[#A1A1AA] mt-1">Supplier: <span className="font-medium text-white">{booking.vehicle.supplier.companyName}</span></p>
            )}
          </div>
          <div className="text-right">
            <span className="px-4 py-1.5 bg-[#27272A] text-white rounded-full text-sm font-medium border border-[#3F3F46]">{booking.status}</span>
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

                const vehicleRate = Number(booking.vehicleTotal || (booking.vehicle?.pricePerDay * d) || 0);

                return (
                  <>
                    <div className="flex justify-between"><span className="text-[#A1A1AA]">Vehicle Rate:</span> <span className="font-medium">€{vehicleRate.toFixed(2)}</span></div>
                    
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

                    {/* Add-ons */}
                    {booking.addOns?.map((addon: any, idx: number) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-[#A1A1AA]">{addon.name} x{addon.quantity || 1}:</span>
                        <span className="font-medium">€{Number((addon.pricePerDay || addon.price || 0) * d * (addon.quantity || 1)).toFixed(2)}</span>
                      </div>
                    ))}

                    {/* Delivery & Taxes */}
                    {Number(booking.deliveryFee) > 0 && (
                      <div className="flex justify-between"><span className="text-[#A1A1AA]">Delivery Fee:</span> <span className="font-medium">€{Number(booking.deliveryFee || 0).toFixed(2)}</span></div>
                    )}
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
                {booking.extensionRequests.map((ext: any) => (
                  <div key={ext.id} className="flex flex-col gap-2 pb-3 border-b border-[#27272A] last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">To {formatDate(ext.newEndDate)}</span>
                      <span className="px-2 py-1 text-xs border border-[#3F3F46] rounded-md uppercase">{ext.status}</span>
                    </div>
                    <div className="flex justify-between text-[#A1A1AA]">
                      <span>Added Cost:</span>
                      <span>€{ext.additionalCost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
