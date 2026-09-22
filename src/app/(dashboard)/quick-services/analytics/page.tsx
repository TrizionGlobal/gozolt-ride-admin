import Image from 'next/image';
import { BarChart3 } from 'lucide-react';

import { QUICK_SERVICE_CATEGORIES } from '@/lib/quick-services';

export default function QuickServicesAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 overflow-hidden rounded-2xl border border-[#2A2A2A]">
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
            Quick Services Analytics
          </h1>

          <p className="mt-1 text-sm text-[#6B7280]">
            Analyse bookings, service demand, completion rates,
            supplier performance and customer activity.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#FCD223]" />

          <h2 className="font-semibold text-white">
            Demand by Service Category
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {QUICK_SERVICE_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-4"
            >
              <p className="font-medium text-white">
                {category.name}
              </p>

              <p className="mt-2 text-2xl font-bold text-[#FCD223]">
                0
              </p>

              <p className="text-xs text-[#6B7280]">
                bookings
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}