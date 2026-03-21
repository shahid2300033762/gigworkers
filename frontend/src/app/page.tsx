"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const bgRef = useRef<HTMLDivElement>(null);
  const [drops, setDrops] = useState<Array<{left: string, duration: string, delay: string}>>([]);

  useEffect(() => {
    // Parallax Effect
    const handleMouseMove = (e: MouseEvent) => {
      if (bgRef.current) {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        bgRef.current.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.05)`;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);

    // Rain Particle Generator
    const newDrops = Array.from({ length: 100 }).map(() => ({
      left: `${Math.random() * 100}%`,
      duration: `${0.5 + Math.random() * 0.5}s`,
      delay: `${Math.random() * 2}s`
    }));
    setDrops(newDrops);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-[#0A0B0D] font-sans text-white overflow-x-hidden min-h-screen relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rain {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        .rain-drop {
          position: absolute;
          background: rgba(255, 255, 255, 0.15);
          width: 1px;
          height: 60px;
          top: -60px;
          animation: rain linear infinite;
        }
        .glass-card-immersive {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glass-nav {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .hero-bg {
          background: linear-gradient(rgba(10, 11, 13, 0.3), rgba(10, 11, 13, 0.6)), 
                      url('https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=2000');
          background-size: cover;
          background-position: center;
          transition: transform 0.1s ease-out;
        }
        .glow-button {
          box-shadow: 0 0 20px rgba(0, 82, 255, 0.4);
          transition: all 0.3s ease;
        }
        .glow-button:hover {
          box-shadow: 0 0 30px rgba(0, 82, 255, 0.6);
          transform: translateY(-2px);
        }
        .fade-in {
          animation: fadeIn 1.2s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
      `}} />

      {/* Hero Background & Rain */}
      <div 
        ref={bgRef}
        id="parallax-bg"
        className="fixed inset-0 z-0 hero-bg" 
        style={{ transform: 'scale(1.05)' }}
      >
        <div className="absolute inset-0 pointer-events-none" id="rain-container">
          {drops.map((drop, i) => (
            <div 
              key={i}
              className="rain-drop"
              style={{
                left: drop.left,
                animationDuration: drop.duration,
                animationDelay: drop.delay
              }}
            />
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
            <span className="text-xl font-extrabold tracking-tight text-white">GigShield <span className="text-blue-400">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/80">
            <button onClick={() => router.push('/')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => router.push('/dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => router.push('/claim')} className="hover:text-white transition-colors">Claims</button>
            <button onClick={() => router.push('/analytics')} className="hover:text-white transition-colors">Analytics</button>
            <button onClick={() => router.push('/profile')} className="hover:text-white transition-colors">Profile</button>
          </div>
          
          <div>
            <button 
              onClick={() => router.push('/signup')}
              className="bg-white text-[#0A0B0D] px-6 py-2 rounded-full text-sm font-bold hover:bg-opacity-90 transition-all"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Hero Text Content */}
        <div className="max-w-4xl mx-auto pt-20">
          <span className="fade-in inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-[#0052FF]/20 text-blue-400 border border-blue-400/30 rounded-full">
            Gig Worker Protection
          </span>
          <h1 className="fade-in delay-1 text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tighter text-white">
            Protect Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Hustle.
            </span>
          </h1>
          <p className="fade-in delay-2 text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Parametric insurance for gig workers. Get paid automatically when the weather stops you from earning. No paperwork, just protection.
          </p>
          
          {/* CTA Buttons */}
          <div className="fade-in delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push('/signup')}
              className="glow-button bg-[#0052FF] text-white px-10 py-4 rounded-xl font-bold text-lg w-full sm:w-auto"
            >
              Get Started
            </button>
            <button 
              onClick={() => router.push('/plans')}
              className="glass-card-immersive text-white px-10 py-4 rounded-xl font-bold text-lg w-full sm:w-auto hover:bg-white/20 transition-all"
            >
              Explore Plans
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">
            See How It Works
          </span>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
