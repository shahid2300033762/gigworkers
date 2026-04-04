"use client";
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { apiFetch } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck, Search, Bell, Settings, LayoutDashboard,
  Map, Shield, Activity, Banknote, Calendar,
  Download, FileText, CheckSquare, AlertTriangle,
  Wallet, Thermometer, AlertCircle
} from 'lucide-react';

export default function AdminAnalytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          try { await supabase.auth.signOut(); } catch (e) {}
          router.push('/login');
          return;
        }

        setAuthorized(true);
      } catch (err) {
        console.error("Auth check failed in admin:", err);
        router.push('/login');
      } finally {
        setCheckingAccess(false);
      }
    }

    checkAccess();
  }, [router]);

  const fetchWorkerData = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin-analytics');
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to load admin analytics.');
        return;
      }
      console.log('Admin Data fetched:', data);
      alert('Fetched worker data. Check console for details.');
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAccess) {
    return <div className="min-h-screen bg-background-light" />;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen">

      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

        <header className="flex items-center justify-between border-b border-primary/10 bg-white/80 backdrop-blur-md px-6 md:px-10 py-4 sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-primary text-xl font-black leading-tight tracking-tight">Vertex</h2>
            </div>
              <a className="text-primary/60 hover:text-primary text-sm font-semibold transition-colors" href="/dashboard">Dashboard</a>
              <a className="text-primary/60 hover:text-primary text-sm font-semibold transition-colors" href="/admin">Analytics</a>
              <a className="text-primary/60 hover:text-primary text-sm font-semibold transition-colors" href="/policy">Policies</a>
              <a className="text-primary/60 hover:text-primary text-sm font-semibold transition-colors" href="/admin/claim-review">Claims</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-primary/5 rounded-xl px-3 py-1.5 border border-primary/10">
              <Search className="w-5 h-5 text-primary/40 mr-2" />
              <input className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-primary/40 w-48" placeholder="Search analytics..." />
            </div>
            <div className="flex gap-2">
              <button className="size-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-all">
                <Bell className="w-5 h-5" />
              </button>
              <button className="size-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="size-10 rounded-full bg-gradient-to-tr from-accent-teal to-accent-purple p-0.5">
              <div className="size-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img alt="User profile" className="size-full object-cover" data-alt="User profile avatar with colorful background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0GtDr1aEvzBpMQ0TI4CLfgfHET4_hmefxsT4LCTzG9ZGCUxJUwpwwS2JJkJzC26LDKBLgD_FQ1ir8uhM6FJUlw0vGbqUX0jU8_mLZjp11tFCPx7K4MM0Rpazq0e_PUPgEBng9FxYFL3AETEBt-b3EDPXU5gtPMq9yI0g3aRivRRHHtfzJxW9vMoUTGoMqfCGgFj2asOp-B2Giwl4WseLgyju_rjcUPilyDAb01pVC_EmEJL-3eOpX5PNF9tph2bEjicNPVUjPlUlQ" />
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-1">

          <AdminSidebar activePage="overview" />

          <main className="flex-1 p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-black text-primary tracking-tight">Admin Analytics Dashboard</h1>
                <p className="text-primary/50 text-base">Real-time weather risk and claim processing insights for Mumbai Metro.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-white border border-primary/10 rounded-xl text-sm font-bold text-primary shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Last 30 Days
                </button>
                <button disabled={loading} onClick={fetchWorkerData} className="px-5 py-2.5 bg-primary rounded-xl text-sm font-bold text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                  {loading ? <Activity className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  {loading ? 'Fetching...' : 'View Worker Data'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-xl bg-accent-teal/10 text-accent-teal flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">+12.5%</span>
                </div>
                <p className="text-primary/50 text-xs font-bold uppercase tracking-wider">Active Policies</p>
                <h3 className="text-3xl font-black text-primary mt-1">89,320</h3>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent-teal to-transparent opacity-20"></div>
              </div>
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">+5.2%</span>
                </div>
                <p className="text-primary/50 text-xs font-bold uppercase tracking-wider">Claims Processed</p>
                <h3 className="text-3xl font-black text-primary mt-1">1,284</h3>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent-purple to-transparent opacity-20"></div>
              </div>
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">High Risk</span>
                </div>
                <p className="text-primary/50 text-xs font-bold uppercase tracking-wider">Potential Fraud</p>
                <h3 className="text-3xl font-black text-primary mt-1">42</h3>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent opacity-20"></div>
              </div>
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">On Track</span>
                </div>
                <p className="text-primary/50 text-xs font-bold uppercase tracking-wider">Total Payouts</p>
                <h3 className="text-3xl font-black text-primary mt-1">₹2.4M</h3>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-20"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="lg:col-span-2 space-y-8">
                <div className="glass-card rounded-3xl overflow-hidden p-1 shadow-xl shadow-primary/5">
                  <div className="p-6 flex items-center justify-between border-b border-primary/5">
                    <div>
                      <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                        <Thermometer className="w-6 h-6 text-red-500" />
                        Weather Disruption Heatmap
                      </h2>
                      <p className="text-primary/40 text-xs">Mumbai Metropolitan Region - Real-time Risk Analysis</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="size-3 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Live Monitor</span>
                    </div>
                  </div>
                  <div className="relative w-full aspect-[16/9] bg-slate-200 overflow-hidden" data-location="Mumbai" >
                    <img className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply" data-alt="Satellite map of Mumbai with street grid" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVqrtPngR1eJHPehSoFjJTdt6AAL1qsmwSSUNkswzmi455Bnhzh3F6kP2Nj3rXfnMISAPcUzea_86r_ETEGOtAaUsfD093uAHSjd9YexTi_9mNZ1WsuBd-9chtBRyE9p_icigG_uYdOFsKuOah7pR7Ntj3-So9OBC3tDKC4DqoGtq8ZBjLNfqVMOkHRNUUjDfJ2DsxpLgAs3tAA1TgXrTZG8GfPYrjIv3yYqhaKvHIUr9xi9kcDbPuxUeWbdsSMwq59F_HeCsAPTQe" />
                    <div className="absolute inset-0 heatmap-gradient"></div>

                    <div className="absolute top-1/4 left-1/3 size-12 rounded-full border-4 border-red-500/30 bg-red-500/20 flex items-center justify-center">
                      <span className="size-3 rounded-full bg-red-500 shadow-lg shadow-red-500"></span>
                    </div>
                    <div className="absolute bottom-1/3 right-1/4 size-20 rounded-full border-4 border-orange-500/30 bg-orange-500/20 flex items-center justify-center">
                      <span className="size-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500"></span>
                    </div>

                    <div className="absolute bottom-4 left-4 glass-card p-3 rounded-xl flex flex-col gap-2">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Risk Legend</p>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-red-500"></div>
                          <span className="text-[10px] font-medium">Critical (Flood Risk)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-orange-500"></div>
                          <span className="text-[10px] font-medium">High (Heavy Rain)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-yellow-400"></div>
                          <span className="text-[10px] font-medium">Moderate</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6 shadow-xl shadow-primary/5">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-lg font-bold text-primary">Claims vs Payouts</h2>
                      <p className="text-primary/40 text-xs">Historical performance and automation efficiency</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-accent-teal"></div>
                        <span className="text-xs font-semibold">Claims</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-accent-purple"></div>
                        <span className="text-xs font-semibold">Payouts</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-4 px-2">

                    <div className="w-full bg-primary/5 rounded-t-lg relative group flex items-end" style={{ "height": "45%" }}>
                      <div className="w-1/2 bg-accent-teal rounded-t-lg transition-all duration-1000" style={{ "height": "100%" }}></div>
                      <div className="w-1/2 bg-accent-purple rounded-t-lg transition-all duration-1000" style={{ "height": "70%" }}></div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary/40">MON</span>
                    </div>
                    <div className="w-full bg-primary/5 rounded-t-lg relative group flex items-end" style={{ "height": "65%" }}>
                      <div className="w-1/2 bg-accent-teal rounded-t-lg" style={{ "height": "100%" }}></div>
                      <div className="w-1/2 bg-accent-purple rounded-t-lg" style={{ "height": "85%" }}></div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary/40">TUE</span>
                    </div>
                    <div className="w-full bg-primary/5 rounded-t-lg relative group flex items-end" style={{ "height": "55%" }}>
                      <div className="w-1/2 bg-accent-teal rounded-t-lg" style={{ "height": "100%" }}></div>
                      <div className="w-1/2 bg-accent-purple rounded-t-lg" style={{ "height": "60%" }}></div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary/40">WED</span>
                    </div>
                    <div className="w-full bg-primary/5 rounded-t-lg relative group flex items-end" style={{ "height": "85%" }}>
                      <div className="w-1/2 bg-accent-teal rounded-t-lg" style={{ "height": "100%" }}></div>
                      <div className="w-1/2 bg-accent-purple rounded-t-lg" style={{ "height": "95%" }}></div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary/40">THU</span>
                    </div>
                    <div className="w-full bg-primary/5 rounded-t-lg relative group flex items-end" style={{ "height": "40%" }}>
                      <div className="w-1/2 bg-accent-teal rounded-t-lg" style={{ "height": "100%" }}></div>
                      <div className="w-1/2 bg-accent-purple rounded-t-lg" style={{ "height": "50%" }}></div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary/40">FRI</span>
                    </div>
                    <div className="w-full bg-primary/5 rounded-t-lg relative group flex items-end" style={{ "height": "30%" }}>
                      <div className="w-1/2 bg-accent-teal rounded-t-lg" style={{ "height": "100%" }}></div>
                      <div className="w-1/2 bg-accent-purple rounded-t-lg" style={{ "height": "40%" }}></div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary/40">SAT</span>
                    </div>
                    <div className="w-full bg-primary/5 rounded-t-lg relative group flex items-end" style={{ "height": "25%" }}>
                      <div className="w-1/2 bg-accent-teal rounded-t-lg" style={{ "height": "100%" }}></div>
                      <div className="w-1/2 bg-accent-purple rounded-t-lg" style={{ "height": "35%" }}></div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary/40">SUN</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6 shadow-xl shadow-primary/5 border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-primary">Fraud Alerts</h2>
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Critical (12)
                    </span>
                  </div>
                  <div className="space-y-4">

                    <div className="p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer border border-transparent hover:border-primary/5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase">High Priority</span>
                        <span className="text-[10px] text-primary/40 font-bold">2m ago</span>
                      </div>
                      <p className="text-sm font-bold text-primary">GPS Spoofing Detected</p>
                      <p className="text-xs text-primary/60 mt-1">User ID: #GH-8829 reported outside claim perimeter.</p>
                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 py-1.5 bg-red-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">Reject</button>
                        <button className="flex-1 py-1.5 bg-white border border-primary/10 text-[10px] font-bold rounded-lg uppercase tracking-wider">Investigate</button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer border border-transparent hover:border-primary/5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-black bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase">Duplicate</span>
                        <span className="text-[10px] text-primary/40 font-bold">15m ago</span>
                      </div>
                      <p className="text-sm font-bold text-primary">Duplicate Claim Signal</p>
                      <p className="text-xs text-primary/60 mt-1">Identical metadata detected across 3 policy IDs.</p>
                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">Review</button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer border border-transparent hover:border-primary/5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">Pattern Shift</span>
                        <span className="text-[10px] text-primary/40 font-bold">1h ago</span>
                      </div>
                      <p className="text-sm font-bold text-primary">Bulk Submission Anomaly</p>
                      <p className="text-xs text-primary/60 mt-1">Sudden 400% spike in claims from Bandra West.</p>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-3 border-2 border-dashed border-primary/10 rounded-2xl text-xs font-bold text-primary/40 hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest">
                    View All Active Alerts
                  </button>
                </div>

                <div className="glass-card rounded-3xl p-6 shadow-xl shadow-primary/5">
                  <h2 className="text-lg font-bold text-primary mb-6">Automated Processing</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-primary/60">Auto-Approval Rate</span>
                        <span className="text-accent-teal">94.2%</span>
                      </div>
                      <div className="w-full h-2 bg-primary/5 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-teal w-[94.2%] rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-primary/60">Fraud Prevention Saving</span>
                        <span className="text-accent-purple">₹128,400</span>
                      </div>
                      <div className="w-full h-2 bg-primary/5 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-purple w-[78%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

    </div>
  );
}
