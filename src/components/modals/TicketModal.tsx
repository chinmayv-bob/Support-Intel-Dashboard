import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';

const TicketModal: React.FC = () => {
    const { selectedTicketId, setSelectedTicketId } = useUIStore();

    if (!selectedTicketId) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedTicketId(null)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                />

                {/* Modal content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">Closed</span>
                                <span className="text-xs text-slate-400 font-mono">#{selectedTicketId}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Enterprise Plan Downgrade Reqeust</h3>
                        </div>
                        <button
                            onClick={() => setSelectedTicketId(null)}
                            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="overflow-y-auto p-6 space-y-6">
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-4">
                            <div className="shrink-0 mt-0.5">
                                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-primary mb-1">AI Reasoning for Flag</h4>
                                <p className="text-sm text-slate-700 italic leading-relaxed">
                                    "The agent exhibited <strong className="not-italic font-semibold text-slate-900">Redundant Clarification</strong> behavior. The customer provided their Order ID in the initial message, but the agent requested it again, causing a 12% sentiment drop."
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Interaction Summary</h4>
                            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                                <p>
                                    The customer initiated a chat regarding a downgrade to the Pro plan for cost reduction. They shared their account number and Order ID <span className="font-mono bg-slate-100 px-1 rounded">ORD-9921</span> immediately.
                                </p>
                                <p>
                                    Agent Mark T. responded quickly but used a generic macro requesting information already provided. The customer expressed frustration, which AI flagged as a negative sentiment spike.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Sentiment</span>
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-sm font-semibold text-slate-700">Positive (0.8)</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Sentiment</span>
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-red-500"></span>
                                    <span className="text-sm font-semibold text-slate-700">Negative (-0.4)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Was this AI analysis helpful?</span>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                                <span className="material-symbols-outlined text-[18px]">thumb_down</span> Inaccurate
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">thumb_up</span> Useful Insight
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TicketModal;
