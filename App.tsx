
import React, { useState, useEffect } from 'react';
import { DeceasedProfile, Memory } from './types';
import * as mockBackend from './services/mockBackend';
import Timeline from './components/Timeline';
import Hero from './components/Hero';
import MemoryForm from './components/MemoryForm';
import StoryViewer from './components/StoryViewer';
import RelatedProfiles from './components/RelatedProfiles';
import { LogIn, LogOut, Plus } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [profile, setProfile] = useState<DeceasedProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [showStory, setShowStory] = useState(false);

  // Initialize
  useEffect(() => {
    // Load the first profile for demo purposes
    const profiles = mockBackend.getProfiles();
    if (profiles.length > 0) {
      setProfile(profiles[0]);
    }

    // Check auth
    const user = mockBackend.getCurrentUserEmail();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (mockBackend.loginMock(authEmail)) {
      setCurrentUser(authEmail);
      setShowAuthModal(false);
      setAuthEmail('');
    } else {
      alert('משתמש לא נמצא. נסה: admin@demo.com');
    }
  };

  const handleLogout = () => {
    mockBackend.logoutMock();
    setCurrentUser(null);
  };

  const handleUpdateProfile = (updated: Partial<DeceasedProfile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updated };
    const success = mockBackend.saveProfile(newProfile);
    if (success) {
        setProfile(newProfile);
    } else {
        alert('שגיאה בשמירת הנתונים. ייתכן והתמונה גדולה מדי לאחסון המקומי.');
    }
  };

  const handleAddMemory = (memoryData: Omit<Memory, 'id' | 'createdAt'>) => {
    if (!profile) return;
    
    const newMemory: Memory = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      ...memoryData
    };

    const updatedProfile = {
      ...profile,
      memories: [...profile.memories, newMemory]
    };

    const success = mockBackend.saveProfile(updatedProfile);
    if (success) {
        setProfile(updatedProfile);
        setShowMemoryForm(false);
    } else {
        alert('שגיאה בשמירת הזיכרון. ייתכן והקובץ המצורף גדול מדי.');
    }
  };

  const handleEditMemory = (memoryData: Omit<Memory, 'id' | 'createdAt'>) => {
    if (!profile || !editingMemory) return;

    const updatedMemories = profile.memories.map(m => 
      m.id === editingMemory.id ? { ...m, ...memoryData } : m
    );

    const updatedProfile = { ...profile, memories: updatedMemories };
    const success = mockBackend.saveProfile(updatedProfile);
    if (success) {
        setProfile(updatedProfile);
        setEditingMemory(null);
    } else {
        alert('שגיאה בשמירת השינויים.');
    }
  };

  const handleDeleteMemory = (id: string) => {
    if (!profile) return;
    if (!window.confirm('האם למחוק זיכרון זה?')) return;
    
    const updatedProfile = {
      ...profile,
      memories: profile.memories.filter(m => m.id !== id)
    };
    
    const success = mockBackend.saveProfile(updatedProfile);
    if (success) {
        setProfile(updatedProfile);
    }
  };

  if (!profile) return <div className="flex h-screen items-center justify-center">טוען...</div>;

  const isAdmin = currentUser === profile.email;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      
      {/* Navbar / Header Controls */}
      <nav className="fixed top-0 w-full z-40 bg-white/10 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex justify-between items-center transition-all hover:bg-white/90 hover:shadow-md group">
        <div className="text-xl font-bold font-serif-hebrew text-amber-600 opacity-80 group-hover:opacity-100">
          נשמה
        </div>
        <div>
          {currentUser ? (
             <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
              <span>התנתק (מנהל)</span>
            </button>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-amber-600 transition-colors"
            >
              <LogIn size={18} />
              <span>כניסת מנהל</span>
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <Hero 
        profile={profile} 
        isAdmin={isAdmin} 
        onUpdateProfile={handleUpdateProfile}
        onPlayStory={() => setShowStory(true)}
      />

      {/* Main Content - Timeline */}
      <main className="pb-8 relative">
        <div className="text-center mt-12 mb-8 px-4">
           <h2 className="text-3xl font-serif-hebrew text-stone-800">עץ החיים</h2>
           <p className="text-stone-500 mt-2">מסע בזמן דרך רגעים, תמונות וזכרונות</p>
        </div>

        <Timeline 
          memories={profile.memories} 
          isAdmin={isAdmin} 
          onDelete={handleDeleteMemory}
          onEdit={(m) => setEditingMemory(m)}
        />
      </main>

      {/* Footer / Related Profiles */}
      {profile.familyMembers && profile.familyMembers.length > 0 && (
        <RelatedProfiles relatedPeople={profile.familyMembers} />
      )}

      {/* Floating Action Button for adding memories */}
      <button
        onClick={() => setShowMemoryForm(true)}
        className="fixed bottom-8 left-8 bg-amber-600 text-white p-4 rounded-full shadow-2xl hover:bg-amber-700 transition-all hover:scale-110 z-30 flex items-center justify-center group"
        title="הוסף זיכרון"
      >
        <Plus size={32} />
        <span className="absolute left-full ml-2 bg-stone-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          הוסף זיכרון
        </span>
      </button>

      {/* Modals */}
      {(showMemoryForm || editingMemory) && (
        <MemoryForm
          isAdmin={isAdmin}
          initialData={editingMemory || undefined}
          onCancel={() => {
            setShowMemoryForm(false);
            setEditingMemory(null);
          }}
          onSubmit={editingMemory ? handleEditMemory : handleAddMemory}
        />
      )}

      {showStory && (
        <StoryViewer 
          profile={profile}
          memories={[...profile.memories].sort((a,b) => a.year - b.year)} 
          onClose={() => setShowStory(false)} 
        />
      )}

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-amber-700">כניסת מנהל דף</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">דואר אלקטרוני</label>
                <input 
                  type="email" 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-amber-500 focus:border-amber-500"
                  placeholder="admin@demo.com"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition-colors"
              >
                התחבר
              </button>
            </form>
            <p className="mt-4 text-xs text-center text-gray-500">
              * לצורך ההדגמה השתמש בכתובת: admin@demo.com
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
