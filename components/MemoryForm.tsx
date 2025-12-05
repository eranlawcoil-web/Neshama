
import React, { useState, useEffect } from 'react';
import { Memory, MediaType } from '../types';
import { polishMemory } from '../services/geminiService';
import { Wand2, Loader2, Image as ImageIcon, Video, Music, X } from 'lucide-react';

interface MemoryFormProps {
  isAdmin: boolean;
  onSubmit: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Memory;
}

const MemoryForm: React.FC<MemoryFormProps> = ({ isAdmin, onSubmit, onCancel, initialData }) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isOfficial, setIsOfficial] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // Media State
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [mediaUrl, setMediaUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setYear(initialData.year);
      setAuthor(initialData.author);
      setContent(initialData.content);
      setIsOfficial(initialData.isOfficial);
      setMediaType(initialData.mediaType || null);
      setMediaUrl(initialData.mediaUrl || '');
    } else {
      // Default for new memories
      if (isAdmin) {
        setIsOfficial(true);
        setAuthor('מערכת');
      } else {
        setIsOfficial(false);
        setAuthor('');
      }
    }
  }, [initialData, isAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if author is empty, fallback to 'מערכת' if official, or 'אנונימי' if not
    const finalAuthor = author.trim() || (isOfficial ? 'מערכת' : 'אורח');

    onSubmit({
      year,
      author: finalAuthor,
      content,
      isOfficial,
      mediaType: mediaUrl ? mediaType : null,
      mediaUrl: mediaUrl || undefined
    });
  };

  const handleEnhance = async () => {
    if (!content) return;
    setIsEnhancing(true);
    const polished = await polishMemory(content);
    setContent(polished);
    setIsEnhancing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaType('image');
        setMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-serif-hebrew font-bold text-gray-800 mb-6 text-center">
          {initialData ? 'עריכת זיכרון' : 'הוספת זיכרון לעץ החיים'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שנה</label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם הכותב</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder={isOfficial ? "מערכת / המשפחה" : "ישראל ישראלי"}
              />
            </div>
          </div>

          {/* Media Selection */}
          <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
            <span className="block text-sm font-medium text-gray-700 mb-2">צרף מדיה (רשות)</span>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => { setMediaType('image'); setMediaUrl(''); }}
                className={`flex-1 flex flex-col items-center p-2 rounded border ${mediaType === 'image' ? 'bg-amber-100 border-amber-500 text-amber-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <ImageIcon size={20} />
                <span className="text-xs mt-1">תמונה</span>
              </button>
              <button
                type="button"
                onClick={() => { setMediaType('video'); setMediaUrl(''); }}
                className={`flex-1 flex flex-col items-center p-2 rounded border ${mediaType === 'video' ? 'bg-amber-100 border-amber-500 text-amber-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <Video size={20} />
                <span className="text-xs mt-1">וידאו (Link)</span>
              </button>
              <button
                type="button"
                onClick={() => { setMediaType('audio'); setMediaUrl(''); }}
                className={`flex-1 flex flex-col items-center p-2 rounded border ${mediaType === 'audio' ? 'bg-amber-100 border-amber-500 text-amber-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <Music size={20} />
                <span className="text-xs mt-1">שיר (Link)</span>
              </button>
            </div>

            {mediaType === 'image' && (
              <div className="relative">
                 {mediaUrl ? (
                   <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                     <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                     <button type="button" onClick={() => setMediaUrl('')} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
                   </div>
                 ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                      <span className="text-sm text-gray-500">לחץ להעלאת תמונה</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                 )}
              </div>
            )}

            {(mediaType === 'video' || mediaType === 'audio') && (
              <div>
                <input 
                  type="url" 
                  value={mediaUrl} 
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={mediaType === 'video' ? 'הדבק קישור (YouTube/MP4)...' : 'הדבק קישור לקובץ אודיו...'}
                  className="w-full p-2 text-sm border rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              הזיכרון שלך
            </label>
            <div className="relative">
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                placeholder={isOfficial ? "תיאור נקודת הציון..." : "ספר/י לנו משהו..."}
              />
              <button
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || !content}
                className="absolute bottom-2 left-2 text-amber-600 hover:bg-amber-50 p-1.5 rounded-full transition-colors flex items-center gap-1 text-xs font-bold"
              >
                {isEnhancing ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                <span>שפר ניסוח</span>
              </button>
            </div>
          </div>

          {isAdmin && (
             <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <input 
                  type="checkbox" 
                  id="isOfficial" 
                  checked={isOfficial} 
                  onChange={(e) => {
                    setIsOfficial(e.target.checked);
                    if(e.target.checked && !author) setAuthor('מערכת');
                  }}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <label htmlFor="isOfficial" className="text-sm font-medium text-stone-700 cursor-pointer select-none">זהו ציון דרך רשמי (מטעם המשפחה)</label>
             </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-lg"
            >
              {initialData ? 'שמור שינויים' : 'הוסף לעץ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemoryForm;
