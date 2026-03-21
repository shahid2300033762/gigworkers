"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search, BookOpen, Zap, Settings, Shield,
    MessageCircle, Mail, PhoneCall, ChevronDown, ChevronRight,
    ArrowLeft, ExternalLink, HelpCircle,
    CheckCircle2, Info, Sparkles, Loader2
} from 'lucide-react';

export default function SupportPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const categories = [
        {
            title: "Parametric Insurance 101",
            description: "Basics of trigger-based coverage and decentralized risk mapping.",
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Automatic Payouts",
            description: "How instant strike systems work without manual claims or delays.",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            title: "Policy Management",
            description: "Manage coverage limits, risk parameters, and regional heatmaps.",
            icon: Settings,
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            title: "Account & Security",
            description: "Guidance on 2FA settings, data privacy, and profile management.",
            icon: Shield,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        }
    ];

    const faqs = [
        {
            q: "What triggers a payout?",
            a: "Payouts are triggered automatically when predefined environmental or data-driven thresholds are met (e.g., rainfall exceeding 40mm/hr in your active zone). No manual filing is required."
        },
        {
            q: "How fast is the automatic transfer?",
            a: "Once the trigger is confirmed by our AI oracle network, funds are initiated immediately via UPI or bank transfer. Most workers receive funds within 5 minutes."
        },
        {
            q: "Can I adjust my coverage mid-week?",
            a: "Yes, you can upgrade your tier or adjust risk parameters anytime. Changes take effect at 12:00 AM the following day."
        },
        {
            q: "How do you verify weather data?",
            a: "We use a multi-source oracle system combining satellite data, ground stations, and decentralized IoT sensors to ensure 100% accuracy."
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen py-10 px-4 lg:px-20 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header / Navigation */}
                <header className="flex justify-between items-center mb-12">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-primary font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">GigShield AI <span className="text-slate-400 font-medium">| Support</span></h2>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Support Area */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Search Hero Section */}
                        <section className="relative rounded-[3rem] bg-gradient-to-br from-primary to-blue-700 p-12 overflow-hidden shadow-2xl shadow-primary/20">
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 50 Q 250 10 500 50 T 1000 50" fill="none" stroke="white" strokeWidth="2"></path>
                                    <path d="M0 100 Q 250 60 500 100 T 1000 100" fill="none" stroke="white" strokeWidth="2"></path>
                                </svg>
                            </div>
                            <div className="absolute -right-20 -top-20 size-80 bg-white/10 blur-3xl rounded-full"></div>

                            <div className="relative z-10 text-center text-white flex flex-col items-center">
                                <div className="mb-6 flex justify-center">
                                    <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                        <Sparkles className="w-8 h-8 text-yellow-300" />
                                    </div>
                                </div>
                                <h1 className="text-4xl font-black mb-4 tracking-tight">How can we help you today?</h1>
                                <p className="text-blue-100 font-medium max-w-lg mb-10 leading-relaxed">
                                    Search our documentation or browse categories below to find everything you need about GigShield AI.
                                </p>

                                <div className="w-full max-w-2xl relative">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                                    <input
                                        type="text"
                                        placeholder="Search for articles, guides, or keywords..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-16 pl-16 pr-6 rounded-2xl bg-white text-primary font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-xl"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Help Categories */}
                        <section>
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-primary uppercase tracking-widest text-sm">
                                <BookOpen className="w-5 h-5" />
                                Browse Knowledge Base
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.title}
                                        className="group p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-left hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all active:scale-[0.98]"
                                    >
                                        <div className={`size-14 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            <cat.icon className="w-7 h-7" />
                                        </div>
                                        <h4 className="text-lg font-black text-primary mb-2 tracking-tight">{cat.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6">
                                            {cat.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                            View Articles <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>

                            <h3 className="text-xl font-black mb-10 text-primary uppercase tracking-widest text-sm">Common Questions</h3>

                            <div className="space-y-4">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                            className="w-full py-5 flex items-center justify-between text-left group"
                                        >
                                            <span className={`font-bold transition-colors ${openFaq === idx ? 'text-primary' : 'text-slate-700 dark:text-slate-300 group-hover:text-primary'}`}>
                                                {faq.q}
                                            </span>
                                            <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-primary' : ''}`} />
                                        </button>
                                        {openFaq === idx && (
                                                <div
                                                    className="overflow-hidden"
                                                >
                                                    <p className="pb-6 text-sm text-slate-500 leading-relaxed font-medium">
                                                        {faq.a}
                                                    </p>
                                                </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Support Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">

                        {/* Team Illustration Sidebar Card */}
                        <section className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent"></div>
                            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="mb-8 w-full max-w-[200px]">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ4F2CjM4Vf5mS8G4Vq0kCjYt6N3w8w9G7n1k9W4U7n1w8w9G7n1k9W4U7n1w8w9G7"
                                        alt="Support Hero"
                                        className="w-full h-auto object-contain opacity-90 drop-shadow-2xl"
                                        style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                                    />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 text-center">Can't find it?</h3>
                                <p className="text-slate-400 text-sm font-medium mb-8 text-center px-4">
                                    Our specialists are available 24/7 to assist you.
                                </p>

                                <div className="space-y-4 w-full">
                                    <button className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 group">
                                        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        Live Chat Support
                                    </button>
                                    <button className="w-full py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                                        <Mail className="w-5 h-5" />
                                        Email Support
                                    </button>
                                    <button className="w-full py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                                        <PhoneCall className="w-5 h-5" />
                                        Schedule a Call
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Team Status */}
                        <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="size-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden ring-1 ring-slate-100">
                                            <img src={`https://lh3.googleusercontent.com/aida-public/AB6AXuA${i}`} alt="Agent" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="size-10 rounded-full border-4 border-white dark:border-slate-900 bg-primary text-white text-[10px] font-black flex items-center justify-center ring-1 ring-slate-100">
                                        +12
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                                        <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span> Specialists Online
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-medium">Avg. response time: ~2 mins</p>
                                </div>
                            </div>
                        </section>

                        {/* System Status */}
                        <section className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Global AI Engine</h4>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
                                <div className="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
                                <div className="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
                                <div className="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
                                <div className="h-1.5 flex-1 bg-emerald-400 rounded-full animate-pulse"></div>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}

function ShieldCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
