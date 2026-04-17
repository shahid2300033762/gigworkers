"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Bell, User, LayoutDashboard, FileText, History, CloudRain, CheckCircle, Receipt, ArrowRight, Loader2, Home, BarChart3, Shield, Zap, AlertTriangle } from 'lucide-react';
import { apiFetch } from '@/lib/auth';
import { getCurrentUser } from '@/lib/worker';

export default function ClaimPayoutFlow() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState<{ risk_level: string, policy: any, city: string, last_claim_at?: string, trigger_probabilities?: Record<string, number>, weather_details?: any } | null>(null);
  const [fetching, setFetching] = useState(true);
  const [cooldownRemaining, setCooldownRemaining] = useState<string | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState('Heavy Rain');
  const [claimResult, setClaimResult] = useState<{ fraud_score?: number, fraud_check?: any, calculated_amount?: number } | null>(null);

  React.useEffect(() => {
    async function init() {
      try {
        const res = await apiFetch('/api/current-risk');
        const data = await res.json();
        if (data.success) {
          setRiskData(data);
          
          if (data.last_claim_at) {
            checkCooldown(data.last_claim_at);
          }
        }
      } catch (err) {
        console.error("Failed to fetch risk data:", err);
      } finally {
        setFetching(false);
      }
    }
    init();
  }, []);

  const checkCooldown = (lastClaimAt: string) => {
    const lastTime = new Date(lastClaimAt).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = (lastTime + 24 * 60 * 60 * 1000) - now;
      
      if (diff <= 0) {
        setCooldownRemaining(null);
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCooldownRemaining(`${hours}h ${minutes}m`);
      }
    }, 1000);
    return () => clearInterval(timer);
  };

  const calculatePotentialPayout = () => {
    if (!riskData || !riskData.policy) return 0;
    
    const { risk_level, policy } = riskData;
    let riskMult = 0;
    if (risk_level === "Medium") riskMult = 0.4;
    else if (risk_level === "High" || risk_level === "Critical") riskMult = 0.7;

    let planWeight = 1.0;
    if (policy.weekly_premium <= 500) planWeight = 0.7; // Starter
    else if (policy.weekly_premium <= 1200) planWeight = 0.9; // Pro
    else planWeight = 1.0; // Elite

    const maxBenefit = policy.coverage_amount || 5000;
    let amount = maxBenefit * riskMult * planWeight;
    
    if (riskMult > 0 && amount < 300) amount = 300;
    if (amount > 3000) amount = 3000;

    return amount;
  };

  const potentialPayout = calculatePotentialPayout();
  const isEligible = riskData && riskData.risk_level !== "Low" && potentialPayout > 0 && !cooldownRemaining;
  
  const getRiskColor = () => {
    if (cooldownRemaining) return "bg-orange-50 text-orange-700 border-orange-200";
    if (!riskData) return "bg-slate-100 text-slate-400";
    if (riskData.risk_level === "Low") return "bg-slate-100 text-slate-500 border-slate-200";
    if (riskData.risk_level === "Medium") return "bg-yellow-50 text-yellow-700 border-yellow-100";
    return "bg-red-50 text-red-700 border-red-100";
  };

  const handleSimulateDisruption = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const res = await apiFetch('/api/trigger-claim', {
        method: 'POST',
        body: JSON.stringify({
          disruption_type: selectedTrigger,
          trigger_type: selectedTrigger,
        })
      });
      const data = await res.json();
      if (data.success) {
        setClaimResult(data);
        router.push(`/payout?amount=${data.calculated_amount}&claimId=${data.claim_id}`);
      } else {
        alert(data.error);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error triggering claim');
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen">
      
<div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">

<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 lg:px-20">
<div className="flex items-center gap-3 text-primary dark:text-slate-100">
<div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
<ShieldCheck className="w-5 h-5" />
</div>
<h2 className="text-lg font-bold leading-tight tracking-tight">Vertex</h2>
</div>
<div className="flex flex-1 justify-end gap-4">
<div className="flex gap-2">
<button className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
<Bell className="w-5 h-5" />
</button>
<button onClick={() => router.push('/profile')} className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
<User className="w-5 h-5" />
</button>
</div>
<div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/10" data-alt="User profile picture of a professional" style={{"backgroundImage":"url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuBKm8UXJx4aJUC248o0Vc4hVjIcX7TLeiwSKS2v_lBZx5CmKy4U2Sqeh_mY47iWsDQbfXhMgLCAiuEp1mkxtSIGTZS3rX5RHW1pEaZrEsD7NZ2ddCSOHV86TD5AqmtORFNHQlNI5WjLZ1wbm7zcXW6OOcYkM4LUxKdHEqXGak51FgOVZOZyxr8_Iba3ogDv9CsuM0fB4LGKNkS09SOdU4aFObMjVGTtIHKc2z210akRCG0yKqlcRx6QVSKntQUsgSskW1jkJKLE85Sr\")"}}></div>
</div>
</header>
<main className="flex-1 flex justify-center py-8 px-4 lg:px-20">
<div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-12 gap-8">

