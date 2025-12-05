

import React, { useState, useEffect } from 'react';
import { DeceasedProfile, Memory } from './types';
import * as mockBackend from './services/mockBackend';
import Timeline from './components/Timeline';
import Hero from './components/Hero';
import MemoryForm from './components/MemoryForm';
import StoryViewer from './components/StoryViewer';
import RelatedProfiles from './components/RelatedProfiles';
import Landing from './components/Landing';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import { LogIn, LogOut, Plus, ShieldAlert, ShoppingCart, Eye, ArrowRight, Settings } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'landing' | 'profile' | 'superAdmin'>('landing');

  // Data State
  const [profile, setProfile] = useState<DeceasedProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'save'>('login');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [showStory, setShowStory] = useState(false);

  // Initialize
  useEffect(() => {
    const user = mockBackend.getCurrentUserEmail();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleStartCreate = () => {
    // Create a new draft profile in memory
    const draft = mockBackend.createNewDraft();
    setProfile(draft);
    setView('profile');
  };

  const handleSelectProfile = (id: string) => {
    try {
        const selected = mockBackend.getProfileById(id);
        if (selected) {
            setProfile(selected);
            setView('profile');
        } else {
            console.error("Profile not found");
        }
    } catch (e) {
        console.error("Error selecting profile", e);
    }
  };

  const handleAuthSuccess = (email: string) => {
    mockBackend.loginMock(email);
    setCurrentUser(email);
    setShowAuthModal(false);

    if (mockBackend.isSuperAdmin(email)) {
        setView('superAdmin');
        return;
    }

    if (authMode === 'save' && profile) {
        // We were trying to save a draft. Now we associate it with the user.
        const updatedProfile = { ...profile, email: email, isDraft: false };
        const savedProfile = mockBackend.saveProfile(updatedProfile);
        if (savedProfile) {
            setProfile(savedProfile);
            alert('האתר נשמר בהצלחה כטיוטה בחשבונך.');
        }
    } else if (authMode === 'login') {
        // If we are currently viewing a profile, and I log in as the owner, 
        // I want to stay on this profile but gain Admin rights.
        if (profile && profile.email === email) {
            // Force refresh of isAdmin calculation
            setCurrentUser(email);
            // We are already on the correct profile, just stay there.
        } else {
            // Just logged in generally. Try to load their personal profile if exists
            const allProfiles = mockBackend.getProfiles();
            const userProfile = allProfiles.find(p => p.email === email);
            if (userProfile) {
                setProfile(userProfile);
                setView('profile');
            } else {
                 // If the user doesn't have a profile and wasn't viewing one they own
                 if (!profile) {
                     const confirmCreate = window.confirm('לא נמצא אתר קיים למשתמש זה. האם ברצונך ליצור אתר חדש?');
                     if (confirmCreate) {
                         handleStartCreate();
                     }
                 }
            }
        }
    }
  };

  const handleUpdateProfile = (updated: Partial<DeceasedProfile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updated };
    
    // If it's a temp draft and user hasn't logged in yet, just update local state
    if (!currentUser) {
        setProfile(newProfile);
        return;
    }

    const savedProfile = mockBackend.saveProfile(newProfile);
    if (savedProfile) {
        setProfile(savedProfile); // Use the returned profile to get auto-generated milestones
    } else {
        alert('שגיאה בשמירת הנתונים. ייתכן והקובץ גדול מדי.');
    }
  };

  // Wrapper to prompt auth if saving for the first time
  const handleSaveRequest = () => {
      if (!currentUser) {
          setAuthMode('save');
          setShowAuthModal(true);
      } else {
          handleUpdateProfile({}); // Trigger save with current state
          alert('כל השינויים נשמרו בהצלחה.');
      }
  };

  const handlePaymentSuccess = () => {
      if (!profile) return;
      const updatedProfile = { ...profile, isPublic: true };
      const saved = mockBackend.saveProfile(updatedProfile);
      if (saved) setProfile(saved);
      setShowPaymentModal(false);
      alert('תודה רבה! האתר פורסם בהצלחה וכעת הוא זמין לכולם.');
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
      memories: [...(profile.memories || []), newMemory]
    };
    
    setProfile(updatedProfile);
    if (currentUser) {
        mockBackend.saveProfile(updatedProfile);
    }
    setShowMemoryForm(false);
  };

  const handleEditMemory = (memoryData: Omit<Memory, 'id' | 'createdAt'>) => {
    if (!profile || !editingMemory) return;

    const updatedMemories = profile.memories.map(m => 
      m.id === editingMemory.id ? { ...m, ...memoryData } : m
    );

    const updatedProfile = { ...profile, memories: updatedMemories };
    setProfile(updatedProfile);
    if (currentUser) {
        mockBackend.saveProfile(updatedProfile);
    }
    setEditingMemory(null);
  };

  const handleDeleteMemory = (id: string) => {
    if (!profile) return;
    if (!window.confirm('האם למחוק זיכרון זה?')) return;
    
    const updatedProfile = {
      ...profile,
      memories: profile.memories.filter(m => m.id !== id)
    };
    
    setProfile(updatedProfile);
    if (currentUser) {
        mockBackend.saveProfile(updatedProfile);
    }
  };

  // ---------------- RENDER ----------------

  if (view === 'superAdmin') {
      return (
          <SuperAdminDashboard 
            onLogout={() => {
                mockBackend.logoutMock();
                setCurrentUser(null);
                setView('landing');
            }}
          />
      );
  }

  if (view === 'landing') {
      return (
          <Landing 
            profiles={mockBackend.getProfiles().filter(p => p.isPublic)} 
            onCreate={handleStartCreate}
            onSelectProfile={handleSelectProfile}
            onLogin={() => {
                setAuthMode('login');
                setShowAuthModal(true);
            }}
          />
      );
  }

  if (!profile) return <div className="h-screen flex items-center justify-center bg-stone-900 text-amber-500">טוען נתונים...</div>;

  // Admin logic: 
  const isAdmin = (currentUser && currentUser === profile.email) || (profile.isDraft === true && !profile.email);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-white/10 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center transition-all hover:bg-white/95 hover:shadow-md group">
        <div className="flex items-center gap-4">
             {/* Back to Home Button */}
             <button 
                onClick={() => setView('landing')} 
                className="flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors bg-white/50 px-3 py-1.5 rounded-full hover:bg-white"
             >
                <ArrowRight size={18} />
                <span className="font-bold text-sm">חזרה לעץ החיים</span>
             </button>

             {/* Site Name (Hidden on small screens if back button is present) */}
             <div className="hidden md:block text-xl font-bold font-serif-hebrew text-amber-600 opacity-80">
                {profile.fullName}
             </div>

            {!profile.isPublic && (
                <span className="bg-stone-200 text-stone-600 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                    <Eye size={12}/> טיוטה
                </span>
            )}
        </div>
       
        <div className="flex items-center gap-3">
          {currentUser ? (
             <div className="flex items-center gap-3">
                 {/* Show user email briefly or icon */}
                 <span className="text-xs text-stone-400 hidden md:inline">{currentUser}</span>
                 <button 
                  onClick={() => {
                      mockBackend.logoutMock();
                      setCurrentUser(null);
                      setView('landing');
                  }}
                  className="flex items-center gap-2 text-sm text-stone-600 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">התנתק</span>
                </button>
             </div>
          ) : (
             <div className="flex items-center gap-2">
                 <button 
                  onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                  }}
                  className="bg-stone-800 text-white text-xs md:text-sm px-3 py-2 rounded-lg hover:bg-black transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Settings size={14} />
                  <span>ניהול הנצחה</span>
                </button>
             </div>
          )}

          {!currentUser && (
              <button 
                onClick={handleSaveRequest}
                className="bg-amber-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                  שמור טיוטה
              </button>
          )}
        </div>
      </nav>

      {/* Trial / Payment Banner */}
      {isAdmin && !profile.isPublic && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-900 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t-4 border-amber-500 shadow-2xl animate-in slide-in-from-bottom-full">
              <div className="flex items-center gap-3">
                  <div className="bg-amber-500 p-2 rounded-full text-stone-900">
                      <ShieldAlert size={24} />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg">מצב טיוטה (פרטי)</h3>
                      <p className="text-stone-400 text-sm">האתר אינו גלוי לציבור. כדי לשתף אותו עם המשפחה והחברים, יש להפעיל מנוי.</p>
                  </div>
              </div>
              <button 
                onClick={() => {
                    if(!currentUser) {
                        setAuthMode('save');
                        setShowAuthModal(true);
                    } else {
                        setShowPaymentModal(true);
                    }
                }}
                className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 whitespace-nowrap"
              >
                  <ShoppingCart size={20}/>
                  רכוש מנוי והפץ (₪150/שנה)
              </button>
          </div>
      )}

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
          memories={profile.memories || []} 
          isAdmin={isAdmin} 
          onDelete={handleDeleteMemory}
          onEdit={(m) => setEditingMemory(m)}
        />
      </main>

      {/* Footer / Related Profiles */}
      {profile.familyMembers && profile.familyMembers.length > 0 && (
        <RelatedProfiles relatedPeople={profile.familyMembers} />
      )}

      {/* Floating Action Button for adding memories (Only if Admin or Public) */}
      {(isAdmin || profile.isPublic) && (
          <button
            onClick={() => setShowMemoryForm(true)}
            className="fixed bottom-24 md:bottom-8 left-8 bg-amber-600 text-white p-4 rounded-full shadow-2xl hover:bg-amber-700 transition-all hover:scale-110 z-30 flex items-center justify-center group"
            title="הוסף זיכרון"
          >
            <Plus size={32} />
          </button>
      )}

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
          memories={[...(profile.memories || [])].sort((a,b) => a.year - b.year)} 
          onClose={() => setShowStory(false)} 
        />
      )}

      {showAuthModal && (
          <AuthModal 
            isSavingDraft={authMode === 'save'}
            onSuccess={handleAuthSuccess}
            onCancel={() => setShowAuthModal(false)}
          />
      )}

      {showPaymentModal && profile && (
          <PaymentModal 
            profileName={profile.fullName}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentModal(false)}
          />
      )}

    </div>
  );
};

export default App;
