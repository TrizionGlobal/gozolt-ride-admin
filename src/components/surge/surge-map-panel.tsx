'use client';

import { Plus, Pencil, Trash2, Minimize2, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import type { SurgeZoneItem } from '@/services/admin/surge.types';

const MAP_BOUNDS = {
  minLat: 35.80,
  maxLat: 35.96,
  minLng: 14.35,
  maxLng: 14.58,
};

function latLngToPercent(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return { x: Math.min(95, Math.max(5, x)), y: Math.min(90, Math.max(5, y)) };
}

interface SurgeMapPanelProps {
  zones: SurgeZoneItem[];
  selectedZoneId: string | null;
  onSelectZone: (id: string) => void;
  onAddZone: () => void;
}

const PLACE_NAMES = [
  { name: 'Gharb', top: '15%', left: '18%' },
  { name: 'Victoria', top: '18%', left: '30%' },
  { name: 'Mellieha', top: '32%', left: '42%' },
  { name: 'Bugibba', top: '38%', left: '32%' },
  { name: 'Mosta', top: '48%', left: '40%' },
  { name: 'Sliema', top: '50%', left: '58%' },
  { name: 'Valletta', top: '58%', left: '55%' },
  { name: 'Mdina', top: '50%', left: '35%' },
  { name: 'Marsaxlokk', top: '75%', left: '62%' },
  { name: 'Airport', top: '70%', left: '48%' },
];

export function SurgeMapPanel({
  zones,
  selectedZoneId,
  onSelectZone,
  onAddZone,
}: SurgeMapPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toolbar = [
    { icon: Plus, label: 'Add zone', onClick: onAddZone },
    { icon: Pencil, label: 'Edit mode', onClick: () => {} },
    { icon: Trash2, label: 'Delete mode', onClick: () => {} },
    { icon: Minimize2, label: 'Minimize', onClick: () => setCollapsed(true) },
    { icon: Maximize2, label: 'Expand', onClick: () => setCollapsed(false) },
  ];

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      {/* Header + toolbar */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Malta — Surge Zones</h3>
        <div className="flex items-center gap-1">
          {toolbar.map((t) => (
            <button
              key={t.label}
              onClick={t.onClick}
              title={t.label}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#6B7280] hover:text-white hover:bg-[#2A2A2A] transition-colors"
            >
              <t.icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Map area */}
      {!collapsed && (
        <div className="relative aspect-[4/3] bg-[#0A0A0A] rounded-md overflow-hidden">
          {/* Malta SVG outline */}
          <svg
            viewBox="0 0 200 120"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Main island */}
            <ellipse cx="110" cy="65" rx="65" ry="38" fill="none" stroke="#2A2A2A" strokeWidth="1" />
            {/* Gozo */}
            <ellipse cx="50" cy="28" rx="22" ry="14" fill="none" stroke="#2A2A2A" strokeWidth="1" />
            {/* Comino */}
            <circle cx="70" cy="38" r="4" fill="none" stroke="#2A2A2A" strokeWidth="0.5" />
          </svg>

          {/* Place name labels */}
          {PLACE_NAMES.map((p) => (
            <span
              key={p.name}
              className="absolute text-[9px] text-[#6B7280] pointer-events-none"
              style={{ top: p.top, left: p.left }}
            >
              {p.name}
            </span>
          ))}

          {/* Zone markers */}
          {zones
            .filter((z) => z.isActive)
            .map((z) => {
              const center = z.polygon.coordinates[0][0];
              const pos = latLngToPercent(center[1], center[0]);
              const isSelected = z.id === selectedZoneId;
              return (
                <button
                  key={z.id}
                  onClick={() => onSelectZone(z.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform"
                  style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
                  title={z.name}
                >
                  <span
                    className={`block rounded-full transition-all ${isSelected ? 'h-4 w-4 ring-2 ring-white/50' : 'h-3 w-3'}`}
                    style={{ backgroundColor: z._color }}
                  />
                </button>
              );
            })}

          {/* Map data label */}
          <span className="absolute bottom-2 right-2 text-[8px] text-[#6B7280]">
            Map data
          </span>
        </div>
      )}

      {collapsed && (
        <div className="flex items-center justify-center py-6 text-[#6B7280] text-xs">
          Map collapsed — click expand to show
        </div>
      )}
    </div>
  );
}
