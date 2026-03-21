"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Shield,
    ShieldCheck,
    ShieldAlert,
    Zap,
    Thermometer,
    CloudRain,
    Check,
    ArrowRight,
    TrendingUp,
    Clock,
    ShieldQuestion,
    Info
} from 'lucide-react';

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        price: 500,
        setup: 'Basic Coverage',
        description: 'Protection for part-time riders who want basic protection against occasional rains.',
        coverage: 'Up to ₹1,500/day',
        triggers: ['Heavy Rain (> 2mm)'],
        icon: CloudRain,
        color: 'emerald',
        premium: 500
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 1200,
        setup: 'Optimal Performance',
        description: 'Maximum flexibility for full-time courier who needs to shield against various disruptions.',
        coverage: 'Up to ₹4,000/day',
        triggers: ['Rain', 'Heatwaves (> 35°C)'],
        icon: Zap,
        color: 'primary',
        popular: true,
        premium: 1200
    },
    {
        id: 'elite',
        name: 'Elite',
        price: 2500,
        setup: 'Blue Shield',
        description: 'The ultimate plan for highest coverage against all weather and any income-disrupting events.',
        coverage: 'Unlimited daily coverage',
        triggers: ['Any weather disruption'],
        icon: ShieldCheck,
        color: 'purple',
        premium: 2500
    }
];

const features = [
    { name: 'Daily Payout Cap', starter: '₹1,500', pro: '₹4,000', elite: 'Unlimited' },
    { name: 'Payout Speed', starter: '24 Hours', pro: 'Instant', elite: 'Instant (Priority)' },
    { name: 'Weather Triggers', starter: 'Heavy Rain', pro: 'Rain, Heat (>35°C)', elite: 'Any Disruption' },
    { name: 'AI Risk Reports', starter: 'Monthly', pro: 'Weekly', elite: 'Daily Real-time' },
    { name: 'Support', starter: 'Email', pro: '24/7 Chat', elite: 'Priority Concierge' },
];

