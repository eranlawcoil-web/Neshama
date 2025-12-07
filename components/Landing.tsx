
import React, { useState, useEffect } from 'react';
import { DeceasedProfile } from '../types';
import { ChevronRight, ChevronLeft, Plus, ArrowLeft, Share2, Check, Heart, Users, Star } from 'lucide-react';
import ProfileSearch from './ProfileSearch';

interface LandingProps {
  profiles: DeceasedProfile[];
  projectName: string;
  onCreate: () => void;
  onLogin: () => void;
  onSelectProfile: (id: string) => void;
  onShowPrivacy: () => void;
}

const Landing: React.FC<LandingProps> = ({ profiles, projectName, onCreate, onLogin, onSelectProfile, onShowPrivacy }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Use the profiles passed from App
  const displayProfiles = profiles && profiles.length > 0 ? profiles : [];

  const changeSlide = (direction: 'next' | 'prev') => {
    if (animating || displayProfiles.length === 0) return;
    setAnimating(true);
    if (direction === 'next') {
        setActiveIndex(prev => (prev + 1) % displayProfiles.length);
    } else {
        setActiveIndex(prev => (prev - 1 + displayProfiles.length) % displayProfiles.length);
    }
    setTimeout(() => setAnimating(false), 700);
  };

  useEffect(() => {
    if (displayProfiles.length === 0) return;
    const timer = setInterval(() => changeSlide('next'), 6000);
    return () => clearInterval(timer);
  }, [activeIndex, displayProfiles.length]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const currentProfile = displayProfiles.length > 0 ? displayProfiles[activeIndex] : null;

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans flex flex-col">
      
      {/* Navbar - Absolute over Hero */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex flex-col md:flex-row justify-between items-center p-6 md:px-12 gap-4 bg-gradient-to-b from-black/60 to-transparent">
         <div className="flex items-center gap-6">
             <div 
               className="text-2xl font-serif-hebrew font-bold text-amber-500 tracking-wide cursor-pointer hover:text-amber-400 transition-colors"
               onClick={() => window.location.reload()}
             >
                {projectName}
             </div>
             
             <div className="hidden md:block">
                <ProfileSearch onSelectProfile={onSelectProfile} variant="dark" />
             </div>
         </div>

         <div className="flex gap-4 md:gap-6 items-center w-full md:w-auto justify-between md:justify-end">
            <div className="md:hidden">
               <ProfileSearch onSelectProfile={onSelectProfile} variant="dark" />
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={handleShare}
                    className="text-stone-300 hover:text-white transition-colors"
                    title="שתף אתר"
                >
                    {showCopied ? <Check size={20} className="text-green-400" /> : <Share2 size={20} />}
                </button>
                <button onClick={onLogin} className="text-sm font-bold text-stone-300 hover:text-white transition-colors uppercase tracking-widest hidden lg:block">
                    כניסה למנויים
                </button>
                <button 
                    onClick={onCreate}
                    className="bg-white text-stone-950 px-6 py-2 rounded-full font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg whitespace-nowrap"
                >
                    צור אתר הנצחה
                </button>
            </div>
         </div>
      </nav>

      {/* --- SECTION 1: HERO / INTRO (Half Height) --- */}
      <header className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-white/5">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1499578124509-1611b77778c8?q=80&w=1920&auto=format&fit=crop" 
               alt="Background" 
               className="w-full h-full object-cover opacity-50"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-black/40"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="flex justify-center mb-6">
                 <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                    <Heart size={14} fill="currentColor" /> פשוט. מכובד. מרגש.
                 </span>
             </div>
             
             <h1 className="text-4xl md:text-6xl font-serif-hebrew font-bold mb-6 leading-tight text-white drop-shadow-2xl">
                זהו אתר ליצירת אתרי הנצחה לאהובים
             </h1>
             
             <p className="text-lg md:text-2xl text-stone-300 mb-10 font-light leading-relaxed max-w-3xl mx-auto">
                בקלות ובפשטות, בשיתוף עם משפחה וחברים, <br className="hidden md:block"/>
                יוצרים יחד <span className="text-amber-400 font-bold">עץ חיים</span> להנצחת יקירנו.
             </p>

             <div className="flex flex-col md:flex-row justify-center gap-4">
                <button 
                    onClick={onCreate} 
                    className="group flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-[0_0_30px_-10px_rgba(217,119,6,0.6)]"
                >
                    <Plus size={24} />
                    <span>צור אתר לזכר יקירך</span>
                </button>
             </div>
          </div>
      </header>

      {/* --- SECTION 2: COMMUNITY SHOWCASE (Compact Slider) --- */}
      <section className="bg-stone-950 py-12 px-4 md:px-12 flex-1 flex flex-col items-center justify-start relative">
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 items-center">
              
              <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-serif-hebrew font-bold text-stone-100 mb-2 flex items-center justify-center gap-2">
                      <Users className="text-amber-500" size={24}/> דוגמאות מהקהילה
                  </h2>
              </div>

              {/* Slider Side - Smaller & Compact */}
              <div className="w-full relative group">
                  <div className="relative w-full aspect-video md:aspect-[2.5/1] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
                      {displayProfiles.map((profile, index) => {
                            let positionClass = 'opacity-0 z-0 pointer-events-none'; 
                            if (index === activeIndex) positionClass = 'opacity-100 z-20 pointer-events-auto'; 
                            
                            return (
                                <div 
                                    key={profile.id} 
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${positionClass}`}
                                >
                                    <div className="absolute inset-0 bg-stone-900">
                                       <img 
                                           src={profile.heroImage} 
                                           alt={profile.fullName} 
                                           className="w-full h-full object-cover opacity-50"
                                       />
                                       <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent"></div>
                                    </div>
                                    
                                    <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12 z-30">
                                         <h3 className="text-2xl md:text-4xl font-serif-hebrew font-bold text-white mb-2 shadow-black drop-shadow-md">
                                             {profile.fullName}
                                         </h3>
                                         <p className="text-stone-300 text-base md:text-lg line-clamp-2 max-w-lg mb-6">
                                             {profile.shortDescription || profile.bio}
                                         </p>
                                         <button 
                                            onClick={() => onSelectProfile(profile.id)}
                                            className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition-colors border border-white/10"
                                         >
                                             <span>כניסה לאתר ההנצחה</span>
                                             <ArrowLeft size={16} />
                                         </button>
                                    </div>
                                </div>
                            );
                      })}
                  </div>

                  {/* Navigation Arrows */}
                  <button 
                      onClick={() => changeSlide('prev')}
                      className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors shadow-lg z-30"
                  >
                      <ChevronRight size={20} />
                  </button>
                  <button 
                      onClick={() => changeSlide('next')}
                      className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors shadow-lg z-30"
                  >
                      <ChevronLeft size={20} />
                  </button>
              </div>

          </div>
      </section>

      {/* Footer */}
      <footer className="w-full p-6 border-t border-stone-900 bg-stone-950 text-center mt-auto">
         <button 
           onClick={onShowPrivacy}
           className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
         >
           תנאי שימוש ומדיניות פרטיות &copy; {new Date().getFullYear()} {projectName}
         </button>
      </footer>
    </div>
  );
};

export default Landing;
