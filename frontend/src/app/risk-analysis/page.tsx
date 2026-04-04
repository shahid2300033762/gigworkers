"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Bell, User,
    Leaf, AlertTriangle, CloudRain, Wind,
    Droplets, Shield, TrendingUp, TrendingDown,
    Plus, Minus, Info, ArrowRight, Sparkles, Loader2
} from 'lucide-react';
import { apiFetch } from "@/lib/auth";
import { generatePremiumBreakdownPDF } from "@/lib/pdf-utils";

function RiskAnalysisContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [data, setData] = useState<{ risk_score: number; weekly_premium: number } | null>(null);
    const [loading, setLoading] = useState(true);

    // Fallback data for showcase
    const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "Mumbai");
    const [simulateWeather, setSimulateWeather] = useState("");
    const platform = searchParams.get("platform") || "Swiggy";

    // Weather State
    const [weatherData, setWeatherData] = useState<any>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
            setWeatherLoading(true);
            try {
                const simParam = simulateWeather ? `&simulate=${simulateWeather}` : "";
                const res = await fetch(`/api/weather?city=${encodeURIComponent(selectedCity)}${simParam}`);
                if (res.ok) {
                    const json = await res.json();
                    setWeatherData(json);
                } else {
                    setWeatherData(null);
                }
            } catch (err) {
                console.error(err);
                setWeatherData(null);
            } finally {
                setWeatherLoading(false);
            }
        }
        fetchWeather();
    }, [selectedCity, simulateWeather]);

    useEffect(() => {
        if (weatherLoading) return; // Wait for weather to be ready

        async function fetchPremium() {
            try {
                const weatherRisk = weatherData?.riskLevel || "Low";
                const res = await apiFetch(`/api/calculate-premium?city=${encodeURIComponent(selectedCity)}&platform=${encodeURIComponent(platform)}&weather_risk=${weatherRisk}`);
                if (res.ok) {
                    const json = await res.json();
                    setData({
                        risk_score: json.risk_score,
                        weekly_premium: json.weekly_premium,
                    });
                } else {
                    setData({ risk_score: 0.72, weekly_premium: 112.5 });
                }
            } catch (err) {
                setData({ risk_score: 0.72, weekly_premium: 112.5 });
            } finally {
                setLoading(false);
            }
        }
        fetchPremium();
    }, [selectedCity, platform, weatherData, weatherLoading]);

    const riskScorePercentage = data ? Math.round(data.risk_score * 100) : 0;
    const strokeDashoffset = 502.4 - (502.4 * (data?.risk_score || 0));

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen">
            <div className="relative flex min-h-screen w-full flex-col">
                {/* Top Navigation */}
                <header className="flex items-center justify-between border-b border-primary/10 bg-white dark:bg-background-dark px-6 py-3 lg:px-10">
                    <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors mr-2">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold leading-tight tracking-tight text-primary dark:text-slate-100">Vertex</h2>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Premium Tier</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex items-center gap-6 mr-6">
                            <button onClick={() => router.push('/dashboard')} className="text-sm font-semibold text-primary border-b-2 border-primary pb-1">Dashboard</button>
                            <button onClick={() => router.push('/admin/risk-heatmap')} className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Risk Map</button>
                            <button onClick={() => router.push('/claim')} className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Claims</button>
                        </nav>
                        <div className="flex gap-2">
                            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button onClick={() => router.push('/profile')} className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                                <User className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-6 py-8 lg:px-10">
                    <div className="mx-auto max-w-7xl">
                        {/* Header Section */}
                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-primary">Risk Intelligence Dashboard</h1>
                                <div className="mt-2 flex items-center gap-2">
                                    <p className="text-slate-500">Real-time environmental data & premium modeling for</p>
                                    <select 
                                        value={selectedCity} 
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="bg-white border border-primary/10 rounded-lg px-2 py-1 text-sm font-bold text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                    >
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Bangalore">Bangalore</option>
                                        <option value="Hyderabad">Hyderabad</option>
                                        <option value="Chennai">Chennai</option>
                                        <option value="Kolkata">Kolkata</option>
                                    </select>
                                    <span className="text-slate-300">|</span>
                                    <select 
                                        value={simulateWeather} 
                                        onChange={(e) => setSimulateWeather(e.target.value)}
                                        className={`border rounded-lg px-2 py-1 text-xs font-bold shadow-sm focus:outline-none cursor-pointer transition-colors ${simulateWeather ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-primary/10 text-slate-400'}`}
                                    >
                                        <option value="">Simulation Off</option>
                                        <option value="heavy_rain">Simulate Heavy Rain</option>
                                        <option value="clear">Simulate Clear Sky</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white px-4 py-2 rounded-lg border border-primary/10 shadow-sm">
                                <Leaf className="w-4 h-4 text-green-600" />
                                Last updated: Just now
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                            {/* Left Column: Risk Analysis */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Central Gauge Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-primary/5">
                                    <div className="flex flex-col items-center justify-center border-r border-primary/10 pr-6">
                                        <div className="relative flex items-center justify-center w-48 h-48 rotate-45">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle className="text-primary/5" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12" />
                                                {!loading && (
                                                    <circle
                                                        className="text-primary"
                                                        cx="96"
                                                        cy="96"
                                                        fill="transparent"
                                                        r="80"
                                                        stroke="currentColor"
                                                        strokeWidth="12"
                                                        strokeDasharray="502.4"
                                                        strokeDashoffset={strokeDashoffset}
                                                    />
                                                )}
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-45">
                                                <span className="text-5xl font-black text-primary">{loading ? "..." : riskScorePercentage}</span>
                                                <span className="text-xs font-bold text-slate-400 uppercase">Risk Score</span>
                                            </div>
                                        </div>
                                        {!loading && (
                                            <div className={`mt-4 flex items-center gap-2 ${data && data.risk_score > 0.6 ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50'} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                                                <AlertTriangle className="w-4 h-4" />
                                                {data && data.risk_score > 0.6 ? 'High Risk Zone' : 'Moderate Risk Zone'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center space-y-4">
                                        <h3 className="text-lg font-bold text-primary">AI Insights</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            Our AI detected a <span className="font-bold text-primary">12% increase</span> in regional {platform === 'Swiggy' ? 'Swiggy' : 'platform'} volatility. <span className="font-bold text-orange-600">Traffic Density: High (8.4/10)</span> and <span className="font-bold text-blue-600">Platform Saturation: 92%</span> in <span className="font-bold">{selectedCity}</span>.
                                        </p>
                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span className="text-slate-500 uppercase">Reliability Index</span>
                                                <span className="text-primary">98.4%</span>
                                            </div>
                                            <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-[98%] transition-all duration-1000"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grid Cards: Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300 cursor-pointer group">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CloudRain className="w-5 h-5 text-primary bg-primary/5 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors" />
                                            <span className="text-xs font-bold text-slate-500 uppercase">Weather</span>
                                        </div>
                                        <div className="text-xl font-bold text-primary capitalize">{weatherLoading ? "..." : (weatherData?.description || "Clear")}</div>
                                        <div className="text-xs font-medium text-slate-500 mt-1 flex items-center">
                                            {weatherLoading ? "..." : `${weatherData?.temperature || 25}°C`}
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300 cursor-pointer group">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Wind className="w-5 h-5 text-primary bg-primary/5 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors" />
                                            <span className="text-xs font-bold text-slate-500 uppercase">Rain Volume</span>
                                        </div>
                                        <div className="text-2xl font-bold text-primary">{weatherLoading ? "..." : `${weatherData?.rainVolume || 0}mm`}</div>
                                        <div className="text-xs font-medium text-blue-500 mt-1 flex items-center">
                                            <Droplets className="w-3 h-3 mr-1" /> Last hour
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300 cursor-pointer group">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Droplets className="w-5 h-5 text-red-500 bg-red-50 p-2 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors" />
                                            <span className="text-xs font-bold text-slate-500 uppercase">Flood Risk</span>
                                        </div>
                                        <div className="text-2xl font-bold text-primary">{weatherLoading ? "..." : (weatherData?.riskLevel || "Low")}</div>
                                        <div className={`text-xs font-medium mt-1 flex items-center ${weatherData?.riskLevel === 'Low' ? 'text-green-500' : weatherData?.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                                            <span className="relative flex h-2 w-2 mr-2">
                                                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${weatherData?.riskLevel === 'Low' ? 'bg-green-400' : weatherData?.riskLevel === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'}`}></span>
                                                <span className={`relative inline-flex rounded-full h-2 w-2 ${weatherData?.riskLevel === 'Low' ? 'bg-green-500' : weatherData?.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                                            </span>
                                            Alert Level
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300 cursor-pointer group">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Shield className="w-5 h-5 text-primary bg-primary/5 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors" />
                                            <span className="text-xs font-bold text-slate-500 uppercase">Zone Safety</span>
                                        </div>
                                        <div className="text-2xl font-bold text-primary">88%</div>
                                        <div className="text-xs font-medium text-slate-400 mt-1">Tier 1 Secure</div>
                                    </div>
                                </div>

                                {/* Risk Map Placeholder */}
                                <div className="relative bg-slate-200 h-80 rounded-xl overflow-hidden border border-primary/5 shadow-inner">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1) brightness(0.95)' }}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedCity)},India&t=m&z=12&ie=UTF8&iwloc=&output=embed`}
                                    ></iframe>
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold text-primary border border-primary/10">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Monitoring Area: {selectedCity}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                        Radar Active
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Premium Calculation Sidebar */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-primary/10 overflow-hidden">
                                    <div className="bg-primary p-6 text-white">
                                        <h3 className="text-lg font-bold">Premium Calculation</h3>
                                        <p className="text-primary/60 text-xs font-medium uppercase tracking-wider">Dynamic AI Pricing</p>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="space-y-4 pb-6 border-b border-primary/5">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Base Premium</span>
                                                <span className="font-semibold text-primary">₹95.00</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500">Risk Adjustment</span>
                                                    <span title="Based on regional risk score">
                                                        <Info className="w-3 h-3 text-primary/40 cursor-help" />
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-red-500">+ ₹{loading ? '..' : Math.round((data?.weekly_premium || 112) - 95)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Platform Bonus ({platform})</span>
                                                <span className="font-semibold text-green-600">- ₹5.00</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Weekly Premium</p>
                                                <p className="text-4xl font-black text-primary transition-all duration-500">₹{loading ? "..." : data?.weekly_premium}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">Verified</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 space-y-3">
                                            <button
                                                onClick={() => router.push(`/policy?premium=${data?.weekly_premium || 0}`)}
                                                disabled={loading}
                                                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98]"
                                            >
                                                {loading ? 'Calculating...' : 'Continue'}
                                                {!loading && <ArrowRight className="w-4 h-4" />}
                                            </button>
                                            <button 
                                                onClick={() => generatePremiumBreakdownPDF({
                                                    city: selectedCity,
                                                    platform: platform,
                                                    basePremium: 95,
                                                    riskAdjustment: Math.round((data?.weekly_premium || 112) - 95),
                                                    bonus: 5,
                                                    total: data?.weekly_premium || 0,
                                                    riskLevel: weatherData?.riskLevel || "Low",
                                                    weather: weatherData?.description || "Clear"
                                                })}
                                                className="w-full bg-transparent border-2 border-primary/10 text-primary font-bold py-3 rounded-xl hover:bg-primary/5 transition-all text-sm"
                                            >
                                                Download PDF Breakdown
                                            </button>
                                        </div>
                                        <div className="pt-4 flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                            <Sparkles className="w-5 h-5 text-primary shrink-0" />
                                            <p className="text-[11px] leading-relaxed text-slate-600 italic">
                                                Your premium is locked for the next 48 hours based on current risk analysis in {selectedCity}. Rates may fluctuate with local environmental changes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer / System Status */}
                <footer className="mt-auto px-6 py-4 lg:px-10 border-t border-primary/5 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> AI Engine Online</span>
                        <span className="hidden sm:inline">|</span>
                        <span>API Version 4.2.0-risk</span>
                    </div>
                    <div className="flex gap-6 text-xs font-bold text-slate-500">
                        <button className="hover:text-primary transition-colors">Legal</button>
                        <button className="hover:text-primary transition-colors">Privacy</button>
                        <button onClick={() => router.push('/support')} className="hover:text-primary transition-colors">Support</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default function RiskAnalysisPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-primary bg-background-light"><Loader2 className="w-10 h-10" /></div>}>
            <RiskAnalysisContent />
        </Suspense>
    );
}