export default function ExplorePlans() {
    const router = useRouter();
    const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly'>('weekly');

    const handleSelectPlan = (premium: number, coverage: string) => {
        // coverage is like "Up to ₹1,500/day" or "Unlimited daily coverage"
        // We need to parse the numeric value
        let numericCoverage = 10000; // Default for Unlimited
        const match = coverage.match(/₹([\d,]+)/);
        if (match) {
            numericCoverage = parseInt(match[1].replace(/,/g, ''));
        }
        
        router.push(`/policy?premium=${premium}&coverage=${numericCoverage}`);
    };

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
                        <button onClick={() => router.push('/admin')} className="text-sm font-semibold hover:text-accent-teal transition-colors">Analytics</button>
                        <button onClick={() => router.push('/profile')} className="text-sm font-semibold hover:text-accent-teal transition-colors">Profile</button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                        Choose the right protection <br /> <span className="gradient-text">for your hustle.</span>
                    </h1>
                    <p className="text-lg text-primary/60 mb-10">
                        Smart, parametric insurance that pays out instantly when weather disrupts your delivery earnings.
                    </p>

                    <div className="inline-flex items-center p-1 bg-white dark:bg-slate-800 rounded-xl border border-primary/10 shadow-sm">
                        <button
                            onClick={() => setBillingCycle('weekly')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'weekly' ? 'bg-primary text-white shadow-md' : 'text-primary/60 hover:text-primary'}`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-primary text-white shadow-md' : 'text-primary/60 hover:text-primary'}`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 transition-all p-10 flex flex-col ${plan.popular ? 'border-primary shadow-2xl shadow-primary/10 ring-4 ring-primary/5' : 'border-primary/5 hover:border-primary/20 shadow-xl shadow-primary/5'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-6 right-6">
                                    <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Popular</span>
                                </div>
                            )}

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${plan.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : plan.color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                <plan.icon size={32} />
                            </div>

                            <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
                            <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-6">{plan.setup}</p>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">₹{billingCycle === 'weekly' ? plan.price : plan.price * 4}</span>
                                    <span className="text-primary/40 font-bold">/{billingCycle === 'weekly' ? 'week' : 'mo'}</span>
                                </div>
                            </div>

                            <p className="text-sm text-primary/60 leading-relaxed mb-8 h-12">
                                {plan.description}
                            </p>

                            <div className="space-y-4 mb-10 flex-grow">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded-full">
                                        <Check size={14} className="text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-bold opacity-80">{plan.coverage}</span>
                                </div>
                                {plan.triggers.map((trigger, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded-full">
                                            <Check size={14} className="text-emerald-600" />
                                        </div>
                                        <span className="text-sm font-bold opacity-80">{trigger}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSelectPlan(plan.premium, plan.coverage)}
                                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${plan.popular ? 'bg-primary text-white hover:bg-slate-800 shadow-lg shadow-primary/20' : 'border-2 border-primary/10 text-primary hover:bg-primary hover:text-white hover:border-primary'}`}
                            >
                                Select {plan.name}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <section className="bg-white dark:bg-slate-900 rounded-[3rem] border border-primary/5 p-12 overflow-hidden relative mb-24">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-teal/5 blur-[100px]"></div>

                    <h2 className="text-3xl font-black mb-12 text-center">Plan Comparison</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-primary/5">
                                    <th className="py-6 font-bold text-primary/40 uppercase tracking-widest text-xs">Features</th>
                                    <th className="py-6 font-black text-center">Starter</th>
                                    <th className="py-6 font-black text-center text-primary">Pro</th>
                                    <th className="py-6 font-black text-center">Elite</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {features.map((feature, i) => (
                                    <tr key={i} className="group hover:bg-primary/[0.01] transition-colors">
                                        <td className="py-6 font-bold text-primary opacity-80">{feature.name}</td>
                                        <td className="py-6 text-center text-sm font-medium opacity-60">{feature.starter}</td>
                                        <td className="py-6 text-center text-sm font-black text-primary">{feature.pro}</td>
                                        <td className="py-6 text-center text-sm font-medium opacity-60">{feature.elite}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="grid lg:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 bg-accent-teal/10 text-accent-teal px-4 py-1.5 rounded-full">
                            <ShieldQuestion size={16} className="font-bold" />
                            <span className="text-xs font-black uppercase tracking-widest text-accent-teal">Reliable Protection</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight leading-[1.1]">
                            Real-time protection <br /> <span className="gradient-text">for every ride.</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                { title: 'Weather Monitoring', desc: 'Our AI agents monitor localized radar data in 5-minute intervals.', icon: CloudRain },
                                { title: 'Automatic Triggers', desc: 'No claims adjusters. If the data matches your plan, payout is initiated.', icon: Zap },
                                { title: '24/7 Support', desc: 'Priority assistance for Elite members around the clock.', icon: Clock },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-primary/5 flex items-center justify-center shrink-0">
                                        <item.icon size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">{item.title}</h4>
                                        <p className="text-sm text-primary/60 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu7dJCsPnqRePuEHcnPMAMIzwMt1TtK8LhL6I7nS5NN84RnPVtab1egd46R8_giZgl1miEC18rOdAFdfUbFIvA0VM-yquiNjFPJByKcJpfakEoPEcXQT78QRhpRSZb_jHi7Kao3MrPERfB8pMtKGD_2hVpW-Po0GNWO14kbGVmoOF789X4dLs4-bNHzcgFZNDI-SAFGq_bCF1kMvn4uBWyOna4LdwjOcEaH8RUb8fBja_XesSqbc4XwZeD-4O8DCiiS8mvIa0if3fg"
                                alt="Delivery Rider"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                            <div className="absolute bottom-10 left-10 p-8 glass-card rounded-3xl border border-white/20 max-w-xs">
                                <TrendingUp className="text-accent-teal mb-4" size={32} />
                                <h3 className="text-white text-xl font-bold mb-2">Earnings Guarantee</h3>
                                <p className="text-white/80 text-sm">We provide safety nets for the modern gig economy, ensuring you stay profitable even in storms.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-primary text-white rounded-[4rem] p-12 lg:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-teal/10 blur-[120px]"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-black mb-8">Not sure which plan to pick?</h2>
                        <p className="text-xl opacity-80 mb-12 max-w-2xl mx-auto">
                            Our AI can analyze your platform history and city weather patterns to recommend the perfect tier for you.
                        </p>
                        <button
                            onClick={() => router.push('/risk-analysis')}
                            className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-3 mx-auto"
                        >
                            Analyze My Risk <Brain size={24} />
                        </button>
                    </div>
                </section>
            </main>

            <footer className="bg-white dark:bg-slate-900 py-12 px-6 border-t border-primary/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-1 rounded-lg">
                            <Shield className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-black tracking-tight text-primary">GigShield AI</span>
                    </div>
                    <p className="text-sm text-primary/40 font-medium">© 2024 GigShield AI. All plans are data-backed and IRDAI certified.</p>
                    <div className="flex gap-4">
                        <button className="text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary">Terms</button>
                        <button className="text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary">Privacy</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Brain({ size }: { size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.5 2a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5Z" />
            <path d="M14.5 2a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5Z" />
            <path d="M11 11a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5Z" />
            <path d="M16 11a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5Z" />
            <path d="M6 11a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5Z" />
            <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4a2.5 2.5 0 0 1 2.5 2.5" />
            <path d="M16 4a2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1 2.5-2.5" />
            <path d="M12 22v-4" />
            <path d="M8 18l4 4 4-4" />
        </svg>
    );
}
