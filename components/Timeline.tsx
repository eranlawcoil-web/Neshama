
import React, { useState } from 'react';
import { Memory } from '../types';
import { Trash2, Edit2, PlayCircle, Music, X, ZoomIn } from 'lucide-react';

interface TimelineProps {
  memories: Memory[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onEdit: (memory: Memory) => void;
}

const Timeline: React.FC<TimelineProps> = ({ memories, isAdmin, onDelete, onEdit }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const sortedMemories = [...memories].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return (a.isOfficial === b.isOfficial) ? 0 : a.isOfficial ? -1 : 1;
  });

  const renderMedia = (memory: Memory) => {
    if (!memory.mediaType || !memory.mediaUrl) return null;

    if (memory.mediaType === 'image') {
      return (
        <div className="group mt-4 rounded-2xl overflow-hidden shadow-sm relative cursor-pointer" onClick={() => setSelectedImage(memory.mediaUrl!)}>
          <img src={memory.mediaUrl} alt="Memory" className="w-full h-auto object-cover max-h-72 transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
             <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" size={32} />
          </div>
        </div>
      );
    }

    if (memory.mediaType === 'video') {
      return (
        <div className="mt-4 rounded-2xl overflow-hidden shadow-md bg-stone-900 relative flex items-center justify-center h-56 group">
          <a href={memory.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-white flex flex-col items-center hover:text-amber-400 transition-colors transform group-hover:scale-110 duration-300">
            <PlayCircle size={56} className="drop-shadow-lg" />
            <span className="text-sm mt-3 font-medium tracking-wide">לחץ לצפייה בוידאו</span>
          </a>
        </div>
      );
    }

    if (memory.mediaType === 'audio') {
      return (
        <div className="mt-4 bg-amber-50/50 rounded-xl p-4 flex items-center gap-4 border border-amber-100 hover:bg-amber-100/50 transition-colors">
          <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 shadow-sm">
            <Music size={24} />
          </div>
          <a href={memory.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-stone-800 font-medium hover:text-amber-700 hover:underline truncate flex-1">
            האזן לקטע שמע / שיר מצורף
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative container mx-auto px-4 py-20 max-w-5xl">
      
      {/* Golden Thread (Central Line) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-transparent via-amber-300 to-transparent opacity-60"></div>
      
      {/* Decorative Top Node */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-4 h-4 rounded-full bg-amber-200 blur-sm"></div>

      <div className="space-y-24">
        {sortedMemories.map((memory, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              key={memory.id} 
              className={`relative flex items-center justify-between w-full group ${isEven ? 'flex-row-reverse' : ''}`}
            >
              <div className="hidden md:block w-5/12"></div>

              {/* Central Node - Leaf/Gem */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                 <div className="w-10 h-10 rounded-full bg-white border border-amber-100 shadow-lg flex items-center justify-center relative">
                    <div className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.6)]"></div>
                 </div>
              </div>

              {/* Memory Card */}
              <div className={`w-full md:w-5/12 ${isEven ? 'md:text-right' : 'md:text-left'} pl-8 md:pl-0 ${isEven ? 'md:pr-0' : 'pr-8 md:pr-0'}`}>
                <div 
                  className={`
                    p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] 
                    transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)]
                    relative backdrop-blur-sm border
                    ${memory.isOfficial 
                      ? 'bg-white/90 border-amber-200' 
                      : 'bg-white/80 border-white'}
                  `}
                >
                  {/* Decorative quote marks for text */}
                  <span className={`absolute text-6xl text-amber-500/10 font-serif leading-none
                     ${isEven ? '-top-2 -right-2' : '-top-2 -left-2'}
                  `}>❝</span>

                  {/* Header: Year & Author */}
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                     <span className="px-4 py-1 bg-stone-900 text-amber-50 text-sm font-bold rounded-full shadow-md">
                        {memory.year}
                     </span>
                     <span className="text-sm text-stone-400 font-medium">
                        {memory.isOfficial ? 'נקודת ציון' : `מאת ${memory.author}`}
                     </span>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button onClick={() => onEdit(memory)} className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => onDelete(memory.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10">
                    <p className={`text-stone-700 leading-relaxed font-light whitespace-pre-wrap ${memory.content.length < 50 ? 'text-xl' : 'text-lg'}`}>
                        {memory.content}
                    </p>
                    {renderMedia(memory)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Bottom Infinity Symbol */}
      <div className="relative flex justify-center mt-32">
        <div className="w-20 h-20 bg-gradient-to-br from-white to-amber-50 rounded-full flex items-center justify-center text-amber-800/50 border border-white shadow-xl z-10">
          <span className="font-serif-hebrew text-4xl">∞</span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors p-2">
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Full size" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />
        </div>
      )}
    </div>
  );
};

export default Timeline;
