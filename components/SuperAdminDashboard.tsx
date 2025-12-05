
import React, { useState } from 'react';
import * as mockBackend from '../services/mockBackend';
import { DeceasedProfile } from '../types';
import { Plus, Users, LogOut, CheckCircle, ExternalLink, Shield } from 'lucide-react';

interface SuperAdminDashboardProps {
  onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onLogout }) => {
  const [profiles, setProfiles] = useState<DeceasedProfile[]>(mockBackend.getProfiles());
  const [newClientEmail, setNewClientEmail] = useState('');
  const [createdProfile, setCreatedProfile] = useState<DeceasedProfile | null>(null);

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

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 p-8 font-sans">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b border-stone-800 pb-8">
                <div>
                    <h1 className="text-4xl font-serif-hebrew font-bold text-amber-500 mb-2">ניהול שיווק - עץ החיים</h1>
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

                {/* Profiles List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Users size={20} className="text-stone-500"/>
                        כל האתרים במערכת ({profiles.length})
                    </h2>

                    <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-stone-950 text-stone-500 text-sm">
                                    <tr>
                                        <th className="p-4 font-medium">שם הנפטר</th>
                                        <th className="p-4 font-medium">בעל האתר</th>
                                        <th className="p-4 font-medium">סטטוס</th>
                                        <th className="p-4 font-medium">פעולות</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-800">
                                    {profiles.map(profile => (
                                        <tr key={profile.id} className="hover:bg-stone-800/50 transition-colors">
                                            <td className="p-4 flex items-center gap-3">
                                                <img src={profile.heroImage} className="w-8 h-8 rounded-full object-cover" alt="" />
                                                <span className="font-bold text-white">{profile.fullName}</span>
                                            </td>
                                            <td className="p-4 text-stone-400 text-sm">{profile.email || '—'}</td>
                                            <td className="p-4">
                                                {profile.isPublic ? (
                                                    <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full border border-green-800">ציבורי</span>
                                                ) : (
                                                    <span className="bg-amber-900/30 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-800">טיוטה</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {profile.isPublic ? (
                                                     <a href={`?id=${profile.id}`} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-white">
                                                        <ExternalLink size={16} />
                                                     </a>
                                                ) : (
                                                    <span className="text-stone-600 text-xs cursor-not-allowed">לא פורסם</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SuperAdminDashboard;
