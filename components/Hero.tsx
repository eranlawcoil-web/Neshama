
import React, { useState } from 'react';
import { DeceasedProfile, RelatedPerson } from '../types';
import { Camera, Edit3, Wand2, Loader2, Info, Play, Music, MapPin, Calendar, X, Navigation, Save, Users, Plus, Trash2 } from 'lucide-react';
import { generateTribute } from '../services/geminiService';

interface HeroProps {
  profile: DeceasedProfile;
  isAdmin: boolean;
  onUpdateProfile: (updated: Partial<DeceasedProfile>) => void;
  onPlayStory: () => void;
}

const Hero: React.FC<HeroProps> = ({ profile, isAdmin, onUpdateProfile, onPlayStory }) => {
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
        name: newFamilyMember.name,
        relation: newFamilyMember.relation,
        imageUrl: newFamilyMember.imageUrl || 'https://via.placeholder.com/150',
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

  // Helper to format date DD.MM.YYYY
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

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

      <div className="relative z-10 container mx-auto px-4 pt-24 flex flex-col items-center text-center">
        {/* Main Photo */}
        <div className="relative group mb-8">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-[6px] border-amber-500/30 shadow-2xl overflow-hidden p-1 bg-stone-800 ring-4 ring-black/20">
            <img 
              src={profile.heroImage} 
              alt={profile.fullName} 
              className="w-full h-full rounded-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {isAdmin && (
            <label className="absolute bottom-4 right-4 cursor-pointer bg-white text-stone-900 p-3 rounded-full shadow-xl hover:bg-amber-500 hover:text-white transition-all transform hover:scale-110">
              <Camera size={22} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          )}
        </div>

        {/* Editing Mode vs View Mode */}
        {isEditingMode ? (
          <div className="w-full max-w-2xl bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
             <h3 className="text-amber-400 font-bold mb-6 text-xl flex items-center justify-center gap-2">
               <Edit3 size={20}/> עריכת פרופיל ראשי
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div>
                 <label className="text-xs text-stone-400 block mb-1">שם מלא</label>
                 <input 
                    value={editForm.fullName} 
                    onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                    className="w-full bg-stone-800/80 border border-stone-600 rounded-lg p-3 text-lg text-white focus:border-amber-500 outline-none"
                 />
               </div>
               {/* Date Inputs */}
               <div className="flex gap-2">
                 <div className="flex-1">
                    <label className="text-xs text-stone-400 block mb-1">תאריך לידה</label>
                    <input 
                        type="date"
                        value={editForm.birthDate} 
                        onChange={e => handleDateChange('birthDate', e.target.value)}
                        className="w-full bg-stone-800/80 border border-stone-600 rounded-lg p-3 text-center text-white focus:border-amber-500 outline-none"
                    />
                 </div>
                 <div className="flex-1">
                    <label className="text-xs text-stone-400 block mb-1">תאריך פטירה</label>
                    <input 
                        type="date"
                        value={editForm.deathDate} 
                        onChange={e => handleDateChange('deathDate', e.target.value)}
                        className="w-full bg-stone-800/80 border border-stone-600 rounded-lg p-3 text-center text-white focus:border-amber-500 outline-none"
                    />
                 </div>
               </div>
             </div>

             <div className="mb-4">
                <label className="text-xs text-stone-400 block mb-1">משפט מפתח (כותרת משנה)</label>
                <input 
                   value={editForm.shortDescription} 
                   onChange={e => setEditForm({...editForm, shortDescription: e.target.value})}
                   className="w-full bg-stone-800/80 border border-stone-600 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                   placeholder="למשל: איש של אנשים ואדמה"
                />
             </div>

             <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <label className="text-xs text-stone-400">ביוגרפיה / הספד</label>
                    <div className="flex gap-2 items-center">
                         <input 
                            placeholder="מילות מפתח ל-AI..." 
                            value={keywords}
                            onChange={e => setKeywords(e.target.value)}
                            className="bg-stone-800 border border-stone-600 rounded px-2 py-1 text-xs w-32 md:w-48"
                         />
                         <button onClick={handleGenerateBio} disabled={isGenerating || !keywords} className="text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1">
                            {isGenerating ? <Loader2 className="animate-spin" size={12}/> : <Wand2 size={12}/>} AI
                         </button>
                    </div>
                </div>
                <textarea 
                   value={editForm.bio} 
                   onChange={e => setEditForm({...editForm, bio: e.target.value})}
                   className="w-full bg-stone-800/80 border border-stone-600 rounded-lg p-4 text-stone-200 h-40 focus:border-amber-500 outline-none resize-none"
                />
             </div>

             {/* Family Members Editor */}
             <div className="mb-6 bg-stone-800/50 p-4 rounded-xl border border-stone-700">
                <label className="text-sm text-amber-400 block mb-3 font-bold border-b border-stone-700 pb-2">קרובים ואתרי הנצחה קשורים</label>
                
                <div className="space-y-2 mb-4">
                  {familyMembers.map(m => (
                    <div key={m.id} className="flex items-center justify-between bg-stone-700/50 p-2 rounded-lg">
                       <div className="flex items-center gap-3">
                         <img src={m.imageUrl || 'https://via.placeholder.com/40'} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                         <div>
                            <div className="text-sm font-bold">{m.name} <span className="text-stone-400 font-normal">({m.relation})</span></div>
                            <div className="text-xs text-stone-500">{m.shortDescription?.substring(0,30)}...</div>
                         </div>
                       </div>
                       <button onClick={() => removeFamilyMember(m.id)} className="text-red-400 hover:text-red-300 p-1">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  ))}
                  {familyMembers.length === 0 && <div className="text-stone-500 text-sm italic">לא הוספו עדיין קרובים.</div>}
                </div>

                <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-700">
                    <p className="text-xs text-stone-400 mb-2 font-bold">הוספת קרוב חדש:</p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                       <input 
                            value={newFamilyMember.name} 
                            onChange={e => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                            placeholder="שם מלא"
                            className="bg-stone-800 border border-stone-600 rounded p-2 text-sm text-white"
                        />
                        <input 
                            value={newFamilyMember.relation} 
                            onChange={e => setNewFamilyMember({...newFamilyMember, relation: e.target.value})}
                            placeholder="קירבה (אח, אמא...)"
                            className="bg-stone-800 border border-stone-600 rounded p-2 text-sm text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                         <div className="flex flex-col">
                             <span className="text-[10px] text-stone-500 mb-0.5">תאריך לידה</span>
                             <input 
                                type="date"
                                value={newFamilyMember.birthDate} 
                                onChange={e => setNewFamilyMember({...newFamilyMember, birthDate: e.target.value})}
                                className="bg-stone-800 border border-stone-600 rounded p-1 text-sm text-white"
                             />
                         </div>
                         <div className="flex flex-col">
                             <span className="text-[10px] text-stone-500 mb-0.5">תאריך פטירה</span>
                             <input 
                                type="date"
                                value={newFamilyMember.deathDate} 
                                onChange={e => setNewFamilyMember({...newFamilyMember, deathDate: e.target.value})}
                                className="bg-stone-800 border border-stone-600 rounded p-1 text-sm text-white"
                             />
                         </div>
                    </div>
                    <input 
                        value={newFamilyMember.shortDescription} 
                        onChange={e => setNewFamilyMember({...newFamilyMember, shortDescription: e.target.value})}
                        placeholder="תיאור קצר (למשל: איש של חזון ומעש...)"
                        className="w-full bg-stone-800 border border-stone-600 rounded p-2 text-sm text-white mb-2"
                    />
                    <input 
                        value={newFamilyMember.memorialUrl} 
                        onChange={e => setNewFamilyMember({...newFamilyMember, memorialUrl: e.target.value})}
                        placeholder="קישור לאתר הנצחה (אופציונלי)"
                        className="w-full bg-stone-800 border border-stone-600 rounded p-2 text-sm text-white mb-2 dir-ltr text-right"
                    />
                    
                    <div className="flex items-center gap-2 mt-3">
                        <label className="cursor-pointer bg-stone-700 text-stone-300 p-2 rounded hover:bg-stone-600 text-xs flex items-center gap-1">
                            <Camera size={14} /> בחר תמונה
                            <input type="file" className="hidden" onChange={handleFamilyMemberImage} />
                        </label>
                        {newFamilyMember.imageUrl && <span className="text-green-400 text-xs">תמונה נבחרה</span>}
                        <div className="flex-1"></div>
                        <button onClick={addFamilyMember} className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-500 text-sm font-bold flex items-center gap-1">
                            <Plus size={16} /> הוסף לרשימה
                        </button>
                    </div>
                </div>
             </div>

             <div className="flex gap-3">
               <button onClick={() => setIsEditingMode(false)} className="flex-1 py-3 bg-stone-700 hover:bg-stone-600 rounded-xl font-bold transition-colors">ביטול</button>
               <button onClick={saveMainDetails} className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center gap-2">
                  <Save size={18} /> שמור שינויים
               </button>
             </div>
          </div>
        ) : (
          <>
            <h1 className="text-5xl md:text-7xl font-serif-hebrew font-bold mb-4 tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 drop-shadow-sm">
              {profile.fullName}
            </h1>
            <div className="flex items-center gap-4 text-xl md:text-2xl text-stone-300 font-light tracking-widest mb-4 dir-ltr">
              <span className="font-mono">{formatDate(profile.birthDate) || profile.birthYear}</span>
              <span className="w-12 h-[1px] bg-stone-500"></span>
              <span className="font-mono">{formatDate(profile.deathDate) || profile.deathYear}</span>
            </div>
            
            {profile.shortDescription && (
                <p className="text-lg md:text-2xl text-amber-100/90 font-serif-hebrew max-w-2xl mx-auto mb-8 leading-relaxed">
                    {profile.shortDescription}
                </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                <button 
                    onClick={() => setShowInfoModal(true)}
                    className="group flex items-center gap-2 bg-stone-800/60 backdrop-blur-sm hover:bg-stone-700 border border-stone-600 px-6 py-3 rounded-full transition-all hover:scale-105"
                >
                    <Info size={18} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                    <span className="font-medium">פרטים ומיקום</span>
                </button>
                
                {profile.playlistUrl && (
                    <a 
                        href={profile.playlistUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="group flex items-center gap-2 bg-stone-800/60 backdrop-blur-sm hover:bg-stone-700 border border-stone-600 px-6 py-3 rounded-full transition-all hover:scale-105"
                    >
                        <Music size={18} className="text-green-400 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">הפלייליסט שלי</span>
                    </a>
                )}

                <button 
                    onClick={onPlayStory}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95"
                >
                    <Play size={18} fill="currentColor" />
                    <span className="font-bold">צפה בסטורי</span>
                </button>
            </div>

            {/* Bio Section */}
            <div className="max-w-3xl mx-auto relative group">
              {isAdmin && (
                <button 
                  onClick={() => {
                     setFamilyMembers(profile.familyMembers || []);
                     setIsEditingMode(true);
                  }}
                  className="absolute -top-12 right-0 md:-right-12 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100"
                  title="ערוך פרטים"
                >
                  <Edit3 size={20} />
                </button>
              )}
              
              <div className="relative p-8 md:p-10 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm mb-12">
                 <span className="text-6xl text-amber-500/20 absolute -top-6 -right-4 font-serif">❝</span>
                 <p className="text-lg md:text-xl font-heebo font-light leading-relaxed text-stone-200 whitespace-pre-line text-right">
                    {profile.bio}
                 </p>
                 <span className="text-6xl text-amber-500/20 absolute -bottom-8 -left-4 font-serif">❞</span>
              </div>
            </div>
            
            {/* Note: Family members display removed from here, moved to main App footer area */}
          </>
        )}
      </div>

      {/* Info Modal */}
      {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-white text-stone-900 rounded-2xl max-w-lg w-full p-8 relative shadow-2xl transform scale-100 transition-all">
                  <button onClick={() => setShowInfoModal(false)} className="absolute top-4 left-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors">
                      <X size={24} />
                  </button>
                  
                  <h3 className="text-3xl font-serif-hebrew font-bold mb-8 text-center text-stone-800">
                      פרטים ודרכי הגעה
                  </h3>

                  {isAdmin ? (
                    <div className="space-y-5">
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                            <h4 className="text-amber-800 font-bold mb-3 flex items-center gap-2"><Edit3 size={16}/> עריכת פרטים נוספים</h4>
                            <div className="space-y-3">
                              <div>
                                  <label className="text-xs font-bold text-stone-500 uppercase">תאריך פטירה עברי</label>
                                  <input value={extraInfo.hebrewDeathDate} onChange={e => setExtraInfo({...extraInfo, hebrewDeathDate: e.target.value})} className="w-full border-b border-amber-200 bg-transparent py-1 focus:border-amber-600 outline-none" placeholder="למשל: י״ד באייר התשפ״ג" />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-stone-500 uppercase">מיקום הקבר</label>
                                  <input value={extraInfo.graveLocation} onChange={e => setExtraInfo({...extraInfo, graveLocation: e.target.value})} className="w-full border-b border-amber-200 bg-transparent py-1 focus:border-amber-600 outline-none" placeholder="שם בית עלמין, חלקה, שורה..." />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-stone-500 uppercase">לינק ל-Waze</label>
                                  <input value={extraInfo.wazeLink} onChange={e => setExtraInfo({...extraInfo, wazeLink: e.target.value})} className="w-full border-b border-amber-200 bg-transparent py-1 focus:border-amber-600 outline-none text-left" dir="ltr" placeholder="https://waze.com/..." />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-stone-500 uppercase">לינק לפלייליסט</label>
                                  <input value={extraInfo.playlistUrl} onChange={e => setExtraInfo({...extraInfo, playlistUrl: e.target.value})} className="w-full border-b border-amber-200 bg-transparent py-1 focus:border-amber-600 outline-none text-left" dir="ltr" placeholder="https://youtube.com/..." />
                              </div>
                            </div>
                        </div>
                        <button onClick={saveExtraInfo} className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg">שמור פרטים</button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                        <div className="flex items-start gap-4 p-4 bg-stone-50 rounded-xl">
                            <div className="bg-white p-3 rounded-full shadow-sm text-amber-600">
                               <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">תאריכים</p>
                                <p className="text-lg text-stone-800">
                                    <span className="font-bold">לועזי:</span> {formatDate(profile.deathDate) || profile.deathYear}
                                </p>
                                <p className="text-xl font-serif-hebrew text-stone-800 mt-1">
                                    <span className="font-bold text-base font-sans ml-1 text-stone-500">עברי:</span>
                                    {profile.hebrewDeathDate || 'לא צוין'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-stone-50 rounded-xl">
                             <div className="bg-white p-3 rounded-full shadow-sm text-amber-600">
                               <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">מיקום הקבר</p>
                                <p className="text-lg font-medium text-stone-800">{profile.graveLocation || 'לא צוין'}</p>
                            </div>
                        </div>

                        {profile.wazeLink && (
                            <a href={profile.wazeLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full bg-[#33ccff] hover:bg-[#2cb5e3] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all hover:-translate-y-1">
                                <Navigation size={24} />
                                <span className="text-lg">נווט עם Waze</span>
                            </a>
                        )}
                    </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default Hero;
