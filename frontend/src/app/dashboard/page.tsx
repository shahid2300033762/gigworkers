"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, Shield, FileText, Wallet, Headset, Loader2, History, Plus, AlertTriangle, ArrowRight, TrendingUp, Download, MoreHorizontal, Car, Coffee, Briefcase, BarChart3, User, Home, LogOut, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { apiFetch } from '@/lib/auth';

export default function WorkerDashboard() {
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [userName, setUserName] = useState('Worker');
  const [worker, setWorker] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [premiumData, setPremiumData] = useState<any>(null);
  const [recentClaims, setRecentClaims] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user && !error) {
          setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Worker');
          
          // Fetch worker profile
          const { data: workerData } = await supabase
            .from('Workers')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (workerData) {
            setWorker(workerData);
            
            // Fetch Weather for worker's city
            const weatherRes = await fetch(`/api/weather?city=${encodeURIComponent(workerData.city)}`);
            if (weatherRes.ok) {
              const weatherJson = await weatherRes.json();
              setWeatherData(weatherJson);
              
              // Fetch Adjusted Premium
              const premiumRes = await apiFetch(`/api/calculate-premium?city=${encodeURIComponent(workerData.city)}&platform=${encodeURIComponent(workerData.platform)}&weather_risk=${weatherJson.riskLevel}`);
              if (premiumRes.ok) {
                const premiumJson = await premiumRes.json();
                setPremiumData(premiumJson);
              }
            }

            // Fetch Recent Claims
            const dashboardRes = await apiFetch(`/api/worker-dashboard/${user.id}`);
            if (dashboardRes.ok) {
              const dashboardJson = await dashboardRes.json();
              setRecentClaims(dashboardJson.data?.recent_claims || dashboardJson.recentClaims || []);
              setUnreadNotifications(dashboardJson.data?.unread_notifications || 0);
            }
          }
          
          setSessionChecked(true);
        } else {
          try { await supabase.auth.signOut(); } catch (e) {}
          router.push('/login');
        }
      } catch (err) {
        console.error("Auth fetch failed in dashboard:", err);
        setSessionChecked(true);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('worker_id');
    router.push('/login');
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen">
      
<div className="flex min-h-screen">

<aside className="w-72 bg-white dark:bg-slate-900 border-r thin-border flex flex-col fixed h-full z-50">
<div className="p-6">
<div className="flex items-center gap-3 mb-8">
<div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
<ShieldCheck className="w-6 h-6" />
</div>
<div>
<h1 className="text-lg font-bold text-primary dark:text-white leading-tight">Vertex</h1>
<p className="text-xs font-semibold text-accent-teal uppercase tracking-wider">Premium Member</p>
</div>
</div>
<nav className="space-y-1">
<button onClick={() => router.push('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
<Home className="w-5 h-5" />
<span>Home</span>
</button>
<button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary font-semibold text-left">
<LayoutDashboard className="w-5 h-5" />
<span>Dashboard</span>
</button>
<button onClick={() => router.push('/claim')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
<FileText className="w-5 h-5" />
<span>Claims</span>
</button>
<button onClick={() => router.push('/analytics')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
<BarChart3 className="w-5 h-5" />
<span>Analytics</span>
</button>
<button onClick={() => router.push('/forecast')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
<BarChart3 className="w-5 h-5" />
<span>Forecast</span>
</button>
<button onClick={() => router.push('/algo-health')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
<BarChart3 className="w-5 h-5" />
<span>Algo-Health</span>
</button>
<button onClick={() => router.push('/notifications')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
<Bell className="w-5 h-5" />
<span>Notifications</span>
{unreadNotifications > 0 && (
  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadNotifications}</span>
)}
</button>
<button onClick={() => router.push('/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
<User className="w-5 h-5" />
<span>Profile</span>
</button>
<button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-left font-semibold">
<LogOut className="w-5 h-5" />
<span>Sign Out</span>
</button>
</nav>
</div>
<div className="mt-auto p-6 space-y-4">
<div className="p-4 bg-primary rounded-xl text-white">
<p className="text-xs opacity-70 mb-1">Current Plan</p>
<p className="font-bold mb-3 text-sm">Platinum Guardian v2.4</p>
<button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all opacity-80 cursor-not-allowed">
  <div className="flex items-center justify-center gap-2">
<Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                    </div>
</button>
</div>
<div className="flex items-center gap-3 px-2">
<div className="size-10 rounded-full bg-slate-200" data-alt="User profile avatar portrait" style={{"backgroundImage":"url('https://lh3.googleusercontent.com/aida-public/AB6AXuCU5Qg_N50OFN_lizgDI0y7xv4JgTwDKOl4ru4DF5E5MnVh0xA3k6yebEDEGABIrS6OkiWgoKmysPNFO4LOUTblIoB5caj6nBsdMtiSYVHUvJhIbcxenJ6tVTFWZ1_6mHu6jED08j_h8VpZ3c-h9CSzq09mDXFvYxbKFoq7aT15skga40A9IMDb7egxfkeCCT83e_I5WdzhbRc8_YAYHw2VWlBq9dJK8lEom8BNTrgAA6oRhzxHp9-WUKc9qm1wswDgvLLj-vOxv_q2')"}}></div>
<div>
<p className="text-sm font-bold">{userName}</p>
<p className="text-xs text-slate-500">Pro Courier</p>
</div>
</div>
</div>
</aside>

<main className="flex-1 ml-72 p-8">
<header className="flex justify-between items-center mb-8">
<div>
<h2 className="text-3xl font-black tracking-tight text-primary">Worker Dashboard</h2>
<p className="text-slate-500">Welcome back, your earnings are currently being protected in real-time.</p>
</div>
<div className="flex gap-3">
<button onClick={() => router.push('/notifications')} className="relative flex items-center justify-center size-10 rounded-xl border thin-border bg-white hover:shadow-sm transition-all">
<Bell className="w-5 h-5 text-slate-600" />
{unreadNotifications > 0 && (
  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">{unreadNotifications}</span>
)}
</button>
<button onClick={() => router.push('/history')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border thin-border bg-white font-semibold text-sm hover:shadow-sm transition-all">
<History className="w-4 h-4" />
                        Activity
                    </button>
<button onClick={() => router.push('/claim')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
<Plus className="w-4 h-4" />
                        New Claim
                    </button>
</div>
</header>

<div className="grid grid-cols-3 gap-4 mb-8">
<button onClick={() => router.push('/claim')} className="flex items-center justify-between p-4 bg-white rounded-xl thin-border hover:border-primary/20 transition-all group">
<div className="flex items-center gap-3">
<div className="size-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
<AlertTriangle className="w-5 h-5" />
</div>
<span className="font-bold text-sm text-slate-700">File Claim</span>
</div>
<ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
</button>
<button onClick={() => router.push('/history')} className="flex items-center justify-between p-4 bg-white rounded-xl thin-border hover:border-primary/20 transition-all group">
<div className="flex items-center gap-3">
<div className="size-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
<Wallet className="w-5 h-5" />
</div>
<span className="font-bold text-sm text-slate-700">Withdraw Funds</span>
</div>
<ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
</button>
<button onClick={() => router.push('/support')} className="flex items-center justify-between p-4 bg-white rounded-xl thin-border hover:border-primary/20 transition-all group">
<div className="flex items-center gap-3">
<div className="size-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
<Headset className="w-5 h-5" />
</div>
<span className="font-bold text-sm text-slate-700">Priority Support</span>
</div>
<ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
</button>
</div>
<div className="grid grid-cols-12 gap-6">

<div className="col-span-8 bg-white rounded-2xl thin-border shadow-sm overflow-hidden flex flex-col animate-fade-in-up" style={{"animationDelay":"0.1s"}}>
<div className="p-8 flex-1 flex flex-col justify-between">
<div>
<div className="flex justify-between items-start mb-6">
<div>
<span className="px-3 py-1 bg-accent-teal/10 text-accent-teal text-[10px] font-bold uppercase tracking-widest rounded-full">System Active</span>
<h3 className="text-2xl font-bold mt-2 text-primary">Active Coverage</h3>
</div>
<div className="text-right">
<p className="text-xs text-slate-400 font-medium">Policy ID</p>
<p className="font-mono text-xs font-bold">GS-992-XPA</p>
</div>
</div>
<p className="text-slate-500 max-w-md">Your AI-powered gig insurance is monitoring demand spikes and environmental risks in your area. You are currently covered for 100% of income loss due to downtime.</p>
</div>
<div className="grid grid-cols-3 gap-6 mt-8">
<div className="p-4 bg-slate-50 rounded-xl">
<p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Time Remaining</p>
<p className="text-lg font-black text-primary">12d 4h 22m</p>
</div>
<div className="p-4 bg-slate-50 rounded-xl">
<p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Max Benefit</p>
<p className="text-lg font-black text-primary">₹5,000.00</p>
</div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Current Risk</p>
                  <p className={`text-lg font-black ${
                    weatherData?.riskLevel === 'Critical' ? 'text-red-600' :
                    weatherData?.riskLevel === 'High' ? 'text-orange-500' :
                    weatherData?.riskLevel === 'Medium' ? 'text-yellow-500' :
                    'text-accent-teal'
                  }`}>
                    {weatherData?.riskLevel || "LOW"}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-8 py-4 bg-slate-50 border-t thin-border flex justify-between items-center">
              <p className="text-xs text-slate-500 font-medium italic">
                {weatherData ? `Tracking live conditions in ${worker?.city}` : "Auto-renewal scheduled for March 15th"}
              </p>
              <button onClick={() => router.push('/policy')} className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                Manage Policy <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl thin-border shadow-sm relative overflow-hidden animate-fade-in-up" style={{ "animationDelay": "0.2s" }}>
              <div className="absolute -right-4 -top-4 size-24 bg-primary/5 rounded-full"></div>
              <p className="text-sm font-medium text-slate-500 mb-1">Weekly Premium</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-3xl font-black text-primary tracking-tight">
                  ₹{premiumData?.weekly_premium || "24.50"}
                </h4>
                {weatherData?.riskLevel !== 'Low' && (
                  <span className="text-xs font-bold text-red-500 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> SURGE
                  </span>
                )}
              </div>
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-primary rounded-full ${weatherData?.riskLevel === 'Low' ? 'w-[65%]' : 'w-[85%]'}`}></div>
              </div>
              <p className="text-[10px] mt-2 text-slate-400 font-medium">Weather adjusted in real-time</p>
            </div>

            <div className="bg-white p-6 rounded-2xl thin-border shadow-sm relative overflow-hidden animate-fade-in-up" style={{ "animationDelay": "0.3s" }}>
              <div className="absolute -right-4 -top-4 size-24 bg-accent-teal/5 rounded-full"></div>
              <p className="text-sm font-medium text-slate-500 mb-1">Protected Earnings</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-3xl font-black text-primary tracking-tight">₹1,280.00</h4>
                <span className="text-xs font-bold text-green-500 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> 12.0%
                </span>
              </div>
              <div className="mt-4 flex gap-1">
                <div className="h-6 flex-1 bg-accent-teal/10 rounded-sm"></div>
                <div className="h-10 flex-1 bg-accent-teal/20 rounded-sm"></div>
                <div className="h-8 flex-1 bg-accent-teal/30 rounded-sm"></div>
                <div className="h-12 flex-1 bg-accent-teal/50 rounded-sm"></div>
                <div className="h-14 flex-1 bg-accent-teal rounded-sm"></div>
              </div>
              <p className="text-[10px] mt-2 text-slate-400 font-medium">All-time protection history</p>
            </div>
          </div>

          {(weatherData?.riskLevel && weatherData.riskLevel !== 'Low') ? (
            <div className="col-span-12 animate-fade-in-up" style={{ "animationDelay": "0.4s" }}>
              <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl text-white shadow-xl shadow-red-900/10 flex items-center justify-between relative overflow-hidden p-8 animate-pulse-subtle">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 50 Q 250 10 500 50 T 1000 50" fill="none" stroke="white" strokeWidth="2"></path>
                    <path d="M0 100 Q 250 60 500 100 T 1000 100" fill="none" stroke="white" strokeWidth="2"></path>
                  </svg>
                </div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="size-32 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 overflow-hidden shrink-0">
                    <img alt="Weather alert" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClAS9vVZTsfWQYfxL79isWxvDB7UTimh7Btw3WpXuGMo1vMgORInynRZwHShLiKpX0F6KeJd-NSN4woW0x2de7EFrZCWBIBQ76lB_JhwQdUbPApuJ0vw_6GNIh6yj6hQdhxB4Loy23g_VVGcGNBcZKfOfKuS3SuWxDGJE91Bn6qz3ZDK1Zhl5CM82-qoSplVXX35543gLrCG5Al-JiIA5IcGFJ_ibdYKPHTka6GqPrUp_O05CRlQpGXjtjcCHKYTaHl8GuapjqeXMS" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-yellow-400 text-primary text-[10px] font-black uppercase rounded">
                      {weatherData.riskLevel} Risk Alert
                    </span>
                    <h3 className="text-2xl font-black mt-1">Weather Surge: {weatherData.weatherCondition}</h3>
                    <p className="text-cyan-50/80 font-medium">
                      Live risk in {worker?.city}. Your protection is active and adjusted for current environmental conditions.
                    </p>
                  </div>
                </div>
                <div className="relative z-10">
                  <button onClick={() => router.push('/risk-analysis')} className="px-6 py-3 bg-white text-primary font-black rounded-xl hover:bg-cyan-50 transition-colors shadow-lg">
                    Analyze Risk
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-12 animate-fade-in-up" style={{ "animationDelay": "0.4s" }}>
              <div className="bg-gradient-to-r from-cyan-600 to-primary rounded-2xl text-white shadow-xl shadow-cyan-900/10 flex items-center justify-between relative overflow-hidden p-8">
                <div className="flex items-center gap-6 relative z-10">
                  <div className="size-32 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 overflow-hidden shrink-0">
                    <ShieldCheck className="w-16 h-16 text-white opacity-80" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-emerald-400 text-primary text-[10px] font-black uppercase rounded">Optimal Conditions</span>
                    <h3 className="text-2xl font-black mt-1">Safe Operating Environment</h3>
                    <p className="text-cyan-50/80 font-medium">Weather in {worker?.city} is currently stable. Your baseline premium is active.</p>
                  </div>
                </div>
                <div className="relative z-10">
                  <button onClick={() => router.push('/analytics')} className="px-6 py-3 bg-white text-primary font-black rounded-xl hover:bg-cyan-50 transition-colors shadow-lg">
                    View Insights
                  </button>
                </div>
              </div>
            </div>
          )}

<div className="col-span-12 bg-white rounded-2xl thin-border shadow-sm animate-fade-in-up" style={{"animationDelay":"0.5s"}}>
<div className="p-6 border-b thin-border flex justify-between items-center">
<h3 className="text-lg font-bold text-primary">Recent Payout History</h3>
<button onClick={() => router.push('/history')} className="text-slate-400 hover:text-primary transition-colors">
<MoreHorizontal className="w-5 h-5" />
</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
<tr>
<th className="px-6 py-4">Transaction ID</th>
<th className="px-6 py-4">Platform</th>
<th className="px-6 py-4">Date</th>
<th className="px-6 py-4">Amount</th>
<th className="px-6 py-4">Status</th>
<th className="px-6 py-4 text-right">Actions</th>
</tr>
</thead>
<tbody className="text-sm divide-y thin-border">
  {recentClaims.length > 0 ? (
    recentClaims.slice(0, 3).map((claim) => (
      <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors table-row-hover">
        <td className="px-6 py-4 font-mono text-xs">#PAY-{claim.id.slice(0, 6).toUpperCase()}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-slate-100 flex items-center justify-center">
              <Car className="w-4 h-4 text-slate-500" />
            </div>
            <span className="font-semibold">{claim.disruption_type || "Gig Protection"}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-slate-500">
          {new Date(claim.created_at).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 font-bold text-primary">₹{claim.payout_amount.toLocaleString()}</td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
            claim.status === 'processed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {claim.status === 'processed' ? 'Completed' : 'Processing'}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <button className="text-slate-400 hover:text-primary"><Download className="w-4 h-4" /></button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="px-6 py-8 text-center text-slate-400 italic">
        No recent payout history found.
      </td>
    </tr>
  )}
</tbody>
</table>
</div>
</div>
</div>
</main>
</div>

    </div>
  );
}
