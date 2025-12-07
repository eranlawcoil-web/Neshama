
import React, { useState, useEffect } from 'react';
import { DeceasedProfile } from '../types';
import { ChevronRight, ChevronLeft, Plus, ArrowLeft, Share2, Check, Heart, Users } from 'lucide-react';
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
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      
      {/* Navbar - Absolute over Hero */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex flex-col md:flex-row justify-between items-center p-6 md:px-12 gap-4 bg-gradient-to-b from-white/90 to-transparent pointer-events-none">
         {/* Top Row / Left Side (Desktop) */}
         <div className="flex items-center justify-between w-full md:w-auto gap-6 pointer-events-auto">
             <div 
               className="text-2xl font-serif-hebrew font-bold text-amber-600 tracking-wide cursor-pointer hover:text-amber-700 transition-colors drop-shadow-sm max-w-[60vw] truncate"
               onClick={() => window.location.reload()}
             >
                {projectName}
             </div>
             
             <div className="hidden md:block">
                <ProfileSearch onSelectProfile={onSelectProfile} variant="light" />
             </div>
         </div>

         {/* Mobile Nav Row 2 */}
         <div className="flex gap-4 md:gap-6 items-center w-full md:w-auto justify-between md:justify-end pointer-events-auto">
            <div className="md:hidden">
               <ProfileSearch onSelectProfile={onSelectProfile} variant="light" />
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={handleShare}
                    className="text-stone-600 hover:text-amber-600 transition-colors bg-white/50 p-2 rounded-full hover:bg-white shadow-sm"
                    title="שתף אתר"
                >
                    {showCopied ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
                </button>
                <button onClick={onLogin} className="text-sm font-bold text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-widest hidden lg:block">
                    כניסה למנויים
                </button>
                <button 
                    onClick={onCreate}
                    className="bg-stone-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-amber-600 transition-colors shadow-lg whitespace-nowrap"
                >
                    צור אתר הנצחה
                </button>
            </div>
         </div>
      </nav>

      {/* --- SECTION 1: HERO / INTRO --- */}
      {/* Reduced padding to py-24 to tighten layout */}
      <header className="relative py-24 md:py-32 flex items-center justify-center overflow-hidden border-b border-stone-200">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1499578124509-1611b77778c8?q=80&w=1920&auto=format&fit=crop" 
               alt="Background" 
               className="w-full h-full object-cover opacity-90 grayscale-[20%]"
             />
             <div className="absolute inset-0 bg-white/60 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-white/20 to-white/60"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="flex justify-center mb-8">
                 <span className="bg-white/80 backdrop-blur-md text-amber-700 border border-amber-200 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase flex items-center gap-2 shadow-sm">
                    <Heart size={14} fill="currentColor" /> פשוט. מכובד. מרגש.
                 </span>
             </div>
             
             <h1 className="text-5xl md:text-7xl font-serif-hebrew font-bold mb-6 leading-tight text-stone-900 drop-shadow-sm">
                זהו אתר ליצירת אתרי הנצחה לאהובים
             </h1>
             
             <p className="text-xl md:text-3xl text-stone-600 mb-10 font-light leading-relaxed max-w-4xl mx-auto">
                בקלות ובפשטות, בשיתוף עם משפחה וחברים, <br className="hidden md:block"/>
                יוצרים יחד <span className="text-amber-600 font-bold border-b-2 border-amber-300">עץ חיים</span> להנצחת יקירנו.
             </p>

             <div className="flex flex-col md:flex-row justify-center gap-6">
                <button 
                    onClick={onCreate} 
                    className="group flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-10 py-5 rounded-full text-xl font-bold transition-all hover:scale-105 shadow-xl shadow-amber-200"
                >
                    <Plus size={28} />
                    <span>צור אתר לזכר יקירך</span>
                </button>
             </div>
          </div>
      </header>

      {/* --- SECTION 2: COMMUNITY SHOWCASE (Side-by-Side Layout) --- */}
      <section className="bg-white py-12 md:py-20 px-4 md:px-12 flex-1 relative overflow-hidden border-t border-stone-200">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-stone-50 to-transparent pointer-events-none"></div>

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              
              {/* Right Side: Text & Navigation */}
              <div className="md:col-span-5 flex flex-col justify-center space-y-6 z-10 text-right">
                  <div>
                      <h2 className="text-3xl md:text-4xl font-serif-hebrew font-bold text-stone-800 mb-4 flex items-center gap-3">
                          <Users className="text-amber-600" size={32}/> 
                          דוגמאות מהקהילה
                      </h2>
                      <p className="text-stone-500 text-lg leading-relaxed">
                          אלפי משפחות בחרו להנציח את יקיריהם באמצעות המערכת שלנו.
                          <br/>
                          הנה הצצה לכמה מהסיפורים המרגשים שנבנו כאן.
                      </p>
                  </div>

                  {/* Indicators & Arrows */}
                  <div className="flex items-center gap-6">
                       <div className="flex gap-2">
                           <button 
                               onClick={() => changeSlide('prev')}
                               className="w-12 h-12 rounded-full border border-stone-200 hover:bg-stone-100 text-stone-400 hover:text-stone-800 flex items-center justify-center transition-colors shadow-sm"
                           >
                               <ChevronRight size={24} />
                           </button>
                           <button 
                               onClick={() => changeSlide('next')}
                               className="w-12 h-12 rounded-full border border-stone-200 bg-white hover:bg-amber-50 hover:border-amber-200 text-stone-400 hover:text-amber-600 flex items-center justify-center transition-all shadow-md"
                           >
                               <ChevronLeft size={24} />
                           </button>
                       </div>
                       
                       <div className="flex gap-1.5">
                           {displayProfiles.map((_, idx) => (
                               <div 
                                 key={idx} 
                                 className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-amber-500' : 'w-2 bg-stone-300'}`} 
                               />
                           ))}
                       </div>
                  </div>

                  {currentProfile && (
                      <div className="hidden md:block animate-in fade-in duration-500">
                          <button 
                             onClick={() => onSelectProfile(currentProfile.id)}
                             className="text-amber-600 hover:text-amber-700 text-lg font-bold flex items-center gap-2 group transition-colors underline decoration-amber-200 hover:decoration-amber-500"
                          >
                              <span>צפה באתר ההנצחה של {currentProfile.fullName}</span>
                              <ArrowLeft size={20} className="transform group-hover:-translate-x-2 transition-transform"/>
                          </button>
                      </div>
                  )}
              </div>

              {/* Left Side: Slider Visual */}
              <div className="md:col-span-7 w-full h-[350px] md:h-[400px] relative">
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-stone-100">
                      {displayProfiles.map((profile, index) => {
                            let positionClass = 'opacity-0 z-0 pointer-events-none translate-x-12'; 
                            if (index === activeIndex) positionClass = 'opacity-100 z-20 pointer-events-auto translate-x-0'; 
                            
                            return (
                                <div 
                                    key={profile.id} 
                                    className={`absolute inset-0 transition-all duration-700 ease-out ${positionClass}`}
                                >
                                    <div className="absolute inset-0 bg-stone-100">
                                       <img 
                                           src={profile.heroImage} 
                                           alt={profile.fullName} 
                                           className="w-full h-full object-cover opacity-90"
                                       />
                                       {/* Gradients tailored for light theme visibility */}
                                       <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                                       <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"></div>
                                    </div>
                                    
                                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-30 flex flex-col items-start text-right">
                                         <h3 className="text-4xl md:text-5xl font-serif-hebrew font-bold text-stone-900 mb-3 drop-shadow-sm">
                                             {profile.fullName}
                                         </h3>
                                         <p className="text-stone-700 text-lg md:text-xl line-clamp-2 max-w-xl mb-6 font-medium leading-relaxed bg-white/60 p-2 rounded-lg backdrop-blur-sm">
                                             {profile.shortDescription || profile.bio}
                                         </p>
                                         
                                         {/* Mobile CTA */}
                                         <div className="md:hidden">
                                            <button 
                                                onClick={() => onSelectProfile(profile.id)}
                                                className="bg-stone-900 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg"
                                            >
                                                כניסה לאתר
                                            </button>
                                         </div>
                                    </div>
                                </div>
                            );
                      })}
                  </div>
              </div>

          </div>
      </section>

      {/* Footer */}
      <footer className="w-full p-6 border-t border-stone-200 bg-stone-100 text-center mt-auto">
         <button 
           onClick={onShowPrivacy}
           className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
         >
           תנאי שימוש ומדיניות פרטיות &copy; {new Date().getFullYear()} {projectName}
         </button>
      </footer>
    </div>
  );
};

export default Landing;
