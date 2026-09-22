'use client';

import { create } from 'zustand';

export type AdminModule =
  | 'CAB'
  | 'RENTAL'
  | 'BIKE_RENTAL'
  | 'AIRPORT_TRANSFER'
  | 'QUICK_SERVICES'
  | 'FOOD_GROCERY';

interface SidebarState {
  isCollapsed: boolean;
  activeModule: AdminModule | null;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setActiveModule: (module: AdminModule | null) => void;

}const VALID_MODULES: AdminModule[] = [
  'CAB',
  'RENTAL',
  'BIKE_RENTAL',
  'AIRPORT_TRANSFER',
  'QUICK_SERVICES',
  'FOOD_GROCERY',
];
export const useSidebarStore = create<SidebarState>((set) => {
  // Hydrate from localStorage on init (client-side only)
  let initialCollapsed = false;
  let initialModule: AdminModule | null = null;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('gozolt-sidebar-collapsed');
    initialCollapsed = stored === 'true';
    
    const storedModule = localStorage.getItem('gozolt-admin-active-module') as AdminModule | null;
    if (storedModule && VALID_MODULES.includes(storedModule)) {
      initialModule = storedModule;
    }
  }

  return {
    isCollapsed: initialCollapsed,
    activeModule: initialModule,

    toggle: () =>
      set((state) => {
        const newValue = !state.isCollapsed;
        if (typeof window !== 'undefined') {
          localStorage.setItem('gozolt-sidebar-collapsed', String(newValue));
        }
        return { isCollapsed: newValue };
      }),

    setCollapsed: (collapsed) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gozolt-sidebar-collapsed', String(collapsed));
      }
      set({ isCollapsed: collapsed });
    },

    setActiveModule: (module) => {
      if (typeof window !== 'undefined') {
        if (module) {
          localStorage.setItem('gozolt-admin-active-module', module);
        } else {
          localStorage.removeItem('gozolt-admin-active-module');
        }
      }
      set({ activeModule: module });
    },
  };
});
