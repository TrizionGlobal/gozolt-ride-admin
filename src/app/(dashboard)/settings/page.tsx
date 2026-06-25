'use client';

import { useState } from 'react';
import { SettingsTabs } from '@/components/settings/settings-tabs';
import { FareConfigTable } from '@/components/settings/fare-config-table';
import { FeesConfig } from '@/components/settings/fees-config';
import { SystemConfigTab } from '@/components/settings/system-config-tab';
import { AdminUsersTable } from '@/components/settings/admin-users-table';
import { useAdminUsers } from '@/hooks/use-settings';
import type { SettingsTab } from '@/services/admin/settings.types';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('system-config');


  const adminUsers = useAdminUsers();


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Manage system configuration and users
        </p>
      </div>

      {/* Card with Tabs */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414]">
        {/* Tabs */}
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'system-config' && <SystemConfigTab />}

          {activeTab === 'admin-users' && (
            <AdminUsersTable
              users={adminUsers.users}
              loading={adminUsers.loading}
            />
          )}


        </div>
      </div>
    </div>
  );
}
