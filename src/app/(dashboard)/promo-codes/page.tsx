'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PromoConfigSection } from '@/components/promo-codes/promo-config-section';
import { PromoTable } from '@/components/promo-codes/promo-table';
import { PromoCreateModal } from '@/components/promo-codes/promo-create-modal';
import { usePromoCodes } from '@/hooks/use-promo-codes';
import type { PromoCode } from '@/services/admin/promo.types';
import { toast } from 'sonner';

export default function PromoCodesPage() {
  const { codes, loading, createCode, updateCode, toggleCode } = usePromoCodes();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);

  const handleEdit = (promo: PromoCode) => {
    setEditingPromo(promo);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPromo(null);
    setModalOpen(true);
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleCode(id, isActive);
      toast.success(isActive ? 'Promo code activated' : 'Promo code deactivated');
    } catch {
      toast.error('Failed to update promo code');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Promo Codes</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Create and manage promotional discounts for riders
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-medium text-[#22C55E]">System Online</span>
        </div>
      </div>

      {/* Promo Codes Table Section */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2A]">
          <h3 className="text-base font-semibold text-white">Promo Codes</h3>
          <Button
            size="sm"
            onClick={handleCreate}
            className="h-8 text-xs bg-[#FACC15] text-black hover:bg-[#E5B800]"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Create Code
          </Button>
        </div>

        <PromoTable
          codes={codes}
          loading={loading}
          onEdit={handleEdit}
          onToggle={handleToggle}
        />
      </div>

      {/* Create/Edit Modal */}
      <PromoCreateModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingPromo={editingPromo}
        onCreate={createCode}
        onUpdate={updateCode}
      />
    </div>
  );
}
