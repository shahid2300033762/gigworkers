"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Shield, MapPin, CloudRain,
    FileText, Download, AlertTriangle,
    ChevronRight, Info, Eye, Database,
    UserCircle, Sparkles
} from 'lucide-react';

export default function PrivacyAndDataPage() {
    const router = useRouter();
    const [sharing, setSharing] = useState({
        location: true,
        weather: true
    });

    const toggleSharing = (key: keyof typeof sharing) => {
        setSharing(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen py-8 px-4 lg:px-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-10">
                    <button
                        onClick={() => router.push('/profile')}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4 text-sm font-semibold group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </button>
                    <div className="flex items-center gap-5">
                        <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-primary">Privacy & Data</h1>
                            <p className="text-slate-500 max-w-xl text-sm leading-relaxed mt-1">
                                Manage how your information is used to protect your income and optimize your gig work.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Data Sharing */}
                    <div className="lg:col-span-12 space-y-8">

                        {/* Data Sharing Controls */}
                        <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-bold text-primary">Data Sharing</h3>
                                <Info className="w-5 h-5 text-slate-300" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-primary/10 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="size-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <button
                                            onClick={() => toggleSharing('location')}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${sharing.location ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                        >
                                            <div
                                                className="size-4 bg-white rounded-full absolute top-1"
                                                style={{ left: sharing.location ? 26 : 4 }}
                                            />
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-primary mb-1">Location Tracking</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Real-time mileage tracking for tax deductions and localized demand surge detection.
                                    </p>
                                </div>

                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-primary/10 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="size-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-sky-500 shadow-sm">
                                            <CloudRain className="w-6 h-6" />
                                        </div>
                                        <button
                                            onClick={() => toggleSharing('weather')}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${sharing.weather ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                        >
                                            <div
                                                className="size-4 bg-white rounded-full absolute top-1"
                                                style={{ left: sharing.weather ? 26 : 4 }}
                                            />
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-primary mb-1">Weather Insights</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Forecast-based earnings protection & critical downtime alerts based on your zip code.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Transparency Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col items-center text-center group">
                                <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-primary mb-2">Privacy Policy</h3>
                                <p className="text-sm text-slate-500 mb-6 px-4">
                                    Read our commitment to your data security and learn about our zero-sell policy.
                                </p>
                                <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all">
                                    View Document
                                </button>
                            </section>

                            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col items-center text-center group">
                                <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
                                    <Download className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-primary mb-2">Data Export</h3>
                                <p className="text-sm text-slate-500 mb-6 px-4">
                                    Download a full archive of your AI insights, earnings history, and risk data.
                                </p>
                                <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all">
                                    Request Export
                                </button>
                            </section>
                        </div>

                        {/* Danger Zone */}
                        <section className="bg-red-50/30 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-[2.5rem] p-10 mt-8">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 shrink-0">
                                    <AlertTriangle className="w-10 h-10" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-xl font-black text-red-600 mb-2">Danger Zone: Account Deletion</h3>
                                    <p className="text-sm text-red-700/80 leading-relaxed font-medium">
                                        This will permanently remove all your data, earning history, and personalized AI risk models. This action is irreversible and will immediately cancel any active coverage.
                                    </p>
                                </div>
                                <button className="px-8 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95 whitespace-nowrap">
                                    Close Account Permanently
                                </button>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Final Navigation */}
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => router.push('/profile')}
                        className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-primary font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
