

import React, { useState, useEffect } from 'react';
import { DeceasedProfile, Memory, SystemConfig } from './types';
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
import ProfileSearch from './components/ProfileSearch';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import QRCodeModal from './components/QRCodeModal';
import { LogIn, LogOut, Plus, ShieldAlert, ShoppingCart, Eye, ArrowRight, Settings, Gift, CheckCircle, Flame } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'landing' | 'profile' | 'superAdmin'>('landing');

  // Data State
  const [profile, setProfile] = useState<DeceasedProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);

  // Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'save'>('login');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [showStory, setShowStory] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Scroll & Sticky State
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCandleLit, setIsCandleLit] = useState(false);

  // Initialize
  useEffect(() => {
    const user = mockBackend.getCurrentUserEmail();
    setSystemConfig(mockBackend.getSystemConfig());

    if (user) {
      setCurrentUser(user);
      if (mockBackend.isSuperAdmin(user)) {
          setView('superAdmin');
      }
    }
  }, []);

  // Tracking Effect
  useEffect(() => {
      if (view === 'profile' && profile) {
          // Log visit when entering a profile view
          const timer = setTimeout(() => {
              mockBackend.logVisit(profile, currentUser || undefined);
          }, 1000);
          return () => clearTimeout(timer);
      }
  }, [profile?.id, view]);

  // Handle Scroll for Sticky Header
  useEffect(() => {
      const handleScroll = () => {
          setIsScrolled(window.scrollY > 400); // 400px threshold approx hero height
      };
      
      if (view === 'profile') {
        window.addEventListener('scroll', handleScroll);
      } else {
        setIsScrolled(false);
      }
      return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const handleStartCreate = () => {
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
            window.scrollTo(0,0);
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

    // Refresh Config just in case
    const updatedConfig = mockBackend.getSystemConfig();
    setSystemConfig(updatedConfig);

    // Priority Check: Super Admin
    if (updatedConfig.superAdminEmails.includes(email)) {
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
        } else {
            // Just logged in generally. Try to load their personal profile if exists
            const allProfiles = mockBackend.getProfiles();
            const userProfile = allProfiles.find(p => p.email === email);
            if (userProfile) {
                setProfile(userProfile);
                setView('profile');
            } else {
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

  // Skip payment for free accounts
  const handleFreePublish = () => {
    if (!profile) return;
    const updatedProfile = { ...profile, isPublic: true };
    const saved = mockBackend.saveProfile(updatedProfile);
    if (saved) {
        setProfile(saved);
        alert('האתר פורסם בהצלחה!');
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

  const projectName = systemConfig?.projectName || 'אתר הנצחה';

  if (view === 'superAdmin') {
      return (
          <>
            <SuperAdminDashboard 
                onLogout={() => {
                    mockBackend.logoutMock();
                    setCurrentUser(null);
                    setView('landing');
                }}
                onShowPrivacy={() => setShowPrivacyModal(true)}
            />
            {showPrivacyModal && <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />}
          </>
      );
  }

  if (view === 'landing') {
      return (
          <>
            <Landing 
                // Pass filtered/sorted community profiles
                profiles={mockBackend.getCommunityProfiles()}
                projectName={projectName}
                onCreate={handleStartCreate}
                onSelectProfile={handleSelectProfile}
                onLogin={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                }}
                onShowPrivacy={() => setShowPrivacyModal(true)}
            />
            {showAuthModal && (
                <AuthModal 
                    isSavingDraft={authMode === 'save'}
                    onSuccess={handleAuthSuccess}
                    onCancel={() => setShowAuthModal(false)}
                />
            )}
            {showPrivacyModal && <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />}
          </>
      );
  }

  if (!profile) return <div className="h-screen flex items-center justify-center bg-stone-900 text-amber-500">טוען נתונים...</div>;

  // Admin logic: 
  const isAdmin = (currentUser && currentUser === profile.email) || (profile.isDraft === true && !profile.email);
  const currentPrice = systemConfig?.pricing.currentPrice || 150;
  const originalPrice = systemConfig?.pricing.originalPrice || 300;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      
      {/* Navbar - Sticky & Dynamic */}
      <nav 
        className={`fixed top-0 w-full z-50 border-b transition-all duration-300 group
            ${isScrolled 
                ? 'bg-white/95 backdrop-blur-md shadow-md border-stone-200 py-3 md:py-4' 
                : 'bg-white/10 backdrop-blur-md border-white/10 py-4 hover:bg-white/95'
            }
        `}
      >
        <div className="px-6 flex justify-between items-center w-full">
            <div className="flex items-center gap-6 flex-1">
                {/* Back to Home Button */}
                <button 
                    onClick={() => setView('landing')} 
                    className={`flex items-center gap-2 transition-colors px-4 py-2 rounded-full hover:bg-white shrink-0 ${isScrolled ? 'text-stone-600 bg-stone-100' : 'text-stone-600 bg-white/50'}`}
                >
                    <ArrowRight size={20} />
                    <span className="font-bold text-base hidden xl:inline">חזרה ל{projectName}</span>
                </button>

                {/* Sticky Profile Info - Slides in when scrolled */}
                <div className={`flex items-center gap-4 transition-all duration-500 flex-1 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 hidden'}`}>
                    <img 
                        src={profile.heroImage} 
                        alt={profile.fullName} 
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-amber-500 shadow-sm shrink-0"
                    />
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
                        <span className="font-serif-hebrew font-bold text-stone-900 text-xl md:text-3xl leading-none whitespace-nowrap">{profile.fullName}</span>
                        
                        {profile.isPublic && (
                             <button 
                                onClick={() => setIsCandleLit(true)}
                                className="flex items-center gap-2 bg-stone-100 hover:bg-amber-50 px-3 py-1 rounded-full transition-colors w-fit"
                             >
                                <Flame size={18} className={isCandleLit ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-stone-400'} />
                                <span className={`text-sm font-bold ${isCandleLit ? 'text-amber-600' : 'text-stone-500'}`}>
                                    {isCandleLit ? 'נר דולק' : 'הדלק נר'}
                                </span>
                             </button>
                        )}
                    </div>
                </div>

                {!isScrolled && (
                   <div className="hidden lg:flex items-center gap-4">
                       <ProfileSearch onSelectProfile={handleSelectProfile} variant="light" />
                   </div>
                )}

                {!isScrolled && (
                    <div className="hidden md:block text-2xl font-bold font-serif-hebrew text-amber-600 opacity-80 absolute left-1/2 transform -translate-x-1/2">
                        {profile.fullName}
                    </div>
                )}

                {!profile.isPublic && (
                    <span className="bg-stone-200 text-stone-600 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 shrink-0">
                        <Eye size={12}/> טיוטה
                    </span>
                )}
            </div>
        
            <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
                <div className="flex items-center gap-3">
                    <span className={`text-xs hidden md:inline ${isScrolled ? 'text-stone-500' : 'text-stone-300 group-hover:text-stone-500'}`}>{currentUser}</span>
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
                        <span>ניהול {projectName}</span>
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
        </div>
      </nav>

      {/* Trial / Payment Banner */}
      {isAdmin && !profile.isPublic && (
          <div className="fixed bottom-0 left-0 right-0 z-[60] bg-stone-900 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t-4 border-amber-500 shadow-2xl animate-in slide-in-from-bottom-full">
              <div className="flex items-center gap-3">
                  <div className="bg-amber-500 p-2 rounded-full text-stone-900">
                      <ShieldAlert size={24} />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg">מצב טיוטה (פרטי)</h3>
                      <p className="text-stone-400 text-sm">האתר אינו גלוי לציבור. {profile.accountType === 'free' ? 'לחץ על הכפתור כדי לפרסם אותו.' : 'כדי לשתף אותו, יש להפעיל מנוי.'}</p>
                  </div>
              </div>
              
              {profile.accountType === 'free' ? (
                  <button 
                    onClick={handleFreePublish}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 whitespace-nowrap"
                  >
                      <CheckCircle size={20}/>
                      פרסם אתר (ללא עלות)
                  </button>
              ) : (
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
                      <span>רכוש מנוי והפץ</span>
                      <div className="flex items-center gap-1 bg-stone-900/10 px-2 rounded-full">
                          {originalPrice > currentPrice && (
                            <span className="text-stone-700 line-through text-xs decoration-red-500">₪{originalPrice}</span>
                          )}
                          <span>₪{currentPrice}/שנה</span>
                      </div>
                  </button>
              )}
          </div>
      )}

      {/* Hero Section */}
      <Hero 
        profile={profile} 
        isAdmin={isAdmin} 
        onUpdateProfile={handleUpdateProfile}
        onPlayStory={() => setShowStory(true)}
        isCandleLit={isCandleLit}
        setIsCandleLit={setIsCandleLit}
        onShowQR={() => setShowQRModal(true)}
      />

      {/* Main Content - Timeline */}
      <main className="pb-8 relative flex-grow">
        <div className="text-center mt-12 mb-8 px-4">
           <h2 className="text-3xl font-serif-hebrew text-stone-800">{projectName}</h2>
           <p className="text-stone-500 mt-2">מסע בזמן דרך רגעים, תמונות וזכרונות</p>
        </div>

        <Timeline 
          memories={profile.memories || []} 
          isAdmin={isAdmin} 
          onDelete={handleDeleteMemory}
          onEdit={(m) => setEditingMemory(m)}
          onAddMemory={() => setShowMemoryForm(true)}
        />
      </main>

      {/* Related Profiles */}
      {profile.familyMembers && profile.familyMembers.length > 0 && (
        <RelatedProfiles relatedPeople={profile.familyMembers} />
      )}
      
      {/* App Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 text-center text-sm border-t border-stone-800 mt-auto">
          <button 
             onClick={() => setShowPrivacyModal(true)}
             className="hover:text-white transition-colors underline decoration-stone-700 hover:decoration-white"
          >
             תנאי שימוש ומדיניות פרטיות
          </button>
      </footer>

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
            price={currentPrice}
            originalPrice={originalPrice}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentModal(false)}
          />
      )}

      {showPrivacyModal && <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />}
      
      {showQRModal && profile && (
        <QRCodeModal 
            url={window.location.href}
            name={profile.fullName}
            projectName={projectName}
            onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};

export default App;