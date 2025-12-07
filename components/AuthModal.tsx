

import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Loader2, Check, X, RefreshCw, Terminal } from 'lucide-react';
import { verifyCode, sendVerificationCode } from '../services/mockBackend';

interface AuthModalProps {
  onSuccess: (email: string) => void;
  onCancel: () => void;
  isSavingDraft: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onCancel, isSavingDraft }) => {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Resend Timer State
  const [resendTimer, setResendTimer] = useState(0);

  // Handle countdown
  useEffect(() => {
      let interval: any;
      if (resendTimer > 0) {
          interval = setInterval(() => {
              setResendTimer(prev => prev - 1);
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.includes('@')) {
        setError('נא להזין כתובת אימייל תקינה');
        return;
    }
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
        setLoading(false);
        // Call backend - this will log the code to CONSOLE but not return it here
        sendVerificationCode(email);
        
        setStep('code');
        setResendTimer(60); // Start 60s cooldown
    }, 1500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        if (verifyCode(email, code)) {
            onSuccess(email);
        } else {
            setLoading(false);
            setError('קוד שגוי. אנא בדוק את הקוד שנשלח למייל ונסה שנית.');
        }
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
      
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl overflow-hidden z-[65]">
        <button onClick={onCancel} className="absolute top-4 left-4 text-gray-400 hover:text-gray-800 transition-colors">✕</button>
        
        <div className="text-center mb-8">
            <h2 className="text-3xl font-serif-hebrew font-bold text-stone-800 mb-2">
                {isSavingDraft ? 'שמירת אתר הנצחה' : 'התחברות לניהול'}
            </h2>
            <p className="text-stone-500 text-sm">
                {isSavingDraft 
                    ? 'כדי לשמור את העריכה שביצעת, אנא הזן כתובת מייל לאימות.'
                    : 'הזן את המייל איתו נרשמת למערכת כדי לערוך'
                }
            </p>
        </div>

        {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
                <div className="relative">
                    <Mail className="absolute right-4 top-3.5 text-stone-400" size={20} />
                    <input 
                        type="email" 
                        value={email}
                        onChange={e => {setEmail(e.target.value); setError('');}}
                        placeholder="כתובת אימייל"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-right"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <>שלח קוד אימות <ArrowRight size={18}/></>}
                </button>
            </form>
        ) : (
            <form onSubmit={handleVerify} className="space-y-4 animate-in slide-in-from-right duration-300">
                 <div className="text-center mb-4">
                    <div className="inline-flex flex-col items-center gap-2 bg-amber-50 text-amber-900 px-4 py-3 rounded-lg text-sm font-medium border border-amber-100">
                        <div className="flex items-center gap-2">
                            <Mail size={16}/>
                            <span>קוד נשלח לכתובת: <span className="font-bold dir-ltr">{email}</span></span>
                        </div>
                        <div className="text-[10px] text-stone-500 opacity-75 flex items-center gap-1">
                            <Terminal size={10} />
                            (בדמו זה: בדוק את ה-Console בדפדפן - F12)
                        </div>
                    </div>
                 </div>
                 
                 <div className="relative">
                    <input 
                        type="text" 
                        value={code}
                        onChange={e => {
                            // Only allow numbers
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length <= 4) {
                                setCode(val);
                                setError('');
                            }
                        }}
                        placeholder="0000"
                        maxLength={4}
                        dir="ltr"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl py-4 text-center text-3xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder-stone-300 text-stone-900"
                        required
                        autoFocus
                    />
                    <div className="absolute inset-0 pointer-events-none flex justify-center items-center gap-[0.55em] opacity-20">
                        <span>_</span><span>_</span><span>_</span><span>_</span>
                    </div>
                </div>

                {error && <p className="text-red-500 text-xs text-center font-bold bg-red-50 py-1 rounded">{error}</p>}
                
                <button 
                    type="submit" 
                    disabled={loading || code.length < 4}
                    className="w-full bg-stone-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <>אמת והכנס <Check size={18}/></>}
                </button>
                
                <div className="flex justify-between items-center mt-4 px-2 pt-2 border-t border-stone-100">
                    <button type="button" onClick={() => setStep('email')} className="text-stone-400 text-xs hover:text-stone-600 transition-colors">
                        החלף כתובת מייל
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => handleSendCode()} 
                        disabled={resendTimer > 0}
                        className={`text-xs font-bold transition-colors flex items-center gap-1 ${resendTimer > 0 ? 'text-stone-300 cursor-not-allowed' : 'text-amber-600 hover:text-amber-700'}`}
                    >
                        {resendTimer > 0 ? (
                            <span>שלח שוב בעוד {resendTimer} שניות</span>
                        ) : (
                            <>
                                <RefreshCw size={12} /> שלח קוד שוב
                            </>
                        )}
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
