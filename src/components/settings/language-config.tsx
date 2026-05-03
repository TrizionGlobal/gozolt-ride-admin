'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AVAILABLE_LANGUAGES,
  type LanguageConfig as LanguageConfigType,
} from '@/services/admin/settings.types';
import { toast } from 'sonner';

interface LanguageConfigProps {
  config: LanguageConfigType | null;
  loading: boolean;
  saving: boolean;
  onSave: (config: LanguageConfigType) => Promise<boolean>;
}

export function LanguageConfig({ config, loading, saving, onSave }: LanguageConfigProps) {
  const [defaultLang, setDefaultLang] = useState('en');
  const [supported, setSupported] = useState<string[]>(['en']);

  useEffect(() => {
    if (config) {
      setDefaultLang(config.defaultLanguage);
      setSupported(config.supportedLanguages);
    }
  }, [config]);

  const handleToggleLanguage = (code: string) => {
    setSupported((prev) => {
      if (prev.includes(code)) {
        // Don't allow removing default language
        if (code === defaultLang) return prev;
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  };

  const handleSave = async () => {
    // Ensure default is always in supported
    const finalSupported = supported.includes(defaultLang)
      ? supported
      : [defaultLang, ...supported];

    const success = await onSave({
      defaultLanguage: defaultLang,
      supportedLanguages: finalSupported,
    });
    if (success) {
      toast.success('Language settings updated');
    }
  };

  if (loading || !config) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 bg-[#1A1A1A]" />
        <Skeleton className="h-40 w-full bg-[#1A1A1A]" />
      </div>
    );
  }

  const hasChanges =
    defaultLang !== config.defaultLanguage ||
    JSON.stringify([...supported].sort()) !== JSON.stringify([...config.supportedLanguages].sort());

  return (
    <div className="max-w-lg space-y-6">
      {/* Default Language */}
      <div>
        <label className="text-sm font-medium text-white mb-2 block">Default Language</label>
        <Select value={defaultLang} onValueChange={setDefaultLang}>
          <SelectTrigger className="w-64 bg-[#0A0A0A] border-[#2A2A2A] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#141414] border-[#2A2A2A]">
            {AVAILABLE_LANGUAGES.map((lang) => (
              <SelectItem
                key={lang.code}
                value={lang.code}
                className="text-white focus:bg-[#1A1A1A] focus:text-white"
              >
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Supported Languages */}
      <div>
        <label className="text-sm font-medium text-white mb-3 block">Supported Languages</label>
        <div className="space-y-3">
          {AVAILABLE_LANGUAGES.map((lang) => (
            <div key={lang.code} className="flex items-center gap-3">
              <Checkbox
                checked={supported.includes(lang.code)}
                onCheckedChange={() => handleToggleLanguage(lang.code)}
                disabled={lang.code === defaultLang}
                className="border-[#2A2A2A] data-[state=checked]:bg-[#FACC15] data-[state=checked]:border-[#FACC15] data-[state=checked]:text-black"
              />
              <span className="text-sm text-white">{lang.label}</span>
              {lang.code === defaultLang && (
                <span className="text-xs text-[#6B7280]">(default)</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <Button
        onClick={handleSave}
        disabled={saving || !hasChanges}
        className="h-10 bg-[#FACC15] text-black font-semibold hover:bg-[#E5B800] disabled:opacity-50"
      >
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}
