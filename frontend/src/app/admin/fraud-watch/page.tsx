import React from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
export default function FraudWatch() {
  return (
    <div className="font-display text-primary w-full min-h-screen">
      
<div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3 sticky top-0 z-50">
<div className="flex items-center gap-8">
<div className="flex items-center gap-4 text-primary dark:text-slate-100">
<div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
<span className="material-symbols-outlined">shield</span>
</div>
<h2 className="text-primary dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em]">GigShield AI</h2>
</div>
<label className="flex flex-col min-w-40 h-10 max-w-64">
<div className="flex w-full flex-1 items-stretch rounded-xl h-full">
<div className="text-slate-500 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-xl" data-icon="search">
<span className="material-symbols-outlined text-[20px]">search</span>
</div>
<input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-0 border-none bg-slate-100 dark:bg-slate-800 focus:border-none h-full placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search Workers or Alerts" value=""/>
</div>
</label>
</div>
<div className="flex flex-1 justify-end gap-8">
<div className="flex items-center gap-9">
<a className="text-primary dark:text-slate-100 text-sm font-semibold border-b-2 border-primary" href="#">Dashboard</a>
<a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Investigations</a>
<a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Risk Profiles</a>
<a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Reports</a>
</div>
<div className="flex gap-2">
<button className="flex items-center justify-center rounded-xl size-10 bg-slate-100 dark:bg-slate-800 text-primary dark:text-slate-100">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="flex items-center justify-center rounded-xl size-10 bg-slate-100 dark:bg-slate-800 text-primary dark:text-slate-100">
<span className="material-symbols-outlined">settings</span>
</button>
</div>
<div className="bg-primary/10 border border-primary/20 rounded-full size-10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary">person</span>
</div>
</div>
</header>
<div className="flex flex-1">
<AdminSidebar activePage="fraud-watch" />
<main className="flex-1 px-4 md:px-10 lg:px-20 py-8">
<div className="flex flex-col gap-6">
<div className="flex items-center justify-between">
<div>
<h1 className="text-3xl font-bold tracking-tight text-primary dark:text-slate-100">Fraud Watch Command Center</h1>
<p className="text-slate-500 text-base mt-1">Real-time monitoring and prevention analytics.</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
<span className="material-symbols-outlined text-[18px]">download</span> Export Report
                            </button>
<button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity">
<span className="material-symbols-outlined text-[18px]">add_moderator</span> New Investigation
                            </button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
<div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between">
<p className="text-slate-500 text-sm font-medium">Fraud Prevention Savings</p>
<span className="material-symbols-outlined text-success-green bg-success-green/10 p-1 rounded">payments</span>
</div>
<p className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight">₹124,500.00</p>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-success-green text-[16px]">trending_up</span>
<p className="text-success-green text-xs font-bold leading-normal">+12.5% vs last month</p>
</div>
</div>
<div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between">
<p className="text-slate-500 text-sm font-medium">Active Critical Alerts</p>
<span className="material-symbols-outlined text-alert-red bg-alert-red/10 p-1 rounded">warning</span>
</div>
<p className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight">18</p>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-alert-red text-[16px]">trending_up</span>
<p className="text-alert-red text-xs font-bold leading-normal">+4 since last hour</p>
</div>
</div>
<div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between">
<p className="text-slate-500 text-sm font-medium">High Risk Workers</p>
<span className="material-symbols-outlined text-alert-amber bg-alert-amber/10 p-1 rounded">person_alert</span>
</div>
<p className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight">42</p>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-success-green text-[16px]">trending_down</span>
<p className="text-success-green text-xs font-bold leading-normal">-5.2% improved</p>
</div>
</div>
<div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between">
<p className="text-slate-500 text-sm font-medium">Investigations Pending</p>
<span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded">assignment_late</span>
</div>
<p className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight">07</p>
<div className="flex items-center gap-1">
<p className="text-slate-400 text-xs font-medium leading-normal">Avg. resolution: 4.2h</p>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div className="lg:col-span-2 flex flex-col gap-4">
<div className="flex items-center justify-between px-2">
<h2 className="text-xl font-bold text-primary dark:text-slate-100 flex items-center gap-2">
<span className="material-symbols-outlined text-alert-red">rss_feed</span>
                                    Real-Time Fraud Alerts
                                </h2>
<div className="flex gap-2">
<button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold">All</button>
<button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200">GPS Spoofing</button>
<button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200">Bot Patterns</button>
</div>
</div>
<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
<table className="w-full text-left border-collapse">
<thead className="bg-slate-50 dark:bg-slate-800/50">
<tr>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Severity</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alert Type</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Worker ID</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-alert-red/10 text-alert-red">CRITICAL</span>
</td>
<td className="px-6 py-4">
<div className="flex flex-col">
<span className="text-sm font-semibold text-slate-900 dark:text-white">GPS Spoofing</span>
<span className="text-xs text-slate-400">Impossible travel detected (NYC -&gt; LAX in 12m)</span>
</div>
</td>
<td className="px-6 py-4 font-mono text-sm text-primary">W-99812</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="size-2 rounded-full bg-alert-red animate-pulse"></span>
<span className="text-sm font-medium text-slate-600 dark:text-slate-400">Flagged</span>
</div>
</td>
<td className="px-6 py-4 text-right">
<button className="text-primary dark:text-slate-300 font-bold text-sm hover:underline">Investigate</button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-alert-amber/10 text-alert-amber">HIGH</span>
</td>
<td className="px-6 py-4">
<div className="flex flex-col">
<span className="text-sm font-semibold text-slate-900 dark:text-white">Bot Pattern</span>
<span className="text-xs text-slate-400">Automated job acceptance (3ms response)</span>
</div>
</td>
<td className="px-6 py-4 font-mono text-sm text-primary">W-12044</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="size-2 rounded-full bg-slate-300"></span>
<span className="text-sm font-medium text-slate-600 dark:text-slate-400">Queueing</span>
</div>
</td>
<td className="px-6 py-4 text-right">
<button className="text-primary dark:text-slate-300 font-bold text-sm hover:underline">Investigate</button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-alert-amber/10 text-alert-amber">HIGH</span>
</td>
<td className="px-6 py-4">
<div className="flex flex-col">
<span className="text-sm font-semibold text-slate-900 dark:text-white">Duplicate Claim</span>
<span className="text-xs text-slate-400">Matching image hash on two different IDs</span>
</div>
</td>
<td className="px-6 py-4 font-mono text-sm text-primary">W-88210</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="size-2 rounded-full bg-primary"></span>
<span className="text-sm font-medium text-slate-600 dark:text-slate-400">Under Review</span>
</div>
</td>
<td className="px-6 py-4 text-right">
<button className="text-primary dark:text-slate-300 font-bold text-sm hover:underline">Investigate</button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">MEDIUM</span>
</td>
<td className="px-6 py-4">
<div className="flex flex-col">
<span className="text-sm font-semibold text-slate-900 dark:text-white">IP Anomaly</span>
<span className="text-xs text-slate-400">Login from known VPN data center</span>
</div>
</td>
<td className="px-6 py-4 font-mono text-sm text-primary">W-00421</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="size-2 rounded-full bg-success-green"></span>
<span className="text-sm font-medium text-slate-600 dark:text-slate-400">Dismissed</span>
</div>
</td>
<td className="px-6 py-4 text-right">
<button className="text-primary dark:text-slate-300 font-bold text-sm hover:underline">Re-open</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<div className="flex flex-col gap-4">
<h2 className="text-xl font-bold text-primary dark:text-slate-100 px-2 flex items-center gap-2">
<span className="material-symbols-outlined text-alert-amber">shield_person</span>
                                Top At-Risk Profiles
                            </h2>
<div className="flex flex-col gap-3">
<div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
<div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
<span className="material-symbols-outlined text-slate-500">face</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-bold text-slate-900 dark:text-white text-sm">Marcus Jenkins</h4>
<span className="text-xs font-bold text-alert-red">94% Risk</span>
</div>
<div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
<div className="bg-alert-red h-full" style={{"width":"94%"}}></div>
</div>
<p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">W-99812 • GPS Manipulator</p>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
<div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
<span className="material-symbols-outlined text-slate-500">face</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-bold text-slate-900 dark:text-white text-sm">Sarah Chen</h4>
<span className="text-xs font-bold text-alert-amber">81% Risk</span>
</div>
<div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
<div className="bg-alert-amber h-full" style={{"width":"81%"}}></div>
</div>
<p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">W-12044 • Pattern Violator</p>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 border-l-4 border-l-alert-red">
<div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
<span className="material-symbols-outlined text-slate-500">face</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-bold text-slate-900 dark:text-white text-sm">Alex Rivera</h4>
<span className="text-xs font-bold text-alert-red">92% Risk</span>
</div>
<div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
<div className="bg-alert-red h-full" style={{"width":"92%"}}></div>
</div>
<p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">W-88210 • Multiple Identity Suspect</p>
</div>
</div>
<button className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 transition-colors">
                                    View All Risk Profiles
                                </button>
</div>
<div className="mt-4 bg-primary text-white p-6 rounded-xl shadow-lg">
<h3 className="font-bold text-lg mb-2">Automated Actions</h3>
<p className="text-white/70 text-sm mb-4">Shield AI is currently set to "Monitor &amp; Notify". Switch to "Auto-Block" for critical alerts?</p>
<div className="flex items-center gap-3">
<button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold border border-white/20">Active Settings</button>
<button className="flex-1 py-2 bg-white text-primary rounded-lg text-xs font-bold shadow-sm">Toggle Auto-Block</button>
</div>
</div>
</div>
</div>
<div className="flex flex-col gap-4">
<h2 className="text-xl font-bold text-primary dark:text-slate-100 px-2 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">map</span>
                            Fraud Heatmap (Last 24h)
                        </h2>
<div className="relative w-full h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-200 group">
<div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Abstract world map heatmap showing fraud hotspots" data-location="Global City Map" style={{"backgroundImage":"url('https"}}>
</div>
<div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>
<div className="absolute top-4 left-4 flex flex-col gap-2">
<div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl">
<div className="flex items-center gap-2 mb-1">
<span className="size-3 rounded-full bg-alert-red"></span>
<span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">San Francisco Hub</span>
</div>
<p className="text-lg font-black text-primary dark:text-white">High Volume</p>
<p className="text-[10px] text-slate-500 font-medium">8 alerts in the last 60 minutes</p>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
<footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-10">
<div className="flex flex-col md:flex-row items-center justify-between gap-6">
<div className="flex items-center gap-3 text-slate-500">
<span className="material-symbols-outlined text-[20px]">shield</span>
<p className="text-sm font-medium">© 2024 GigShield AI Inc. Security Operations Center.</p>
</div>
<div className="flex gap-6">
<a className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Incident Support</a>
<a className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">API Documentation</a>
</div>
<div className="flex items-center gap-2 px-3 py-1 bg-success-green/10 text-success-green rounded-full text-xs font-bold">
<span className="size-1.5 rounded-full bg-success-green"></span>
                        System Online
                    </div>
</div>
</footer>
</div>
</div>

    </div>
  );
}
