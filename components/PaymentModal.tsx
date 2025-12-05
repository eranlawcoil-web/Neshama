

import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock } from 'lucide-react';

interface PaymentModalProps {
  profileName: string;
  onSuccess: () => void;
  onCancel: () => void;
  price?: number;
  originalPrice?: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ profileName, onSuccess, onCancel, price = 150, originalPrice = 300 }) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Payment Processing
    setTimeout(() => {
        setLoading(false);
        onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300">
       <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
          <div className="bg-amber-50 p-6 border-b border-amber-100 text-center">
             <h2 className="text-2xl font-serif-hebrew font-bold text-amber-900 mb-1">הפצת אתר הנצחה</h2>
             <p className="text-amber-700/80 text-sm">עבור {profileName}</p>
          </div>

          <div className="p-8">
             <div className="flex justify-between items-center mb-8 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                    <span className="block text-stone-500 text-xs mb-1">מנוי שנתי מתחדש</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-stone-800 font-bold text-lg">₪{price}</span>
                        {originalPrice > price && (
                             <span className="text-stone-400 text-sm line-through decoration-red-400 decoration-2">₪{originalPrice}</span>
                        )}
                        <span className="text-sm font-normal text-stone-400">/ שנה</span>
                    </div>
                </div>
                <div className="bg-white p-2 rounded-full shadow-sm">
                    <ShieldCheck className="text-green-500" size={24}/>
                </div>
             </div>

             <form onSubmit={handlePayment} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1 block">מספר כרטיס אשראי</label>
                    <div className="relative">
                        <CreditCard className="absolute right-3 top-3 text-stone-400" size={18}/>
                        <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000" 
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            maxLength={19}
                            className="w-full border border-stone-300 rounded-lg py-2.5 pr-10 pl-3 focus:ring-2 focus:ring-amber-500 outline-none dir-ltr"
                            required
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1 block">תוקף</label>
                        <input 
                            type="text" 
                            placeholder="MM/YY" 
                            value={expiry}
                            onChange={e => setExpiry(e.target.value)}
                            maxLength={5}
                            className="w-full border border-stone-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-amber-500 outline-none text-center dir-ltr"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1 block">CVC</label>
                        <input 
                            type="text" 
                            placeholder="123" 
                            value={cvc}
                            onChange={e => setCvc(e.target.value)}
                            maxLength={3}
                            className="w-full border border-stone-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-amber-500 outline-none text-center dir-ltr"
                            required
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        {loading ? 'מעבד תשלום...' : (
                            <>
                             <Lock size={16} /> בצע תשלום ופרסם אתר
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-stone-400 mt-3 flex items-center justify-center gap-1">
                        <Lock size={10} /> תשלום מאובטח בתקן SSL
                    </p>
                </div>
             </form>
          </div>
          
          <button onClick={onCancel} className="absolute top-4 left-4 text-stone-400 hover:text-stone-600">ביטול</button>
       </div>
    </div>
  );
};

export default PaymentModal;