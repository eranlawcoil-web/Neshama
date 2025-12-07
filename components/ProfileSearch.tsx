
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, X } from 'lucide-react';
import { DeceasedProfile } from '../types';
import * as mockBackend from '../services/mockBackend';

interface ProfileSearchProps {
  onSelectProfile: (id: string) => void;
  variant?: 'dark' | 'light';
}

const ProfileSearch: React.FC<ProfileSearchProps> = ({ onSelectProfile, variant = 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false); // Dropdown open
  const [isExpanded, setIsExpanded] = useState(false); // Input visible
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DeceasedProfile[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (!query) {
            setIsExpanded(false); // Collapse if empty
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  // Focus input when expanded
  useEffect(() => {
      if (isExpanded && inputRef.current) {
          inputRef.current.focus();
      }
  }, [isExpanded]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 1) {
      const allProfiles = mockBackend.getProfiles();
      const filtered = allProfiles.filter(p => 
        p.isPublic && 
        p.fullName.includes(text)
      );
      setResults(filtered.slice(0, 5));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
      setQuery('');
      setResults([]);
      setIsOpen(false);
      setIsExpanded(false);
  }

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={containerRef}>
      {/* Icon Button (Visible when collapsed) */}
      {!isExpanded && (
          <button 
            onClick={() => setIsExpanded(true)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                isDark 
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10' 
                : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
            }`}
            title="חיפוש הנצחה"
          >
              <Search size={18} />
          </button>
      )}

      {/* Expanded Input Area */}
      {isExpanded && (
        <div className={`flex items-center gap-2 pl-2 pr-3 py-2 rounded-full shadow-xl border transition-all duration-300 animate-in fade-in zoom-in-95 origin-right absolute top-0 right-0 z-50 w-64 md:w-72 ${
            isDark 
            ? 'bg-stone-800 border-stone-700 text-white' 
            : 'bg-white border-amber-200 text-stone-800'
        }`}>
            <Search size={16} className="text-amber-500 shrink-0" />
            <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="חיפוש..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder-opacity-50"
            />
            <button onClick={clearSearch} className="text-stone-400 hover:text-stone-600 p-1">
                <X size={14} />
            </button>
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-12 right-0 w-72 bg-white text-stone-900 rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
            <div className="text-xs font-bold text-stone-400 px-4 py-2 bg-stone-50 border-b border-stone-100">תוצאות</div>
            {results.map(profile => (
                <button 
                    key={profile.id}
                    onClick={() => {
                        onSelectProfile(profile.id);
                        clearSearch();
                    }}
                    className="w-full text-right px-4 py-3 hover:bg-amber-50 transition-colors flex items-center justify-between group border-b border-stone-100 last:border-0"
                >
                    <div className="flex items-center gap-3">
                        <img src={profile.heroImage} alt={profile.fullName} className="w-8 h-8 rounded-full object-cover border border-stone-200" />
                        <div>
                            <div className="font-bold text-sm text-stone-800 group-hover:text-amber-700">{profile.fullName}</div>
                        </div>
                    </div>
                    <ChevronRight size={14} className="text-stone-300 group-hover:text-amber-500" />
                </button>
            ))}
        </div>
      )}
      
      {/* No Results */}
      {isOpen && query.length > 1 && results.length === 0 && (
          <div className="absolute top-12 right-0 w-64 bg-white text-stone-500 rounded-xl shadow-xl border border-stone-200 p-4 text-center text-sm z-[100]">
              לא נמצאו תוצאות עבור "{query}"
          </div>
      )}
    </div>
  );
};

export default ProfileSearch;
