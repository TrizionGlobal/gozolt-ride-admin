'use client';

import { useState } from 'react';
import { SettingsTabs } from '@/components/settings/settings-tabs';
import { FareConfigTable } from '@/components/settings/fare-config-table';
import { FeesConfig } from '@/components/settings/fees-config';
import { AdminUsersTable } from '@/components/settings/admin-users-table';
import { SystemConfig } from '@/components/settings/system-config';
import { LanguageConfig } from '@/components/settings/language-config';
import { IntegrationsGrid } from '@/components/settings/integrations-grid';
import {
  useFareConfig,
  useFeeConfig,
  useAdminUsers,
  useSystemConfig,
  useLanguageConfig,
  useIntegrations,
} from '@/hooks/use-settings';
import type { SettingsTab } from '@/services/admin/settings.types';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('fare-config');

  const fareConfig = useFareConfig();
  const feeConfig = useFeeConfig();
  const adminUsers = useAdminUsers();
  const systemConfig = useSystemConfig();
  const languageConfig = useLanguageConfig();
  const integrations = useIntegrations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Manage system configuration, users, and integrations
        </p>
      </div>

      {/* Card with Tabs */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414]">
        {/* Tabs */}
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'fare-config' && (
            <FareConfigTable
              rules={fareConfig.rules}
              loading={fareConfig.loading}
              saving={fareConfig.saving}
              onSave={fareConfig.updateRule}
            />
          )}

          {activeTab === 'fees' && (
            <FeesConfig
              fees={feeConfig.fees}
              loading={feeConfig.loading}
              saving={feeConfig.saving}
              onSave={feeConfig.updateFees}
            />
          )}

          {activeTab === 'admin-users' && (
            <AdminUsersTable
              users={adminUsers.users}
              loading={adminUsers.loading}
            />
          )}

          {activeTab === 'system' && (
            <SystemConfig
              config={systemConfig.config}
              loading={systemConfig.loading}
              onToggle={systemConfig.updateSetting}
            />
          )}

          {activeTab === 'language' && (
            <LanguageConfig
              config={languageConfig.config}
              loading={languageConfig.loading}
              saving={languageConfig.saving}
              onSave={languageConfig.updateConfig}
            />
          )}

          {activeTab === 'integrations' && (
            <IntegrationsGrid
              integrations={integrations.integrations}
              loading={integrations.loading}
              testing={integrations.testing}
              onTest={integrations.testConnection}
            />
          )}
        </div>
      </div>
    </div>
  );
}
