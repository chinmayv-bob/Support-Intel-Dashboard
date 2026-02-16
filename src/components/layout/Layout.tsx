import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUIStore } from '../../store/useUIStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isSidebarOpen } = useUIStore();

    return (
        <div className="min-h-screen bg-slate-50 font-display text-slate-900">
            <Sidebar />
            <div className={cn(
                "transition-all duration-300",
                isSidebarOpen ? "pl-64" : "pl-0"
            )}>
                <Header />
                <main className="max-w-[1600px] mx-auto p-0">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
