import React from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
export default function RiskAnalysis() {
  return (
    <div className="font-display text-primary w-full min-h-screen">
      
<div className="relative flex min-h-screen flex-col bg-background-light overflow-x-hidden">

<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 py-3 lg:px-20">
<div className="flex items-center gap-8">
<div className="flex items-center gap-3 text-primary">
<span className="material-symbols-outlined text-3xl font-bold">shield_with_heart</span>
<h2 className="text-primary text-xl font-bold leading-tight tracking-tight">Vertex</h2>
</div>
<div className="hidden md:flex items-center gap-2">
<div className="flex items-stretch rounded-lg bg-slate-100 h-10 w-64 border border-slate-200">
<div className="text-slate-500 flex items-center justify-center pl-3">
<span className="material-symbols-outlined text-xl">search</span>
</div>
<input className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 pl-2" placeholder="Search risk models..." type="text"/>
</div>
</div>
</div>
<div className="flex items-center gap-6">
<nav className="hidden lg:flex items-center gap-8">
<a className="text-slate-600 hover:text-primary text-sm font-semibold transition-colors" href="#">Dashboard</a>
<a className="text-primary border-b-2 border-primary text-sm font-bold pb-1" href="#">Risk Analysis</a>
<a className="text-slate-600 hover:text-primary text-sm font-semibold transition-colors" href="#">Policy Manager</a>
<a className="text-slate-600 hover:text-primary text-sm font-semibold transition-colors" href="#">Analytics</a>
</nav>
<div className="flex items-center gap-3 border-l border-slate-200 pl-6">
<button className="flex items-center justify-center rounded-full size-10 bg-slate-100 text-primary hover:bg-slate-200 transition-colors">
<span className="material-symbols-outlined text-xl">notifications</span>
</button>
<button className="flex items-center justify-center rounded-full size-10 bg-slate-100 text-primary hover:bg-slate-200 transition-colors">
<span className="material-symbols-outlined text-xl">settings</span>
</button>
<div className="size-10 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden shadow-sm">
<img alt="User Profile" className="w-full h-full object-cover" data-alt="Professional male profile picture for admin user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi_cZQy1sGUc04ptLIBwg-cM-EVT8xUd61176jowh9k_EC8nTv6uP4YwPdiDyYn7xVBQosrdQjTbudLqDoe6Pjw1YunRsIX6UmNRYL_m2rT4fdpqu4XCFccPl8kQ1yHMtSlpZJbGSznCk5AZI6N80M_SIPNHvfLA51OR8KO5sRTzeVIcZU6RhrCs8SJdUxcVojUWyyawG8yBdNGnamdwKl_QlPx3MVx3If4ipdxNZ1EyMKPqCn7MmIM1ivksOv3pOU0DwKYvfylef5"/>
</div>
</div>
</div>
</header>
<div className="flex flex-1">
<AdminSidebar activePage="risk-analysis" />
<main className="flex-1 px-6 py-8 lg:px-20 max-w-[1600px] mx-auto w-full">

<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
<div>
<h1 className="text-3xl font-black text-primary tracking-tight">Risk Analysis Dashboard</h1>
<p className="text-slate-500 mt-1 font-medium">Real-time predictive modeling and market disruption trends.</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 shadow-sm">
<span className="material-symbols-outlined text-lg">calendar_today</span>
                        Last 30 Days
                    </button>
<button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:opacity-90 shadow-md">
<span className="material-symbols-outlined text-lg">download</span>
                        Export Report
                    </button>
</div>
</div>

<div className="flex border-b border-slate-200 gap-8 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
<a className="flex items-center gap-2 border-b-2 border-primary text-primary pb-4 font-bold text-sm" href="#">
<span className="material-symbols-outlined text-lg">history</span>
                    Historical Trends
                </a>
<a className="flex items-center gap-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 pb-4 font-bold text-sm" href="#">
<span className="material-symbols-outlined text-lg">query_stats</span>
                    Predictive Risk Modeling
                </a>
<a className="flex items-center gap-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 pb-4 font-bold text-sm" href="#">
<span className="material-symbols-outlined text-lg">currency_exchange</span>
                    Premium Adjustment Impact
                </a>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
<span className="material-symbols-outlined">analytics</span>
</div>
<span className="text-green-600 text-sm font-bold flex items-center">+4.2%</span>
</div>
<p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Avg Risk Score</p>
<h3 className="text-2xl font-black text-primary mt-1">12.5%</h3>
</div>
<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
<span className="material-symbols-outlined">warning</span>
</div>
<span className="text-red-500 text-sm font-bold flex items-center">-1.8%</span>
</div>
<p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Disruption Prob.</p>
<h3 className="text-2xl font-black text-primary mt-1">8.2%</h3>
</div>
<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-green-50 text-green-600 rounded-lg">
<span className="material-symbols-outlined">monetization_on</span>
</div>
<span className="text-green-600 text-sm font-bold flex items-center">+12.5%</span>
</div>
<p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Revenue Impact</p>
<h3 className="text-2xl font-black text-primary mt-1">+₹142.8k</h3>
</div>
<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
<span className="material-symbols-outlined">groups</span>
</div>
<span className="text-slate-500 text-sm font-bold flex items-center">Stable</span>
</div>
<p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Active Policyholders</p>
<h3 className="text-2xl font-black text-primary mt-1">24,502</h3>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

<div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
<div className="flex justify-between items-center mb-6">
<h3 className="text-lg font-bold text-primary">Predictive Risk Modeling (Next 7 Days)</h3>
<div className="flex gap-2">
<span className="flex items-center gap-1 text-xs font-bold text-slate-500">
<span className="size-2 rounded-full bg-primary"></span> Confidence Interval
                            </span>
</div>
</div>
<div className="relative h-64 w-full bg-slate-50 rounded-lg border border-slate-100 flex items-end px-6 pb-4">

<div className="absolute inset-0 grid grid-cols-7 gap-4 px-6 pt-4 pb-12 opacity-10">
<div className="border-r border-slate-300 h-full"></div>
<div className="border-r border-slate-300 h-full"></div>
<div className="border-r border-slate-300 h-full"></div>
<div className="border-r border-slate-300 h-full"></div>
<div className="border-r border-slate-300 h-full"></div>
<div className="border-r border-slate-300 h-full"></div>
<div className="h-full"></div>
</div>

<div className="w-full flex items-end justify-between relative z-10 h-48">
<div className="w-8 bg-primary/20 rounded-t-lg h-24 relative group">
<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded hidden group-hover:block">12%</div>
</div>
<div className="w-8 bg-primary/30 rounded-t-lg h-32"></div>
<div className="w-8 bg-primary/40 rounded-t-lg h-40"></div>
<div className="w-8 bg-primary/80 rounded-t-lg h-28"></div>
<div className="w-8 bg-primary rounded-t-lg h-44 border-2 border-white"></div>
<div className="w-8 bg-primary/60 rounded-t-lg h-36"></div>
<div className="w-8 bg-primary/40 rounded-t-lg h-20"></div>
</div>
</div>
<div className="flex justify-between mt-4 px-4 text-slate-400 text-xs font-bold">
<span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
</div>
</div>

<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
<h3 className="text-lg font-bold text-primary mb-6">Premium Impact Analysis</h3>
<div className="space-y-6">
<div className="flex items-center gap-4">
<div className="size-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">H1</div>
<div className="flex-1">
<p className="text-sm font-bold text-primary">High-Risk Adjustment</p>
<div className="w-full bg-slate-100 h-2 rounded-full mt-1">
<div className="bg-emerald-500 h-2 rounded-full" style={{"width":"75%"}}></div>
</div>
</div>
<span className="text-xs font-black text-emerald-600">+₹24k</span>
</div>
<div className="flex items-center gap-4">
<div className="size-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">M2</div>
<div className="flex-1">
<p className="text-sm font-bold text-primary">Market Saturation</p>
<div className="w-full bg-slate-100 h-2 rounded-full mt-1">
<div className="bg-amber-500 h-2 rounded-full" style={{"width":"45%"}}></div>
</div>
</div>
<span className="text-xs font-black text-amber-600">+₹12k</span>
</div>
<div className="flex items-center gap-4">
<div className="size-12 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">L3</div>
<div className="flex-1">
<p className="text-sm font-bold text-primary">Disruption Bonus</p>
<div className="w-full bg-slate-100 h-2 rounded-full mt-1">
<div className="bg-rose-500 h-2 rounded-full" style={{"width":"20%"}}></div>
</div>
</div>
<span className="text-xs font-black text-rose-600">-₹4.2k</span>
</div>
</div>
<div className="mt-8 p-4 bg-primary rounded-xl text-white">
<p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Net Revenue Forecast</p>
<h4 className="text-2xl font-black mt-1">₹1.24M</h4>
<p className="text-xs text-green-400 font-bold mt-2">↑ 8.5% Expected Growth</p>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
<div className="p-6 border-b border-slate-100 flex justify-between items-center">
<h3 className="text-lg font-bold text-primary">City-wide Risk Scores</h3>
<button className="text-primary text-sm font-bold hover:underline">View Map</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
<tr>
<th className="px-6 py-4">Market / City</th>
<th className="px-6 py-4">Active Workers</th>
<th className="px-6 py-4">Risk Level</th>
<th className="px-6 py-4 text-right">Last Peak</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100">
<tr className="hover:bg-slate-50 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="size-8 rounded bg-slate-100 flex items-center justify-center text-primary font-bold">SF</div>
<span className="font-bold text-sm text-slate-700">San Francisco, CA</span>
</div>
</td>
<td className="px-6 py-4 text-sm font-medium text-slate-600">12,402</td>
<td className="px-6 py-4">
<span className="px-2 py-1 rounded bg-red-100 text-red-600 text-[10px] font-black">HIGH</span>
</td>
<td className="px-6 py-4 text-right text-sm text-slate-500">2h ago</td>
</tr>
<tr className="hover:bg-slate-50 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="size-8 rounded bg-slate-100 flex items-center justify-center text-primary font-bold">NY</div>
<span className="font-bold text-sm text-slate-700">New York, NY</span>
</div>
</td>
<td className="px-6 py-4 text-sm font-medium text-slate-600">42,110</td>
<td className="px-6 py-4">
<span className="px-2 py-1 rounded bg-amber-100 text-amber-600 text-[10px] font-black">MED</span>
</td>
<td className="px-6 py-4 text-right text-sm text-slate-500">14m ago</td>
</tr>
<tr className="hover:bg-slate-50 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="size-8 rounded bg-slate-100 flex items-center justify-center text-primary font-bold">AT</div>
<span className="font-bold text-sm text-slate-700">Austin, TX</span>
</div>
</td>
<td className="px-6 py-4 text-sm font-medium text-slate-600">8,924</td>
<td className="px-6 py-4">
<span className="px-2 py-1 rounded bg-emerald-100 text-emerald-600 text-[10px] font-black">LOW</span>
</td>
<td className="px-6 py-4 text-right text-sm text-slate-500">Stable</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
<div className="p-6 border-b border-slate-100 flex justify-between items-center">
<h3 className="text-lg font-bold text-primary">Density vs. Disruption Prob.</h3>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-slate-400 text-sm">info</span>
<span className="text-[10px] font-bold text-slate-400 uppercase">Normalized Data</span>
</div>
</div>
<div className="p-6">
<div className="space-y-6">
<div className="relative pt-1">
<div className="flex mb-2 items-center justify-between">
<div>
<span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">Ultra Dense (Hubs)</span>
</div>
<div className="text-right">
<span className="text-xs font-black inline-block text-primary">94% Prob.</span>
</div>
</div>
<div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-slate-100">
<div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary" style={{"width":"94%"}}></div>
</div>
</div>
<div className="relative pt-1">
<div className="flex mb-2 items-center justify-between">
<div>
<span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-slate-600 bg-slate-100">Suburban Clusters</span>
</div>
<div className="text-right">
<span className="text-xs font-black inline-block text-slate-600">42% Prob.</span>
</div>
</div>
<div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-slate-100">
<div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-400" style={{"width":"42%"}}></div>
</div>
</div>
<div className="relative pt-1">
<div className="flex mb-2 items-center justify-between">
<div>
<span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-slate-600 bg-slate-100">Remote/Rural</span>
</div>
<div className="text-right">
<span className="text-xs font-black inline-block text-slate-600">12% Prob.</span>
</div>
</div>
<div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-slate-100">
<div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-300" style={{"width":"12%"}}></div>
</div>
</div>
</div>
<div className="mt-8 p-4 bg-slate-50 rounded-lg flex items-start gap-4">
<span className="material-symbols-outlined text-primary">lightbulb</span>
<p className="text-xs text-slate-600 leading-relaxed font-medium">
<strong className="text-primary">Insight:</strong> Markets with &gt;15% density increase over 24h show a 3x higher probability of insurance claim spikes within 72h.
                            </p>
</div>
</div>
</div>
</div>
</main>
</div>
<footer className="mt-auto border-t border-slate-200 py-6 px-6 lg:px-20 bg-white">
<div className="flex flex-col md:flex-row justify-between items-center gap-4">
<p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 Vertex Risk Systems</p>
<div className="flex gap-6">
<a className="text-slate-400 hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors" href="#">Security Audit</a>
<a className="text-slate-400 hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors" href="#">API Documentation</a>
<a className="text-slate-400 hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors" href="#">Terms of Service</a>
</div>
</div>
</footer>
</div>

    </div>
  );
}
