'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SystemConfigCard } from './system-config-card';
import type { SystemConfigItem } from '@/services/admin/settings.types';

interface SystemConfigProps {
  config: SystemConfigItem[];
  loading: boolean;
  onToggle: (key: string, value: string | boolean) => Promise<boolean>;
}

export function SystemConfig({ config, loading, onToggle }: SystemConfigProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full bg-[#1A1A1A] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {config.map((item) => (
        <SystemConfigCard
          key={item.key}
          item={item}
          onToggle={async (key, value) => onToggle(key, value)}
        />
      ))}
    </div>
  );
}
