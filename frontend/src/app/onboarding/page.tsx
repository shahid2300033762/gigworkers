"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  User,
  IdCard,
  Info,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lock,
  Headset,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getWorkerProfile } from "@/lib/worker";

export default function WorkerOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    platform: "UberEats",
    city: "",
    upi_id: "",
    license: "",
  });
  const [isUPIValid, setIsUPIValid] = useState<boolean | null>(null);
  const [isVerifyingUPI, setIsVerifyingUPI] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedName, setVerifiedName] = useState("");

  const handleVerifyUPI = async () => {
    if (!formData.upi_id || !formData.upi_id.includes("@")) return;
    
    setIsVerifyingUPI(true);
    setIsVerified(false);
    setVerifiedName("");
    setErrorMsg("");

    try {
      const res = await apiFetch("/api/verify-upi", {
        method: "POST",
        body: JSON.stringify({ upi_id: formData.upi_id }),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error("Verification service is currently unreachable or returned an invalid response.");
      }

      if (res.ok && data.success && data.valid) {
        setIsVerified(true);
        setVerifiedName(data.name);
        setIsUPIValid(true);
      } else {
        setIsVerified(false);
        setIsUPIValid(false);
        
        // Use error from data if available, otherwise fallback
        const errMsg = data.error === "VPA_NOT_FOUND" 
          ? "Invalid UPI ID. Please check and try again." 
          : (data.error || "Verification failed. Please try again later.");
        
        setErrorMsg(errMsg);
      }
    } catch (err: any) {
      console.error("UPI Verification Error:", err);
      setErrorMsg(err.message || "Connection error during verification.");
    } finally {
      setIsVerifyingUPI(false);
    }
  };

  // Reset verification if UPI ID changes
  useEffect(() => {
    setIsVerified(false);
    setVerifiedName("");
    setIsUPIValid(null);
  }, [formData.upi_id]);

  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!user || error) {
          try { await supabase.auth.signOut(); } catch (e) {}
          router.push("/login");
          return;
        }

        const worker = await getWorkerProfile(user.id);
        if (worker) {
          router.push("/dashboard");
          return;
        }

        setFormData((current) => ({
          ...current,
          name: user.user_metadata?.full_name || current.name,
        }));
      } catch (err) {
        console.error("Auth check failed in onboarding:", err);
        router.push("/login");
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) {
        router.push("/login");
        return;
      }

      const cleanedData = {
        id: user.id,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        platform: formData.platform,
        city: formData.city.trim(),
        upi_id: formData.upi_id.trim(),
        license: formData.license.trim(),
        risk_score: 0.5,
      };

      const res = await apiFetch("/api/register-worker", {
        method: "POST",
        body: JSON.stringify(cleanedData),
      });
      const data = await res.json();

      if (res.ok && data.success && data.worker) {
        router.push("/dashboard");
        return;
      }

      setErrorMsg(data.error || "Registration failed.");
    } catch (error: any) {
      setErrorMsg(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="flex items-center justify-between px-6 py-4 lg:px-20 bg-white/50 backdrop-blur-md border-b border-primary/5 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-1.5 rounded-lg text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-primary text-xl font-bold tracking-tight">GigShield AI</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-sm font-medium hidden sm:block">Support</span>
            <button className="flex items-center justify-center rounded-full size-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12">
          <div className="w-full max-w-2xl mb-8">
            <div className="flex justify-between items-end mb-3">
              <div>
                <span className="text-primary font-bold text-sm uppercase tracking-wider">Step 2 of 5</span>
                <h1 className="text-2xl font-bold text-slate-900">Professional Identity</h1>
              </div>
              <span className="text-primary font-bold">40%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: "40%" }}></div>
            </div>
          </div>
          <div className="glass-card w-full max-w-2xl rounded-xl shadow-2xl shadow-primary/5 p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-32 h-32 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-9xl text-primary">delivery_dining</span>
            </div>
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="size-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <img className="w-full h-full object-cover" data-alt="Anime style delivery rider icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfjD-N0QVEL-PxkKfxNMwEP6x0M-a82rQOuC4fx9lnjg5yLhpZjMKtLYf6Qbyc2LARKvmlbrvPrlMar5bxeg3dcGl3zq5j6ax9mFTM3vf9KLtKiHB0-PqRH_0fyfLneG7fBdwz2BWTBjFspT0gyZJViudmFUUCH8rtLwrrW-kdyZWpuj7bCRbHKyevzH5MAPLBAm_UemnyyipOq3MURSTgzRGGbHASsepUW22bQLGep0oUZsjWEEnjCV3TZezjP8DZCm-gY-E10BoA" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Worker Verification</h3>
                <p className="text-slate-500 text-sm">Please provide your details as they appear on your official documents.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {errorMsg ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMsg}
                </div>
              ) : null}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Full Legal Name</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full rounded-lg border-slate-200 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all py-3 px-4 outline-none input-hover" placeholder="John Doe" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                  <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full rounded-lg border-slate-200 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all py-3 px-4 outline-none input-hover" placeholder="+91 98765 43210" type="tel" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Primary Platform</label>
                  <select value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} className="w-full rounded-lg border-slate-200 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all py-3 px-4 outline-none appearance-none input-hover">
                    <option value="Swiggy">Swiggy</option>
                    <option value="Zomato">Zomato</option>
                    <option value="Blinkit">Blinkit</option>
                    <option value="UberEats">UberEats</option>
                    <option value="DoorDash">DoorDash</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Operating City</label>
                  <select 
                    value={formData.city} 
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                    required 
                    className="w-full rounded-lg border-slate-200 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all py-3 px-4 outline-none appearance-none input-hover"
                  >
                    <option value="">Select a city</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">UPI ID (for payouts)</label>
                  <div className="relative">
                    <input 
                      value={formData.upi_id} 
                      onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })} 
                      required 
                      className={`w-full rounded-lg border-slate-200 bg-white/50 focus:ring-2 transition-all py-3 px-4 pr-24 outline-none input-hover ${
                        isVerified ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20' : 
                        isUPIValid === false ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 
                        'focus:border-primary focus:ring-primary/20'
                      }`} 
                      placeholder="rajesh@okaxis" 
                      type="text" 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {!isVerified && formData.upi_id.includes("@") && (
                        <button
                          type="button"
                          onClick={handleVerifyUPI}
                          disabled={isVerifyingUPI}
                          className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-md hover:bg-primary/90 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        >
                          {isVerifyingUPI ? <Loader2 className="w-3 h-3 animate-spin" /> : "VERIFY"}
                        </button>
                      )}
                      {isVerified && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      {!isVerifyingUPI && isUPIValid === false && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </div>
                  {isVerifyingUPI && (
                    <p className="text-[10px] text-primary font-bold ml-1 animate-pulse flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Securely Verifying VPA via Gateway...
                    </p>
                  )}
                  {!isVerifyingUPI && isUPIValid === false && (
                    <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Invalid UPI ID. Please check and try again.
                    </p>
                  )}
                  {isVerified && (
                    <p className="text-[10px] text-emerald-600 font-bold ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-left-2 transition-all">
                      <CheckCircle2 className="w-3 h-3" /> Verified as: <span className="uppercase tracking-tight underline underline-offset-2">{verifiedName}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Driver License Number</label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input value={formData.license} onChange={(e) => setFormData({ ...formData, license: e.target.value })} required className="w-full rounded-lg border-slate-200 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all py-3 pl-11 pr-4 outline-none input-hover" placeholder="AB12345678" type="text" />
                </div>
              </div>
              <div className="p-6 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-4">
                <Info className="text-primary mt-1 shrink-0 w-6 h-6" />
                <div className="text-sm text-slate-700 leading-relaxed">
                  <p className="font-medium text-primary mb-1">Secure AI Processing</p>
                  Your data is encrypted with bank-grade security and processed by GigShield AI to ensure immediate activation of your premium benefits.
                </div>
              </div>
              <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <button onClick={() => router.back()} className="w-full sm:w-auto px-8 py-3 rounded-lg font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2" type="button">
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button 
                  disabled={loading || !isVerified || isVerifyingUPI} 
                  className={`w-full sm:w-auto px-10 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 relative group ${
                    loading || !isVerified || isVerifyingUPI ? 'bg-slate-400 cursor-not-allowed opacity-70' : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'
                  }`} 
                  type="submit"
                >
                  <span className={`flex items-center gap-2 transition-opacity ${loading ? "opacity-0" : "opacity-100"}`}>
                    Submit & Create Account
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  {loading ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </span>
                  ) : null}
                </button>
              </div>
            </form>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 opacity-10 pointer-events-none z-0 transform rotate-[-15deg]">
              <img alt="Professional anime delivery scooter illustration" className="w-full h-full object-contain grayscale opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfjD-N0QVEL-PxkKfxNMwEP6x0M-a82rQOuC4fx9lnjg5yLhpZjMKtLYf6Qbyc2LARKvmlbrvPrlMar5bxeg3dcGl3zq5j6ax9mFTM3vf9KLtKiHB0-PqRH_0fyfLneG7fBdwz2BWTBjFspT0gyZJViudmFUUCH8rtLwrrW-kdyZWpuj7bCRbHKyevzH5MAPLBAm_UemnyyipOq3MURSTgzRGGbHASsepUW22bQLGep0oUZsjWEEnjCV3TZezjP8DZCm-gY-E10BoA" />
            </div>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <ShieldCheck className="w-5 h-5" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Lock className="w-5 h-5" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Headset className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </main>
        <footer className="py-6 px-10 text-center text-slate-400 text-xs">
          © 2024 GigShield AI Inc. All rights reserved. Professional worker protection worldwide.
        </footer>
      </div>
    </div>
  );
}
