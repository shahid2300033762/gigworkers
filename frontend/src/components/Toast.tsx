"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400 shrink-0" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />;
      default: return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  const getBg = (type: ToastType) => {
    switch (type) {
      case 'success': return 'bg-green-950/90 border-green-800';
      case 'error': return 'bg-red-950/90 border-red-800';
      case 'warning': return 'bg-yellow-950/90 border-yellow-800';
      default: return 'bg-slate-900/90 border-slate-700';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-sm animate-slide-in ${getBg(toast.type)}`}
            style={{ animation: 'slideIn 0.3s ease-out forwards' }}
          >
            {getIcon(toast.type)}
            <p className="text-sm text-white font-medium leading-relaxed flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-white/40 hover:text-white transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
      `}} />
    </ToastContext.Provider>
  );
}