<div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
<nav className="flex flex-col gap-1 text-slate-700 dark:text-slate-300 font-semibold">
<button onClick={() => router.push('/')} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
<Home className="w-5 h-5 text-slate-500" />
<span>Home</span>
</button>
<button onClick={() => router.push('/dashboard')} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
<LayoutDashboard className="w-5 h-5 text-slate-500" />
<span>Dashboard</span>
</button>
<button onClick={() => router.push('/claim')} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 text-left">
<FileText className="w-5 h-5" />
<span>Claims</span>
</button>
<button onClick={() => router.push('/analytics')} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
<BarChart3 className="w-5 h-5 text-slate-500" />
<span>Analytics</span>
</button>
<button onClick={() => router.push('/profile')} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
<User className="w-5 h-5 text-slate-500" />
<span>Profile</span>
</button>
</nav>
</div>

<div className="lg:col-span-9 flex flex-col gap-6">

{fetching ? (
  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 flex items-center gap-4 border border-slate-100 animate-pulse">
    <div className="size-10 rounded-full bg-slate-200"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
    </div>
  </div>
) : riskData ? (
  <div className="flex flex-col gap-4">
    {cooldownRemaining && (
      <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-r-xl animate-bounce-subtle" role="alert">
        <p className="font-bold">Unusual claim activity detected</p>
        <p className="text-sm">You have already claimed insurance today. Please allow 24 hours between claims for validation.</p>
      </div>
    )}
    <div className={`border rounded-xl p-4 flex items-center gap-4 relative overflow-hidden ${getRiskColor()}`}>
      <div className="rain-overlay opacity-20"></div>
      <div className={`size-10 rounded-full flex items-center justify-center ${
        cooldownRemaining ? 'bg-orange-200 text-orange-600' :
        riskData.risk_level === 'Low' ? 'bg-slate-200 text-slate-500' :
        riskData.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 
        'bg-red-100 text-red-600'
      }`}>
        <CloudRain className="w-6 h-6" />
      </div>
      <div>
        <p className="font-semibold">
          {cooldownRemaining ? "Claim Cooldown Active" : `${riskData.risk_level} Risk Detected in ${riskData.city}`}
        </p>
        <p className="text-sm opacity-90">
          {cooldownRemaining 
            ? `Next claim available in: ${cooldownRemaining}`
            : isEligible 
              ? `Your calculated payout is ₹${potentialPayout.toLocaleString()}.` 
              : "No claim eligible under current conditions."}
        </p>
      </div>
    </div>
  </div>
) : null}

