'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { IntegrationCard } from './integration-card';
import type { Integration } from '@/services/admin/settings.types';

interface IntegrationsGridProps {
  integrations: Integration[];
  loading: boolean;
  testing: string | null;
  onTest: (id: string) => Promise<boolean>;
}

export function IntegrationsGrid({ integrations, loading, testing, onTest }: IntegrationsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 bg-[#1A1A1A] rounded-lg" />
        ))}
      </div>
    );
  }

  if (integrations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
        No integrations configured
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          testing={testing === integration.id}
          onTest={onTest}
        />
      ))}
    </div>
  );
}
