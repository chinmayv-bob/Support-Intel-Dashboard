import { create } from 'zustand';

type ViewMode = 'focus' | 'analytics' | 'quality' | 'handoff' | 'library';

interface UIState {
    viewMode: ViewMode;
    searchQuery: string;
    isSidebarOpen: boolean;
    selectedTicketId: string | null;
    setSearchQuery: (query: string) => void;
    setViewMode: (mode: ViewMode) => void;
    toggleSidebar: () => void;
    setSelectedTicketId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    viewMode: 'focus',
    searchQuery: '',
    isSidebarOpen: true,
    selectedTicketId: null,
    setSearchQuery: (query) => set({ searchQuery: query }),
    setViewMode: (mode) => set({ viewMode: mode }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSelectedTicketId: (id) => set({ selectedTicketId: id }),
}));
