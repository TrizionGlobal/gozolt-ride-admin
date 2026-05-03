'use client';

import type { LucideIcon } from 'lucide-react';

interface DisputeMetadataItemProps {
  icon: LucideIcon;
  iconColor?: string;
  text: string;
}

export function DisputeMetadataItem({
  icon: Icon,
  iconColor = 'text-[#6B7280]',
  text,
}: DisputeMetadataItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
      <span className="text-xs text-[#9CA3AF]">{text}</span>
    </div>
  );
}
