import { create } from 'zustand';

type ViewMode = 'focus' | 'analytics' | 'quality' | 'handoff';

interface UIState {
    viewMode: ViewMode;
    isSidebarOpen: boolean;
    selectedTicketId: string | null;
    setViewMode: (mode: ViewMode) => void;
    toggleSidebar: () => void;
    setSelectedTicketId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    viewMode: 'focus',
    isSidebarOpen: true,
    selectedTicketId: null,
    setViewMode: (mode) => set({ viewMode: mode }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSelectedTicketId: (id) => set({ selectedTicketId: id }),
}));
