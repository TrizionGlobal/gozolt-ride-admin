import { cn } from '@/lib/utils';
import { Car, CalendarCheck, Bike } from 'lucide-react';

export type BikeRentalTab = 'bikes' | 'bookings';

interface BikeRentalTabsProps {
  activeTab: BikeRentalTab;
  onTabChange: (tab: BikeRentalTab) => void;
}

export function BikeRentalTabs({ activeTab, onTabChange }: BikeRentalTabsProps) {
  const tabs = [
    { id: 'bikes', label: 'Bikes', icon: Bike },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  ] as const;

  return (
    <div className="flex space-x-1 border-b border-[#2A2A2A]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2',
            activeTab === tab.id
              ? 'border-[#FFD700] text-[#FFD700]'
              : 'border-transparent text-[#6B7280] hover:text-white hover:border-[#2A2A2A]'
          )}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
