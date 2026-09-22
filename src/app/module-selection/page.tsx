'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSidebarStore, type AdminModule, } from '@/stores/sidebar.store';
import { Topbar } from '@/components/layout/topbar';

interface ModuleCard {
  module: AdminModule;
  title: string;
  description: string;
  image: string;
  route: string;
}

const MODULES: ModuleCard[] = [
  {
    module: 'CAB',
    title: 'Cab Booking',
    description:
      'Centrally manage platform-wide fleet operations, driver accounts, and passenger rides.',
    image: '/cab-booking-icon.png',
    route: '/',
  },
  {
    module: 'RENTAL',
    title: 'Car Rentals',
    description:
      'Centrally manage vehicle inventory, suppliers, customer bookings, and rental operations.',
    image: '/car-rental-icon.png',
    route: '/car-rentals/dashboard',
  },
  {
    module: 'BIKE_RENTAL',
    title: 'Bike Rentals',
    description:
      'Centrally manage bike fleets, supplier accounts, customer bookings, and reservations.',
    image: '/bike-rental-icon.png',
    route: '/bike-rentals/dashboard',
  },
  {
    module: 'AIRPORT_TRANSFER',
    title: 'Airport Transfers',
    description:
      'Manage transfer bookings, passengers, flights, vehicles, suppliers, and scheduled journeys.',
    image: '/airport-transfers-icon.png',
    route: '/airport-transfers/dashboard',
  },
  {
    module: 'QUICK_SERVICES',
    title: 'Quick Services',
    description:
      'Manage service categories, customer requests, professionals, assignments, and bookings.',
    image: '/quick-services-icon.png',
    route: '/quick-services/dashboard',
  },
  {
    module: 'FOOD_GROCERY',
    title: 'Food & Groceries',
    description:
      'Manage restaurants, grocery partners, menus, products, orders, and delivery operations.',
    image: '/food-groceries-icon.png',
    route: '/food-groceries/dashboard',
  },
];

export default function ModuleSelectionPage() {
  const router = useRouter();
  const setActiveModule = useSidebarStore(
    (state) => state.setActiveModule,
  );

  const handleSelection = (
    module: AdminModule,
    route: string,
  ) => {
    setActiveModule(module);
    router.push(route);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A]">
      <Topbar />

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-6xl space-y-12 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              Welcome to the{' '}
              <span className="text-[#FFD700]">
                Admin Portal
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-[#6B7280]">
              Select the module you wish to manage today. You
              can always switch between modules later from the
              sidebar.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((item) => (
              <button
                key={item.module}
                type="button"
                onClick={() =>
                  handleSelection(item.module, item.route)
                }
                className="group relative flex h-full min-h-[255px] flex-col items-center justify-start overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD700] hover:bg-[#1A1A1A] hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] shadow-lg transition-colors group-hover:border-[#FFD700]/50">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="mb-2 text-xl font-bold text-white">
                      {item.title}
                    </h2>

                    <p className="text-xs leading-relaxed text-[#6B7280]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}