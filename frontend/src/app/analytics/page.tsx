"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CloudRain, Droplets, Wind } from 'lucide-react';
import { 
  ShieldCheck, ArrowLeft, BarChart3, TrendingUp, Users, Activity, 
  Map as MapIcon, Calendar, Filter, Download, LayoutDashboard, FileText, History, User, Home,
  ChevronDown, X
} from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [simulateWeather, setSimulateWeather] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms");

  const platforms = [
    { label: 'Uber Logistics', score: 94, color: 'bg-blue-500' },
    { label: 'Zomato Delivery', score: 88, color: 'bg-red-500' },
    { label: 'Swiggy Pro', score: 92, color: 'bg-orange-500' },
    { label: 'Dunzo Elite', score: 79, color: 'bg-emerald-500' },
  ];

  const filteredPlatforms = selectedPlatform === "All Platforms" 
    ? platforms 
    : platforms.filter(p => p.label === selectedPlatform);

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

  const dynamicRiskScore = weatherData?.riskLevel === 'Critical' ? 'Critical' : weatherData?.riskLevel === 'High' ? 'High' : weatherData?.riskLevel === 'Medium' ? 'Medium' : 'Low';
  const riskColor = dynamicRiskScore === 'Critical' ? 'text-red-500' : dynamicRiskScore === 'High' ? 'text-orange-500' : dynamicRiskScore === 'Medium' ? 'text-yellow-500' : 'text-emerald-500';
  const riskBg = dynamicRiskScore === 'Critical' ? 'bg-red-500/10' : dynamicRiskScore === 'High' ? 'bg-orange-500/10' : dynamicRiskScore === 'Medium' ? 'bg-yellow-500/10' : 'bg-emerald-500/10';

  const stats = [
    { label: 'Weather Risk', value: weatherLoading ? '...' : dynamicRiskScore, icon: ShieldCheck, color: riskColor, bg: riskBg },
    { label: 'Weather Condition', value: weatherLoading ? '...' : (weatherData?.weatherCondition || 'Clear'), icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Precipitation', value: weatherLoading ? '...' : `${weatherData?.rainVolume || 0}mm`, icon: Droplets, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Temperature', value: weatherLoading ? '...' : `${weatherData?.temperature || 25}°C`, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-primary/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-primary p-1.5 rounded-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-primary">Vertex</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => router.push('/')} className="text-sm font-semibold hover:text-accent-teal transition-colors">Home</button>
            <button onClick={() => router.push('/dashboard')} className="text-sm font-semibold hover:text-accent-teal transition-colors">Dashboard</button>
            <button onClick={() => router.push('/claim')} className="text-sm font-semibold hover:text-accent-teal transition-colors">Claims</button>
            <button onClick={() => router.push('/analytics')} className="text-sm font-semibold text-primary">Analytics</button>
            <button onClick={() => router.push('/profile')} className="text-sm font-semibold hover:text-accent-teal transition-colors">Profile</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-primary/60 font-bold text-sm mb-4 hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-black tracking-tight mb-2">Risk Analytics</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
                <p className="text-primary/60 font-medium">Real-time localized risk insights for</p>
                <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-background-light dark:bg-slate-900 border border-primary/10 rounded-xl px-4 py-2 text-sm font-black text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
                >
                    <option value="Mumbai">Mumbai</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Bangalore">Bangalore</option>
                                        <option value="Hyderabad">Hyderabad</option>
                                        <option value="Chennai">Chennai</option>
                                        <option value="Kolkata">Kolkata</option>
                </select>
                <div className="flex items-center gap-2 bg-background-light dark:bg-slate-900 border border-primary/10 rounded-xl px-4 py-2">
                    <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">Simulation:</span>
                    <select 
                        value={simulateWeather} 
                        onChange={(e) => setSimulateWeather(e.target.value)}
                        className={`text-xs font-extrabold bg-transparent focus:outline-none cursor-pointer ${simulateWeather ? 'text-orange-500' : 'text-primary/60'}`}
                    >
                        <option value="">Off</option>
                        <option value="heavy_rain">Heavy Rain</option>
                        <option value="clear">Clear Sky</option>
                    </select>
                </div>
            </div>
          </div>

          <div className="flex gap-4 relative">
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`border px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${showFilters ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800 border-primary/10 hover:bg-primary/5'}`}
              >
                <Filter size={18} /> {selectedPlatform === "All Platforms" ? "Filters" : selectedPlatform}
                {selectedPlatform !== "All Platforms" && (
                  <X 
                    size={14} 
                    className="ml-2 hover:scale-125 transition-transform" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlatform("All Platforms");
                    }} 
                  />
                )}
                <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {showFilters && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl shadow-2xl z-[60] py-3 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <p className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-primary/40">Select Platform</p>
                  <button 
                    onClick={() => { setSelectedPlatform("All Platforms"); setShowFilters(false); }}
                    className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors hover:bg-primary/5 ${selectedPlatform === "All Platforms" ? 'text-primary' : 'text-primary/60'}`}
                  >
                    All Platforms
                  </button>
                  {platforms.map((p) => (
                    <button 
                      key={p.label}
                      onClick={() => { setSelectedPlatform(p.label); setShowFilters(false); }}
                      className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors hover:bg-primary/5 ${selectedPlatform === p.label ? 'text-primary' : 'text-primary/60'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
              <Download size={18} /> Export Data
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Risk Heatmap Placeholder */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-primary/5 p-10 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-primary uppercase tracking-widest text-sm flex items-center gap-2">
                <MapIcon className="w-5 h-5" /> Localized Risk Heatmap
              </h3>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Live</span>
            </div>
            <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-primary/5 relative group">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.3) invert(0.05)' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedCity)},India&t=k&z=11&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white pointer-events-none">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Signal Strength</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-accent-teal' : 'bg-white/20'}`}></div>)}
                  </div>
                  <span className="text-xs font-bold">Satellite Feed: {selectedCity} (Optimized)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Platform Performance */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-primary/5 p-10 shadow-sm min-h-[400px]">
            <h3 className="text-xl font-black text-primary uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
              <Users className="w-5 h-5" /> Safety Correlation
            </h3>
            <div className="space-y-6">
              {filteredPlatforms.length > 0 ? (
                filteredPlatforms.map((platform, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm">{platform.label}</span>
                      <span className="text-xs font-bold opacity-60">{platform.score}% Safety Index</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${platform.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${platform.score}%` }}
                      />
                    </div>
                  </div>
                )
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-primary/40">
                  <Filter className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold">No platforms match your filter</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-900 py-12 px-6 border-t border-primary/5 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1 rounded-lg">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-primary">Vertex</span>
          </div>
          <p className="text-sm text-primary/40 font-medium tracking-tight">© 2026 Vertex. Powered by localized radar oracles.</p>
          <div className="flex gap-4">
            <button onClick={() => router.push('/support')} className="text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors">Support</button>
            <button className="text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors">Privacy</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
