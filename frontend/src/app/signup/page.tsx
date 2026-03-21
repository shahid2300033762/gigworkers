"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Loader2, Mail, Lock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getWorkerProfile } from '@/lib/worker';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        async function checkSession() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    const { data: { user }, error } = await supabase.auth.getUser();
                    if (user && !error) {
                        const worker = await getWorkerProfile(user.id);
                        if (worker) {
                            router.push('/dashboard');
                        } else {
                            router.push('/onboarding');
                        }
                        return;
                    } else {
                        try { await supabase.auth.signOut(); } catch (e) {}
                    }
                }
            } catch (err) {
                console.error("Auth check failed in signup:", err);
            } finally {
                setCheckingSession(false);
            }
        }
        checkSession();
    }, [router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (error) {
                throw error;
            }

            // Route to onboarding to complete worker registration
            router.push('/onboarding');
        } catch (err: any) {
            console.error('Signup error:', err.message);
            setErrorMsg(err.message || 'Failed to create an account. Please try again.');
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
        <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-4 relative font-display text-primary">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-accent-teal/10 blur-[100px] rounded-full"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-accent-purple/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="w-full max-w-md z-10 mt-10 mb-10">
                <div className="flex flex-col items-center justify-center mb-8 cursor-pointer" onClick={() => router.push('/')}>
                    <div className="bg-primary p-2.5 rounded-xl mb-4 shadow-lg shadow-primary/20">
                        <Shield className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Create an Account</h1>
                    <p className="text-slate-500 mt-2 text-center">Join GigShield AI for premium parametric protection.</p>
                </div>

                <div className="glass-card bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-white">
                    <form onSubmit={handleSignup} className="space-y-5">
                        {errorMsg && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Legal Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-slate-800 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 group mt-4!"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-slate-500 font-medium">
                    Already have an account?{' '}
                    <button
                        onClick={() => router.push('/login')}
                        className="text-primary font-bold hover:underline"
                    >
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
}
