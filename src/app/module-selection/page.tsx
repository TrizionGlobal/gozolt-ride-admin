'use client';

import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/stores/sidebar.store';
import Image from 'next/image';
import { Topbar } from '@/components/layout/topbar';

export default function ModuleSelectionPage() {
  const router = useRouter();
  const { setActiveModule } = useSidebarStore();

  const handleSelection = (module: 'CAB' | 'RENTAL' | 'BIKE_RENTAL') => {
    setActiveModule(module);
    if (module === 'CAB') {
      router.push('/');
    } else {
      router.push('/car-rentals');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Topbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-6xl w-full text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Welcome to the <span className="text-[#FFD700]">Admin Portal</span>
            </h1>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              Select the module you wish to manage today. You can always switch between modules later from the sidebar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Cab Booking Card */}
            <button 
              onClick={() => handleSelection('CAB')}
              className="group relative flex flex-col items-center justify-start p-8 rounded-3xl border border-[#2A2A2A] bg-[#141414] transition-all duration-300 hover:border-[#FFD700] hover:bg-[#1A1A1A] hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] text-center h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-3xl" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-[#2A2A2A] group-hover:border-[#FFD700]/50 transition-colors">
                  <Image src="/cab-icon.jpg" alt="Cab Booking" width={80} height={80} className="object-cover w-full h-full" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Cab Booking</h2>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Centrally manage platform-wide fleet operations, driver accounts, and passenger rides.
                  </p>
                </div>
              </div>
            </button>

            {/* Car Rentals Card */}
            <button 
              onClick={() => handleSelection('RENTAL')}
              className="group relative flex flex-col items-center justify-start p-8 rounded-3xl border border-[#2A2A2A] bg-[#141414] transition-all duration-300 hover:border-[#FFD700] hover:bg-[#1A1A1A] hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] text-center h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-3xl" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-[#2A2A2A] group-hover:border-[#FFD700]/50 transition-colors">
                  <Image src="/rental-icon.jpg" alt="Car Rentals" width={80} height={80} className="object-cover w-full h-full" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Car Rentals</h2>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Centrally manage global vehicle inventory, suppliers, and customer bookings.
                  </p>
                </div>
              </div>
            </button>

            {/* Bike Rentals Card */}
            <button 
              onClick={() => handleSelection('BIKE_RENTAL')}
              className="group relative flex flex-col items-center justify-start p-8 rounded-3xl border border-[#27272A] bg-[#111111] transition-all duration-300 hover:border-[#FACC15] hover:bg-[#1A1A1A] hover:shadow-[0_0_30px_rgba(250,204,21,0.15)] text-center h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FACC15]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-3xl" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-[#27272A] group-hover:border-[#FACC15]/50 transition-colors bg-white">
                  <Image src="/bike-rental-icon-v2.jpg" alt="Bike Rentals" width={80} height={80} className="object-cover w-full h-full" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Bike Rentals</h2>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Centrally manage global bike fleets, supplier accounts, and reservations.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
