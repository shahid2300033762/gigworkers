"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell, ShieldCheck, Check, CheckCheck, AlertTriangle, CloudRain,
  FileText, DollarSign, Clock, Filter, Trash2, ArrowLeft,
  Loader2, LayoutDashboard, Home, User, BarChart3
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { apiFetch } from '@/lib/auth';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await apiFetch('/api/notifications?limit=50');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  async function markAllRead() {
    try {
      await apiFetch('/api/notifications/mark-read', { method: 'POST', body: JSON.stringify({}) });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  }

  async function markOneRead(id: string) {
    try {
      await apiFetch('/api/notifications/mark-read', {
        method: 'POST',
        body: JSON.stringify({ notification_ids: [id] }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'claim_approved': return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'claim_denied': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'fraud_alert': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'weather_warning': return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'premium_change': return <DollarSign className="w-5 h-5 text-purple-600" />;
      case 'policy_expiry': return <Clock className="w-5 h-5 text-amber-600" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getBgColor = (type: string, read: boolean) => {
    if (read) return "bg-white";
    switch (type) {
      case 'claim_approved': return "bg-green-50 border-l-4 border-l-green-500";
      case 'fraud_alert': return "bg-orange-50 border-l-4 border-l-orange-500";
      case 'weather_warning': return "bg-blue-50 border-l-4 border-l-blue-500";
      default: return "bg-primary/5 border-l-4 border-l-primary";
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const filtered = filter === "all"
    ? notifications
    : filter === "unread"
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full min-h-screen">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 flex flex-col fixed h-full z-50">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary leading-tight">Vertex</h1>
                <p className="text-xs font-semibold text-accent-teal uppercase tracking-wider">Notifications</p>
              </div>
            </div>
            <nav className="space-y-1">
              <button onClick={() => router.push('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
                <Home className="w-5 h-5" /><span>Home</span>
              </button>
              <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
                <LayoutDashboard className="w-5 h-5" /><span>Dashboard</span>
              </button>
              <button onClick={() => router.push('/notifications')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary font-semibold text-left">
                <Bell className="w-5 h-5" /><span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </button>
              <button onClick={() => router.push('/claim')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
                <FileText className="w-5 h-5" /><span>Claims</span>
              </button>
              <button onClick={() => router.push('/analytics')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
                <BarChart3 className="w-5 h-5" /><span>Analytics</span>
              </button>
              <button onClick={() => router.push('/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-left font-semibold">
                <User className="w-5 h-5" /><span>Profile</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72 p-8">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-primary">Notifications</h2>
              <p className="text-slate-500">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-sm hover:shadow-sm transition-all"
                >
                  <CheckCheck className="w-4 h-4" /> Mark All Read
                </button>
              )}
            </div>
          </header>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "claim_approved", label: "Claims" },
              { key: "weather_warning", label: "Weather" },
              { key: "fraud_alert", label: "Fraud" },
              { key: "system", label: "System" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === tab.key
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-primary/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Bell className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400">No notifications</h3>
              <p className="text-slate-400 text-sm mt-1">
                {filter !== "all" ? "Try a different filter" : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && markOneRead(notif.id)}
                  className={`p-5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md cursor-pointer group ${getBgColor(notif.type, notif.read)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.read ? 'bg-slate-100' : 'bg-white shadow-sm'
                    }`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-bold text-sm ${notif.read ? 'text-slate-500' : 'text-primary'}`}>
                          {notif.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                            {getTimeAgo(notif.created_at)}
                          </span>
                          {!notif.read && (
                            <span className="size-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                      </div>
                      <p className={`text-sm ${notif.read ? 'text-slate-400' : 'text-slate-600'}`}>
                        {notif.message}
                      </p>
                      {notif.type === 'claim_approved' && notif.data?.amount && (
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          ₹{(notif.data.amount as number).toLocaleString()} Payout
                        </span>
                      )}
                      {notif.type === 'weather_warning' && notif.data?.risk_level && (
                        <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full ${
                          notif.data.risk_level === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {notif.data.risk_level as string} Risk
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
