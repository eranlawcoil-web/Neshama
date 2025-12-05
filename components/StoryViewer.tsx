
import React, { useState, useEffect, useMemo } from 'react';
import { Memory, DeceasedProfile } from '../types';
import { X, ChevronRight, ChevronLeft, Pause, Play, Share2, Link, Check, ExternalLink } from 'lucide-react';

interface StoryViewerProps {
  memories: Memory[];
  profile: DeceasedProfile;
  onClose: () => void;
}

type SlideType = 'intro' | 'memory' | 'outro';

interface StorySlide {
  type: SlideType;
  memory?: Memory;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ memories, profile, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCopied, setShowCopied] = useState(false);

  // Construct slides: Intro -> Memories -> Outro
  const slides: StorySlide[] = useMemo(() => {
    return [
      { type: 'intro' },
      ...memories.map(m => ({ type: 'memory' as SlideType, memory: m })),
      { type: 'outro' }
    ];
  }, [memories]);

  const DURATION = 5000; // 5 seconds per slide
  const currentSlide = slides[currentIndex];

  useEffect(() => {
    let interval: any;
    
    if (!isPaused) {
      const step = 50; // Update every 50ms
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (currentIndex < slides.length - 1) {
              setCurrentIndex(c => c + 1);
              return 0;
            } else {
              onClose(); // End of story
              return 100;
            }
          }
          return prev + (step / DURATION) * 100;
        });
      }, step);
    }

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, slides.length, onClose]);

  // Reset progress when slide changes manually
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const wasPaused = isPaused;
    setIsPaused(true);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `עץ החיים של ${profile.fullName}`,
          text: `צפו בסיפור המרגש ובזכרונות של ${profile.fullName}.`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      handleCopyLink();
    }
    
    if (!wasPaused) setIsPaused(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  // Helper to render slide content
  const renderContent = () => {
    if (currentSlide.type === 'intro') {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 z-20">
            {/* Background Image for Intro */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${profile.heroImage})` }}
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-30 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-amber-500/50 shadow-2xl overflow-hidden mx-auto mb-6">
                  <img src={profile.heroImage} alt="Profile" className="w-full h-full object-cover" />
               </div>
               <h1 className="text-4xl md:text-6xl font-serif-hebrew font-bold text-amber-100 mb-2 drop-shadow-lg">
                 {profile.fullName}
               </h1>
               <div className="text-xl md:text-2xl text-stone-300 font-light tracking-widest dir-ltr mb-6">
                 {formatDate(profile.birthDate) || profile.birthYear} - {formatDate(profile.deathDate) || profile.deathYear}
               </div>
               {profile.shortDescription && (
                  <p className="text-lg md:text-xl text-white/90 max-w-md mx-auto leading-relaxed">
                    {profile.shortDescription}
                  </p>
               )}
            </div>
        </div>
      );
    }

    if (currentSlide.type === 'outro') {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 z-20">
             <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${profile.heroImage})` }}
            >
              <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md"></div>
            </div>

            <div className="relative z-30 space-y-8 animate-in zoom-in duration-500">
               <h2 className="text-3xl md:text-5xl font-serif-hebrew text-white mb-4">
                 לזכר {profile.fullName}
               </h2>
               <p className="text-stone-300 text-lg">תודה שהקדשתם זמן לזכור</p>
               
               <button 
                 onClick={onClose}
                 className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-xl transition-all hover:scale-105 mx-auto"
               >
                 <ExternalLink size={24} />
                 כניסה לאתר הזיכרון
               </button>
            </div>
        </div>
      );
    }

    // Memory Slide
    const memory = currentSlide.memory!;
    return (
      <div className="w-full h-full relative flex items-center justify-center bg-stone-900">
        {/* Background Blur */}
        {memory.mediaType === 'image' && memory.mediaUrl && (
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl"
                style={{ backgroundImage: `url(${memory.mediaUrl})` }}
             ></div>
        )}

        {/* Media Content */}
        <div className="relative z-10 w-full max-w-md p-4 flex flex-col items-center animate-in fade-in duration-500">
            {memory.mediaType === 'image' && memory.mediaUrl ? (
                <img 
                    src={memory.mediaUrl} 
                    alt="Memory" 
                    className="max-h-[50vh] rounded-lg shadow-2xl mb-8 object-contain bg-black/20"
                />
            ) : (
                <div className="text-8xl text-amber-500/20 mb-8 font-serif">❝</div>
            )}
            
            <p className={`text-center font-serif-hebrew leading-relaxed drop-shadow-lg text-amber-50 ${memory.content.length < 100 ? 'text-2xl md:text-3xl font-bold' : 'text-lg md:text-xl'}`}>
                {memory.content}
            </p>
            <div className="mt-6 text-stone-400 text-sm">
                {memory.year} • {memory.author}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* Top Progress Bars */}
      <div className="absolute top-4 left-0 right-0 px-4 flex gap-1 z-40">
        {slides.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all linear"
              style={{ 
                width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' 
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Header Info (Only for memory slides) */}
      {currentSlide.type === 'memory' && (
        <div className="absolute top-8 left-4 flex items-center gap-3 z-40 animate-in fade-in">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-lg shadow-lg">
             {currentSlide.memory?.year}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm shadow-black drop-shadow-md">{currentSlide.memory?.author}</span>
            <span className="text-xs opacity-80 shadow-black drop-shadow-md">{currentSlide.memory?.isOfficial ? 'ציון דרך' : 'זיכרון'}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-8 right-4 flex gap-3 z-40">
           {profile.isPublic && (
             <>
                {showCopied && (
                    <span className="text-xs bg-black/60 px-2 py-1 rounded text-white animate-fade-in">הקישור הועתק</span>
                )}
                <button onClick={handleCopyLink} className="hover:text-amber-400 transition-colors p-1 bg-black/20 rounded-full backdrop-blur-sm" title="העתק קישור">
                    {showCopied ? <Check size={20} className="text-green-400" /> : <Link size={20} />}
                </button>
                <button onClick={handleShare} className="hover:text-amber-400 transition-colors p-1 bg-black/20 rounded-full backdrop-blur-sm" title="שתף">
                    <Share2 size={20} />
                </button>
             </>
           )}
           <button onClick={() => setIsPaused(!isPaused)} className="hover:text-amber-400 transition-colors p-1 bg-black/20 rounded-full backdrop-blur-sm">
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
           </button>
           <button onClick={onClose} className="hover:text-red-400 transition-colors p-1 bg-black/20 rounded-full backdrop-blur-sm">
              <X size={24} />
           </button>
      </div>

      {/* Content Area */}
      {renderContent()}

      {/* Navigation Hit Areas (Invisible) */}
      <div className="absolute inset-y-0 left-0 w-1/3 z-30" onClick={handleNext}></div>
      <div className="absolute inset-y-0 right-0 w-1/3 z-30" onClick={handlePrev}></div>
      
      {/* Visual Arrows (Hover only) */}
      <div className="absolute inset-y-0 right-0 w-1/6 z-40 cursor-pointer flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
           <ChevronRight size={48} className="drop-shadow-lg" />
      </div>
      <div className="absolute inset-y-0 left-0 w-1/6 z-40 cursor-pointer flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
           <ChevronLeft size={48} className="drop-shadow-lg" />
      </div>
    </div>
  );
};

export default StoryViewer;
