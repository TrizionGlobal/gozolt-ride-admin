'use client';

import { useState } from 'react';
import {
  Wrench,
  Zap,
  Radio,
  Settings,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import type { SystemConfigItem } from '@/services/admin/settings.types';
import { toast } from 'sonner';

const ICON_MAP: Record<string, React.ElementType> = {
  Wrench,
  Zap,
  Radio,
  Settings,
};

interface SystemConfigCardProps {
  item: SystemConfigItem;
  onToggle: (key: string, value: boolean) => Promise<boolean>;
}

export function SystemConfigCard({ item, onToggle }: SystemConfigCardProps) {
  const [toggling, setToggling] = useState(false);
  const Icon = ICON_MAP[item.icon] ?? Settings;

  const handleToggle = async (checked: boolean) => {
    setToggling(true);
    const success = await onToggle(item.key, checked);
    if (success) {
      toast.success(`${item.title} ${checked ? 'enabled' : 'disabled'}`);
    } else {
      toast.error(`Failed to update ${item.title}`);
    }
    setToggling(false);
  };

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#9CA3AF]" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">{item.title}</h4>
          <p className="text-xs text-[#6B7280] mt-0.5">{item.description}</p>
        </div>
      </div>

      {item.type === 'toggle' ? (
        <Switch
          checked={item.value === true}
          onCheckedChange={handleToggle}
          disabled={toggling}
          className="data-[state=checked]:bg-[#FACC15]"
        />
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.info('Configuration coming soon')}
          className="h-8 text-xs text-[#FACC15] hover:text-[#E5B800] hover:bg-[#1A1A1A]"
        >
          Configure
        </Button>
      )}
    </div>
  );
}
