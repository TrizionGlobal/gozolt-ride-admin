'use client';

import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => {
  // Hydrate from localStorage on init (client-side only)
  let initialCollapsed = false;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('gozolt-sidebar-collapsed');
    initialCollapsed = stored === 'true';
  }

  return {
    isCollapsed: initialCollapsed,

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
  };
});
