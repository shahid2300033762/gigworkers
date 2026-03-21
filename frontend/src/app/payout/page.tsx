"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Bell, User, Check, Receipt, Wallet, BadgeCheck, LayoutDashboard, History, HelpCircle, Loader2 } from 'lucide-react';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PayoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || "0";
  const claimId = searchParams.get('claimId') || "GS-99281";

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen">

      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50 md:px-12">
            <div className="flex items-center gap-3">
              <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-primary dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">GigShield AI</h2>
            </div><nav className="hidden md:flex items-center gap-8 ml-12">
              <button onClick={() => router.push('/')} className="text-primary dark:text-white font-bold text-sm border-b-2 border-primary dark:border-white pb-1 tracking-wide">Home</button>
              <button onClick={() => router.push('/claim')} className="text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-primary dark:hover:text-white transition-colors tracking-wide">Claims</button>
              <button onClick={() => router.push('/plans')} className="text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-primary dark:hover:text-white transition-colors tracking-wide">Insurance</button>
              <button onClick={() => router.push('/profile')} className="text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-primary dark:hover:text-white transition-colors tracking-wide">Profile</button>
            </nav>
            <div className="flex gap-2">
              <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Bell className="w-5 h-5" />
              </button>
              <button onClick={() => router.push('/profile')} className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <User className="w-5 h-5" />
              </button>
            </div>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto w-full">
            <div className="relative mb-8">
              <div className="size-32 rounded-full bg-gradient-to-br from-accent-teal to-accent-purple flex items-center justify-center shadow-lg shadow-accent-teal/20 animate-subtle-pulse">
                <Check className="text-white w-12 h-12" />
              </div>
              <div className="absolute -inset-4 bg-accent-teal/10 rounded-full blur-2xl -z-10"></div>
            </div>
            <div className="text-center mb-10">
              <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold mb-3">₹{Number(amount).toLocaleString()} Payout Successful</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md mx-auto">Successfully transferred to your registered UPI account.</p>
            </div>
            <div className="w-full max-w-md mb-10">
              <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl p-6 shadow-xl overflow-hidden relative group animate-entrance">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Receipt className="w-16 h-16" />
                </div>
                <p className="text-primary dark:text-accent-teal text-sm font-bold uppercase tracking-widest mb-4">Payout Details</p>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase">Claim ID</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold text-lg">#{claimId}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase">Transaction ID</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono text-sm">TXN123456789</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase">Payout Destination</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Wallet className="w-5 h-5 text-accent-teal" />
                      <span className="text-slate-800 dark:text-slate-200 font-medium">Registered UPI ID</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-sm italic">Verification Status</span>
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-bold">
                    <BadgeCheck className="w-4 h-4" /> Verified
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button onClick={() => router.push('/dashboard')} className="flex-1 bg-primary text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                <LayoutDashboard className="w-5 h-5" />
                Return to Dashboard
              </button>
              <button onClick={() => router.push('/history')} className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] transition-transform hover:shadow-md">
                <History className="w-5 h-5" />
                View History
              </button>
            </div>
            <div className="mt-12 text-center">
              <p className="text-slate-400 dark:text-slate-500 text-sm flex items-center justify-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Need help with your payout? <button onClick={() => router.push('/support')} className="text-primary dark:text-accent-teal font-semibold underline underline-offset-4">Contact Support</button>
              </p>
            </div>
          </main>
          <footer className="py-8 px-6 text-center border-t border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 dark:text-slate-500 text-xs">© 2024 GigShield AI. All payouts are secured and verified by our automated claim engine.</p>
          </footer>
        </div>
      </div>

    </div>
  );
}

export default function PayoutSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background-light"><Loader2 className="w-10 h-10 animate-spin text-primary"></Loader2></div>}>
      <PayoutSuccessContent />
    </Suspense>
  );
}
