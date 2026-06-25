'use client';

import { useState } from 'react';
import { Save, Wrench, UserPlus, Zap, FileCheck, Mail, Phone, Smartphone, MonitorSmartphone, ShieldCheck, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function SystemConfigTab() {
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    maintenanceMode: false,
    driverRegistration: true,
    forceAdmin2FA: true,
    debugMode: false,
    supportEmail: 'support@gozolt.com',
    emergencyNumber: '+1 800 555 0199',
    minIosVersion: '1.2.0',
    minAndroidVersion: '1.2.0',
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('System configuration saved successfully');
    }, 800);
  };

  const toggle = (key: keyof typeof config) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateInput = (key: keyof typeof config, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Save Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">Global Preferences</h2>
          <p className="text-sm text-[#6B7280]">Manage platform-wide behaviors and requirements</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#FACC15] text-black hover:bg-[#E5B800] font-semibold transition-all"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* App States */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider">App States</h3>
          
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]/50 hover:border-[#3A3A3A] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#EF4444]/10 text-[#EF4444]">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">Maintenance Mode</p>
                <p className="text-xs text-[#6B7280]">Disable all apps with a maintenance screen</p>
              </div>
            </div>
            <button 
              onClick={() => toggle('maintenanceMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.maintenanceMode ? 'bg-[#EF4444]' : 'bg-[#2A2A2A]'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Driver Registration */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]/50 hover:border-[#3A3A3A] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">Driver Registration</p>
                <p className="text-xs text-[#6B7280]">Accept new driver sign-ups</p>
              </div>
            </div>
            <button 
              onClick={() => toggle('driverRegistration')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.driverRegistration ? 'bg-[#22C55E]' : 'bg-[#2A2A2A]'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.driverRegistration ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Force 2FA */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]/50 hover:border-[#3A3A3A] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FACC15]/10 text-[#FACC15]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">Require Admin 2FA</p>
                <p className="text-xs text-[#6B7280]">Force two-factor authentication for admins</p>
              </div>
            </div>
            <button 
              onClick={() => toggle('forceAdmin2FA')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.forceAdmin2FA ? 'bg-[#22C55E]' : 'bg-[#2A2A2A]'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.forceAdmin2FA ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Debug Mode */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]/50 hover:border-[#3A3A3A] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#A855F7]/10 text-[#A855F7]">
                <Bug className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">Debug Mode</p>
                <p className="text-xs text-[#6B7280]">Enable verbose system logging</p>
              </div>
            </div>
            <button 
              onClick={() => toggle('debugMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.debugMode ? 'bg-[#22C55E]' : 'bg-[#2A2A2A]'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.debugMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Contact & Versions */}
        <div className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider">Contact & Legal</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]/50">
                <Mail className="h-5 w-5 text-[#6B7280]" />
                <div className="flex-1">
                  <p className="text-xs text-[#6B7280] mb-1">Support Email</p>
                  <input 
                    type="email" 
                    value={config.supportEmail}
                    readOnly
                    className="w-full bg-transparent border-none text-[#6B7280] text-sm focus:outline-none focus:ring-0 p-0 cursor-not-allowed"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]/50">
                <Phone className="h-5 w-5 text-[#6B7280]" />
                <div className="flex-1">
                  <p className="text-xs text-[#6B7280] mb-1">Emergency SOS Number</p>
                  <input 
                    type="text" 
                    value={config.emergencyNumber}
                    readOnly
                    className="w-full bg-transparent border-none text-[#6B7280] text-sm focus:outline-none focus:ring-0 p-0 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider">App Versions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]/50">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="h-4 w-4 text-[#6B7280]" />
                  <p className="text-xs text-[#6B7280]">Min iOS Version</p>
                </div>
                <input 
                  type="text" 
                  value={config.minIosVersion}
                  readOnly
                  className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg text-[#6B7280] text-sm px-3 py-2 focus:outline-none cursor-not-allowed"
                />
              </div>
              <div className="p-4 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]/50">
                <div className="flex items-center gap-2 mb-3">
                  <MonitorSmartphone className="h-4 w-4 text-[#6B7280]" />
                  <p className="text-xs text-[#6B7280]">Min Android Version</p>
                </div>
                <input 
                  type="text" 
                  value={config.minAndroidVersion}
                  readOnly
                  className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg text-[#6B7280] text-sm px-3 py-2 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}
