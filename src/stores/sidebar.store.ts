'use client';

import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  activeModule: 'CAB' | 'RENTAL' | null;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setActiveModule: (module: 'CAB' | 'RENTAL' | null) => void;
}

export const useSidebarStore = create<SidebarState>((set) => {
  // Hydrate from localStorage on init (client-side only)
  let initialCollapsed = false;
  let initialModule: 'CAB' | 'RENTAL' | null = null;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('gozolt-sidebar-collapsed');
    initialCollapsed = stored === 'true';
    
    const storedModule = localStorage.getItem('gozolt-admin-active-module');
    if (storedModule === 'CAB' || storedModule === 'RENTAL') {
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
