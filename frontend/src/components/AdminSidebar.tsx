import React from 'react';
import {
  LayoutDashboard, Map, Shield, Activity, Banknote
} from 'lucide-react';
import Link from 'next/link';

export default function AdminSidebar({ activePage = 'overview' }: { activePage?: string }) {
  return (
    <aside className="w-64 border-r border-primary/5 bg-white/50 hidden md:flex flex-col p-6 gap-8 shrink-0">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-3">Main Menu</p>
        <Link href="/admin">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activePage === 'overview' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary/60 hover:bg-primary/5 hover:text-primary'}`}>
            <LayoutDashboard className={`w-5 h-5 ${activePage === 'overview' ? '' : 'text-primary/40'}`} />
            <span className="text-sm font-semibold">Overview</span>
          </div>
        </Link>
        <Link href="/admin/risk-heatmap">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activePage === 'risk-heatmap' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary/60 hover:bg-primary/5 hover:text-primary'}`}>
            <Map className={`w-5 h-5 ${activePage === 'risk-heatmap' ? '' : 'text-primary/40'}`} />
            <span className="text-sm font-semibold">Risk Heatmap</span>
          </div>
        </Link>
        <Link href="/admin/risk-analysis">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activePage === 'risk-analysis' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary/60 hover:bg-primary/5 hover:text-primary'}`}>
            <Shield className={`w-5 h-5 ${activePage === 'risk-analysis' ? '' : 'text-primary/40'}`} />
            <span className="text-sm font-semibold">Risk Analysis</span>
          </div>
        </Link>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-3">Risk Controls</p>
        <Link href="/admin/fraud-watch">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activePage === 'fraud-watch' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary/60 hover:bg-primary/5 hover:text-primary'}`}>
            <Activity className={`w-5 h-5 ${activePage === 'fraud-watch' ? '' : 'text-primary/40'}`} />
            <span className="text-sm font-semibold">Fraud Watch</span>
          </div>
        </Link>
        <Link href="/admin">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activePage === 'payout-history' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary/60 hover:bg-primary/5 hover:text-primary'}`}>
            <Banknote className={`w-5 h-5 ${activePage === 'payout-history' ? '' : 'text-primary/40'}`} />
            <span className="text-sm font-semibold">Payout History</span>
          </div>
        </Link>
      </div>
      <div className="mt-auto">
        <div className="bg-gradient-to-br from-primary to-blue-900 rounded-2xl p-4 text-white">
          <p className="text-xs opacity-70 mb-1">Weekly Report</p>
          <p className="text-sm font-bold mb-3">System is running optimal with 99.9% uptime.</p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all border border-white/10">
            View Analytics
          </button>
        </div>
      </div>
    </aside>
  );
}
