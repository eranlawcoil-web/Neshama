
import React, { useState, useEffect } from 'react';
import * as mockBackend from '../services/mockBackend';
import { DeceasedProfile, VisitLog, SystemConfig } from '../types';
import { Plus, Users, LogOut, CheckCircle, ExternalLink, Search, Edit, X, Save, Lock, Unlock, CreditCard, Gift, Activity, Settings, DollarSign, Mail, Trash2, PenTool } from 'lucide-react';

interface SuperAdminDashboardProps {
  onLogout: () => void;
  onShowPrivacy?: () => void;
}

type Tab = 'sites' | 'activity' | 'settings';

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onLogout, onShowPrivacy }) => {
  const [activeTab, setActiveTab] = useState<Tab>('sites');
  
  const [profiles, setProfiles] = useState<DeceasedProfile[]>([]);
  const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);
  const [config, setConfig] = useState<SystemConfig>(mockBackend.getSystemConfig());

  // Create Client State
  const [newClientEmail, setNewClientEmail] = useState('');
  const [createdProfile, setCreatedProfile] = useState<DeceasedProfile | null>(null);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Modal State
  const [editingProfile, setEditingProfile] = useState<DeceasedProfile | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
      setProfiles(mockBackend.getProfiles());
      setVisitLogs(mockBackend.getVisitLogs());
      setConfig(mockBackend.getSystemConfig());
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientEmail) return;

    const newProfile = mockBackend.createProfileForUser(newClientEmail);
    if (newProfile) {
        setCreatedProfile(newProfile);
        refreshData();
        setNewClientEmail('');
    }
  };

  const handleSaveEdit = () => {
    if (editingProfile) {
        const saved = mockBackend.saveProfile(editingProfile);
        if (saved) {
            refreshData();
            setEditingProfile(null);
        }
    }
  };

  const handleSaveConfig = () => {
      mockBackend.saveSystemConfig(config);
      alert('הגדרות מערכת נשמרו בהצלחה');
  };

  // Filter profiles based on search term (Case Insensitive)
  const filteredProfiles = profiles.filter(p => {
      const term = searchTerm.toLowerCase();
      const nameMatch = p.fullName?.toLowerCase().includes(term);
      const emailMatch = p.email?.toLowerCase().includes(term);
      return nameMatch || emailMatch;
  });

  // --- Render Tabs ---

  const renderSitesTab = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 text-stone-800">
                <Users size={20} className="text-stone-400"/>
                ניהול אתרים ({filteredProfiles.length})
            </h2>
            
            <div className="relative w-full md:w-auto">
                <Search className="absolute right-3 top-2.5 text-stone-400" size={16} />
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="חיפוש לפי שם או מייל..."
                    className="w-full md:w-64 bg-stone-50 border border-stone-200 rounded-full py-2 pr-10 pl-4 text-sm focus:border-amber-500 outline-none transition-colors text-stone-800"
                />
            </div>
        </div>

        {/* Quick Create */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
                 <div className="bg-amber-100 p-2 rounded-full text-amber-600"><Plus size={20}/></div>
                 <span className="font-bold text-stone-800">פתיחת אתר חדש ללקוח (חינם)</span>
            </div>
            <form onSubmit={handleCreateProfile} className="flex gap-2 w-full md:w-auto">
                <input 
                    type="email"
                    value={newClientEmail}
                    onChange={e => setNewClientEmail(e.target.value)}
                    placeholder="אימייל הלקוח..."
                    className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-stone-800 focus:border-amber-500 outline-none w-full md:w-64"
                    required
                />
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2 rounded-lg transition-colors whitespace-nowrap shadow-sm">
                    צור אתר
                </button>
            </form>
        </div>
        
        {createdProfile && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-in fade-in flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 text-green-700 font-bold mb-1"><CheckCircle size={18} /> האתר נוצר בהצלחה!</div>
                    <div className="text-sm text-stone-600">שויך לכתובת: <span className="text-stone-900 font-medium">{createdProfile.email}</span></div>
                </div>
                <button onClick={() => setCreatedProfile(null)} className="text-stone-400 hover:text-stone-600"><X size={18}/></button>
            </div>
        )}

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-stone-50 text-stone-500 text-sm border-b border-stone-200">
                        <tr>
                            <th className="p-4 font-medium">שם המונצח</th>
                            <th className="p-4 font-medium">בעל האתר</th>
                            <th className="p-4 font-medium">סטטוס</th>
                            <th className="p-4 font-medium">סוג חשבון</th>
                            <th className="p-4 font-medium text-center">מוצג בקהילה</th>
                            <th className="p-4 font-medium">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {filteredProfiles.map(profile => (
                            <tr key={profile.id} className="hover:bg-stone-50 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={profile.heroImage} className="w-10 h-10 rounded-full object-cover border border-stone-200" alt="" />
                                    <div>
                                        <div className="font-bold text-stone-800">{profile.fullName}</div>
                                        <div className="text-xs text-stone-400">{new Date(profile.lastUpdated || 0).toLocaleDateString('he-IL')}</div>
                                    </div>
                                </td>
                                <td className="p-4 text-stone-500 text-sm max-w-[150px] truncate" title={profile.email}>{profile.email || '—'}</td>
                                <td className="p-4">
                                    {profile.isPublic ? (
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200 flex items-center gap-1 w-fit">
                                            <Unlock size={10} /> ציבורי
                                        </span>
                                    ) : (
                                        <span className="bg-stone-100 text-stone-500 text-xs px-2 py-1 rounded-full border border-stone-200 flex items-center gap-1 w-fit">
                                            <Lock size={10} /> פרטי
                                        </span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {profile.accountType === 'free' ? (
                                        <span className="text-amber-600 text-xs flex items-center gap-1 font-medium">
                                            <Gift size={12}/> חינם
                                        </span>
                                    ) : (
                                        <span className="text-stone-500 text-xs flex items-center gap-1">
                                            <CreditCard size={12}/> משלם
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={profile.showInCommunity || false}
                                        onChange={(e) => {
                                            const updated = { ...profile, showInCommunity: e.target.checked };
                                            mockBackend.saveProfile(updated);
                                            refreshData();
                                        }}
                                        className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                                    />
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button 
                                        onClick={() => setEditingProfile({...profile})}
                                        className="p-2 rounded bg-white hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors border border-stone-200 shadow-sm"
                                        title="ערוך הגדרות אתר"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <a 
                                        href={`?id=${profile.id}`} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="p-2 rounded bg-white hover:bg-stone-50 text-stone-400 hover:text-stone-600 transition-colors border border-stone-200 shadow-sm"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const renderActivityTab = () => (
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-in fade-in shadow-sm">
         <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center gap-2">
             <Activity size={20} className="text-amber-600"/>
             <h3 className="font-bold text-stone-800">יומן פעילות ועדכונים</h3>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-right">
                 <thead className="bg-stone-50 text-stone-500 text-sm">
                     <tr>
                         <th className="p-4">תאריך ושעה</th>
                         <th className="p-4">שם האתר</th>
                         <th className="p-4">משתמש/מבקר</th>
                         <th className="p-4">סוג פעולה</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-100">
                     {visitLogs.map(log => (
                         <tr key={log.id} className="hover:bg-stone-50">
                             <td className="p-4 text-sm text-stone-500 font-mono">
                                 {new Date(log.timestamp).toLocaleString('he-IL')}
                             </td>
                             <td className="p-4 font-bold text-stone-800">{log.profileName}</td>
                             <td className="p-4 text-sm text-amber-600">{log.visitorEmail}</td>
                             <td className="p-4">
                                 {log.actionType === 'update' && <span className="text-blue-600 text-xs px-2 py-1 bg-blue-50 border border-blue-100 rounded">עדכון תוכן</span>}
                                 {log.actionType === 'create' && <span className="text-green-600 text-xs px-2 py-1 bg-green-50 border border-green-100 rounded">יצירה חדשה</span>}
                                 {log.actionType === 'visit' && <span className="text-stone-500 text-xs px-2 py-1 bg-stone-100 border border-stone-200 rounded">ביקור באתר</span>}
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
  );

  const renderSettingsTab = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
          {/* General Settings */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 md:col-span-2 shadow-sm">
              <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                  <PenTool size={20} className="text-purple-500"/>
                  הגדרות כלליות ומיתוג
              </h3>
              
              <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-2">שם המיזם / כותרת האתר</label>
                  <input 
                    type="text"
                    value={config.projectName}
                    onChange={(e) => setConfig({...config, projectName: e.target.value})}
                    placeholder="למשל: אתר הנצחה"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 focus:border-amber-500 outline-none"
                  />
                  <p className="text-xs text-stone-400 mt-2">שם זה יופיע בכותרת העליונה, בדף הנחיתה ובקודי ה-QR.</p>
              </div>
          </div>

          {/* Pricing Management */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                  <DollarSign size={20} className="text-green-500"/>
                  ניהול מחירים
              </h3>
              
              <div className="space-y-6">
                  <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-2">מחיר מקורי (מוצג כ"מחוק")</label>
                      <div className="relative">
                          <input 
                            type="number"
                            value={config.pricing.originalPrice}
                            onChange={(e) => setConfig({...config, pricing: {...config.pricing, originalPrice: Number(e.target.value)}})}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 pl-12 text-stone-800 focus:border-amber-500 outline-none"
                          />
                          <span className="absolute left-4 top-3 text-stone-400">₪</span>
                      </div>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-2">מחיר לתשלום בפועל</label>
                      <div className="relative">
                          <input 
                            type="number"
                            value={config.pricing.currentPrice}
                            onChange={(e) => setConfig({...config, pricing: {...config.pricing, currentPrice: Number(e.target.value)}})}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 pl-12 text-stone-800 focus:border-amber-500 outline-none"
                          />
                          <span className="absolute left-4 top-3 text-stone-400">₪</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Admin Management */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
               <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                  <Settings size={20} className="text-blue-500"/>
                  מנהלי מערכת (Admins)
              </h3>

              <div className="space-y-4">
                  <div className="flex gap-2">
                      <input 
                         placeholder="הוסף אימייל של אדמין..."
                         id="newAdminEmail"
                         className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-stone-800 outline-none focus:border-blue-500"
                      />
                      <button 
                        onClick={() => {
                            const input = document.getElementById('newAdminEmail') as HTMLInputElement;
                            if(input.value && input.value.includes('@')) {
                                setConfig({...config, superAdminEmails: [...config.superAdminEmails, input.value]});
                                input.value = '';
                            }
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl"
                      >
                          <Plus />
                      </button>
                  </div>
                  
                  <div className="bg-stone-50 rounded-xl border border-stone-200 p-2 space-y-2">
                      {config.superAdminEmails.map(email => (
                          <div key={email} className="flex justify-between items-center bg-white border border-stone-100 p-3 rounded-lg shadow-sm">
                              <span className="text-sm font-mono text-stone-600">{email}</span>
                              {config.superAdminEmails.length > 1 && (
                                  <button 
                                    onClick={() => setConfig({...config, superAdminEmails: config.superAdminEmails.filter(e => e !== email)})}
                                    className="text-stone-400 hover:text-red-500"
                                  >
                                      <Trash2 size={16} />
                                  </button>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
          
          <div className="md:col-span-2">
              <button 
                onClick={handleSaveConfig}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                  <Save size={20} />
                  שמור הגדרות מערכת
              </button>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-8 font-sans flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-grow">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-8 border-b border-stone-200 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif-hebrew font-bold text-amber-600 mb-2">ניהול מערכת - {config.projectName}</h1>
                    <p className="text-stone-500">ברוך הבא לממשק הניהול הראשי</p>
                </div>
                <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 bg-white hover:bg-stone-100 text-stone-700 px-4 py-2 rounded-lg transition-colors border border-stone-200 shadow-sm"
                >
                    <LogOut size={18} /> התנתק
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-8 border-b border-stone-200 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('sites')}
                    className={`pb-4 px-4 font-bold transition-colors whitespace-nowrap ${activeTab === 'sites' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-stone-800'}`}
                >
                    אתרים ומשתמשים
                </button>
                <button 
                    onClick={() => setActiveTab('activity')}
                    className={`pb-4 px-4 font-bold transition-colors whitespace-nowrap ${activeTab === 'activity' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-stone-800'}`}
                >
                    יומן עדכונים וביקורים
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`pb-4 px-4 font-bold transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-stone-800'}`}
                >
                    הגדרות מערכת ותשלומים
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'sites' && renderSitesTab()}
            {activeTab === 'activity' && renderActivityTab()}
            {activeTab === 'settings' && renderSettingsTab()}

            {/* Edit Profile Modal (Shared) */}
            {editingProfile && (
                <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg border border-stone-200 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                            <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                <Edit size={20} className="text-amber-600"/>
                                עריכת הגדרות אתר
                            </h3>
                            <button onClick={() => setEditingProfile(null)} className="text-stone-400 hover:text-stone-700">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                                <img src={editingProfile.heroImage} className="w-12 h-12 rounded-full object-cover" alt="" />
                                <div>
                                    <div className="font-bold text-stone-800 text-lg">{editingProfile.fullName}</div>
                                    <div className="text-xs text-stone-500">ID: {editingProfile.id}</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2">בעל האתר (אימייל)</label>
                                <input 
                                    type="email" 
                                    value={editingProfile.email}
                                    onChange={e => setEditingProfile({...editingProfile, email: e.target.value})}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-stone-800 focus:border-amber-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-3">סוג חשבון</label>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => setEditingProfile({...editingProfile, accountType: 'standard'})}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${editingProfile.accountType !== 'free' ? 'bg-amber-600 text-white' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-100'}`}
                                        >
                                            <CreditCard size={14}/> משלם (רגיל)
                                        </button>
                                        <button 
                                            onClick={() => setEditingProfile({...editingProfile, accountType: 'free'})}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${editingProfile.accountType === 'free' ? 'bg-amber-600 text-white' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-100'}`}
                                        >
                                            <Gift size={14}/> חינם (VIP)
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-3">סטטוס אתר</label>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => setEditingProfile({...editingProfile, isPublic: true})}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${editingProfile.isPublic ? 'bg-green-600 text-white' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-100'}`}
                                        >
                                            <Unlock size={14}/> ציבורי
                                        </button>
                                        <button 
                                            onClick={() => setEditingProfile({...editingProfile, isPublic: false})}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${!editingProfile.isPublic ? 'bg-stone-600 text-white' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-100'}`}
                                        >
                                            <Lock size={14}/> פרטי (טיוטה)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-stone-200 flex gap-3">
                            <button onClick={() => setEditingProfile(null)} className="flex-1 py-3 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold transition-colors">
                                ביטול
                            </button>
                            <button onClick={handleSaveEdit} className="flex-1 py-3 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-bold shadow-lg transition-colors flex items-center justify-center gap-2">
                                <Save size={18}/> שמור שינויים
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-sm border-t border-stone-200 text-stone-500">
            <button 
                onClick={onShowPrivacy}
                className="hover:text-stone-800 transition-colors underline decoration-stone-300 hover:decoration-stone-800"
            >
                תנאי שימוש ומדיניות פרטיות
            </button>
        </footer>
    </div>
  );
};

export default SuperAdminDashboard;
