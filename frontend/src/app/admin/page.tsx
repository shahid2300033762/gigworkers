"use client";
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { apiFetch } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck, Search, Bell, Settings, LayoutDashboard,
  Shield, Activity, Banknote, Calendar,
  Download, FileText, CheckSquare, AlertTriangle,
  Wallet, Thermometer, AlertCircle, Users, TrendingUp,
  CheckCircle, XCircle, Eye, Loader2, RefreshCw, Zap
} from 'lucide-react';

interface AdminStats {
  active_policies: number;
  claims_processed: number;
  total_workers: number;
  total_payouts: number;
  pending_fraud_alerts: number;
  trigger_events_count: number;
}

interface FraudAlert {
  id: string;
  signal_type: string;
  severity: string;
  fraud_score: number;
  details: { message: string };
  status: string;
  created_at: string;
  worker_id: string;
  claim_id: string;
  Claims?: { id: string; payout_amount: number; trigger_type: string; created_at: string };
  Workers?: { name: string; city: string; platform: string };
}

interface TriggerEvent {
  id: string;
  city: string;
  trigger_type: string;
  severity: string;
  data: Record<string, unknown>;
  affected_policies: number;
  created_at: string;
}

export default function AdminAnalytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [triggerEvents, setTriggerEvents] = useState<TriggerEvent[]>([]);
  const [recentClaims, setRecentClaims] = useState<any[]>([]);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.push('/login');
          return;
        }
        setAuthorized(true);
        await loadData();
      } catch (err) {
        console.error("Auth check failed in admin:", err);
        router.push('/login');
      }
    }
    checkAccess();
  }, [router]);

  async function loadData() {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin-analytics');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setFraudAlerts(data.fraud_alerts || []);
        setRecentClaims(data.recent_claims || []);
        setTriggerEvents(data.trigger_events || []);
      }
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshData() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  async function resolveFraud(signalId: string, resolution: string) {
    setResolvingId(signalId);
    try {
      const res = await apiFetch('/api/fraud/resolve', {
        method: 'POST',
        body: JSON.stringify({ signal_id: signalId, resolution }),
      });
      const data = await res.json();
      if (data.success) {
        setFraudAlerts(prev => prev.filter(a => a.id !== signalId));
        if (stats) {
          setStats({ ...stats, pending_fraud_alerts: Math.max(0, stats.pending_fraud_alerts - 1) });
        }
      }
    } catch (err) {
      console.error('Failed to resolve fraud alert:', err);
    } finally {
      setResolvingId(null);
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'weather': return '🌧️';
      case 'heatwave': return '🔥';
      case 'demand_surge': return '📈';
      case 'platform_outage': return '⚠️';
      case 'traffic_disruption': return '🚦';
      default: return '⚡';
    }
  };

  if (!authorized || loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-primary/10 bg-white/80 backdrop-blur-md px-6 md:px-10 py-4 sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-primary text-xl font-black leading-tight tracking-tight">Vertex</h2>
            </div>
            <a className="text-primary/60 hover:text-primary text-sm font-semibold transition-colors" href="/dashboard">Dashboard</a>
            <a className="text-primary text-sm font-semibold border-b-2 border-primary pb-1" href="/admin">Admin</a>
            <a className="text-primary/60 hover:text-primary text-sm font-semibold transition-colors" href="/policy">Policies</a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="size-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-all"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className="size-10 rounded-full bg-gradient-to-tr from-accent-teal to-accent-purple p-0.5">
              <div className="size-full rounded-full bg-white flex items-center justify-center text-primary font-bold text-sm">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          <AdminSidebar activePage="overview" />

          <main className="flex-1 p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">

            {/* Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-black text-primary tracking-tight">Admin Analytics Dashboard</h1>
                <p className="text-primary/50 text-base">Real-time data from your live insurance platform.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-xl text-xs font-bold text-green-700">
                  <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                  Live Data
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-xl bg-accent-teal/10 text-accent-teal flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-primary/50 text-xs font-bold uppercase tracking-wider">Active Policies</p>
                <h3 className="text-3xl font-black text-primary mt-1">{stats?.active_policies ?? 0}</h3>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent-teal to-transparent opacity-20" />
              </div>
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-primary/50 text-xs font-bold uppercase tracking-wider">Claims Processed</p>
                <h3 className="text-3xl font-black text-primary mt-1">{stats?.claims_processed ?? 0}</h3>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent-purple to-transparent opacity-20" />
              </div>
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  {(stats?.pending_fraud_alerts ?? 0) > 0 && (
                    <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full animate-pulse">
                      Action Required
                    </span>
                  )}
                </div>
                <p className="text-primary/50 text-xs font-bold uppercase tracking-wider">Fraud Alerts</p>
                <h3 className="text-3xl font-black text-primary mt-1">{stats?.pending_fraud_alerts ?? 0}</h3>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent opacity-20" />
              </div>
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-primary/50 text-xs font-bold uppercase tracking-wider">Total Payouts</p>
                <h3 className="text-3xl font-black text-primary mt-1">
                  ₹{((stats?.total_payouts ?? 0) / 1000).toFixed(1)}K
                </h3>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-20" />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Fraud Alerts Panel */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card rounded-3xl p-6 shadow-xl shadow-primary/5 border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      Fraud Detection Alerts
                    </h2>
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      ML-Powered
                    </span>
                  </div>

                  {fraudAlerts.length === 0 ? (
                    <div className="text-center py-10">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-400">No pending fraud alerts</p>
                      <p className="text-xs text-slate-300">Your ML fraud engine is actively monitoring all claims.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {fraudAlerts.map((alert) => (
                        <div key={alert.id} className="p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-all border border-transparent hover:border-primary/5">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs font-black px-2 py-0.5 rounded-full uppercase ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                            <span className="text-[10px] text-primary/40 font-bold">
                              Score: {alert.fraud_score}/100
                            </span>
                          </div>
                          <p className="text-sm font-bold text-primary">{alert.signal_type.replace('_', ' ').toUpperCase()}</p>
                          <p className="text-xs text-primary/60 mt-1">{alert.details?.message || 'Anomalous activity detected'}</p>
                          {alert.Workers && (
                            <p className="text-[10px] text-primary/40 mt-1">
                              Worker: {alert.Workers.name} • {alert.Workers.city} • {alert.Workers.platform}
                            </p>
                          )}
                          {alert.Claims && (
                            <p className="text-[10px] text-primary/40">
                              Claim: ₹{alert.Claims.payout_amount} • {alert.Claims.trigger_type}
                            </p>
                          )}
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => resolveFraud(alert.id, "resolved")}
                              disabled={resolvingId === alert.id}
                              className="flex-1 py-1.5 bg-red-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                            >
                              {resolvingId === alert.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                              Reject Claim
                            </button>
                            <button
                              onClick={() => resolveFraud(alert.id, "false_positive")}
                              disabled={resolvingId === alert.id}
                              className="flex-1 py-1.5 bg-green-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => resolveFraud(alert.id, "investigating")}
                              disabled={resolvingId === alert.id}
                              className="flex-1 py-1.5 bg-white border border-primary/10 text-[10px] font-bold rounded-lg uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Investigate
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Claims Table */}
                <div className="glass-card rounded-3xl overflow-hidden p-1 shadow-xl shadow-primary/5">
                  <div className="p-6 flex items-center justify-between border-b border-primary/5">
                    <h2 className="text-lg font-bold text-primary">Recent Claims</h2>
                    <span className="text-xs font-bold text-primary/40">{recentClaims.length} records</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                          <th className="px-4 py-3 text-left">Worker</th>
                          <th className="px-4 py-3 text-left">Type</th>
                          <th className="px-4 py-3 text-left">Amount</th>
                          <th className="px-4 py-3 text-left">Fraud</th>
                          <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-slate-50">
                        {recentClaims.length === 0 ? (
                          <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-300 italic">No claims yet</td></tr>
                        ) : (
                          recentClaims.slice(0, 8).map((claim: any) => (
                            <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3">
                                <p className="font-semibold text-xs">{claim.Workers?.name || 'Unknown'}</p>
                                <p className="text-[10px] text-slate-400">{claim.Workers?.city || ''}</p>
                              </td>
                              <td className="px-4 py-3 text-xs font-medium">{claim.trigger_type || claim.disruption_type || '-'}</td>
                              <td className="px-4 py-3 font-bold text-primary text-xs">₹{claim.payout_amount?.toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <div className={`h-1.5 rounded-full ${
                                    (claim.fraud_score || 0) > 50 ? 'bg-red-500' :
                                    (claim.fraud_score || 0) > 20 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`} style={{ width: `${Math.max(claim.fraud_score || 0, 5)}%` }} />
                                  <span className="text-[10px] text-slate-400 font-bold">{claim.fraud_score || 0}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  claim.status === 'processed' ? 'bg-green-100 text-green-700' :
                                  claim.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {claim.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                {/* Trigger Events */}
                <div className="glass-card rounded-3xl p-6 shadow-xl shadow-primary/5">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      Trigger Events
                    </h2>
                    <span className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">
                      Auto-monitored
                    </span>
                  </div>

                  {triggerEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="w-10 h-10 text-green-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">No trigger events detected</p>
                      <p className="text-[10px] text-slate-300 mt-1">Monitoring 7 cities every 5 minutes</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {triggerEvents.slice(0, 6).map((event) => (
                        <div key={event.id} className="p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getTriggerIcon(event.trigger_type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-primary truncate">{event.city}</p>
                              <p className="text-[10px] text-primary/50">
                                {event.trigger_type.replace('_', ' ')} • {event.affected_policies} policies
                              </p>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${getSeverityColor(event.severity)}`}>
                              {event.severity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* System Stats */}
                <div className="glass-card rounded-3xl p-6 shadow-xl shadow-primary/5">
                  <h2 className="text-lg font-bold text-primary mb-6">System Health</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-primary/60">Workers Registered</span>
                        <span className="text-accent-teal">{stats?.total_workers ?? 0}</span>
                      </div>
                      <div className="w-full h-2 bg-primary/5 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-teal rounded-full transition-all" style={{ width: `${Math.min(((stats?.total_workers ?? 0) / 100) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-primary/60">Fraud Prevention Score</span>
                        <span className="text-accent-purple">
                          {stats && stats.claims_processed > 0
                            ? `${Math.round(((stats.claims_processed - (stats.pending_fraud_alerts || 0)) / stats.claims_processed) * 100)}%`
                            : '100%'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-primary/5 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-purple rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-primary/60">AI Service</span>
                        <span className="text-green-600">Online</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-primary/40">
                        <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                        Gradient Boosting + Isolation Forest + Random Forest
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
