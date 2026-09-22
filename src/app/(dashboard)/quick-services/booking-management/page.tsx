'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, ClipboardList } from 'lucide-react';

import { QUICK_SERVICE_CATEGORIES } from '@/lib/quick-services';

export default function QuickServicesBookingSelectionPage() {
  const router = useRouter();

  const openServiceBookings = (slug: string) => {
    router.push(
      `/quick-services/booking-management/${slug}`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414]">
          <Image
            src="/quick-services-icon.png"
            alt="Quick Services"
            width={64}
            height={64}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            Quick Services Booking Management
          </h1>

          <p className="mt-1 text-sm text-[#6B7280]">
            Select a Quick Service category to review its
            bookings, customer requirements, schedules and
            assigned professionals.
          </p>
        </div>
      </div>

      {/* Information */}
      <div className="flex items-center gap-3 rounded-xl border border-[#FCD223]/20 bg-[#FCD223]/5 p-4">
        <ClipboardList className="h-5 w-5 shrink-0 text-[#FCD223]" />

        <p className="text-sm text-[#D1D5DB]">
          Select one of the 12 categories below to open its
          Booking Management page.
        </p>
      </div>

      {/* 12 Quick Service cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {QUICK_SERVICE_CATEGORIES.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() =>
              openServiceBookings(service.slug)
            }
            className="group relative flex min-h-56 flex-col items-center justify-between overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#FCD223] hover:bg-[#1A1A1A] hover:shadow-[0_10px_30px_rgba(252,210,35,0.12)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FCD223]/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 flex w-full flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A]">
                <Image
                  src={service.icon}
                  alt={service.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>

              <h2 className="mt-4 text-base font-bold text-white">
                {service.name}
              </h2>

              {service.childServices.length > 0 ? (
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#6B7280]">
                  {service.childServices.join(' • ')}
                </p>
              ) : (
                <p className="mt-2 text-xs text-[#6B7280]">
                  View service bookings
                </p>
              )}
            </div>

            <div className="relative z-10 mt-4 flex items-center gap-1 text-xs font-semibold text-[#FCD223]">
              View Bookings
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}