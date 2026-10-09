'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Building2, CreditCard, UserPlus, CheckCircle2, Search, Filter, MoreVertical, ShieldCheck, Clock, MapPin, Check } from 'lucide-react';
import { useSuppliers } from '@/hooks/use-suppliers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { SupplierListItem } from '@/services/admin/supplier.types';
import { supplierService } from '@/services/admin/supplier.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SupplierActionsMenu } from '@/components/suppliers/supplier-actions-menu';
import { QuickServicesSupplierDetailDrawer } from '@/components/suppliers/quick-services-supplier-detail-drawer';
import { SupplierSuspendModal } from '@/components/suppliers/supplier-suspend-modal';
import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { SupplierStatusBadge } from '@/components/suppliers/supplier-status-badge';
import { TIER_DISPLAY, TIER_COLORS } from '@/services/admin/supplier.types';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

export default function QuickServicesSupplierManagementPage() {
  const router = useRouter();
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierListItem | null>(null);
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  const [suspendModalSupplier, setSuspendModalSupplier] = useState<SupplierListItem | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // We use the global supplier hook since it retrieves all registered supplier businesses
  const { data: supplierData, loading, refetch } = useSuppliers({ page, limit, search: debouncedSearch, serviceType: 'QUICK_SERVICES' });

  const suppliers = supplierData?.data || [];

  const totalSuppliers = suppliers.length;
  const approvedSuppliers = suppliers.filter(s => s.status === 'ACTIVE').length;
  const pendingSuppliers = suppliers.filter(s => s.status === 'PENDING_VERIFICATION').length;
  const subscribedSuppliers = suppliers.filter(s => s.subscription !== null).length;
  const nonSubscribedSuppliers = suppliers.filter(s => s.subscription === null).length;

  const handleApprove = async (id: string) => {
    try {
      await supplierService.approveSupplier(id);
      toast.success('Supplier approved successfully');
      refetch();
    } catch (err) {
      toast.error('Failed to approve supplier');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              Review registered suppliers, verify their service catalogs, and manage subscriptions.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard
          title="Total Suppliers"
          value={totalSuppliers}
          icon={<Building2 className="h-5 w-5" />}
          color="blue"
          isLoading={loading}
        />
        <SummaryCard
          title="Approved Suppliers"
          value={approvedSuppliers}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="emerald"
          isLoading={loading}
        />
        <SummaryCard
          title="Pending Suppliers"
          value={pendingSuppliers}
          icon={<Clock className="h-5 w-5" />}
          color="amber"
          isLoading={loading}
        />
        <SummaryCard
          title="With Subscription"
          value={subscribedSuppliers}
          icon={<CreditCard className="h-5 w-5" />}
          color="emerald"
          isLoading={loading}
        />
        <SummaryCard
          title="Without Subscription"
          value={nonSubscribedSuppliers}
          icon={<UserPlus className="h-5 w-5" />}
          color="blue"
          isLoading={loading}
        />
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#141414] shadow-2xl">
        <div className="border-b border-[#2A2A2A] bg-[#1A1A1A] p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> Authorized Service Partners
              </h2>
              <p className="mt-1 text-xs text-[#6B7280]">
                Manage the catalog of independent professionals and companies providing Quick Services.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <Input
                  placeholder="Search supplier, email, phone..."
                  className="pl-9 bg-[#0A0A0A] border-transparent text-sm h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden">
          <ServerSideTable<SupplierListItem>
            columns={[
              {
                key: 'entity',
                title: 'Supplier Entity',
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#1F1F1F] to-[#0A0A0A] border border-[#2A2A2A] flex items-center justify-center font-bold text-white uppercase shadow-inner">
                      {row.companyName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm group-hover:text-[#FFD700] transition-colors">
                        {row.companyName}
                      </p>
                      <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
                        {row.email}
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'services',
                title: 'Quick Services Offered',
                render: (row) => (
                  <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                    {row.quickServicesOffered && row.quickServicesOffered.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          {row.quickServicesOffered.reduce((acc, cat) => acc + (cat.services?.length || 0), 0)} Services
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-[#1A1A1A] text-[#6B7280] border-[#2A2A2A] font-medium text-[10px] cursor-pointer hover:bg-[#2A2A2A] transition-colors"
                          onClick={(e) => { e.stopPropagation(); setViewDetailsId(row.id); }}
                        >
                          View Catalog
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-[#6B7280]">No services configured</span>
                    )}
                  </div>
                ),
              },
              {
                key: 'tier',
                title: 'Subscription Tier',
                render: (row) => {
                  const tier = row.subscription?.tier;
                  return tier ? (
                    <span className={cn('inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium', TIER_COLORS[tier])}>
                      {TIER_DISPLAY[tier]}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium bg-[#2A2A2A] text-[#9CA3AF] border border-[#3A3A3A]">
                      Not Subscribed
                    </span>
                  );
                },
              },
              {
                key: 'region',
                title: 'Region',
                render: () => (
                  <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                    <MapPin className="h-3.5 w-3.5 text-[#6B7280]" />
                    Malta (All Regions)
                  </div>
                ),
              },
              {
                key: 'status',
                title: 'Status',
                render: (row) => <SupplierStatusBadge status={row.status} />,
              },
              {
                key: 'date',
                title: 'Onboarding Date',
                render: (row) => (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF]">
                    <Clock className="h-3 w-3 text-[#6B7280]" />
                    {new Date(row.createdAt).toLocaleDateString()}
                  </div>
                ),
              },
              {
                key: 'action',
                title: 'Actions',
                className: 'text-center',
                render: (row) => (
                  <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                    <SupplierActionsMenu
                      status={row.status as any}
                      onView={() => setViewDetailsId(row.id)}
                      onApprove={row.status !== 'ACTIVE' ? () => handleApprove(row.id) : undefined}
                      onSuspend={row.status === 'ACTIVE' ? () => setSuspendModalSupplier(row) : undefined}
                    />
                  </div>
                ),
              }
            ]}
            data={suppliers}
            isLoading={loading}
            page={page}
            limit={limit}
            total={supplierData?.meta?.total ?? 0}
            onPageChange={setPage}
            onLimitChange={setLimit}
            rowKey="id"
            emptyText={
              <div className="py-20 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4 border border-[#2A2A2A]">
                  <Building2 className="h-8 w-8 text-[#52525B]" />
                </div>
                <p className="text-base font-bold text-white">No service partners found</p>
                <p className="mt-1 text-sm text-[#6B7280] max-w-sm mx-auto">
                  Wait for professionals to register via the Gozolt Partner App to provide Quick Services.
                </p>
              </div>
            }
          />
        </div>
      </div>

      <QuickServicesSupplierDetailDrawer
        supplierId={viewDetailsId}
        open={!!viewDetailsId}
        onOpenChange={(open) => !open && setViewDetailsId(null)}
      />

      {suspendModalSupplier && (
        <SupplierSuspendModal
          supplierId={suspendModalSupplier.id}
          supplierName={suspendModalSupplier.companyName}
          open={!!suspendModalSupplier}
          onOpenChange={(open) => !open && setSuspendModalSupplier(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: 'blue' | 'amber' | 'emerald';
  isLoading?: boolean;
}

function SummaryCard({ title, value, icon, color = 'blue', isLoading = false }: SummaryCardProps) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-400 group-hover:border-blue-500/40',
    amber: 'bg-amber-500/10 text-amber-400 group-hover:border-amber-500/40',
    emerald: 'bg-emerald-500/10 text-emerald-400 group-hover:border-emerald-500/40'
  };

  if (isLoading) {
    return (
      <div className="group rounded-xl border border-[#2A2A2A] bg-[#141414] p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl bg-[#2A2A2A]" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 bg-[#2A2A2A]" />
            <Skeleton className="h-6 w-12 bg-[#2A2A2A]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-4 rounded-xl border border-[#2A2A2A] bg-[#141414] p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${colorMap[color].split(' group-hover:')[1]}`}>
      <div className={`shrink-0 rounded-xl p-3 transition-transform group-hover:scale-110 ${colorMap[color].split(' group-hover:')[0]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold capitalize text-[#6B7280] group-hover:text-[#9CA3AF] transition-colors leading-tight">
          {title}
        </p>
        <div className="flex flex-col mt-1">
          <p className="text-2xl font-bold text-white leading-none">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function TableHeading({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <th className={`whitespace-nowrap px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#6B7280] group-hover:text-white transition-colors ${className}`}>
      {children}
    </th>
  );
}