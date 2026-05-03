// --- GeoJSON Polygon ---
export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

// --- Zone type (UI-only, not in backend) ---
export type SurgeZoneType = 'surge' | 'pickup' | 'standard';

// --- Zone rules (UI-only, stored in schedule JSON or mock) ---
export interface ZoneRules {
  surgeMultiplier: string;
  minDrivers: number;
  maxCap: number;
}

// --- Base surge zone from backend ---
export interface SurgeZone {
  id: string;
  name: string;
  multiplier: number;
  polygon: GeoJSONPolygon;
  schedule: object | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Extended surge zone with UI-only fields ---
export interface SurgeZoneItem extends SurgeZone {
  _displayId: string;
  _zoneType: SurgeZoneType;
  _color: string;
  _rides24h: number;
  _activeDrivers: number;
  _rules: ZoneRules;
}

// --- Create payload ---
export interface CreateSurgeZonePayload {
  name: string;
  multiplier: number;
  polygon: GeoJSONPolygon;
  isActive?: boolean;
}

// --- Update payload ---
export interface UpdateSurgeZonePayload {
  name?: string;
  multiplier?: number;
  polygon?: GeoJSONPolygon;
  schedule?: object | null;
  isActive?: boolean;
}

// --- Surge history chart point ---
export interface SurgeHistoryPoint {
  time: string;
  demand: number;
  supply: number;
}

// --- Global rules (UI-only, no backend model) ---
export interface GlobalSurgeRules {
  calculationFrequency: number;
  maxSurgeCap: number;
  thresholds: SurgeThreshold[];
}

export interface SurgeThreshold {
  ratioMin: number;
  ratioMax: number;
  multiplier: number;
}

// --- Zone override (UI-only, no backend model) ---
export interface ZoneOverride {
  id: string;
  zoneName: string;
  rule: string;
  isActive: boolean;
}

// --- Zone type display helper ---
export function getZoneTypeDisplay(type: SurgeZoneType) {
  const map: Record<SurgeZoneType, { label: string; className: string; dotColor: string }> = {
    surge: {
      label: 'Surge',
      className: 'bg-red-500/20 text-red-400 border-red-500/30',
      dotColor: '#EF4444',
    },
    pickup: {
      label: 'Pickup',
      className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      dotColor: '#F97316',
    },
    standard: {
      label: 'Standard',
      className: 'bg-green-500/20 text-green-400 border-green-500/30',
      dotColor: '#22C55E',
    },
  };
  return map[type];
}
