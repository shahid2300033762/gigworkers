"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ShieldCheck, User as LucideUser, Settings, ArrowLeft, // Renamed User from lucide-react to LucideUser to avoid conflict
    ChevronRight, Shield, Bell, AppWindow,
    LayoutDashboard, UserCircle2, FileText, BarChart3,
    Loader2
} from 'lucide-react';
import { User } from '@supabase/supabase-js'; // Added this import
import { supabase } from '@/lib/supabase';
import { getCurrentSession } from '@/lib/getSession'; // Added this import

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null); // Changed type to User from @supabase/supabase-js
    const [worker, setWorker] = useState<any>(null);

    useEffect(() => {
        async function loadUser() { // Renamed getProfile to loadUser
            try {
                const session = await getCurrentSession(); // Used getCurrentSession
                const authUser = session?.user;
                if (!authUser) {
                    router.push('/login');
                    return;
                }
                setUser(authUser);

                const { data: workerData, error } = await supabase
                    .from('Workers')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                if (error) {
                    throw error;
                }

                if (workerData) {
                    setWorker(workerData);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, [router]);

    const menuItems = [
        {
            title: "Account Settings",
            description: "Manage your password, security, and personal info",
            icon: Settings,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            route: "/profile/settings"
        },
        {
            title: "Privacy & Data",
            description: "Control your privacy settings and data usage",
            icon: ShieldCheck,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            route: "/profile/privacy"
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen">
            <nav className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-primary/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="bg-primary p-1.5 rounded-lg">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-primary">Vertex</span>
                    </div>
                    <div className="hidden md:flex items-center gap-10">
                        <button onClick={() => router.push('/')} className="text-sm font-semibold hover:text-accent-teal transition-colors text-slate-500">Home</button>
                        <button onClick={() => router.push('/dashboard')} className="text-sm font-semibold hover:text-accent-teal transition-colors text-slate-500">Dashboard</button>
                        <button onClick={() => router.push('/claim')} className="text-sm font-semibold hover:text-accent-teal transition-colors text-slate-500">Claims</button>
                        <button onClick={() => router.push('/analytics')} className="text-sm font-semibold hover:text-accent-teal transition-colors text-slate-500">Analytics</button>
                        <button onClick={() => router.push('/profile')} className="text-sm font-semibold text-primary">Profile</button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/login');
                            }}
                            className="bg-primary/5 text-primary text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary/10 transition-all"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </nav>

            <div className="py-12 px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                        <p className="text-slate-500 font-bold">Loading Profile...</p>
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto">
                    {/* Profile Header Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-xl shadow-primary/5 text-center relative overflow-hidden mb-8">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>

                        <div className="flex justify-center mb-6 relative">
                            <div className="size-24 bg-gradient-to-br from-primary to-blue-600 rounded-full p-1.5 shadow-lg shadow-primary/20">
                                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKm8UXJx4aJUC248o0Vc4hVjIcX7TLeiwSKS2v_lBZx5CmKy4U2Sqeh_mY47iWsDQbfXhMgLCAiuEp1mkxtSIGTZS3rX5RHW1pEaZrEsD7NZ2ddCSOHV86TD5AqmtORFNHQlNI5WjLZ1wbm7zcXW6OOcYkM4LUxKdHEqXGak51FgOVZOZyxr8_Iba3ogDv9CsuM0fB4LGKNkS09SOdU4aFObMjVGTtIHKc2z210akRCG0yKqlcRx6QVSKntQUsgSskW1jkJKLE85Sr"
                                        alt="User Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="absolute bottom-1 right-1/2 translate-x-10 size-7 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                        </div>

                        <h1 className="text-3xl font-black mb-2 text-primary tracking-tight">
                            {worker?.name || user?.user_metadata?.full_name || "New User"}
                        </h1>
                        <p className="text-slate-500 font-medium mb-1 italic">
                            {worker?.platform || "Gig Worker"} • {worker?.city || "Member"}
                        </p>
                        
                        <div className="flex flex-col items-center gap-3 mt-4">
                            <div className="flex items-center gap-2">
                                <select 
                                    value={worker?.city || ""} 
                                    onChange={async (e) => {
                                        const newCity = e.target.value;
                                        if (!newCity || !worker) return;
                                        setLoading(true);
                                        const { error } = await supabase
                                            .from('Workers')
                                            .update({ city: newCity })
                                            .eq('id', user?.id);
                                        
                                        if (!error) {
                                            setWorker({ ...worker, city: newCity });
                                        } else {
                                            console.error("Update failed:", error);
                                        }
                                        setLoading(false);
                                    }}
                                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Change City</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Kolkata">Kolkata</option>
                                </select>
                            </div>
                            <p className="text-slate-400 text-sm font-medium">{user?.email}</p>
                        </div>

                        <div className="flex items-center justify-center gap-2 mt-4">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                                {worker?.upi_id || "No UPI Linked"}
                            </span>
                            <span className={`px-3 py-1 ${worker?.account_status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'} text-[10px] font-black uppercase tracking-widest rounded-full`}>
                                {worker ? "Active" : "Pending Verification"}
                            </span>
                        </div>
                    </div>

                    {/* Main Settings Menu */}
                    <div className="flex flex-col gap-4">
                        {menuItems.map((item) => (
                            <button
                                key={item.title}
                                onClick={() => router.push(item.route)}
                                className="group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all active:scale-[0.98] text-left"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`size-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="font-black text-primary text-lg tracking-tight mb-0.5">{item.title}</p>
                                        <p className="text-sm text-slate-500 font-medium">{item.description}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors group-hover:translate-x-1 transition-transform" />
                            </button>
                        ))}
                    </div>

                    {/* Secondary Actions */}
                    <div className="mt-8 grid grid-cols-1 gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Support & Help</p>
                        <div className="flex justify-center gap-8">
                            <button onClick={() => router.push('/support')} className="text-slate-500 hover:text-primary text-sm font-bold">Help Center</button>
                            <button className="text-slate-500 hover:text-primary text-sm font-bold">Terms of Service</button>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}
