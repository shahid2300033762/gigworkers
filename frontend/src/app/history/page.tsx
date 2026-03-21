"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Shield,
    ArrowLeft,
    TrendingUp,
    Calendar,
    CheckCircle2,
    ExternalLink,
    CloudRain,
    Thermometer,
    Waves,
    Zap,
    Info,
    BadgeCheck,
    Search,
    Loader2,
    Wind
} from 'lucide-react';
import { generateTransactionHistoryPDF } from '@/lib/pdf-utils';
import { apiFetch } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const iconMap: Record<string, any> = {
    'Heavy Rain': CloudRain,
    'Flood': Waves,
    'Heatwave': Thermometer,
    'Storm': Zap,
    'Lightning': Zap,
    'Cyclone': Wind, // Wind not imported yet, adding it to imports
};

export default function PayoutHistory() {
    const router = useRouter();
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([
        { label: 'Total Payouts Received', value: '₹0', change: 'Calculating...', icon: TrendingUp, color: 'emerald' },
        { label: 'Total Events Protected', value: '0', change: 'Calculating...', icon: Shield, color: 'primary' },
        { label: 'Active Coverage', value: 'Elite', change: 'Renews in 4 days', icon: BadgeCheck, color: 'purple' },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }

                const res = await apiFetch(`/api/worker-dashboard/${user.id}`);
                if (res.ok) {
                    const json = await res.json();
                    const claims = json.data.recent_claims || [];
                    
                    // Map Claims to display format
                    const mappedHistory = claims.map((claim: any) => {
                        const dateObj = new Date(claim.created_at);
                        return {
                            id: `TXN_${claim.id.slice(0, 8).toUpperCase()}`,
                            date: dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                            time: dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
                            type: claim.disruption_type,
                            amount: `₹${claim.payout_amount.toLocaleString()}`,
                            status: claim.status === 'processed' ? 'Completed' : 'Pending',
                            icon: iconMap[claim.disruption_type] || CloudRain
                        };
                    });

                    setHistoryData(mappedHistory);

                    // Update Stats
                    const totalPayout = claims.reduce((acc: number, c: any) => acc + (c.payout_amount || 0), 0);
                    setStats([
                        { label: 'Total Payouts Received', value: `₹${totalPayout.toLocaleString()}`, change: `+${claims.length} payments`, icon: TrendingUp, color: 'emerald' },
                        { label: 'Total Events Protected', value: claims.length.toString(), change: 'Across all active plans', icon: Shield, color: 'primary' },
                        { label: 'Active Coverage', value: 'Elite', change: 'Renews in 4 days', icon: BadgeCheck, color: 'purple' },
                    ]);
                }
            } catch (err) {
                console.error("Error fetching history:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [router]);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-primary min-h-screen">
            <nav className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-primary/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="bg-primary p-1.5 rounded-lg">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-primary">GigShield AI</span>
                    </div>
                    <div className="hidden md:flex items-center gap-10">
                        <button onClick={() => router.push('/')} className="text-sm font-semibold hover:text-accent-teal transition-colors">Home</button>
                        <button onClick={() => router.push('/dashboard')} className="text-sm font-semibold hover:text-accent-teal transition-colors">Dashboard</button>
                        <button onClick={() => router.push('/claim')} className="text-sm font-semibold hover:text-accent-teal transition-colors">Claims</button>
                        <button onClick={() => router.push('/analytics')} className="text-sm font-semibold hover:text-accent-teal transition-colors">Analytics</button>
                        <button onClick={() => router.push('/profile')} className="text-sm font-semibold hover:text-accent-teal transition-colors">Profile</button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 text-primary/60 font-bold text-sm mb-4 hover:text-primary transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Payout History</h1>
                        <p className="text-primary/60 font-medium">Your earnings are protected. View all parametric insurance settlements.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="pl-12 pr-6 py-3 bg-white dark:bg-slate-800 border border-primary/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-64"
                            />
                        </div>
                        <button 
                            onClick={() => generateTransactionHistoryPDF(historyData)}
                            className="bg-white dark:bg-slate-800 border border-primary/10 px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary/5 transition-all"
                        >
                            Export PDF
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 group"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : stat.color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black mb-2">{stat.value}</h3>
                            <p className={`text-xs font-bold ${stat.color === 'emerald' ? 'text-emerald-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-primary/60'}`}>
                                {stat.change}
                            </p>
                        </div>
                    ))}
                </div>

                <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
                    <div className="p-8 border-b border-primary/5 flex items-center justify-between">
                        <h2 className="font-black text-xl">Recent Transactions</h2>
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
                            <Calendar size={14} className="text-primary/60" />
                            <span className="text-xs font-bold text-primary/60">Last 30 Days</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-primary/[0.02] border-b border-primary/5">
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-primary/40">Date & Time</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-primary/40">Disruption Type</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-primary/40 text-right">Amount</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-primary/40 text-center">Status</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-primary/40">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                <p className="text-sm font-bold text-primary/40 uppercase tracking-widest">Loading transactions...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : historyData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-primary/40 font-bold uppercase tracking-widest text-sm">
                                            No transactions found yet. 
                                            <button onClick={() => router.push('/dashboard')} className="ml-2 text-primary hover:underline">Start a claim</button>
                                        </td>
                                    </tr>
                                ) : (
                                    historyData.map((row, i) => (
                                        <tr key={i} className="hover:bg-primary/[0.01] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm tracking-tight">{row.date}</span>
                                                    <span className="text-[10px] font-bold opacity-40 uppercase">{row.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                        <row.icon size={16} />
                                                    </div>
                                                    <span className="font-bold text-sm">{row.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="font-black text-emerald-600 text-lg">{row.amount}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    <CheckCircle2 size={12} />
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs opacity-40">{row.id}</span>
                                                    <ExternalLink size={12} className="text-primary/20 group-hover:text-primary transition-colors cursor-pointer" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-primary/[0.01] border-t border-primary/5 flex justify-center">
                        <button className="text-sm font-black text-primary hover:underline transition-all flex items-center gap-2">
                            View All Transactions <ArrowLeft size={16} className="rotate-180" />
                        </button>
                    </div>
                </section>

                <section className="mt-24 grid md:grid-cols-2 gap-12">
                    <div className="bg-gradient-to-br from-primary to-slate-800 rounded-[3rem] p-12 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-teal/20 blur-[100px] group-hover:scale-110 transition-transform duration-700"></div>
                        <h3 className="text-2xl font-black mb-4 relative z-10">Reliable Protection</h3>
                        <p className="opacity-70 text-sm leading-relaxed mb-8 relative z-10">
                            Our AI agents monitor localized radar data and city alerts in real-time. If conditions match your plan's triggers, your payout is initiated immediately—no paperwork, no delays.
                        </p>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                <Info size={24} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">24/7 Monitoring active</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-primary/5 shadow-xl shadow-primary/5 flex flex-col justify-center">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-8">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Instant Settlements</h3>
                        <p className="text-primary/60 text-sm leading-relaxed mb-8">
                            Payouts are transferred directly to your registered UPI account within minutes of a trigger event. You focus on safety; we'll handle the stability.
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-black">15ms</p>
                                <p className="text-[10px] font-black uppercase opacity-40">AI Decision Time</p>
                            </div>
                            <div className="w-px h-10 bg-primary/10"></div>
                            <div className="text-center">
                                <p className="text-2xl font-black">120s</p>
                                <p className="text-[10px] font-black uppercase opacity-40">Avg. Settlement</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white dark:bg-slate-900 py-12 px-6 border-t border-primary/5 mt-24">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-1 rounded-lg">
                            <Shield className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-black tracking-tight text-primary">GigShield AI</span>
                    </div>
                    <p className="text-sm text-primary/40 font-medium">© 2024 GigShield AI. Automated payouts verified by blockchain oracle.</p>
                    <div className="flex gap-4">
                        <button onClick={() => router.push('/support')} className="text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors">Support</button>
                        <button className="text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary">Docs</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
