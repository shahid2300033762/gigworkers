"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Bell, ArrowLeft, Zap, Brain, TrendingUp, Info, Shield, BadgeCheck, Home, FileText, Wallet, User, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/auth';
import { getCurrentUser } from '@/lib/worker';

function PolicyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const premium = searchParams.get('premium') || '500';
  const coverage = searchParams.get('coverage') || '1500';

  const handleBuy = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      const workerId = user?.id || null;
      
      // Basic UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!workerId || !uuidRegex.test(workerId)) {
        alert('Active session not found or invalid. Please complete the onboarding again.');
        router.push('/onboarding');
        return;
      }

      console.log('Using Worker ID for policy:', workerId);
      const response = await apiFetch('/api/create-policy', {
        method: 'POST',
        body: JSON.stringify({
          worker_id: workerId,
          weekly_premium: Number(premium),
          coverage_amount: Number(coverage)
        })
      });
      
      const data = await response.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        console.error('Failed to create policy', data.error);
        alert(`Could not create policy: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating policy:', error);
      alert('An error occurred while creating your policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen">
      <div className="relative flex min-h-screen flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 py-3 lg:px-10 bg-white dark:bg-background-dark/50 sticky top-0 z-50">
            <div className="flex items-center gap-4 text-primary dark:text-slate-100">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-tight">GigShield AI</h2>
            </div>
            <div className="flex flex-1 justify-end gap-6">
              <div className="hidden md:flex items-center gap-6 pr-6 border-r border-slate-200 dark:border-slate-800">
                <button onClick={() => router.push('/plans')} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer">Explore Plans</button>
                <button onClick={() => router.push('/history')} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer">History</button>
                <button className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer">Support</button>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="size-10 rounded-full bg-primary/10 border border-primary/20 overflow-hidden cursor-pointer">
                  <img className="w-full h-full object-cover" alt="Profile picture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKXH_6FEydH7J-V3C92cUgbOQVJcqv5hpWLySsyH_gKAaaSvPPKOEryKJ4uqKixQh97TUVxNoHWHf4EP05ok1UDrVE0L-2QyQtA8hCwiQqRUh1Rbk2Modr7BthCCdQeJX4EGzjq9xhWc1k3Oqb8ns5wQvxSkPv17iKx_5eiQSeUkJLZEUiHV8JV_e0xMQI8VkHqtgprhUBh5jNIkplNP3jc8J3H2q4Wz5kAAZk_EUIpCCfMI8q0b0S7d-NLHO0N1Q0dr-vupK7hMWq" />
                </div>
              </div>
            </div>
          </header>
          <main className="flex flex-1 justify-center py-8 px-4 lg:px-40">
            <div className="layout-content-container flex flex-col max-w-[800px] flex-1">
              <div className="mb-6">
                <button onClick={() => router.push('/plans')} className="flex items-center gap-2 text-primary dark:text-slate-300 font-medium hover:underline">
                  <ArrowLeft className="w-4 h-4 text-sm" />
                  <span>Back to Explore</span>
                </button>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
                <div className="h-48 w-full bg-gradient-to-r from-primary to-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent)]"></div>
                  </div>
                  <div className="relative h-full flex flex-col justify-end p-8">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-2">Recommended Plan</span>
                    <h1 className="text-white text-3xl font-black tracking-tight">Income Protection Plus</h1>
                  </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Weekly Coverage</p>
                    <p className="text-primary dark:text-slate-100 text-4xl font-black">₹{Number(coverage).toLocaleString()}</p>
                  </div>
                  <div className="bg-primary/5 dark:bg-primary/20 p-4 rounded-xl border border-primary/10">
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Premium Amount</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-primary dark:text-slate-100 text-2xl font-bold">₹{premium}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">/ week</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Key Policy Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 size-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">Instant Payouts</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Funds are settled directly to your wallet within minutes of approval.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 size-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">AI Claims Processing</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">No paperwork. Our AI validates your gig platform data for automatic claims.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 size-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">Income Protection</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Covers illness, platform downtime, or sudden drops in gig volume.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 size-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">24/7 Assistance</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Dedicated support for any issues with your coverage or platform link.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-slate-400" />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        By clicking Buy Policy, you agree to our Terms of Service and Privacy Policy.
                        Auto-renewal will be active by default.
                      </p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <button onClick={() => router.back()} className="flex-1 md:flex-none px-8 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        Back
                      </button>
                      <button disabled={loading} onClick={handleBuy} className="flex-1 md:flex-none px-12 py-3 rounded-xl bg-primary text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-primary/20">
                        {loading ? 'Processing...' : 'Buy Policy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                  <Shield className="w-4 h-4 text-sm" />
                  <span className="text-xs font-bold uppercase tracking-widest">Secured by GigShield AI</span>
                </div>
                <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                  <BadgeCheck className="w-4 h-4 text-sm" />
                  <span className="text-xs font-bold uppercase tracking-widest">IRDAI Certified</span>
                </div>
              </div>
            </div>
          </main>
          <nav className="md:hidden sticky bottom-0 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
            <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-slate-400">
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-medium">Home</span>
            </button>
            <button onClick={() => router.push('/policy')} className="flex flex-col items-center gap-1 text-primary">
              <FileText className="w-5 h-5" />
              <span className="text-[10px] font-medium">Policies</span>
            </button>
            <button onClick={() => router.push('/claim')} className="flex flex-col items-center gap-1 text-slate-400">
              <Wallet className="w-5 h-5" />
              <span className="text-[10px] font-medium">Claims</span>
            </button>
            <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-1 text-slate-400">
              <User className="w-5 h-5" />
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default function PolicyPurchase() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <PolicyContent />
    </Suspense>
  );
}
