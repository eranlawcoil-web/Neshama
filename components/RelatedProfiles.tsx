

import React from 'react';
import { RelatedPerson } from '../types';
import { ExternalLink, Heart, Eye } from 'lucide-react';

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
              className="group relative bg-stone-800 rounded-2xl overflow-hidden border border-stone-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-96"
            >
              {/* Image & Overlay */}
              <div className="absolute inset-0 z-0">
                  <img 
                    src={person.imageUrl || 'https://via.placeholder.com/400'} 
                    alt={person.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale-[30%]"
                  />
                  {/* Gradient Overlay: Darkens on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-colors duration-500 group-hover:from-black/95 group-hover:via-black/60"></div>
              </div>

              {/* Content Content */}
              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end">
                  
                  <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                      <div className="flex justify-between items-end mb-2">
                           <span className="inline-block text-amber-400 font-bold text-xs tracking-wider uppercase bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-amber-500/30">
                              {person.relation}
                           </span>
                           <span className="text-xs font-mono text-stone-300 opacity-80 dir-ltr">
                                {(formatDate(person.birthDate) || '')} - {(formatDate(person.deathDate) || '')}
                           </span>
                      </div>

                      <h3 className="text-3xl font-serif-hebrew font-bold text-white mb-2 drop-shadow-md">
                        {person.name}
                      </h3>

                      {person.shortDescription && (
                        <p className="text-stone-300 text-sm leading-relaxed mb-4 line-clamp-2 opacity-90 font-light">
                            {person.shortDescription}
                        </p>
                      )}

                      {/* Action Button - Reveals on hover */}
                      <div className="h-0 group-hover:h-12 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                          {person.memorialUrl && person.memorialUrl !== '#' ? (
                            <a 
                                href={person.memorialUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-sm shadow-lg transition-colors"
                            >
                                <span>ביקור באתר ההנצחה</span>
                                <ExternalLink size={14} />
                            </a>
                           ) : (
                            <div className="flex items-center justify-center gap-2 w-full py-3 bg-stone-700/50 text-stone-400 rounded-xl font-medium text-sm border border-stone-600 cursor-default">
                                <span>טרם הוקם אתר</span>
                            </div>
                           )}
                      </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProfiles;
