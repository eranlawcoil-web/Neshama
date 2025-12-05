
import React from 'react';
import { RelatedPerson } from '../types';
import { ExternalLink, Heart } from 'lucide-react';

interface RelatedProfilesProps {
  relatedPeople: RelatedPerson[];
}

const RelatedProfiles: React.FC<RelatedProfilesProps> = ({ relatedPeople }) => {
  if (!relatedPeople || relatedPeople.length === 0) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return dateString.split('-')[0]; // Just return year for the card
  };

  return (
    <div className="w-full bg-stone-900 text-stone-200 py-24 px-4 border-t border-stone-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-800/50 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-full bg-stone-800/50 mb-4 border border-stone-700">
            <Heart className="w-6 h-6 text-amber-600" fill="currentColor" fillOpacity={0.4} />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif-hebrew text-amber-100/90 mb-4">
            קרובים ואהובים שהלכו לעולמם
          </h2>
          <p className="text-stone-400 font-light text-lg">
            פינת זיכרון לבני משפחה נוספים
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPeople.map((person) => (
            <div 
              key={person.id} 
              className="group bg-stone-800/40 rounded-2xl overflow-hidden border border-stone-700/50 hover:border-amber-700/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-1"
            >
              {/* Card Header / Image */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/10 z-10 transition-opacity group-hover:opacity-0"></div>
                <img 
                  src={person.imageUrl || 'https://via.placeholder.com/400'} 
                  alt={person.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter grayscale-[20%] group-hover:grayscale-0"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent z-20 flex flex-col justify-end h-full">
                  <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-block text-amber-300 font-bold text-xs tracking-wider uppercase bg-amber-900/40 px-3 py-1 rounded-full backdrop-blur-md border border-amber-500/20 mb-2">
                        {person.relation}
                      </span>
                      <h3 className="text-3xl font-serif-hebrew font-bold text-white mb-1 shadow-black drop-shadow-md">
                        {person.name}
                      </h3>
                      <div className="text-sm font-mono text-stone-300 dir-ltr text-right opacity-90">
                        {(formatDate(person.birthDate) || '')} - {(formatDate(person.deathDate) || '')}
                      </div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 relative">
                {person.shortDescription && (
                  <p className="text-stone-400 text-sm leading-relaxed mb-6 line-clamp-3 min-h-[4.5em] font-light">
                    {person.shortDescription}
                  </p>
                )}

                {person.memorialUrl && person.memorialUrl !== '#' ? (
                  <a 
                    href={person.memorialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-stone-700/50 hover:bg-amber-700 text-stone-300 hover:text-white rounded-xl transition-all duration-300 font-medium text-sm border border-stone-600 hover:border-amber-600 group/btn"
                  >
                    <span>ביקור באתר ההנצחה</span>
                    <ExternalLink size={14} className="group-hover/btn:translate-x-[-2px] transition-transform" />
                  </a>
                ) : (
                  <div className="w-full py-3 bg-stone-800/30 text-stone-600 rounded-xl text-center text-sm cursor-default border border-stone-800/50 flex items-center justify-center gap-2">
                    <span>טרם הוקם אתר</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProfiles;