{/* Multi-Trigger Type Selector */}
{riskData && riskData.risk_level !== 'Low' && !cooldownRemaining && (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
      <Zap className="w-4 h-4 text-amber-500" />
      Select Trigger Type
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {[
        { key: 'Heavy Rain', label: 'Weather', icon: '🌧️', prob: riskData.trigger_probabilities?.weather },
        { key: 'Demand Surge', label: 'Demand Surge', icon: '📈', prob: riskData.trigger_probabilities?.demand_surge },
        { key: 'Platform Outage', label: 'Platform Outage', icon: '⚠️', prob: riskData.trigger_probabilities?.platform_outage },
        { key: 'Traffic Disruption', label: 'Traffic', icon: '🚦', prob: riskData.trigger_probabilities?.traffic_disruption },
        { key: 'Heatwave', label: 'Heatwave', icon: '🔥', prob: riskData.trigger_probabilities?.heatwave },
      ].map(trigger => (
        <button
          key={trigger.key}
          onClick={() => setSelectedTrigger(trigger.key)}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedTrigger === trigger.key
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-slate-200 hover:border-primary/20'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{trigger.icon}</span>
            <span className="text-xs font-bold">{trigger.label}</span>
          </div>
          {trigger.prob !== undefined && (
            <div className="flex items-center gap-1">
              <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(trigger.prob * 100)}%` }} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">{Math.round(trigger.prob * 100)}%</span>
            </div>
          )}
        </button>
      ))}
    </div>
    {riskData.trigger_probabilities && (
      <p className="text-[10px] text-slate-400 mt-2 italic">Probabilities computed by ML Trigger Classifier (Random Forest)</p>
    )}
  </div>
)}

{/* Fraud Score Transparency */}
{claimResult?.fraud_check && (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-green-600" />
        <span className="text-sm font-bold">Claim Confidence</span>
      </div>
      <span className={`text-lg font-black ${
        claimResult.fraud_check.claim_confidence > 80 ? 'text-green-600' :
        claimResult.fraud_check.claim_confidence > 50 ? 'text-yellow-600' : 'text-red-600'
      }`}>
        {claimResult.fraud_check.claim_confidence}%
      </span>
    </div>
    <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${
          claimResult.fraud_check.claim_confidence > 80 ? 'bg-green-500' :
          claimResult.fraud_check.claim_confidence > 50 ? 'bg-yellow-500' : 'bg-red-500'
        }`}
        style={{ width: `${claimResult.fraud_check.claim_confidence}%` }}
      />
    </div>
    <p className="text-[10px] text-slate-400 mt-1">Verified by ML Anomaly Detection (Isolation Forest)</p>
  </div>
)}

<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
<h3 className="text-lg font-bold mb-8">Parametric Trigger Process</h3>
<div className="relative flex flex-col gap-0">

<div className="flex gap-6 pb-8 group animate-step" style={{"animationDelay":"0.2s"}}>
<div className="relative flex flex-col items-center">
<div className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-white bg-transparent"><img alt="Rain cloud" className="size-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTR22XKKsRw6kBjaJ1NzP32s7D0e-QwlEGvNsEiItsE2KuwuisWAQv7Bq9hsOvTE68k-R6oKYgaqCrPzFGqwOG7ToqrSIkKyQF3Vf135r04U6IfVsJBPXd4dTiBG6vBxJaJh2lcJH1nlsWQ0hhskHav_qrshSgvxXqsLjpuGnyivTGnhzpgadGfb8VsPjOvKCzj6XooX0-vM9IhHEyS1zWdIbLGANUNe90CarmI9adUfK1uaheTKJJkNjw52GsgferDR7MEy2IR5Lv"/></div>
<div className="absolute top-10 h-full w-[2px] bg-blue-500 animate-line" style={{"animationDelay":"0.7s"}}></div>
</div>
<div className="flex flex-col pt-1">
<h4 className="font-bold text-slate-900 dark:text-slate-100">{cooldownRemaining ? "Cooldown Active" : (riskData?.risk_level || "Weather") + " Detection"}</h4>
<p className="text-sm text-slate-500 dark:text-slate-400">
  {cooldownRemaining ? `Next available in ${cooldownRemaining}` : `Intensity: Verification Active • Location: ${riskData?.city || "Detecting..."}`}
</p>
</div>
</div>

<div className="flex gap-6 pb-8 group animate-step" style={{"animationDelay":"1.2s"}}>
<div className="relative flex flex-col items-center">
<div className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-white bg-transparent"><img alt="API Sync" className="size-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8wLwRZycwPBhelXfB2_3KAA2LpeKvYjQVGwuSkdgHHn0yi2bhL1IxkSwA5olzYRihk1iUbtLG19b7gt9RcHbenzT9XXPf9JPcIkQBxMyebzWy6Avctbe6Zkp6r_eZOHVFlIJIbzgJp2BJIpJYVk6cdSBFieuH-woJvJagR2flPZmC-KNoJy_rHLGwSD4Gl0rHF5N5QEovFOeH0D9Zvl9QofDSbuNo5XSvHVOt5m7bJdDxETZAxHiK4-cv0duZG4xME0vChP-LYRuw"/></div>
<div className="absolute top-10 h-full w-[2px] bg-blue-500 animate-line" style={{"animationDelay":"1.7s"}}></div>
</div>
<div className="flex flex-col pt-1">
<h4 className="font-bold text-slate-900 dark:text-slate-100">Weather API Triggered</h4>
<p className="text-sm text-slate-500 dark:text-slate-400">Satellite &amp; Ground station data verified</p>
</div>
</div>

<div className="flex gap-6 pb-8 group animate-step" style={{"animationDelay":"2.2s"}}>
<div className="relative flex flex-col items-center">
<div className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-white bg-transparent"><img alt="Smart Contract" className="size-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzgDiJcAgAD2Q-dlaJVtn8QFHEbwpXZRodKwSTaBhbxGqF37GJpey9MT5AwiwN3f3bWm7yK6j4nYzbwOg0p_YN2wPQRz_d52UMYPp-i1_P4S7BmhfC-c9K_cNIO6sVslWh6LoZE5ktnBimkVAY1SbPkE7-dUv5dkpq7WA7pjHFVq4PyE86P9Da2nmWd8RSndgXZeod8zjxboHj-dYARhc88DmLMSBoRltnq0B-7YzyJrb_hylKLL9R6w8bLPz-riZZBWNUJHbLND8n"/></div>
<div className="absolute top-10 h-full w-[2px] bg-blue-500 animate-line" style={{"animationDelay":"2.7s"}}></div>
</div>
<div className="flex flex-col pt-1">
<h4 className="font-bold text-slate-900 dark:text-slate-100">Claim Generated</h4>
<p className="text-sm text-slate-500 dark:text-slate-400">ID: GS-9921 • Smart Contract Executed</p>
</div>
</div>

<div className="flex gap-6 group animate-step" style={{"animationDelay":"3.2s"}}>
<div className="relative flex flex-col items-center">
<div className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-white shadow-lg shadow-green-500/30 bg-transparent"><img alt="Payout" className="size-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtvnwmUU_pKJTudLit5Lx-mxUc9dDMpDqN90I8Xbl64Q068xAgjkBArRExhSzusTs8srwhleUiBW-z48KoOI2hVb_fOH7myYQvtu8_TrvtgZjZx_G_24SptXkXpqzfdB0fwlFC9vdV5i_LV8J8-1FxJxshnjMpLSpbzOSq3uuUC0B4_PKgAlB5idtt45I6zFxVSIU4izqaY0RVB5u2vijLX5t95HF8VpeGfZcEDToOq8OxSfzhZFTcxrcppBuUs5jUnRYw2esU2b8K"/></div>
</div>
<div className="flex flex-col pt-1">
<h4 className="font-bold text-green-600 dark:text-green-400">Payout Initiated</h4>
<p className="text-sm text-slate-500 dark:text-slate-400">Funds transferred to linked account</p>
</div>
</div>
</div>
</div>

<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
<div className="h-48 bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center relative overflow-hidden" data-alt="Abstract blue gradient background pattern" style={{"backgroundImage":"url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuDcsIUIp208ZQ4jipLDR5mNdHZmnqH9q_90KkydhtyvGjsUzRe4Qzt7NTpnABd5NnB9RSD9xo04AiJJXrljI8Xxoqfd52yXnWNeQ4y6JsPrXjQesV7GP8ASERBEEyTAtyQy-M7_TcakvFwO9h-U9jX8CJOmSTIqhCUoc6olj4g6sPqu1aM3yw_ENyGRcmCsyZOdF1rbzn-moHvbUyo_cqPeg3ITWPlQ1Y6W_Px8km07Cuo5nPOTXR2B5DtIca5kDohQEua36vrb-c6q\")"}}>
<div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"></div>
<div className="z-10 flex flex-col items-center">
<div className="size-16 rounded-full bg-green-500 flex items-center justify-center text-white mb-4 scale-110 animate-pulse-subtle">
<CheckCircle className="w-10 h-10" />
</div>
<h2 className="text-2xl font-bold text-white">Payment Confirmed</h2>
</div>
</div>
<div className="p-8 flex flex-col items-center text-center">
<h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">₹{potentialPayout.toLocaleString()} estimated payout</h3>
<p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
    {cooldownRemaining 
      ? `You have already claimed today. Please try again after the cooldown period ends.`
      : isEligible 
        ? `Based on your parametric coverage and current risk levels in ${riskData?.city || 'your city'}, you are eligible for a payout.`
        : `Current environmental conditions in ${riskData?.city || 'your city'} do not justify an insurance payout at this time.`
    }
</p>
<div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
<button disabled={loading || !isEligible} onClick={handleSimulateDisruption} className={`flex-1 max-w-xs flex items-center justify-center gap-2 rounded-xl h-12 text-white font-bold transition-all shadow-lg active:scale-95 ${!isEligible ? 'bg-slate-300 cursor-not-allowed opacity-50' : 'bg-primary hover:bg-primary/90'}`}>
  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
  {cooldownRemaining ? "Cooldown Active" : (isEligible ? "Trigger Payout" : "Claim Ineligible")}
</button>
<button onClick={() => router.push('/dashboard')} className="flex-1 max-w-xs flex items-center justify-center gap-2 rounded-xl h-12 bg-primary text-white font-bold hover:bg-primary/90 transition-all">
<LayoutDashboard className="w-5 h-5" />
                                Return to Dashboard
                            </button>
<button onClick={() => router.push('/history')} className="flex-1 max-w-xs flex items-center justify-center gap-2 rounded-xl h-12 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700">
<Receipt className="w-5 h-5" />
                                View Payout History
                            </button>
</div>
</div>

<div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
<div>
<p className="text-slate-500 dark:text-slate-500 mb-1">Transaction ID</p>
<p className="font-mono font-medium">#{`VTX-${Date.now().toString(36).toUpperCase()}`}</p>
</div>
<div>
<p className="text-slate-500 dark:text-slate-500 mb-1">Date &amp; Time</p>
<p className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
</div>
<div>
<p className="text-slate-500 dark:text-slate-500 mb-1">Coverage Type</p>
<p className="font-medium text-blue-600 dark:text-blue-400">Rainfall Parametric</p>
</div>
<div>
<p className="text-slate-500 dark:text-slate-500 mb-1">Status</p>
<p className="font-medium text-green-600 flex items-center gap-1">
<span className="size-2 rounded-full bg-green-600"></span> {isEligible ? "Ready" : cooldownRemaining ? "Cooldown" : "Ineligible"}
                            </p>
</div>
</div>
</div>
</div>
</div>
</main>

<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
<button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-slate-400">
<Home className="w-5 h-5" />
<span className="text-[10px] font-medium">Home</span>
</button>
<button onClick={() => router.push('/claim')} className="flex flex-col items-center gap-1 text-primary">
<FileText className="w-5 h-5" />
<span className="text-[10px] font-medium">Claims</span>
</button>
<button onClick={() => router.push('/history')} className="flex flex-col items-center gap-1 text-slate-400">
<History className="w-5 h-5" />
<span className="text-[10px] font-medium">History</span>
</button>
<button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-1 text-slate-400">
<User className="w-5 h-5" />
<span className="text-[10px] font-medium">Profile</span>
</button>
</div>
</div>

    </div>
  );
}
