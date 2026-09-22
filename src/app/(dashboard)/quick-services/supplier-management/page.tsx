import Image from 'next/image';
import { Building2, CreditCard, UserPlus } from 'lucide-react';

export default function QuickServicesSupplierManagementPage() {
  return (
    <div className="space-y-6">
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
            Quick Services Supplier Management
          </h1>

          <p className="mt-1 text-sm text-[#6B7280]">
            Review registered suppliers, offered services,
            approval status and subscription details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          title="Registered Suppliers"
          value={0}
          description="All Quick Services suppliers"
          icon={<Building2 className="h-5 w-5" />}
        />

        <SummaryCard
          title="New Registrations"
          value={0}
          description="Waiting for admin review"
          icon={<UserPlus className="h-5 w-5" />}
        />

        <SummaryCard
          title="Active Subscriptions"
          value={0}
          description="Suppliers with active plans"
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#141414]">
        <div className="border-b border-[#2A2A2A] p-5">
          <h2 className="text-lg font-semibold text-white">
            Registered Suppliers
          </h2>

          <p className="mt-1 text-xs text-[#6B7280]">
            Supplier and subscription information will appear
            here after the backend API is connected.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0F0F0F]">
              <tr>
                <TableHeading>Supplier</TableHeading>
                <TableHeading>Contact</TableHeading>
                <TableHeading>Quick Services</TableHeading>
                <TableHeading>Registration Date</TableHeading>
                <TableHeading>Approval Status</TableHeading>
                <TableHeading>Subscription Plan</TableHeading>
                <TableHeading>Subscription Status</TableHeading>
                <TableHeading>Expiry Date</TableHeading>
                <TableHeading>Actions</TableHeading>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-16 text-center"
                >
                  <Building2 className="mx-auto h-10 w-10 text-[#52525B]" />

                  <p className="mt-3 text-sm font-medium text-white">
                    No supplier records loaded
                  </p>

                  <p className="mt-1 text-xs text-[#6B7280]">
                    Connect the Quick Services supplier API to
                    display registered suppliers.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

function SummaryCard({
  title,
  value,
  description,
  icon,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
          {title}
        </p>

        <div className="rounded-full bg-[#FCD223]/10 p-2 text-[#FCD223]">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#9CA3AF]">
        {description}
      </p>
    </div>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
      {children}
    </th>
  );
}