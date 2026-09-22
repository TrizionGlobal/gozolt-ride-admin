import Image from 'next/image';

export default function AirportTransfersDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414]">
          <Image
            src="/airport-transfers-icon.png"
            alt="Airport Transfers"
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            Airport Transfers Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#6B7280]">
            Manage airport transfer bookings, passengers,
            suppliers, vehicles and scheduled journeys.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          label="Total Transfers"
          value="—"
          description="All transfer bookings"
        />

        <DashboardCard
          label="Scheduled Today"
          value="—"
          description="Transfers scheduled today"
        />

        <DashboardCard
          label="Active Transfers"
          value="—"
          description="Currently in progress"
        />

        <DashboardCard
          label="Pending Assignment"
          value="—"
          description="Awaiting supplier or driver"
        />
      </div>

      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
        <h2 className="text-lg font-semibold text-white">
          Airport Transfer Operations
        </h2>

        <p className="mt-2 text-sm text-[#6B7280]">
          Booking and operational data will appear here after
          the Airport Transfer backend APIs are connected.
        </p>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  label: string;
  value: string;
  description: string;
}

function DashboardCard({
  label,
  value,
  description,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 transition-colors hover:border-[#FCD223]/40">
      <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold text-[#FCD223]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#9CA3AF]">
        {description}
      </p>
    </div>
  );
}