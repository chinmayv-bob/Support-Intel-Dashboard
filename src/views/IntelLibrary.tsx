import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKB } from '../hooks/useKB';
import { Skeleton } from '../components/shared/Skeleton';

const IntelLibrary: React.FC = () => {
    const { data, isLoading, error } = useKB();
    const [activeTab, setActiveTab] = useState<'articles' | 'faqs'>('articles');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const hasError = !!error;

    if (hasError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-red-50 rounded-xl border border-red-100">
                <span className="material-symbols-outlined text-4xl text-red-500 mb-4">error</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Library Unavailable</h3>
                <p className="text-slate-600 max-w-md">
                    We couldn't load the Knowledge Base. Please try again later.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-0 py-8 px-10">
            <header className="mb-12 space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Intel Library</h1>
                    {/* Pill Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {['articles', 'faqs'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        className="w-full pl-10 pr-4 py-2.5 bg-transparent border-b border-slate-200 focus:border-slate-900 transition-colors outline-none text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {/* Simplified List View */}
            <div className="space-y-1">
                {/* List Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-2">
                    <div className="col-span-9 pl-0">Title</div>
                    <div className="col-span-3 text-right">Panel</div>
                </div>

                {isLoading ? (
                    [1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="py-4 border-b border-slate-50">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    ))
                ) : activeTab === 'articles' ? (
                    (data?.articles || [])
                        .filter(article =>
                            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.problem_statement.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((article) => (
                            <div key={article.title} className="group border border-transparent hover:border-slate-200 border-b-slate-50 hover:bg-slate-50 rounded-lg transition-all mb-1 overflow-hidden">
                                <button
                                    onClick={() => setExpandedId(expandedId === article.title ? null : article.title)}
                                    className="w-full grid grid-cols-12 gap-4 px-4 py-3 items-center text-left"
                                >
                                    <div className="col-span-9 font-bold text-slate-900 text-sm flex items-center gap-3">
                                        <span className={`material-symbols-outlined text-slate-300 transition-transform text-[18px] ${expandedId === article.title ? 'rotate-90 text-primary' : ''}`}>
                                            chevron_right
                                        </span>
                                        {article.title}
                                    </div>
                                    <div className="col-span-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            {article.panels_affected.map((p) => (
                                                <span key={p} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {expandedId === article.title && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 pt-1 bg-slate-50/50 border-t border-slate-100 flex">
                                                <div className="w-8 flex-shrink-0 flex flex-col items-center pt-2">
                                                    <div className="w-px h-full bg-slate-200 relative"></div>
                                                </div>
                                                <div className="flex-1 pl-2 pt-2 pb-2 space-y-6">
                                                    {/* Problem Description */}
                                                    <div className="relative">
                                                        <div className="absolute -left-[29px] top-1.5 w-3 h-3 bg-red-100 border-2 border-red-500 rounded-full z-10"></div>
                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Problem Description</h4>
                                                        <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-100 shadow-sm">
                                                            {article.problem_statement}
                                                        </p>
                                                    </div>

                                                    {/* Resolution Steps */}
                                                    <div className="relative">
                                                        <div className="absolute -left-[29px] top-1.5 w-3 h-3 bg-green-100 border-2 border-green-500 rounded-full z-10"></div>
                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Resolution Steps</h4>
                                                        <div className="bg-white p-4 rounded border border-slate-100 shadow-sm">
                                                            <div className="space-y-3">
                                                                {article.resolution_steps.split(/[\n;]+/).map(step => step.trim()).filter(Boolean).map((step, i) => (
                                                                    <div key={i} className="flex gap-3 text-sm text-slate-700">
                                                                        <span className="font-mono text-slate-400 text-xs pt-0.5 select-none">{String(i + 1).padStart(2, '0')}</span>
                                                                        <span className="leading-relaxed">{step}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                ) : (
                    /* FAQ Section Implementation */
                    (data?.faqs || [])
                        .filter(faq =>
                            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((faq, i) => (
                            <div key={i} className="group border border-transparent hover:border-slate-200 border-b-slate-50 hover:bg-slate-50 rounded-lg transition-all mb-1">
                                <button
                                    onClick={() => setExpandedId(expandedId === `faq-${i}` ? null : `faq-${i}`)}
                                    className="w-full grid grid-cols-12 gap-4 px-4 py-3 items-center text-left"
                                >
                                    <div className="col-span-9 font-bold text-slate-900 text-sm flex items-center gap-3">
                                        <span className={`material-symbols-outlined text-slate-300 transition-transform text-[18px] ${expandedId === `faq-${i}` ? 'rotate-90 text-primary' : ''}`}>
                                            chevron_right
                                        </span>
                                        {faq.question}
                                    </div>
                                    <div className="col-span-3 text-right">
                                        {faq.panel && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                {faq.panel}
                                            </span>
                                        )}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {expandedId === `faq-${i}` && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 pt-1 bg-slate-50/50 border-t border-slate-100 flex">
                                                <div className="w-8 flex-shrink-0 flex flex-col items-center pt-2">
                                                    <div className="w-px h-full bg-slate-200 relative"></div>
                                                </div>
                                                <div className="flex-1 pl-2 pt-2 pb-2">
                                                    <div className="relative">
                                                        <div className="absolute -left-[29px] top-1.5 w-3 h-3 bg-purple-100 border-2 border-purple-500 rounded-full z-10"></div>
                                                        <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-100 shadow-sm">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center border-t border-slate-100 pt-4 pb-2">
                <p className="text-[10px] text-slate-400">
                    Displaying {activeTab === 'articles' ? (data?.articles || []).length : (data?.faqs || []).length} items • Updated just now
                </p>
            </div>
        </div>
    );
};

export default IntelLibrary;
