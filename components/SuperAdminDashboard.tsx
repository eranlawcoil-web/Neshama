

import React, { useState, useEffect } from 'react';
import * as mockBackend from '../services/mockBackend';
import { DeceasedProfile, VisitLog } from '../types';
import { Plus, Users, LogOut, CheckCircle, ExternalLink, Search, Edit, X, Save, Lock, Unlock, CreditCard, Gift, Activity, Calendar } from 'lucide-react';

interface SuperAdminDashboardProps {
  onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onLogout }) => {
  const [profiles, setProfiles] = useState<DeceasedProfile[]>([]);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [createdProfile, setCreatedProfile] = useState<DeceasedProfile | null>(null);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Modal State
  const [editingProfile, setEditingProfile] = useState<DeceasedProfile | null>(null);

  // Visit Logs
  const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);

  useEffect(() => {
    setProfiles(mockBackend.getProfiles());
    setVisitLogs(mockBackend.getVisitLogs());
  }, []);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientEmail) return;

    const newProfile = mockBackend.createProfileForUser(newClientEmail);
    if (newProfile) {
        setCreatedProfile(newProfile);
        setProfiles(mockBackend.getProfiles());
        setNewClientEmail('');
    }
  };

  const handleSaveEdit = () => {
    if (editingProfile) {
        const saved = mockBackend.saveProfile(editingProfile);
        if (saved) {
            setProfiles(mockBackend.getProfiles());
            setEditingProfile(null);
        }
    }
  };

  const filteredProfiles = profiles.filter(p => 
      p.fullName.includes(searchTerm) || 
      p.email?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 p-8 font-sans">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b border-stone-800 pb-8">
                <div>
                    <h1 className="text-4xl font-serif-hebrew font-bold text-amber-500 mb-2">ניהול שיווק - אתר הנצחה</h1>
                    <p className="text-stone-400">ברוך הבא, מנהל מערכת ראשי</p>
                </div>
                <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 px-4 py-2 rounded-lg transition-colors"
                >
                    <LogOut size={18} /> התנתק
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Create Profile & Recent Activity */}
                <div className="space-y-8">
                     {/* Create New Client Section */}
                    <div className="bg-stone-900 rounded-2xl p-8 border border-stone-800 shadow-xl h-fit">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-amber-500/10 p-3 rounded-full text-amber-500">
                                <Plus size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white">הקמת אתר ללקוח</h2>
                        </div>
                        
                        <form onSubmit={handleCreateProfile} className="space-y-4">
                            <div>
                                <label className="text-xs text-stone-500 block mb-2 font-bold">אימייל הלקוח (בעל האתר)</label>
                                <input 
                                    type="email"
                                    value={newClientEmail}
                                    onChange={e => setNewClientEmail(e.target.value)}
                                    placeholder="client@example.com"
                                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
                                פתח אתר חדש ללא עלות
                            </button>
                        </form>

                        {createdProfile && (
                            <div className="mt-6 bg-green-900/20 border border-green-800 rounded-xl p-4 animate-in fade-in">
                                <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                                    <CheckCircle size={18} />
                                    האתר נוצר בהצלחה!
                                </div>
                                <p className="text-sm text-stone-400 mb-2">
                                    שויך לכתובת: <span className="text-white">{createdProfile.email}</span>
                                </p>
                                <div className="text-xs text-stone-500 bg-black/30 p-2 rounded break-all">
                                    ID: {createdProfile.id}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recent Activity Log */}
                    <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800 shadow-xl overflow-hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity size={20} className="text-stone-500"/>
                            <h2 className="text-lg font-bold text-white">פעילות אחרונה</h2>
                        </div>
                        <div className="overflow-y-auto max-h-[400px] custom-scrollbar space-y-3">
                             {visitLogs.map(log => (
                                 <div key={log.id} className="text-sm border-b border-stone-800 pb-2 last:border-0 last:pb-0">
                                     <div className="flex justify-between items-start">
                                         <span className="font-bold text-stone-300">{log.profileName}</span>
                                         <span className="text-xs text-stone-500 font-mono">
                                             {new Date(log.timestamp).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}
                                         </span>
                                     </div>
                                     <div className="flex justify-between mt-1 text-xs text-stone-500">
                                         <span>מבקר: {log.visitorEmail}</span>
                                         <span>{new Date(log.timestamp).toLocaleDateString('he-IL')}</span>
                                     </div>
                                 </div>
                             ))}
                             {visitLogs.length === 0 && (
                                 <p className="text-stone-600 text-sm text-center py-4">אין פעילות רשומה</p>
                             )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Profiles List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Users size={20} className="text-stone-500"/>
                            כל האתרים במערכת ({filteredProfiles.length})
                        </h2>
                        
                        {/* Search Bar */}
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute right-3 top-2.5 text-stone-500" size={16} />
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="חיפוש לפי שם או מייל..."
                                className="w-full md:w-64 bg-stone-900 border border-stone-800 rounded-full py-2 pr-10 pl-4 text-sm focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-stone-950 text-stone-500 text-sm">
                                    <tr>
                                        <th className="p-4 font-medium">שם הנפטר</th>
                                        <th className="p-4 font-medium">בעל האתר</th>
                                        <th className="p-4 font-medium">סטטוס</th>
                                        <th className="p-4 font-medium">סוג חשבון</th>
                                        <th className="p-4 font-medium">פעולות</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-800">
                                    {filteredProfiles.map(profile => (
                                        <tr key={profile.id} className="hover:bg-stone-800/50 transition-colors">
                                            <td className="p-4 flex items-center gap-3">
                                                <img src={profile.heroImage} className="w-8 h-8 rounded-full object-cover" alt="" />
                                                <span className="font-bold text-white">{profile.fullName}</span>
                                            </td>
                                            <td className="p-4 text-stone-400 text-sm max-w-[150px] truncate" title={profile.email}>{profile.email || '—'}</td>
                                            <td className="p-4">
                                                {profile.isPublic ? (
                                                    <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full border border-green-800 flex items-center gap-1 w-fit">
                                                        <Unlock size={10} /> ציבורי
                                                    </span>
                                                ) : (
                                                    <span className="bg-stone-800 text-stone-400 text-xs px-2 py-1 rounded-full border border-stone-700 flex items-center gap-1 w-fit">
                                                        <Lock size={10} /> פרטי
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {profile.accountType === 'free' ? (
                                                    <span className="text-amber-400 text-xs flex items-center gap-1">
                                                        <Gift size={12}/> חינם
                                                    </span>
                                                ) : (
                                                    <span className="text-stone-400 text-xs flex items-center gap-1">
                                                        <CreditCard size={12}/> משלם
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 flex gap-2">
                                                <button 
                                                    onClick={() => setEditingProfile({...profile})}
                                                    className="p-2 rounded bg-stone-800 hover:bg-amber-600 text-stone-400 hover:text-white transition-colors"
                                                    title="ערוך הגדרות אתר"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                {profile.isPublic && (
                                                     <a href={`?id=${profile.id}`} target="_blank" rel="noreferrer" className="p-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors">
                                                        <ExternalLink size={16} />
                                                     </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProfiles.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-stone-500">
                                                לא נמצאו אתרים תואמים לחיפוש
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingProfile && (
                <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-stone-900 rounded-2xl w-full max-w-lg border border-stone-700 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-stone-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Edit size={20} className="text-amber-500"/>
                                עריכת הגדרות אתר
                            </h3>
                            <button onClick={() => setEditingProfile(null)} className="text-stone-500 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                                <img src={editingProfile.heroImage} className="w-12 h-12 rounded-full object-cover" alt="" />
                                <div>
                                    <div className="font-bold text-white text-lg">{editingProfile.fullName}</div>
                                    <div className="text-xs text-stone-500">ID: {editingProfile.id}</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2">בעל האתר (אימייל)</label>
                                <input 
                                    type="email" 
                                    value={editingProfile.email}
                                    onChange={e => setEditingProfile({...editingProfile, email: e.target.value})}
                                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-stone-950 rounded-xl border border-stone-800">
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-3">סוג חשבון</label>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => setEditingProfile({...editingProfile, accountType: 'standard'})}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${editingProfile.accountType !== 'free' ? 'bg-amber-600 text-white' : 'bg-stone-900 text-stone-400 hover:bg-stone-800'}`}
                                        >
                                            <CreditCard size={14}/> משלם (רגיל)
                                        </button>
                                        <button 
                                            onClick={() => setEditingProfile({...editingProfile, accountType: 'free'})}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${editingProfile.accountType === 'free' ? 'bg-amber-600 text-white' : 'bg-stone-900 text-stone-400 hover:bg-stone-800'}`}
                                        >
                                            <Gift size={14}/> חינם (VIP)
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-stone-950 rounded-xl border border-stone-800">
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-3">סטטוס אתר</label>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => setEditingProfile({...editingProfile, isPublic: true})}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${editingProfile.isPublic ? 'bg-green-600 text-white' : 'bg-stone-900 text-stone-400 hover:bg-stone-800'}`}
                                        >
                                            <Unlock size={14}/> ציבורי
                                        </button>
                                        <button 
                                            onClick={() => setEditingProfile({...editingProfile, isPublic: false})}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${!editingProfile.isPublic ? 'bg-stone-700 text-white' : 'bg-stone-900 text-stone-400 hover:bg-stone-800'}`}
                                        >
                                            <Lock size={14}/> פרטי (טיוטה)
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {editingProfile.accountType === 'standard' && !editingProfile.isPublic && (
                                <p className="text-xs text-amber-500 bg-amber-900/20 p-2 rounded">
                                    * במידה ותשמור כ"פרטי" ו"משלם", המשתמש יתבקש לשלם בכניסה הבאה כדי לפרסם.
                                </p>
                            )}
                        </div>

                        <div className="p-6 border-t border-stone-800 flex gap-3">
                            <button onClick={() => setEditingProfile(null)} className="flex-1 py-3 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 font-bold transition-colors">
                                ביטול
                            </button>
                            <button onClick={handleSaveEdit} className="flex-1 py-3 rounded-xl bg-amber-600 text-white hover:bg-amber-500 font-bold shadow-lg transition-colors flex items-center justify-center gap-2">
                                <Save size={18}/> שמור שינויים
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default SuperAdminDashboard;