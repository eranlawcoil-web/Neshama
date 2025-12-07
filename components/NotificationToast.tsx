
import React, { useState, useEffect } from 'react';
import { Mail, X, CheckCircle, AlertCircle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error';
  duration?: number;
}

const NotificationToast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleShowToast = (event: CustomEvent<ToastMessage>) => {
      const newToast = { ...event.detail, id: Date.now().toString() };
      setToasts(prev => [newToast, ...prev]);

      if (newToast.duration !== 0) {
        setTimeout(() => {
          removeToast(newToast.id);
        }, newToast.duration || 6000);
      }
    };

    window.addEventListener('show-toast' as any, handleShowToast as any);
    return () => window.removeEventListener('show-toast' as any, handleShowToast as any);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className="bg-white rounded-xl shadow-2xl border border-stone-200 p-4 max-w-md w-full pointer-events-auto animate-in slide-in-from-top-2 fade-in flex items-start gap-4"
        >
          <div className={`p-2 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-green-100 text-green-600' : toast.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
             {toast.type === 'success' ? <CheckCircle size={24}/> : toast.type === 'error' ? <AlertCircle size={24}/> : <Mail size={24}/>}
          </div>
          <div className="flex-1">
             <h4 className="font-bold text-stone-900 text-sm">{toast.title}</h4>
             <p className="text-stone-600 text-sm mt-1">{toast.message}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="text-stone-400 hover:text-stone-600">
             <X size={18}/>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
