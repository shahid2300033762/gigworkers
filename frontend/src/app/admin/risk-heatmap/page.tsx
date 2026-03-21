import React from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
export default function RiskHeatmap() {
  return (
    <div className="font-display text-primary w-full min-h-screen">
      
<div className="relative flex h-screen w-full flex-col overflow-hidden">

<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3 z-50">
<div className="flex items-center gap-8">
<div className="flex items-center gap-4 text-primary dark:text-slate-100">
<div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
<span className="material-symbols-outlined">shield_with_heart</span>
</div>
<h2 className="text-xl font-bold leading-tight tracking-tight">GigShield AI</h2>
</div>
<nav className="hidden md:flex items-center gap-8">
<a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="#">Dashboard</a>
<a className="text-primary dark:text-white text-sm font-bold border-b-2 border-primary dark:border-white pb-1" href="#">Risk Map</a>
<a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="#">Alerts</a>
<a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="#">Settings</a>
</nav>
</div>
<div className="flex flex-1 justify-end gap-6 items-center">
<label className="relative flex flex-col min-w-40 h-10 max-w-64">
<div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
<div className="text-slate-500 flex items-center justify-center pl-4">
<span className="material-symbols-outlined text-lg">search</span>
</div>
<input className="w-full border-none bg-transparent focus:ring-0 text-sm placeholder:text-slate-500" placeholder="Search districts..."/>
</div>
</label>
<div className="flex gap-2">
<button className="relative flex items-center justify-center rounded-xl size-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
<span className="material-symbols-outlined text-xl">notifications</span>
<span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
</button>
<button className="flex items-center justify-center rounded-xl size-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
<span className="material-symbols-outlined text-xl">account_circle</span>
</button>
</div>
<div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 bg-cover bg-center overflow-hidden" data-alt="User profile avatar" style={{"backgroundImage":"url('https"}}></div>
</div>
</header>
<main className="flex flex-1 overflow-hidden">
<AdminSidebar activePage="risk-heatmap" />
<aside className="w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto z-40">
<div className="p-6">
<div className="flex items-center justify-between mb-6">
<div>
<h1 className="text-xl font-bold">Mumbai Region</h1>
<p className="text-sm text-slate-500">Live Disruption Overview</p>
</div>
<span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded uppercase">Live</span>
</div>

<div className="mb-8">
<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Risk Intensity</h3>
<div className="flex items-center gap-2">
<div className="flex-1 h-2 rounded-full bg-red-500" title="Critical"></div>
<div className="flex-1 h-2 rounded-full bg-orange-500" title="High"></div>
<div className="flex-1 h-2 rounded-full bg-yellow-400" title="Moderate"></div>
<div className="flex-1 h-2 rounded-full bg-emerald-500" title="Low"></div>
</div>
<div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500">
<span>CRITICAL</span>
<span>HIGH</span>
<span>MODERATE</span>
<span>STABLE</span>
</div>
</div>

<div className="space-y-4">
<h3 className="text-sm font-bold flex items-center gap-2">
<span className="material-symbols-outlined text-red-500 text-lg">warning</span>
                        Active Disruptions
                    </h3>
<div className="risk-gradient-critical p-4 rounded-lg">
<div className="flex justify-between items-start mb-2">
<span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">CRITICAL</span>
<span className="text-[10px] text-slate-500">2 mins ago</span>
</div>
<h4 className="font-bold text-sm">Dharavi - Severe Flooding</h4>
<p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Water levels exceeding 1.2m. Dispatch halted in Zone 4B.</p>
<div className="mt-3 flex gap-2">
<button className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full">REROUTE GIGS</button>
<button className="px-3 py-1 border border-slate-200 dark:border-slate-700 text-[10px] font-bold rounded-full">DETAILS</button>
</div>
</div>
<div className="risk-gradient-high p-4 rounded-lg">
<div className="flex justify-between items-start mb-2">
<span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">HIGH</span>
<span className="text-[10px] text-slate-500">14 mins ago</span>
</div>
<h4 className="font-bold text-sm">Bandra West - Gridlock</h4>
<p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Heavy congestion due to localized rainfall. Delay: +25 mins.</p>
</div>
<div className="risk-gradient-moderate p-4 rounded-lg">
<div className="flex justify-between items-start mb-2">
<span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">MODERATE</span>
<span className="text-[10px] text-slate-500">28 mins ago</span>
</div>
<h4 className="font-bold text-sm">Worli - High Winds</h4>
<p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Wind gusts up to 45km/h. Caution recommended for 2-wheelers.</p>
</div>
</div>
</div>
<div className="mt-auto p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
<div className="flex items-center justify-between mb-4">
<h3 className="text-sm font-bold">Region Statistics</h3>
<span className="material-symbols-outlined text-slate-400">trending_up</span>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
<p className="text-[10px] text-slate-500 uppercase">Avg Delay</p>
<p className="text-lg font-bold text-primary dark:text-accent">+18m</p>
</div>
<div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
<p className="text-[10px] text-slate-500 uppercase">Risk Level</p>
<p className="text-lg font-bold text-orange-500">Elevated</p>
</div>
</div>
</div>
</aside>

<section className="flex-1 relative bg-slate-100">

<div className="absolute top-6 left-6 z-30 flex flex-col gap-3">
<div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1">
<button className="p-2 bg-primary text-white rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-sm">layers</span>
<span className="ml-1 text-xs font-bold">Heatmap</span>
</button>
<button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center transition-all">
<span className="material-symbols-outlined text-sm">cloud</span>
<span className="ml-1 text-xs font-bold">Weather</span>
</button>
<button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center transition-all">
<span className="material-symbols-outlined text-sm">traffic</span>
<span className="ml-1 text-xs font-bold">Traffic</span>
</button>
</div>
</div>

<div className="absolute bottom-10 right-10 z-30 flex flex-col gap-2">
<button className="size-12 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<span className="material-symbols-outlined">add</span>
</button>
<button className="size-12 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<span className="material-symbols-outlined">remove</span>
</button>
<button className="size-12 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center mt-2">
<span className="material-symbols-outlined">near_me</span>
</button>
</div>

<div className="absolute inset-0 z-10 w-full h-full bg-cover bg-center transition-all duration-700" data-alt="Detailed heatmap of Mumbai city showing risk levels" data-location="Mumbai" style={{"backgroundImage":"url('https"}}>

<div className="absolute inset-0 pointer-events-none">

<div className="absolute top-[20%] left-[30%] size-64 rounded-full bg-red-500/20 blur-3xl"></div>

<div className="absolute bottom-[30%] right-[25%] size-80 rounded-full bg-orange-500/20 blur-3xl"></div>

<div className="absolute top-[50%] left-[60%] size-48 rounded-full bg-yellow-400/20 blur-3xl"></div>

<div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{"backgroundImage":"linear-gradient(45deg, #001f3d 25%, transparent 25%, transparent 50%, #001f3d 50%, #001f3d 75%, transparent 75%, transparent)","backgroundSize":"20px 20px"}}></div>
</div>
</div>

<div className="absolute inset-0 z-20 pointer-events-none">

<div className="absolute top-[25%] left-[35%] pointer-events-auto cursor-pointer group">
<div className="flex flex-col items-center">
<div className="hidden group-hover:block absolute bottom-full mb-2 w-32 bg-slate-900 text-white p-2 rounded text-[10px] leading-tight shadow-xl">
<strong>Dharavi Zone</strong><br/>
                            Risk: Critical (Flooding)<br/>
                            Status: Lockdown
                        </div>
<div className="size-10 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white ring-4 ring-red-500/20">
<span className="material-symbols-outlined text-sm">water_drop</span>
</div>
</div>
</div>

<div className="absolute bottom-[40%] right-[30%] pointer-events-auto cursor-pointer group">
<div className="flex flex-col items-center">
<div className="size-10 bg-orange-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white ring-4 ring-orange-500/20">
<span className="material-symbols-outlined text-sm">traffic</span>
</div>
</div>
</div>

<div className="absolute top-[55%] left-[65%] pointer-events-auto cursor-pointer group">
<div className="flex flex-col items-center">
<div className="size-10 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white ring-4 ring-yellow-400/20">
<span className="material-symbols-outlined text-sm">thunderstorm</span>
</div>
</div>
</div>
</div>

<div className="absolute bottom-6 left-6 right-6 z-30">
<div className="max-w-4xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between">
<div className="flex gap-8 items-center px-4">
<div className="flex flex-col">
<span className="text-[10px] font-bold text-slate-500 uppercase">Region</span>
<span className="text-sm font-bold">South Mumbai</span>
</div>
<div className="h-8 w-px bg-slate-300 dark:bg-slate-700"></div>
<div className="flex flex-col">
<span className="text-[10px] font-bold text-slate-500 uppercase">Precipitation</span>
<span className="text-sm font-bold">12mm/hr</span>
</div>
<div className="h-8 w-px bg-slate-300 dark:bg-slate-700"></div>
<div className="flex flex-col">
<span className="text-[10px] font-bold text-slate-500 uppercase">Active Gigs</span>
<span className="text-sm font-bold text-accent">1,402</span>
</div>
</div>
<div className="flex gap-3">
<button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all">
<span className="material-symbols-outlined text-sm">security</span>
                            DEPLOY SAFE-MODE
                        </button>
<button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            EXPORT REPORT
                        </button>
</div>
</div>
</div>
</section>
</main>
</div>

    </div>
  );
}
