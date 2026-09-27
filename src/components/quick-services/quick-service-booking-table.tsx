import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Clock, CheckCircle2, XCircle } from 'lucide-react';

import { toast } from 'sonner';
import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { apiClient as adminApi } from '@/lib/api-client';
import { useActiveSuppliers } from '@/hooks/use-admin-quick-services';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface QuickServiceBookingTableProps {
  data: any[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onAssignSuccess?: () => void;
}

export function QuickServiceBookingTable({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onAssignSuccess,
}: QuickServiceBookingTableProps) {
  const router = useRouter();
  const suppliers = useActiveSuppliers();
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');

  const handleAssign = async (bookingId: string) => {
    if (!selectedSupplier) {
      toast.error('Please select a supplier first');
      return;
    }
    setAssigningId(bookingId);
    try {
      await adminApi.post(`/quick-services/admin/assign/${bookingId}`, {
        supplierId: selectedSupplier
      });
      toast.success('Successfully assigned booking to supplier');
      if (onAssignSuccess) onAssignSuccess();
      setSelectedSupplier('');
    } catch (error) {
      toast.error('Failed to assign supplier');
    } finally {
      setAssigningId(null);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      key: 'user',
      title: 'User Name',
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-white">{row.userName || `${row.user?.firstName} ${row.user?.lastName}`}</p>
          <p className="text-xs text-gray-500">{row.userEmail || row.user?.email}</p>
          <p className="text-xs text-gray-500">{row.userPhone || row.user?.phone || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'service',
      title: 'Service',
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-white">{row.serviceTitle}</p>
        </div>
      ),
    },
    {
      key: 'date',
      title: 'Booking Date',
      render: (row) => (
        <span className="text-sm text-white">
          {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(row.bookingDate))}
        </span>
      ),
    },
    {
      key: 'amount',
      title: 'Paid Amount',
      render: (row) => <span className="text-sm text-white font-medium">€{row.totalAmount}</span>,
    },
    {
      key: 'status',
      title: 'Status',
      className: 'text-center',
      render: (row) => {
        let colorClass = 'bg-gray-900/40 text-gray-400 border-gray-800';
        let Icon = Clock;
        let displayStatus = row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Unknown';

        if (row.status === 'COMPLETED') {
          colorClass = 'bg-green-900/40 text-green-400 border-green-800';
          Icon = CheckCircle2;
          displayStatus = 'Completed';
        } else if (row.status === 'ASSIGNED') {
          colorClass = 'bg-blue-900/40 text-blue-400 border-blue-800';
          Icon = CheckCircle2;
          displayStatus = 'Assigned';
        } else if (row.status === 'IN_PROGRESS') {
          colorClass = 'bg-purple-900/40 text-purple-400 border-purple-800';
          Icon = Clock;
          displayStatus = 'In Progress';
        } else if (row.status === 'PENDING') {
          colorClass = 'bg-yellow-900/40 text-yellow-400 border-yellow-800';
          Icon = Clock;
          displayStatus = 'Pending';
        } else if (row.status === 'CANCELLED') {
          colorClass = 'bg-red-900/40 text-red-400 border-red-800';
          Icon = XCircle;
          displayStatus = 'Cancelled';
        }
        
        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
              <Icon className="h-3 w-3" />
              {displayStatus}
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      title: 'Assign Supplier',
      render: (row) => {
        if (row.status !== 'PENDING') {
          return <span className="text-gray-500 text-xs">{row.supplier?.companyName || 'Assigned'}</span>;
        }

        return (
          <div className="flex items-center gap-2">
            <Select onValueChange={setSelectedSupplier}>
              <SelectTrigger className="w-[140px] h-8 text-xs bg-[#1A1A1A] border-[#333]">
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#333]">
                {suppliers.map((sup) => (
                  <SelectItem key={sup.id} value={sup.id} className="text-white text-xs hover:bg-[#333]">
                    {sup.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={() => handleAssign(row.id)}
              disabled={assigningId === row.id}
              className="h-8 bg-[#FACC15] text-black hover:bg-[#E5B800] text-xs font-semibold px-3"
            >
              {assigningId === row.id ? '...' : 'Assign'}
            </Button>
          </div>
        );
      },
    },
    {
      key: 'viewDetails',
      title: 'View Details',
      className: 'text-center',
      render: (row) => (
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/quick-services/booking-management/${row._id || row.id}`);
            }}
            className="rounded bg-white/5 border border-white/10 p-1.5 text-white hover:bg-white/10 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <ServerSideTable
      columns={columns}
      data={data}
      isLoading={loading}
      page={page}
      limit={limit}
      total={total}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
    />
  );
}
