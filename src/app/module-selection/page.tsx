'use client';

import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/stores/sidebar.store';
import Image from 'next/image';
import { Topbar } from '@/components/layout/topbar';

export default function ModuleSelectionPage() {
  const router = useRouter();
  const { setActiveModule } = useSidebarStore();

  const handleSelection = (module: 'CAB' | 'RENTAL') => {
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
        <div className="max-w-4xl w-full text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Welcome to the <span className="text-[#FFD700]">Admin Portal</span>
            </h1>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              Select the module you wish to manage today. You can always switch between modules later from the sidebar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Cab Booking Card */}
            <button 
              onClick={() => handleSelection('CAB')}
              className="group relative flex flex-col items-center justify-center p-12 rounded-3xl border border-[#2A2A2A] bg-[#141414] transition-all duration-300 hover:border-[#FFD700] hover:bg-[#1A1A1A] hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-3xl" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-[#2A2A2A] group-hover:border-[#FFD700]/50 transition-colors">
                  <Image src="/cab-icon.jpg" alt="Cab Booking" width={128} height={128} className="object-cover w-full h-full" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Cab Booking</h2>
                  <p className="text-sm text-[#6B7280]">
                    Manage active fleet, drivers, users, ride history, global settlements, and live tracking for Cab services.
                  </p>
                </div>
              </div>
            </button>

            {/* Car Rentals Card */}
            <button 
              onClick={() => handleSelection('RENTAL')}
              className="group relative flex flex-col items-center justify-center p-12 rounded-3xl border border-[#2A2A2A] bg-[#141414] transition-all duration-300 hover:border-[#FFD700] hover:bg-[#1A1A1A] hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-3xl" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-[#2A2A2A] group-hover:border-[#FFD700]/50 transition-colors">
                  <Image src="/rental-icon.jpg" alt="Car Rentals" width={128} height={128} className="object-cover w-full h-full" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Car Rentals</h2>
                  <p className="text-sm text-[#6B7280]">
                    Manage global supplier rental vehicles, track global rental bookings, and review rental customers.
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
