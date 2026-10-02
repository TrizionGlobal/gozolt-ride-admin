'use client';

import { useState } from 'react';
import { Settings2, Pencil, Search, Loader2 } from 'lucide-react';
import { useQuickServicesPricing } from '@/hooks/use-quick-services-pricing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DynamicDataTable, type ColumnDef } from '@/components/ui/dynamic-data-table';
import { QuickServicePricingRule } from '@/services/admin/quick-services-pricing.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { quickServicesPricingService } from '@/services/admin/quick-services-pricing.service';
import { toast } from 'sonner';

export default function QuickServicesPricingRulesPage() {
  const { pricingRules, loading, refetch } = useQuickServicesPricing();
  const [editingRule, setEditingRule] = useState<QuickServicePricingRule | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [minHourlyRate, setMinHourlyRate] = useState<number>(0);
  const [upfrontFee, setUpfrontFee] = useState<number>(0);
  const [materialCost, setMaterialCost] = useState<number>(0);
  const [pickupFee, setPickupFee] = useState<number | null>(null);
  const [estPriceFrom, setEstPriceFrom] = useState<string>('');
  const [estPriceTo, setEstPriceTo] = useState<string>('');


  const handleEditClick = (rule: QuickServicePricingRule) => {
    setEditingRule(rule);
    setMinHourlyRate(rule.minHourlyRate);
    setUpfrontFee(rule.upfrontFee);
    setMaterialCost(rule.materialCost);
    setPickupFee(rule.pickupFee !== undefined ? rule.pickupFee : null);

    let from = '';
    let to = '';
    if (rule.estimatedSparePrice) {
      const match = rule.estimatedSparePrice.match(/€(\d+)\s*-\s*€(\d+)/);
      if (match) {
        from = match[1];
        to = match[2];
      }
    }
    setEstPriceFrom(from);
    setEstPriceTo(to);
  };

  const handleSave = async () => {
    if (!editingRule) return;

    if (estPriceFrom && estPriceTo) {
      if (Number(estPriceTo) <= Number(estPriceFrom)) {
        toast.error('Estimated Spare Price "To" value must be greater than "From" value');
        setIsSaving(false);
        return;
      }
    } else if ((estPriceFrom && !estPriceTo) || (!estPriceFrom && estPriceTo)) {
      toast.error('Please enter both From and To values for Estimated Spare Price, or leave both empty.');
      setIsSaving(false);
      return;
    }

    setIsSaving(true);
    try {
      const estimatedSparePriceFinal = (estPriceFrom && estPriceTo) ? `€${estPriceFrom} - €${estPriceTo}` : null;
      await quickServicesPricingService.updatePricingRule(editingRule.serviceKey, {
        minHourlyRate: Number(minHourlyRate),
        upfrontFee: Number(upfrontFee),
        materialCost: Number(materialCost),
        pickupFee: pickupFee !== null ? Number(pickupFee) : undefined,
        estimatedSparePrice: estimatedSparePriceFinal
      });
      toast.success('Pricing rule updated successfully');
      setEditingRule(null);
      refetch();
    } catch (e) {
      toast.error('Failed to update pricing rule');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: any[] = [
    {
      key: 'serviceKey',
      title: 'Service Key',
      dataIndex: 'serviceKey',
      render: (row: any) => (
        <span className="font-medium text-slate-200">
          {String(row.serviceKey).split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
        </span>
      ),
    },
    {
      key: 'minHourlyRate',
      title: 'Min Hourly Rate',
      dataIndex: 'minHourlyRate',
      render: (row: any) => <span className="font-semibold text-yellow-500">€{Number(row.minHourlyRate).toFixed(2)}</span>,
    },
    {
      key: 'upfrontFee',
      title: 'Upfront Fee',
      dataIndex: 'upfrontFee',
      render: (row: any) => `€${Number(row.upfrontFee).toFixed(2)}`,
    },
    {
      key: 'materialCost',
      title: 'Material Cost',
      dataIndex: 'materialCost',
      render: (row: any) => `€${Number(row.materialCost).toFixed(2)}`,
    },
    {
      key: 'pickupFee',
      title: 'Pickup Fee',
      dataIndex: 'pickupFee',
      render: (row: any) => row.pickupFee !== null && row.pickupFee !== undefined ? `€${Number(row.pickupFee).toFixed(2)}` : '-',
    },
    {
      key: 'estimatedSparePrice',
      title: 'Est. Spare Price',
      dataIndex: 'estimatedSparePrice',
      render: (row: any) => row.estimatedSparePrice ? String(row.estimatedSparePrice) : '-',
    },
    {
      key: 'actions',
      title: <div className="text-center">Actions</div>,
      className: 'text-center w-[120px]',
      render: (row: any) => (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={() => handleEditClick(row)} className="h-8 gap-2 bg-[#2D3342] border-slate-700 hover:bg-[#363D4F] hover:text-white">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-yellow-500" />
            Pricing Rules
          </h2>
          <p className="text-slate-400">Manage base rates, upfront fees, and material costs for each service dynamically.</p>
        </div>
      </div>

      <DynamicDataTable
        columns={columns}
        data={pricingRules || []}
        isLoading={loading}
        searchKeys={['serviceKey']}
        searchPlaceholder="Search service keys..."
      />

      <Dialog open={!!editingRule} onOpenChange={(open) => !open && setEditingRule(null)}>
        <DialogContent className="bg-[#1A1F2C] border-slate-800 text-slate-200 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Pricing Rule</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Service Key</label>
              <Input
                disabled
                value={editingRule ? String(editingRule.serviceKey).split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : ''}
                className="bg-[#2D3342] border-slate-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Min Hourly Rate (€)</label>
                <Input type="number" min="0" value={minHourlyRate} onChange={(e) => setMinHourlyRate(Number(e.target.value))} className="bg-[#2D3342] border-slate-700" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Upfront Fee (€)</label>
                <Input type="number" min="0" value={upfrontFee} onChange={(e) => setUpfrontFee(Number(e.target.value))} className="bg-[#2D3342] border-slate-700" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Material Cost (€)</label>
                <Input type="number" min="0" value={materialCost} onChange={(e) => setMaterialCost(Number(e.target.value))} className="bg-[#2D3342] border-slate-700" />
              </div>
              {pickupFee !== null && pickupFee !== undefined && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Pickup Fee (€)</label>
                  <Input type="number" min="0" value={pickupFee} onChange={(e) => setPickupFee(Number(e.target.value))} className="bg-[#2D3342] border-slate-700" />
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Est. Spare Price (€)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={estPriceFrom}
                  onChange={(e) => setEstPriceFrom(e.target.value)}
                  placeholder="From"
                  className="bg-[#2D3342] border-slate-700"
                />
                <span className="text-slate-400 font-bold">-</span>
                <Input
                  type="number"
                  min="0"
                  value={estPriceTo}
                  onChange={(e) => setEstPriceTo(e.target.value)}
                  placeholder="To"
                  className="bg-[#2D3342] border-slate-700"
                />
              </div>
              {estPriceFrom && estPriceTo && Number(estPriceTo) <= Number(estPriceFrom) && (
                <p className="text-xs text-red-500 font-medium">"To" value must be greater than "From" value</p>
              )}
              {((estPriceFrom && !estPriceTo) || (!estPriceFrom && estPriceTo)) && (
                <p className="text-xs text-red-500 font-medium">Both values must be provided, or both empty</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRule(null)} className="bg-transparent border-slate-700 hover:bg-[#2D3342] hover:text-white">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving || (!!estPriceFrom && !!estPriceTo && Number(estPriceTo) <= Number(estPriceFrom)) || (!!estPriceFrom !== !!estPriceTo)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
