
import React, { useState, useEffect } from 'react';
import { DeceasedProfile } from '../types';
import { ChevronRight, ChevronLeft, Plus, ArrowLeft, Share2, Check } from 'lucide-react';
import ProfileSearch from './ProfileSearch';

interface LandingProps {
  profiles: DeceasedProfile[];
  onCreate: () => void;
  onLogin: () => void;
  onSelectProfile: (id: string) => void;
}

const Landing: React.FC<LandingProps> = ({ profiles, onCreate, onLogin, onSelectProfile }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Use the profiles passed from App, which are now curated by "Community" logic
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
    <div className="relative w-full h-screen bg-stone-950 overflow-hidden text-white font-sans">
      
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex flex-col md:flex-row justify-between items-center p-6 md:px-12 gap-4">
         <div className="flex items-center gap-6">
             <div 
               className="text-2xl font-serif-hebrew font-bold text-amber-500 tracking-wide cursor-pointer hover:text-amber-400 transition-colors"
               onClick={() => window.location.reload()}
             >
                אתר הנצחה
             </div>
             
             {/* Search Bar */}
             <div className="hidden md:block">
                <ProfileSearch onSelectProfile={onSelectProfile} variant="dark" />
             </div>
         </div>

         <div className="flex gap-4 md:gap-6 items-center w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Search */}
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

      {/* Main Carousel Area */}
      <div className="w-full h-full relative">
        {displayProfiles.map((profile, index) => {
            let positionClass = 'opacity-0 scale-110 z-0'; // Default hidden
            if (index === activeIndex) positionClass = 'opacity-100 scale-100 z-20'; // Active
            if (index === (activeIndex + 1) % displayProfiles.length) positionClass = 'opacity-0 translate-x-full z-10'; // Next (preload)

            return (
                <div 
                    key={profile.id} 
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${positionClass}`}
                >
                    <img 
                        src={profile.heroImage} 
                        alt={profile.fullName} 
                        className="w-full h-full object-cover brightness-[0.4]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/30"></div>
                </div>
            );
        })}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-30 flex flex-col justify-center px-8 md:px-24 max-w-7xl mx-auto pointer-events-none">
            <div className="pointer-events-auto mt-20 md:mt-0">
                <span className="inline-block text-amber-500 font-bold tracking-[0.3em] uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    דוגמאות מהקהילה
                </span>
                <h1 className="text-5xl md:text-9xl font-serif-hebrew font-bold mb-6 leading-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 text-transparent bg-clip-text bg-gradient-to-br from-white to-stone-400">
                    {currentProfile?.fullName}
                </h1>
                <p className="text-lg md:text-2xl text-stone-300 max-w-2xl mb-10 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 line-clamp-3 md:line-clamp-none">
                    {currentProfile?.shortDescription || currentProfile?.bio.substring(0, 100) + '...'}
                </p>

                <div className="flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <button 
                        onClick={onCreate} 
                        className="group flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(217,119,6,0.5)]"
                    >
                        <Plus size={24} />
                        <span>התחל בחינם</span>
                    </button>
                    
                    {currentProfile && (
                        <button 
                            onClick={() => onSelectProfile(currentProfile.id)}
                            className="group flex items-center justify-center gap-3 border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg transition-all"
                        >
                            <span>גלה עוד</span>
                            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Navigation Dots/Arrows */}
        {displayProfiles.length > 1 && (
            <div className="absolute bottom-12 right-12 z-40 flex items-center gap-6">
                <div className="text-sm font-mono text-stone-400">
                    <span className="text-white text-xl">{activeIndex + 1}</span> / {displayProfiles.length}
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => changeSlide('prev')}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95"
                    >
                        <ChevronRight size={20}/>
                    </button>
                    <button 
                        onClick={() => changeSlide('next')}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95"
                    >
                        <ChevronLeft size={20}/>
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
