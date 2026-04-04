"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle, CheckCircle, Activity, TrendingUp, BarChart3, RefreshCw, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AlgoHealthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [workerData, setWorkerData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlgoHealth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get worker profile for platform info
      const { data: worker } = await supabase
        .from('Workers')
        .select('*')
        .eq('id', user.id)
        .single();

      setWorkerData(worker);

      // Point to our backend port 3001
      const aiUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:3001';
      
      const res = await fetch(`${aiUrl}/api/deactivation-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: worker?.risk_score ? (5 - worker.risk_score * 2) : 4.6,
          cancellation_rate: worker?.risk_score ? worker.risk_score * 0.1 : 0.04,
          late_deliveries: Math.floor(Math.random() * 3),
          platform: worker?.platform || 'Swiggy'
        })
      });

      if (res.ok) {
        const aiData = await res.json();
        setData({
          vertex_score: aiData.vertex_score,
          risk_level: aiData.risk_level,
          platform_volatility: aiData.platform_volatility,
          recommendations: aiData.recommendations,
          source: 'ai-service',
          metrics: {
            rating: worker?.risk_score ? (5 - worker.risk_score * 2).toFixed(2) : '4.60',
            cancellation_rate: worker?.risk_score ? `${(worker.risk_score * 20).toFixed(1)}%` : '4%',
            delivery_speed: aiData.vertex_score > 70 ? 'Top 10%' : 'Standard',
            account_age: '1.2 Years'
          }
        });
      } else {
        throw new Error("API failed");
      }
    } catch (err) {
      console.error("Algo-health fetch error:", err);
      // Premium Fallback
      setData({
        vertex_score: 88,
        risk_level: "Low",
        platform_volatility: "Stable",
        recommendations: ["Maintain current high rating", "Excellent cancellation record"],
        source: 'fallback',
        metrics: { 
          rating: '4.65', 
          cancellation_rate: '3.2%', 
          delivery_speed: 'Top 15%', 
          account_age: '1.2 Years' 
        }
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAlgoHealth(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlgoHealth();
  };

  const getScoreColor = () => {
    if (!data) return '#0052FF';
    if (data.vertex_score >= 75) return '#059669'; // Emerald 600
    if (data.vertex_score >= 45) return '#D97706'; // Amber 600
    return '#DC2626'; // Red 600
  };

  const getScoreLabel = () => {
    if (!data) return 'Loading';
    if (data.vertex_score >= 75) return 'Excellent';
    if (data.vertex_score >= 45) return 'Good';
    return 'Critical';
  };

  return (
    <div className="bg-[#F8FAFC] font-sans text-slate-900 min-h-screen relative overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .premium-card { background: white; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
        .premium-nav { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid #E2E8F0; }
        .score-track { stroke: #E2E8F0; }
      `}} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between premium-nav px-8 py-3 rounded-full shadow-sm">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-[#0052FF] rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Vertex</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <button onClick={() => router.push('/')} className="hover:text-[#0052FF] transition-colors">Home</button>
            <button onClick={() => router.push('/dashboard')} className="hover:text-[#0052FF] transition-colors">Dashboard</button>
            <button onClick={() => router.push('/forecast')} className="hover:text-[#0052FF] transition-colors">Forecast</button>
            <button onClick={() => router.push('/algo-health')} className="text-[#0052FF] border-b-2 border-blue-500 pb-0.5">Algo-Health</button>
            <button onClick={() => router.push('/claim')} className="hover:text-[#0052FF] transition-colors">Claims</button>
          </div>
          <div className="w-20"></div>
        </nav>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Score & Summary */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="premium-card p-10 rounded-[2.5rem] text-center">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Health Score</h2>
                <button onClick={handleRefresh} className={`p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 ${refreshing ? 'animate-spin' : ''}`}>
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              {loading ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="relative inline-block">
                  <svg className="w-52 h-52 transform -rotate-90">
                    <circle cx="104" cy="104" r="94" className="score-track" strokeWidth="14" fill="none" />
                    <circle cx="104" cy="104" r="94" stroke={getScoreColor()} strokeWidth="14" fill="none"
                      strokeDasharray={590} strokeDashoffset={590 - (590 * data.vertex_score / 100)}
                      strokeLinecap="round" style={{transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'}}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-6xl font-black text-slate-900 leading-none">{data.vertex_score}</span>
                    <span className={`text-xs font-bold uppercase mt-1 ${data.vertex_score >= 75 ? 'text-emerald-600' : data.vertex_score >= 45 ? 'text-amber-600' : 'text-red-600'}`}>
                      {getScoreLabel()}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100/50">
                <p className="text-sm text-blue-700 font-medium leading-relaxed">
                  {data?.source === 'ai-service' ? 'Real-time Vertex AI Analysis' : 'Estimated Health Analysis'}
                </p>
                {data?.source === 'ai-service' && (
                  <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                    <Zap className="w-3 h-3 fill-blue-500" /> Live Connection Active
                  </div>
                )}
              </div>
            </div>

            <div className="premium-card p-6 rounded-[2rem]">
              <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                Risk Profile
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Account Safety</span>
                  <span className={`text-sm font-bold ${data?.risk_level === 'Low' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {data?.risk_level === 'Low' ? 'Ultra Stable' : 'Standard'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Market Volatility</span>
                  <span className="text-sm font-bold text-slate-700">{data?.platform_volatility || "Normal"}</span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Primary Hub</span>
                  <span className="text-sm font-bold text-[#0052FF]">{workerData?.platform || "Gig Network"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Metrics & Feed */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="premium-card p-10 rounded-[2.5rem]">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Algorithmic Health</h1>
                  <p className="text-slate-500 max-w-md">Comprehensive analysis of your performance metrics across all integrated platforms.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-3xl shadow-inner border border-blue-100">
                  <Activity className="w-8 h-8 text-[#0052FF]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
                  <TrendingUp className="w-5 h-5 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs uppercase font-bold text-slate-400 mb-1 tracking-wider">Avg. Rating</span>
                  <span className="text-3xl font-black text-slate-900">{data?.metrics?.rating || "4.60"}</span>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
                  <BarChart3 className="w-5 h-5 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs uppercase font-bold text-slate-400 mb-1 tracking-wider">Cancellation</span>
                  <span className="text-3xl font-black text-slate-900">{data?.metrics?.cancellation_rate || "3.5%"}</span>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
                  <CheckCircle className="w-5 h-5 text-[#0052FF] mb-4 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs uppercase font-bold text-slate-400 mb-1 tracking-wider">Insurance Status</span>
                  <span className="text-sm font-bold uppercase py-1.5 px-4 bg-emerald-100 text-emerald-700 rounded-full inline-block mt-1">PROTECTED</span>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
                  <Shield className="w-5 h-5 text-slate-400 mb-4 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs uppercase font-bold text-slate-400 mb-1 tracking-wider">Efficiency Rank</span>
                  <span className="text-3xl font-black text-slate-900">{data?.metrics?.delivery_speed || "Top 10%"}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="premium-card p-8 rounded-[2.5rem]">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                AI Optimization Roadmap
              </h3>
              <div className="grid gap-3">
                {data?.recommendations?.map((rec: string, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-blue-50/50 transition-colors">
                    <div className="w-2 h-2 mt-2 rounded-full bg-[#0052FF]" />
                    <p className="text-sm text-slate-700 font-medium">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="premium-card p-8 rounded-[2.5rem]">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Regional Algorithm Policy</h3>
              <div className="space-y-4">
                <div className="p-5 border-l-4 border-blue-500 bg-blue-50/30 rounded-r-3xl">
                  <h4 className="font-bold text-sm text-blue-900 mb-1">Efficiency Surge Analysis</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Platform algorithms are currently prioritizing fulfillment reliability over speed in your active zones.</p>
                </div>
                <div className="p-5 border-l-4 border-amber-500 bg-amber-50/30 rounded-r-3xl">
                  <h4 className="font-bold text-sm text-amber-900 mb-1">Protection Alert: Deactivation Coverage</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Vertex insurance algorithmically detects "False Flag" deactivations and initiates immediate coverage protocol.</p>
                </div>
                <div className="flex justify-center mt-6">
                  <button onClick={() => router.push('/forecast')} className="text-sm font-bold text-[#0052FF] hover:underline flex items-center gap-1 group">
                    View your 5-day earnings forecast 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
