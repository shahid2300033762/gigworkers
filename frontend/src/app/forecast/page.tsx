"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, TrendingDown, TrendingUp, CloudRain, Sun, CloudLightning, Snowflake, AlertTriangle, CalendarDays, IndianRupee, Umbrella, ArrowRight } from 'lucide-react';

interface ForecastDay {
  date: string;
  dayName: string;
  weatherCondition: string;
  description: string;
  temperature: number;
  humidity: number;
  rainVolume: number;
  riskLevel: string;
  earningsImpact: { estimatedLossPercent: number; estimatedLoss: number; severity: string };
  recommendation: string;
}

export default function EarningsForecastPage() {
  const router = useRouter();
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [city, setCity] = useState("Mumbai");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForecast() {
      setLoading(true);
      try {
        const res = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
        if (res.ok) {
          const data = await res.json();
          setForecast(data.forecast || []);
        }
      } catch (err) {
        console.error("Forecast error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchForecast();
  }, [city]);

  const getWeatherIcon = (condition: string, riskLevel: string) => {
    if (riskLevel === "Critical") return <CloudLightning className="w-6 h-6 text-red-600" />;
    if (condition === "Rain" || condition === "Drizzle") return <CloudRain className="w-6 h-6 text-[#0052FF]" />;
    if (condition === "Snow") return <Snowflake className="w-6 h-6 text-cyan-500" />;
    return <Sun className="w-6 h-6 text-amber-500" />;
  };

  const getRiskBg = (risk: string) => {
    if (risk === "Critical") return "bg-red-50 border-red-100";
    if (risk === "High") return "bg-orange-50 border-orange-100";
    if (risk === "Medium") return "bg-yellow-50 border-yellow-100";
    return "bg-emerald-50 border-emerald-100";
  };

  const getRiskText = (risk: string) => {
    if (risk === "Critical") return "text-red-700";
    if (risk === "High") return "text-orange-700";
    if (risk === "Medium") return "text-yellow-700";
    return "text-emerald-700";
  };

  const totalWeekLoss = forecast.reduce((sum, d) => sum + d.earningsImpact.estimatedLoss, 0);
  const riskyDays = forecast.filter(d => d.riskLevel !== "Low").length;

  return (
    <div className="bg-[#F8FAFC] font-sans text-slate-900 min-h-screen relative overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .premium-card { background: white; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
        .premium-nav { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid #E2E8F0; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.6s ease-out forwards; opacity: 0; }
      `}} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between premium-nav px-8 py-3 rounded-full shadow-sm">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-[#0052FF] rounded-lg flex items-center justify-center shadow-md shadow-blue-100">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Vertex</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <button onClick={() => router.push('/dashboard')} className="hover:text-[#0052FF] transition-colors">Dashboard</button>
            <button onClick={() => router.push('/forecast')} className="text-[#0052FF] border-b-2 border-blue-500 pb-0.5">Forecast</button>
            <button onClick={() => router.push('/algo-health')} className="hover:text-[#0052FF] transition-colors">Algo-Health</button>
            <button onClick={() => router.push('/claim')} className="hover:text-[#0052FF] transition-colors">Claims</button>
          </div>
          <div className="w-20"></div>
        </nav>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 slide-up" style={{animationDelay: "0s"}}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
                <CalendarDays className="w-6 h-6 text-[#0052FF]" />
              </div>
              <span className="text-xs font-bold text-[#0052FF] uppercase tracking-widest">Predictive Intelligence</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Earnings Forecast</h1>
            <p className="text-slate-500 max-w-lg font-medium">5-day weather prediction mapped to your potential earning losses. Plan your week smarter.</p>
          </div>
          <div className="relative group">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 appearance-none pr-12 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm group-hover:border-blue-400"
            >
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="premium-card p-8 rounded-[2rem] slide-up" style={{animationDelay: "0.1s"}}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-red-50 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projected Loss</span>
            </div>
            <span className="text-4xl font-black text-red-600">₹{totalWeekLoss.toLocaleString()}</span>
            <p className="text-xs text-slate-500 font-semibold mt-2">Week estimate based on current patterns</p>
          </div>
          
          <div className="premium-card p-8 rounded-[2rem] slide-up" style={{animationDelay: "0.2s"}}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risky Windows</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-4xl font-black text-amber-600">{riskyDays}</span>
              <span className="text-lg text-slate-400 font-bold ml-1">/ {forecast.length} days</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-2">Days with Medium or higher risk</p>
          </div>

          <div className="premium-card p-8 rounded-[2rem] slide-up" style={{animationDelay: "0.3s"}}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <Umbrella className="w-5 h-5 text-[#0052FF]" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safe Protocols</span>
            </div>
            <span className="text-lg font-black text-[#0052FF] leading-tight block">
              {riskyDays >= 3 ? "Upgrade to Elite Protection" : riskyDays >= 1 ? "Active Pro Plan Coverage" : "Safe Zone: No Risk Detected"}
            </span>
            <p className="text-xs text-slate-500 font-semibold mt-2">Dynamic recommendation</p>
          </div>
        </div>

        {/* Forecast Timeline */}
        <div className="premium-card rounded-[2.5rem] overflow-hidden slide-up" style={{animationDelay: "0.4s"}}>
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">5-Day Impact Breakdown</h2>
            <p className="text-sm text-slate-500 font-semibold">Weather patterns mapped to earnings for {city}</p>
          </div>

          {loading ? (
            <div className="p-32 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {forecast.map((day, i) => (
                <div key={day.date} className="p-8 flex flex-col md:flex-row items-start md:items-center gap-8 hover:bg-slate-50 transition-all group">
                  {/* Day Info */}
                  <div className="w-36 shrink-0">
                    <p className="font-black text-xl text-slate-900">{day.dayName}</p>
                    <p className="text-xs text-slate-400 font-bold tracking-wider">{day.date}</p>
                  </div>

                  {/* Weather */}
                  <div className="flex items-center gap-4 w-52 shrink-0">
                    <div className="p-3 bg-slate-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {getWeatherIcon(day.weatherCondition, day.riskLevel)}
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-800 capitalize tracking-tight">{day.description}</p>
                      <p className="text-xs text-slate-500 font-bold">{day.temperature}°C • {day.humidity}% Humidity</p>
                    </div>
                  </div>

                  {/* Risk Badge */}
                  <div className={`px-4 py-2 rounded-2xl border text-[11px] font-black uppercase tracking-widest ${getRiskBg(day.riskLevel)} ${getRiskText(day.riskLevel)} shadow-sm`}>
                    {day.riskLevel} Risk
                  </div>

                  {/* Earnings Impact Bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest font-sans">Loss Projection</span>
                      <span className={`text-base font-black ${day.earningsImpact.estimatedLoss > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {day.earningsImpact.estimatedLoss > 0 ? `-₹${day.earningsImpact.estimatedLoss}` : "Stable"}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${
                          day.riskLevel === "Critical" ? "bg-red-500" :
                          day.riskLevel === "High" ? "bg-orange-500" :
                          day.riskLevel === "Medium" ? "bg-yellow-500" : "bg-emerald-500"
                        }`}
                        style={{width: `${Math.max(day.earningsImpact.estimatedLossPercent, 3)}%`}}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold mt-2 italic">"{day.recommendation}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-10 premium-card p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-700 border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 rotate-12 group-hover:scale-[1.7] transition-transform duration-700">
            <Shield className="w-64 h-64 text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-white mb-2 leading-tight">Secure your income this week</h3>
              <p className="text-blue-100 text-sm font-medium max-w-md">Our algorithmically-linked coverage plans ensure that weather losses are offset automatically. Join 50,000+ protected gig workers.</p>
            </div>
            <button
              onClick={() => router.push('/plans')}
              className="bg-white text-[#0052FF] px-10 py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-slate-50 transition-all hover:translate-y-[-2px] hover:shadow-[0_20px_40px_-5px_rgba(255,255,255,0.3)]"
            >
              Coverage Plans <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
