import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Header: React.FC = () => {
    const { viewMode, setViewMode, searchQuery, setSearchQuery } = useUIStore();

    return (
        <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6 py-3 flex items-center justify-between gap-6">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 lg:hidden">
                    <div className="size-8 text-white bg-primary rounded flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">threat_intelligence</span>
                    </div>
                </div>

                <div className="flex h-9 w-64 items-center rounded-lg bg-slate-50 border border-slate-200 px-3 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
                    <input
                        type="text"
                        placeholder="Search intel..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-full w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 text-slate-900 ml-2"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                    <span className="text-xs font-semibold text-slate-600">Focus Mode</span>
                    <button
                        onClick={() => setViewMode(viewMode === 'focus' ? 'analytics' : 'focus')}
                        className={cn(
                            "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            viewMode === 'focus' ? "bg-primary" : "bg-slate-300"
                        )}
                    >
                        <span className={cn(
                            "inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200",
                            viewMode === 'focus' ? "translate-x-5" : "translate-x-1"
                        )} />
                    </button>
                </div>

                <div className="h-6 w-px bg-slate-200"></div>

                <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-0.5 right-0.5 size-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
