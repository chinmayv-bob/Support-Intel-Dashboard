import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
    const { viewMode, setViewMode, isSidebarOpen } = useUIStore();

    const navItems = [
        { id: 'focus', label: 'Intel Feed', icon: 'threat_intelligence' },
        { id: 'analytics', label: 'Trend Analysis', icon: 'auto_graph' },
        { id: 'quality', label: 'Quality & Coaching', icon: 'fact_check' },
        { id: 'handoff', label: 'Engineering Handoff', icon: 'terminal' },
        { id: 'library', label: 'Library', icon: 'library_books' },
    ] as const;

    if (!isSidebarOpen) return null;

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-40">
            <div className="px-6 py-6 flex items-center gap-3">
                <div className="size-9 text-white bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-[24px]">threat_intelligence</span>
                </div>
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 leading-none">Support Intel</h2>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">AI Dashboard</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setViewMode(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                            viewMode === item.id
                                ? "bg-primary/5 text-primary font-bold shadow-sm border border-primary/10"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <span className={cn(
                            "material-symbols-outlined text-[20px]",
                            viewMode === item.id ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                        )}>
                            {item.icon}
                        </span>
                        <span className="text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">System Status</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600">All signals operational</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
