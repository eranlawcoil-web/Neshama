

import React, { useState } from 'react';
import { DeceasedProfile, RelatedPerson } from '../types';
import { Camera, Edit3, Wand2, Loader2, Info, Play, Music, Navigation, Save, Users, Plus, Trash2, Share2, Check, Flame, Calendar, MapPin, X, Map as MapIcon, QrCode } from 'lucide-react';
import { generateTribute } from '../services/geminiService';

interface HeroProps {
  profile: DeceasedProfile;
  isAdmin: boolean;
  onUpdateProfile: (updated: Partial<DeceasedProfile>) => void;
  onPlayStory: () => void;
  isCandleLit: boolean;
  setIsCandleLit: (lit: boolean) => void;
  onShowQR?: () => void;
}

const Hero: React.FC<HeroProps> = ({ profile, isAdmin, onUpdateProfile, onPlayStory, isCandleLit, setIsCandleLit, onShowQR }) => {
  const [isEditingMode, setIsEditingMode] = useState(false);
  
  // Local state for editing form
  const [editForm, setEditForm] = useState({
    fullName: profile.fullName,
    birthYear: profile.birthYear,
    birthDate: profile.birthDate || '',
    deathYear: profile.deathYear,
    deathDate: profile.deathDate || '',
    bio: profile.bio,
    shortDescription: profile.shortDescription || '',
  });

  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Edit fields for Info Modal (Location, Playlist etc)
  const [extraInfo, setExtraInfo] = useState({
    hebrewDeathDate: profile.hebrewDeathDate || '',
    graveLocation: profile.graveLocation || '',
    wazeLink: profile.wazeLink || '',
    playlistUrl: profile.playlistUrl || ''
  });

  // Family Members Editing
  const [familyMembers, setFamilyMembers] = useState<RelatedPerson[]>(profile.familyMembers || []);
  const [newFamilyMember, setNewFamilyMember] = useState<Partial<RelatedPerson>>({ 
      name: '', 
      relation: '', 
      imageUrl: '', 
      birthDate: '', 
      deathDate: '', 
      shortDescription: '',
      memorialUrl: ''
  });

  // When entering edit mode, strip the Z"L so it's clean for the user
  const handleStartEdit = () => {
      let cleanName = profile.fullName;
      if (cleanName.endsWith(' ז״ל')) {
          cleanName = cleanName.replace(' ז״ל', '');
      }
      setEditForm(prev => ({ ...prev, fullName: cleanName }));
      setFamilyMembers(profile.familyMembers || []);
      setIsEditingMode(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Size Validation (Max 1.5MB)
      if (file.size > 1.5 * 1024 * 1024) {
        alert("התמונה גדולה מדי. אנא בחר תמונה קטנה מ-1.5MB כדי לאפשר שמירה מהירה.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ heroImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFamilyMemberImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert("התמונה גדולה מדי עבור איש קשר. נא לבחור תמונה קטנה יותר.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFamilyMember(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addFamilyMember = () => {
    if (!newFamilyMember.name || !newFamilyMember.relation) {
        alert("חובה למלא שם וקירבה");
        return;
    }
    const member: RelatedPerson = {
        id: Date.now().toString(),
        name: newFamilyMember.name!,
        relation: newFamilyMember.relation!,
        imageUrl: newFamilyMember.imageUrl || 'https://via.placeholder.com/300',
        birthDate: newFamilyMember.birthDate,
        deathDate: newFamilyMember.deathDate,
        shortDescription: newFamilyMember.shortDescription,
        memorialUrl: newFamilyMember.memorialUrl
    };
    const updatedMembers = [...familyMembers, member];
    setFamilyMembers(updatedMembers);
    setNewFamilyMember({ 
        name: '', 
        relation: '', 
        imageUrl: '', 
        birthDate: '', 
        deathDate: '', 
        shortDescription: '', 
        memorialUrl: '' 
    });
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleDateChange = (field: 'birthDate' | 'deathDate', value: string) => {
    // Automatically update the Year field based on the Date
    const year = value ? parseInt(value.split('-')[0]) : 0;
    if (field === 'birthDate') {
      setEditForm(prev => ({ ...prev, birthDate: value, birthYear: year || prev.birthYear }));
    } else {
      setEditForm(prev => ({ ...prev, deathDate: value, deathYear: year || prev.deathYear }));
    }
  };

  const saveMainDetails = () => {
    onUpdateProfile({ ...editForm, familyMembers });
    setIsEditingMode(false);
  };

  const handleGenerateBio = async () => {
    if (!keywords) return;
    setIsGenerating(true);
    const generated = await generateTribute(editForm.fullName, keywords);
    setEditForm({ ...editForm, bio: generated });
    setIsGenerating(false);
  };

  const saveExtraInfo = () => {
    onUpdateProfile(extraInfo);
    setShowInfoModal(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Helper to format date DD.MM.YYYY
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  // Helper for map logic
  const getMapData = () => {
      const location = profile.graveLocation || '';
      const encodedLoc = encodeURIComponent(location);
      
      return {
          hasLocation: !!location,
          embedUrl: `https://maps.google.com/maps?q=${encodedLoc}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodedLoc}`,
          wazeUrl: profile.wazeLink || `https://waze.com/ul?q=${encodedLoc}&navigate=yes`
      };
  };

  const mapData = getMapData();

  return (
    <div className="relative w-full bg-stone-900 text-white overflow-hidden pb-12 transition-all">
      {/* Background with Parallax effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src={profile.heroImage} 
          alt={profile.fullName} 
          className="w-full h-full object-cover opacity-25 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-black/40"></div>
      </div>
      
      {/* Realistic Candle Animation Styles */}
      <style>{`
        .candle-container {
            width: 80px;
            height: 100px;
            position: relative;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .candle-glass {
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.1) 100%);
            border-left: 1px solid rgba(255,255,255,0.3);
            border-right: 1px solid rgba(255,255,255,0.3);
            border-radius: 4px;
            position: relative;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
            overflow: hidden;
        }
        .candle-wax {
            position: absolute;
            bottom: 5px;
            left: 5px;
            right: 5px;
            height: 40%;
            background: #fdf6d3; /* Wax color */
            border-radius: 2px;
            box-shadow: inset 0 -5px 10px rgba(0,0,0,0.1);
        }
        .candle-wick {
            position: absolute;
            bottom: 42%;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 10px;
            background: #333;
        }
        
        /* The Flame */
        .flame {
            position: absolute;
            bottom: 48%; /* Just above wick */
            left: 50%;
            width: 14px;
            height: 35px;
            border-radius: 50% 50% 20% 20%;
            background: radial-gradient(white 80%, transparent 100%);
            transform: translateX(-50%);
            box-shadow: 
                0 0 10px 2px rgba(255, 165, 0, 0.6), /* Orange glow */
                0 0 20px 5px rgba(255, 215, 0, 0.4), /* Yellow glow */
                0 -10px 20px 5px rgba(255, 69, 0, 0.3); /* Red top glow */
            animation: flame-flicker 3s infinite linear, flame-move 2s infinite ease-in-out alternate;
            opacity: 0.9;
            transform-origin: bottom center;
            z-index: 10;
        }

        /* Inner Blue Core */
        .flame::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 8px;
            height: 10px;
            background: rgba(0, 0, 255, 0.5);
            border-radius: 50%;
            filter: blur(2px);
        }

        /* Glass Reflection */
        .glass-reflection {
             position: absolute;
             top: 10%;
             left: 10%;
             width: 5px;
             height: 60%;
             background: rgba(255,255,255,0.2);
             border-radius: 10px;
             filter: blur(1px);
        }

        /* Halo / Ambient Light */
        .candle-glow {
            position: absolute;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            width: 120px;
            height: 120px;
            background: radial-gradient(circle, rgba(255,160,0,0.2) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: glow-pulse 3s infinite ease-in-out;
            z-index: 0;
        }

        /* Off State */
        .candle-off .flame { display: none; }
        .candle-off .candle-glow { display: none; }
        
        @keyframes flame-flicker {
            0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.9; }
            25% { transform: translateX(-50%) scale(0.95, 1.05); opacity: 0.8; }
            50% { transform: translateX(-50%) scale(1.05, 0.95); opacity: 1; }
            75% { transform: translateX(-50%) scale(0.98, 1.02); opacity: 0.85; }
        }
        
        @keyframes flame-move {
            0% { transform: translateX(-52%) rotate(-1deg); }
            100% { transform: translateX(-48%) rotate(1deg); }
        }

        @keyframes glow-pulse {
            0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
            50% { opacity: 0.5; transform: translateX(-50%) scale(0.9); }
        }
      `}</style>

      {/* Candle Placement */}
      <div className="absolute top-24 left-4 z-20 md:top-32 md:left-12 flex flex-col items-center">
        <div 
            className={`candle-container ${isCandleLit ? '' : 'candle-off'} hover:scale-105`}
            onClick={() => setIsCandleLit(true)}
            title={isCandleLit ? 'נר זיכרון דולק' : 'הדלק נר זיכרון'}
        >
             <div className="candle-glow"></div>
             <div className="candle-glass bg-stone-800/30 backdrop-blur-sm border-stone-600/50">
                <div className="glass-reflection"></div>
                <div className="candle-wax bg-stone-100"></div>
                <div className="candle-wick"></div>
                <div className="flame"></div>
             </div>
        </div>
        
        <span className={`mt-2 text-[10px] md:text-xs font-bold transition-all duration-700 text-center max-w-[100px] leading-tight px-2 py-1 rounded-full ${isCandleLit ? 'text-amber-300 bg-black/40' : 'text-stone-400 bg-black/20'}`}>
             {isCandleLit ? 'נר זיכרון דולק' : 'הדלק נר לעילוי הנשמה'}
        </span>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 flex flex-col items-center text-center">
        {/* Main Photo */}
        <div className="relative group mb-8">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-[6px] border-amber-500/30 shadow-2xl overflow-hidden p-1 bg-stone-800 ring-4 ring-black/20 relative">
            <img 
              src={profile.heroImage} 
              alt={profile.fullName} 
              className="w-full h-full rounded-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {isAdmin && !isEditingMode && (
            <label className="absolute bottom-4 right-4 cursor-pointer bg-white text-stone-900 p-3 rounded-full shadow-xl hover:bg-amber-500 hover:text-white transition-all transform hover:scale-110 z-20">
              <Camera size={22} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          )}
        </div>

        {/* Editing Mode vs View Mode */}
        {isEditingMode ? (
          <div className="w-full max-w-2xl bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-right">
             <h3 className="text-amber-400 font-bold mb-6 text-xl flex items-center justify-center gap-2 border-b border-white/10 pb-4">
               <Edit3 size={20}/> עריכת פרופיל ראשי
             </h3>
             
             {/* Edit Main Image Button (Also in Edit Mode) */}
             <div className="flex justify-center mb-6">
                 <label className="cursor-pointer bg-stone-800 hover:bg-stone-700 text-stone-300 px-4 py-2 rounded-lg border border-stone-600 flex items-center gap-2 transition-colors">
                    <Camera size={16} />
                    <span>החלף תמונה ראשית</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                 </label>
             </div>

             <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">שם המונצח</label>
                  <input 
                      value={editForm.fullName} 
                      onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                      className="w-full bg-stone-800/80 border border-stone-600 rounded-lg p-3 text-lg text-white focus:border-amber-500 outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                      <label className="text-xs text-stone-400 block mb-1">תאריך לידה</label>
                      <input 
                          type="date"
                          value={editForm.birthDate} 
                          onChange={e => handleDateChange('birthDate', e.target.value)}
                          className="w-full bg-stone-800/80 border border-stone-600 rounded-lg p-3 text-white focus:border-amber-500 outline-none transition-colors"
                      />
                  </div>
                  <div className="flex-1">
                      <label className="text-xs text-stone-400 block mb-1">תאריך פטירה</label>
                      <input 
                          type="date"
                          value={editForm.deathDate} 
                          onChange={e => handleDateChange('deathDate', e.target.value)}
                          className="w-full bg-stone-800/80 border border-stone-600 rounded-lg p-3 text-white focus:border-amber-500 outline-none transition-colors"
                      />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-400 block mb-1">משפט מפתח (כותרת משנה)</label>
                  <input 
                    value={editForm.shortDescription} 
                    onChange={e => setEditForm({...editForm, shortDescription: e.target.value})}
                    className="w-full bg-stone-800/80 border border-stone-600 rounded-lg p-3 text-white focus:border-amber-500 outline-none transition-colors"
                    placeholder="למשל: איש של אנשים ואדמה"
                  />
                </div>
             </div>

             <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                    <label className="text-xs text-stone-400">ביוגרפיה / הספד</label>
                    <div className="flex gap-2 items-center bg-stone-800 rounded-lg p-1 pr-2">
                         <input 
                            placeholder="נושאים לכתיבה..." 
                            value={keywords}
                            onChange={e => setKeywords(e.target.value)}
                            className="bg-transparent border-none text-xs w-32 outline-none text-white placeholder-stone-500"
                         />
                         <button onClick={handleGenerateBio} disabled={isGenerating || !keywords} className="bg-amber-600 hover:bg-amber-500 text-white rounded px-2 py-1 text-xs flex items-center gap-1 transition-colors">
                            {isGenerating ? <Loader2 className="animate-spin" size={12}/> : <Wand2 size={12}/>} 
                            <span>כתוב עבורי</span>
                         </button>
                    </div>
                </div>
                <textarea 
                   value={editForm.bio} 
                   onChange={e => setEditForm({...editForm, bio: e.target.value})}
                   className="w-full bg-stone-800/80 border border-stone-600 rounded-lg p-4 text-stone-200 h-40 focus:border-amber-500 outline-none resize-none leading-relaxed"
                />
             </div>

             {/* Family Members Editor Section */}
             <div className="mb-8 bg-stone-800/50 p-5 rounded-xl border border-stone-700/50">
                <div className="flex items-center gap-2 mb-4 border-b border-stone-700 pb-2">
                   <Users size={18} className="text-amber-500"/>
                   <label className="text-sm font-bold text-stone-200">קרובים ואתרי הנצחה</label>
                </div>
                
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto custom-scrollbar">
                  {familyMembers.map(m => (
                    <div key={m.id} className="flex items-center justify-between bg-stone-900/60 p-3 rounded-lg border border-stone-700">
                       <div className="flex items-center gap-3">
                         <img src={m.imageUrl || 'https://via.placeholder.com/40'} alt={m.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-stone-600" />
                         <div className="text-right">
                            <div className="text-sm font-bold text-stone-200">{m.name} <span className="text-amber-500/80 font-normal text-xs px-1">|</span> <span className="text-stone-400 font-normal text-xs">{m.relation}</span></div>
                            <div className="text-xs text-stone-500 truncate max-w-[150px]">{m.shortDescription}</div>
                         </div>
                       </div>
                       <button onClick={() => removeFamilyMember(m.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  ))}
                  {familyMembers.length === 0 && <div className="text-stone-500 text-sm italic text-center py-2">לא הוספו עדיין קרובים.</div>}
                </div>

                <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-700 shadow-inner">
                    <p className="text-xs text-stone-400 mb-3 font-bold flex items-center gap-1"><Plus size={12}/> הוספת פרופיל קשור חדש:</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                       <input 
                            value={newFamilyMember.name} 
                            onChange={e => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                            placeholder="שם מלא *"
                            className="bg-stone-800 border border-stone-600 rounded px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                        />
                        <input 
                            value={newFamilyMember.relation} 
                            onChange={e => setNewFamilyMember({...newFamilyMember, relation: e.target.value})}
                            placeholder="קירבה *"
                            className="bg-stone-800 border border-stone-600 rounded px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                         <div className="flex flex-col">
                             <span className="text-[10px] text-stone-500 mb-1 mr-1">ת. לידה</span>
                             <input 
                                type="date"
                                value={newFamilyMember.birthDate} 
                                onChange={e => setNewFamilyMember({...newFamilyMember, birthDate: e.target.value})}
                                className="bg-stone-800 border border-stone-600 rounded px-2 py-1.5 text-xs text-white focus:border-amber-500 outline-none"
                             />
                         </div>
                         <div className="flex flex-col">
                             <span className="text-[10px] text-stone-500 mb-1 mr-1">ת. פטירה</span>
                             <input 
                                type="date"
                                value={newFamilyMember.deathDate} 
                                onChange={e => setNewFamilyMember({...newFamilyMember, deathDate: e.target.value})}
                                className="bg-stone-800 border border-stone-600 rounded px-2 py-1.5 text-xs text-white focus:border-amber-500 outline-none"
                             />
                         </div>
                    </div>

                    <textarea 
                        value={newFamilyMember.shortDescription} 
                        onChange={e => setNewFamilyMember({...newFamilyMember, shortDescription: e.target.value})}
                        placeholder="משפט קצר על האדם..."
                        rows={2}
                        className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-sm text-white mb-3 focus:border-amber-500 outline-none resize-none"
                    />
                    
                    <input 
                        value={newFamilyMember.memorialUrl} 
                        onChange={e => setNewFamilyMember({...newFamilyMember, memorialUrl: e.target.value})}
                        placeholder="קישור לאתר הנצחה (אופציונלי)"
                        className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-sm text-white mb-3 dir-ltr text-right focus:border-amber-500 outline-none"
                    />
                    
                    <div className="flex items-center gap-3 pt-2 border-t border-stone-700/50 mt-2">
                        <label className={`cursor-pointer px-3 py-2 rounded text-xs flex items-center gap-2 transition-colors border ${newFamilyMember.imageUrl ? 'bg-green-900/30 border-green-500/50 text-green-300' : 'bg-stone-800 border-stone-600 text-stone-300 hover:bg-stone-700'}`}>
                            <Camera size={14} /> 
                            {newFamilyMember.imageUrl ? 'תמונה נבחרה' : 'בחר תמונה'}
                            <input type="file" className="hidden" onChange={handleFamilyMemberImage} />
                        </label>
                        <div className="flex-1"></div>
                        <button onClick={addFamilyMember} className="bg-stone-200 hover:bg-white text-stone-900 px-4 py-2 rounded font-bold text-sm flex items-center gap-1 shadow-lg transition-all transform hover:scale-105">
                            <Plus size={16} /> הוסף לרשימה
                        </button>
                    </div>
                </div>
             </div>

             <div className="flex gap-3 pt-4 border-t border-white/10">
               <button onClick={() => setIsEditingMode(false)} className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-bold transition-colors">ביטול עריכה</button>
               <button onClick={saveMainDetails} className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-900/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                  <Save size={18} /> שמור הכל
               </button>
             </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-4 mb-4 group relative">
              <h1 className="text-5xl md:text-8xl font-serif-hebrew font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 drop-shadow-sm leading-tight">
                {profile.fullName}
              </h1>
              
              <div className="flex gap-2 absolute left-0 md:-left-24 top-1/2 -translate-y-1/2">
                {isAdmin && (
                    <button
                      onClick={handleStartEdit}
                      className="bg-white/10 hover:bg-white/20 text-amber-500 hover:text-amber-400 p-3 rounded-full backdrop-blur shadow-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="ערוך פרטים"
                    >
                      <Edit3 size={24} />
                    </button>
                )}
                
                {/* Share Button - Visible to everyone */}
                <button
                  onClick={handleShare}
                  className="bg-white/10 hover:bg-white/20 text-stone-300 hover:text-amber-400 p-3 rounded-full backdrop-blur shadow-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="העתק קישור לאתר"
                >
                  {showCopied ? <Check size={24} /> : <Share2 size={24} />}
                </button>

                {/* QR Code Button - Visible if handler exists */}
                {onShowQR && (
                    <button
                        onClick={onShowQR}
                        className="bg-white/10 hover:bg-white/20 text-stone-300 hover:text-amber-400 p-3 rounded-full backdrop-blur shadow-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="קוד גישה (QR)"
                    >
                        <QrCode size={24} />
                    </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xl md:text-2xl text-stone-300 font-light tracking-widest mb-6 dir-ltr opacity-90">
              <span className="font-mono">{formatDate(profile.birthDate) || profile.birthYear}</span>
              <span className="w-12 h-[1px] bg-stone-500"></span>
              <span className="font-mono">{formatDate(profile.deathDate) || profile.deathYear}</span>
            </div>
            
            {profile.shortDescription && (
                <p className="text-lg md:text-2xl text-amber-100/90 font-serif-hebrew max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
                    {profile.shortDescription}
                </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-20">
                <button 
                    onClick={() => setShowInfoModal(true)}
                    className="group flex items-center gap-2 bg-stone-800/40 backdrop-blur-md hover:bg-stone-700/60 border border-stone-500/30 px-6 py-3 rounded-full transition-all hover:scale-105 hover:border-amber-500/50"
                >
                    <Info size={18} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                    <span className="font-medium text-stone-200">פרטים ומיקום</span>
                </button>
                
                {profile.playlistUrl && (
                    <a 
                        href={profile.playlistUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="group flex items-center gap-2 bg-stone-800/40 backdrop-blur-md hover:bg-stone-700/60 border border-stone-500/30 px-6 py-3 rounded-full transition-all hover:scale-105 hover:border-green-500/50"
                    >
                        <Music size={18} className="text-green-400 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-stone-200">הפלייליסט שלי</span>
                    </a>
                )}

                <button 
                    onClick={onPlayStory}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 border border-white/10"
                >
                    <Play size={18} fill="currentColor" />
                    <span className="font-bold tracking-wide">צפה בסיפור חייו</span>
                </button>
            </div>

            {/* Bio Section */}
            <div className="max-w-4xl mx-auto relative group">
              <div className="relative p-8 md:p-12 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm mb-12">
                 <span className="text-7xl text-amber-500/10 absolute -top-8 -right-6 font-serif select-none">❝</span>
                 <p className="text-lg md:text-xl font-heebo font-light leading-relaxed text-stone-200 whitespace-pre-line text-right">
                    {profile.bio}
                 </p>
                 <span className="text-7xl text-amber-500/10 absolute -bottom-10 -left-6 font-serif select-none">❞</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Info Modal */}
      {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="bg-white text-stone-900 rounded-3xl max-w-2xl w-full p-0 relative shadow-2xl transform scale-100 transition-all border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
                  
                  {/* Modal Header */}
                  <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                      <h3 className="text-2xl font-serif-hebrew font-bold text-stone-800 flex items-center gap-2">
                          <MapIcon className="text-amber-600" size={24} />
                          פרטים ודרכי הגעה
                      </h3>
                      <button onClick={() => setShowInfoModal(false)} className="p-2 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-900 transition-colors">
                          <X size={24} />
                      </button>
                  </div>

                  <div className="overflow-y-auto p-6 space-y-6">
                      {isAdmin ? (
                        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 mb-4">
                            <h4 className="text-amber-800 font-bold mb-4 flex items-center gap-2 text-lg"><Edit3 size={18}/> עריכת מידע נוסף</h4>
                            <div className="space-y-4">
                              <div>
                                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">תאריך פטירה עברי</label>
                                  <input value={extraInfo.hebrewDeathDate} onChange={e => setExtraInfo({...extraInfo, hebrewDeathDate: e.target.value})} className="w-full border-b border-amber-200 bg-transparent py-2 focus:border-amber-600 outline-none transition-colors" placeholder="למשל: י״ד באייר התשפ״ג" />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">מיקום הקבר / כתובת</label>
                                  <input value={extraInfo.graveLocation} onChange={e => setExtraInfo({...extraInfo, graveLocation: e.target.value})} className="w-full border-b border-amber-200 bg-transparent py-2 focus:border-amber-600 outline-none transition-colors" placeholder="שם בית עלמין, חלקה, שורה..." />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">לינק ל-Waze (אופציונלי)</label>
                                  <input value={extraInfo.wazeLink} onChange={e => setExtraInfo({...extraInfo, wazeLink: e.target.value})} className="w-full border-b border-amber-200 bg-transparent py-2 focus:border-amber-600 outline-none text-left transition-colors" dir="ltr" placeholder="https://waze.com/..." />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">לינק לפלייליסט</label>
                                  <input value={extraInfo.playlistUrl} onChange={e => setExtraInfo({...extraInfo, playlistUrl: e.target.value})} className="w-full border-b border-amber-200 bg-transparent py-2 focus:border-amber-600 outline-none text-left transition-colors" dir="ltr" placeholder="https://youtube.com/..." />
                              </div>
                              <button onClick={saveExtraInfo} className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg mt-4">שמור פרטים</button>
                            </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                            {/* Date Card */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 bg-stone-50 p-5 rounded-2xl border border-stone-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-sm border border-stone-100">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">תאריך פטירה</div>
                                        <div className="font-bold text-xl text-stone-800 font-mono">{formatDate(profile.deathDate) || profile.deathYear}</div>
                                        <div className="font-serif-hebrew text-stone-600">{profile.hebrewDeathDate}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                                <div className="p-5 border-b border-stone-100 flex items-start gap-4">
                                     <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">מיקום הקבר / הנצחה</div>
                                        <div className="text-lg font-medium text-stone-800 leading-snug">
                                            {profile.graveLocation || 'לא צוין מיקום'}
                                        </div>
                                    </div>
                                </div>
                                
                                {mapData.hasLocation && (
                                    <div className="w-full h-48 bg-stone-100 relative">
                                        <iframe 
                                            width="100%" 
                                            height="100%" 
                                            frameBorder="0" 
                                            scrolling="no" 
                                            marginHeight={0} 
                                            marginWidth={0} 
                                            src={mapData.embedUrl}
                                            className="opacity-90 hover:opacity-100 transition-opacity"
                                            title="Map Location"
                                        ></iframe>
                                        <div className="absolute inset-0 pointer-events-none border-inner shadow-inner"></div>
                                    </div>
                                )}
                                
                                {mapData.hasLocation && (
                                    <div className="p-4 bg-stone-50 flex gap-3">
                                        <a 
                                            href={mapData.wazeUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#33ccff] hover:bg-[#2cb5e3] text-white py-3 rounded-xl font-bold shadow transition-transform hover:-translate-y-1"
                                        >
                                            <Navigation size={18} /> ניווט ב-Waze
                                        </a>
                                        <a 
                                            href={mapData.googleMapsUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 py-3 rounded-xl font-bold transition-colors"
                                        >
                                            <MapIcon size={18} /> Google Maps
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Hero;