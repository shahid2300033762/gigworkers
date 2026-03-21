"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, User, Mail, Phone, Lock, Eye,
    Bell, CreditCard, LogOut, CheckCircle2,
    ChevronRight, Settings, Smartphone, ShieldCheck,
    PencilLine, HelpCircle, Loader2, Save, Shield, Wallet
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCurrentSession } from '@/lib/getSession';

export default function SettingsPage() {
    const router = useRouter();
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [worker, setWorker] = useState<any>(null);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false
    });
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [savingName, setSavingName] = useState(false);

    useEffect(() => {
        async function loadUser() {
            const session = await getCurrentSession();
            const authUser = session?.user;
            if (!authUser) { router.push('/login'); return; }
            setUser(authUser);
            const { data: w } = await supabase.from('Workers').select('*').eq('id', authUser.id).single();
            if (w) setWorker(w);
            setLoading(false);
        }
        loadUser();
    }, [router]);

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleEdit = (field: string) => {
        if (field === 'Full Name') {
            setNewName(worker?.name || worker?.full_name || user?.user_metadata?.full_name || '');
            setIsEditingName(true);
        } else {
            alert(`${field} editing is currently disabled. Please contact support to change your verified information.`);
        }
    };

    const handleNameSave = async () => {
        if (!newName.trim()) return;
        setSavingName(true);
        try {
            // Update Workers table
            const { error: workerError } = await supabase
                .from('Workers')
                .update({ name: newName }) // Table uses "name", not "full_name"
                .eq('id', user.id);
            
            if (workerError) throw workerError;

            // Update Auth metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: newName }
            });

            if (authError) throw authError;

            setWorker({ ...worker, name: newName, full_name: newName });
            setIsEditingName(false);
        } catch (error: any) {
            alert("Error updating name: " + error.message);
        } finally {
            setSavingName(false);
        }
    };

    const handleNameCancel = () => {
        setIsEditingName(false);
    };

    const handleUpdatePassword = () => {
        alert("A password reset link has been sent to your registered email address.");
    };

    const handleLogoutAll = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) alert("Error logging out: " + error.message);
        router.push('/login');
    };

    const handleAddPayoutId = () => {
        alert("To add a secondary payout ID, please complete the additional KYC verification in the mobile app.");
    };

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-primary w-full h-full min-h-screen py-8 px-4 lg:px-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-end mb-8">
                    <div>
                        <button
                            onClick={() => router.push('/profile')}
                            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-2 text-sm font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Profile
                        </button>
                        <h1 className="text-3xl font-black tracking-tight text-primary">Account Settings</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage your personal information and security preferences</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
                        <p className="text-sm font-bold text-primary">Oct 24, 2023</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Personal & Security */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Personal Information */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>

                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                                <User className="w-5 h-5" />
                                Personal Information
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between group hover:border-primary/20 border border-transparent transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                                            {isEditingName ? (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <input 
                                                        type="text" 
                                                        value={newName} 
                                                        onChange={(e) => setNewName(e.target.value)}
                                                        className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1 text-sm font-bold text-primary w-full max-w-[200px] outline-none focus:border-primary transition-all"
                                                        autoFocus
                                                    />
                                                    <button 
                                                        onClick={handleNameSave} 
                                                        disabled={savingName}
                                                        className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all disabled:opacity-50"
                                                    >
                                                        {savingName ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button 
                                                        onClick={handleNameCancel} 
                                                        disabled={savingName}
                                                        className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
                                                    >
                                                        <ArrowLeft className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="font-bold text-primary">{worker?.name || worker?.full_name || user?.user_metadata?.full_name || 'Not set'}</p>
                                            )}
                                        </div>
                                    </div>
                                    {!isEditingName && (
                                        <button onClick={() => handleEdit('Full Name')} className="text-slate-400 hover:text-primary p-2">
                                            <PencilLine className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between group hover:border-primary/20 border border-transparent transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                                            <p className="font-bold text-primary">{user?.email || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleEdit('Email Address')} className="text-slate-400 hover:text-primary p-2">
                                        <PencilLine className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between group hover:border-primary/20 border border-transparent transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                                            <p className="font-bold text-primary">{worker?.phone || user?.user_metadata?.phone || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleEdit('Phone Number')} className="text-slate-400 hover:text-primary p-2">
                                        <PencilLine className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Security */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                                <Lock className="w-5 h-5" />
                                Security
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary">Reset Password</p>
                                            <p className="text-xs text-slate-500">Last changed 2 months ago</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleUpdatePassword}
                                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Update
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <Smartphone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary">Two-Factor Auth</p>
                                            <p className="text-xs text-slate-500">Highly recommended for account security</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${is2FAEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <div
                                            className="size-4 bg-white rounded-full absolute top-1"
                                            style={{ left: is2FAEnabled ? 26 : 4 }}
                                        />
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Payout & Notifications */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Payout Card (Stitch Highlight) */}
                        <section className="bg-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="size-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                                        <CheckCircle2 className="w-3 h-3" /> Verified Account
                                    </span>
                                </div>

                                <div className="mb-8">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Primary UPI ID</p>
                                    <h4 className="text-xl font-black text-white tracking-wide">{worker?.upi_id || 'No UPI linked'}</h4>
                                </div>

                                <button 
                                    onClick={handleAddPayoutId}
                                    className="w-full py-4 bg-white text-primary font-black rounded-xl hover:bg-slate-100 transition-all shadow-lg active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                                >
                                    Add Secondary Payout ID
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </section>

                        {/* Notifications */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                                <Bell className="w-5 h-5" />
                                Notifications
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-sm text-primary">Email Notifications</p>
                                        <p className="text-xs text-slate-500">Weekly reports and news</p>
                                    </div>
                                    <button
                                        onClick={() => toggleNotification('email')}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${notifications.email ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <div
                                            className="size-3 bg-white rounded-full absolute top-1"
                                            style={{ left: notifications.email ? 22 : 2 }}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <div>
                                        <p className="font-bold text-sm text-primary">Push Notifications</p>
                                        <p className="text-xs text-slate-500">Real-time status alerts</p>
                                    </div>
                                    <button
                                        onClick={() => toggleNotification('push')}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${notifications.push ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <div
                                            className="size-3 bg-white rounded-full absolute top-1"
                                            style={{ left: notifications.push ? 22 : 2 }}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <div>
                                        <p className="font-bold text-sm text-primary">SMS Notifications</p>
                                        <p className="text-xs text-slate-500">Critical payout updates</p>
                                    </div>
                                    <button
                                        onClick={() => toggleNotification('sms')}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${notifications.sms ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <div
                                            className="size-3 bg-white rounded-full absolute top-1"
                                            style={{ left: notifications.sms ? 22 : 2 }}
                                        />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Danger Zone */}
                        <button 
                            onClick={handleLogoutAll}
                            className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Log out of all sessions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
