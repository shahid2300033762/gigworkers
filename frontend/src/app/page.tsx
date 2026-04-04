"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CloudRain, Zap, IndianRupee, BarChart3, ArrowRight, Menu, X, Activity, CalendarDays } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const bgRef = useRef<HTMLDivElement>(null);
  const [drops, setDrops] = useState<Array<{left: string, duration: string, delay: string}>>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (bgRef.current) {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        bgRef.current.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.05)`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);

    const newDrops = Array.from({ length: 100 }).map(() => ({
      left: `${Math.random() * 100}%`,
      duration: `${0.5 + Math.random() * 0.5}s`,
      delay: `${Math.random() * 2}s`
    }));
    setDrops(newDrops);

    return () => { document.removeEventListener('mousemove', handleMouseMove); };
  }, []);

  const features = [
    {
      icon: <CloudRain className="w-6 h-6" />,
      title: "Parametric Triggers",
      desc: "Claims auto-trigger when weather conditions cross risk thresholds. No paperwork needed."
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Algo-Health Score",
      desc: "Track your platform deactivation risk. Our AI analyzes your gig profile to predict account threats."
    },
    {
      icon: <CalendarDays className="w-6 h-6" />,
      title: "Earnings Forecast",
      desc: "5-day weather predictions mapped to earning losses. Know which days to boost coverage."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "GPS Verification",
      desc: "Claims cross-validated with your real-time GPS location and live weather at those coordinates."
    },
    {
      icon: <IndianRupee className="w-6 h-6" />,
      title: "Instant UPI Payouts",
      desc: "Verified payouts sent directly to your UPI ID within minutes of claim approval."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Risk Timeline",
      desc: "7-day historical risk analysis. See how conditions evolved and track your protection history."
    },
  ];

  return (
    <div className="bg-[#0A0B0D] font-sans text-white overflow-x-hidden min-h-screen relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rain { 0% { transform: translateY(-100vh); } 100% { transform: translateY(100vh); } }
        .rain-drop { position: absolute; background: rgba(255, 255, 255, 0.15); width: 1px; height: 60px; top: -60px; animation: rain linear infinite; }
        .glass-card-immersive { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.2); }
        .glass-nav { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .hero-bg { background: linear-gradient(rgba(10, 11, 13, 0.3), rgba(10, 11, 13, 0.6)), url('https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=2000'); background-size: cover; background-position: center; transition: transform 0.1s ease-out; }
        .glow-button { box-shadow: 0 0 20px rgba(0, 82, 255, 0.4); transition: all 0.3s ease; }
        .glow-button:hover { box-shadow: 0 0 30px rgba(0, 82, 255, 0.6); transform: translateY(-2px); }
        .fade-in { animation: fadeIn 1.2s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .delay-1 { animation-delay: 0.2s; } .delay-2 { animation-delay: 0.4s; } .delay-3 { animation-delay: 0.6s; }
        .feature-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s ease; }
        .feature-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(0, 82, 255, 0.3); transform: translateY(-4px); }
      `}} />

      {/* Hero Background & Rain */}
      <div ref={bgRef} className="fixed inset-0 z-0 hero-bg" style={{ transform: 'scale(1.05)' }}>
        <div className="absolute inset-0 pointer-events-none">
          {drops.map((drop, i) => (
            <div key={i} className="rain-drop" style={{ left: drop.left, animationDuration: drop.duration, animationDelay: drop.delay }} />
          ))}
        </div>
      </div>

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between glass-nav px-8 py-3 rounded-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-[#0052FF] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">Vertex</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/80">
            <button onClick={() => router.push('/')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => router.push('/dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => router.push('/forecast')} className="hover:text-white transition-colors">Forecast</button>
            <button onClick={() => router.push('/claim')} className="hover:text-white transition-colors">Claims</button>
            <button onClick={() => router.push('/analytics')} className="hover:text-white transition-colors">Analytics</button>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/signup')} className="hidden sm:block bg-white text-[#0A0B0D] px-6 py-2 rounded-full text-sm font-bold hover:bg-opacity-90 transition-all">
              Get Started
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 glass-nav rounded-2xl p-4 space-y-2">
            {[['/', 'Home'], ['/dashboard', 'Dashboard'], ['/forecast', 'Forecast'], ['/algo-health', 'Algo-Health'], ['/claim', 'Claims'], ['/signup', 'Get Started']].map(([path, label]) => (
              <button key={path} onClick={() => { router.push(path); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto pt-20">
          <span className="fade-in inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-[#0052FF]/20 text-blue-400 border border-blue-400/30 rounded-full">
            Gig Worker Protection · Powered by AI
          </span>
          <h1 className="fade-in delay-1 text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tighter text-white">
            Protect Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Hustle.</span>
          </h1>
          <p className="fade-in delay-2 text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Parametric insurance for gig workers. Get paid automatically when the weather stops you from earning. No paperwork, just protection.
          </p>
          
          <div className="fade-in delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => router.push('/signup')} className="glow-button bg-[#0052FF] text-white px-10 py-4 rounded-xl font-bold text-lg w-full sm:w-auto">
              Get Started
            </button>
            <button onClick={() => router.push('/plans')} className="glass-card-immersive text-white px-10 py-4 rounded-xl font-bold text-lg w-full sm:w-auto hover:bg-white/20 transition-all">
              Explore Plans
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">How It Works</span>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce"></div>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-white/5 text-blue-400 border border-white/10 rounded-full">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Insurance that thinks for you</h2>
            <p className="text-white/50 max-w-xl mx-auto">From weather disruption to instant payout — fully automated protection in 3 steps.</p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              { step: "01", title: "Weather Triggers", desc: "Our AI monitors real-time weather across India. When conditions cross risk thresholds in your zone, the system activates." },
              { step: "02", title: "GPS Verified", desc: "Your location is cross-validated with live weather data at those exact coordinates. No fake claims possible." },
              { step: "03", title: "Instant Payout", desc: "Verified claims trigger automatic UPI payouts. Money hits your account within minutes, not weeks." },
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl glass-card-immersive group">
                <span className="text-[80px] font-black text-white/[0.03] absolute top-2 right-4 leading-none">{item.step}</span>
                <span className="text-sm font-bold text-blue-400 mb-3 block">Step {item.step}</span>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Feature Grid */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">What makes Vertex different</h2>
            <p className="text-white/50 max-w-lg mx-auto">Built specifically for India's gig economy with features no other platform offers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="feature-card p-6 rounded-2xl cursor-pointer">
                <div className="w-12 h-12 bg-[#0052FF]/10 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center glass-card-immersive p-12 rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to protect your earnings?</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">Join thousands of gig workers who never worry about weather disruptions again.</p>
          <button onClick={() => router.push('/signup')} className="glow-button bg-[#0052FF] text-white px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2">
            Start Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0052FF] rounded flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm">Vertex</span>
            <span className="text-white/30 text-xs ml-2">© 2026 Vertex Inc.</span>
          </div>
          <div className="flex gap-6 text-xs text-white/40 font-medium">
            <button onClick={() => router.push('/support')} className="hover:text-white transition-colors">Support</button>
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
