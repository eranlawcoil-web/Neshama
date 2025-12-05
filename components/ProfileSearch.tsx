
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { DeceasedProfile } from '../types';
import * as mockBackend from '../services/mockBackend';

interface ProfileSearchProps {
  onSelectProfile: (id: string) => void;
  variant?: 'dark' | 'light';
}

const ProfileSearch: React.FC<ProfileSearchProps> = ({ onSelectProfile, variant = 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DeceasedProfile[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 1) {
      const allProfiles = mockBackend.getProfiles();
      const filtered = allProfiles.filter(p => 
        p.isPublic && 
        p.fullName.includes(text)
      );
      setResults(filtered.slice(0, 5)); // Limit to 5 results
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={containerRef}>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${isOpen ? 'w-64 md:w-80 ring-2 ring-amber-500/50' : 'w-48 md:w-64'} ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'}`}>
        <Search size={16} className={isDark ? 'text-stone-400' : 'text-stone-500'} />
        <input 
            type="text" 
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.length > 1 && setIsOpen(true)}
            placeholder="חיפוש הנצחה"
            className="bg-transparent border-none outline-none text-sm w-full placeholder-opacity-70"
        />
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white text-stone-900 rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
            <div className="text-xs font-bold text-stone-400 px-4 py-2 bg-stone-50 border-b border-stone-100">תוצאות חיפוש</div>
            {results.map(profile => (
                <button 
                    key={profile.id}
                    onClick={() => {
                        onSelectProfile(profile.id);
                        setIsOpen(false);
                        setQuery('');
                    }}
                    className="w-full text-right px-4 py-3 hover:bg-amber-50 transition-colors flex items-center justify-between group border-b border-stone-100 last:border-0"
                >
                    <div className="flex items-center gap-3">
                        <img src={profile.heroImage} alt={profile.fullName} className="w-8 h-8 rounded-full object-cover border border-stone-200" />
                        <div>
                            <div className="font-bold text-sm text-stone-800 group-hover:text-amber-700">{profile.fullName}</div>
                            <div className="text-xs text-stone-400 font-mono dir-ltr text-right">{profile.birthYear} - {profile.deathYear}</div>
                        </div>
                    </div>
                    <ChevronRight size={14} className="text-stone-300 group-hover:text-amber-500" />
                </button>
            ))}
        </div>
      )}
      
      {isOpen && query.length > 1 && results.length === 0 && (
          <div className="absolute top-full mt-2 right-0 w-64 bg-white text-stone-500 rounded-xl shadow-xl border border-stone-200 p-4 text-center text-sm z-[100]">
              לא נמצאו תוצאות עבור "{query}"
          </div>
      )}
    </div>
  );
};

export default ProfileSearch;
