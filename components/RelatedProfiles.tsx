
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
    <div className="w-full bg-stone-900 text-stone-200 py-24 px-4 border-t border-stone-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Heart className="w-8 h-8 mx-auto text-amber-700 mb-4" />
          <h2 className="text-3xl md:text-4xl font-serif-hebrew text-amber-100/90 mb-4">
            קרובים ואהובים שהלכו לעולמם
          </h2>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-800 to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPeople.map((person) => (
            <div 
              key={person.id} 
              className="bg-stone-800/40 rounded-2xl overflow-hidden border border-stone-700/50 hover:border-amber-900/50 transition-all duration-300 hover:shadow-2xl hover:bg-stone-800/60 group"
            >
              {/* Card Header / Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/20 z-10"></div>
                <img 
                  src={person.imageUrl || 'https://via.placeholder.com/400'} 
                  alt={person.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-20 flex justify-between items-end">
                  <span className="text-amber-400 font-bold text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-amber-900/30">
                    {person.relation}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-2xl font-serif-hebrew font-bold text-stone-100 mb-1 group-hover:text-amber-200 transition-colors">
                  {person.name}
                </h3>
                <div className="text-sm font-mono text-stone-500 mb-4 dir-ltr text-right">
                   {(formatDate(person.birthDate) || '')} - {(formatDate(person.deathDate) || '')}
                </div>
                
                {person.shortDescription && (
                  <p className="text-stone-400 text-sm leading-relaxed mb-6 line-clamp-3 min-h-[4.5em]">
                    {person.shortDescription}
                  </p>
                )}

                {person.memorialUrl ? (
                  <a 
                    href={person.memorialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-stone-700 hover:bg-amber-700 text-stone-200 hover:text-white rounded-xl transition-all duration-300 font-medium text-sm border border-stone-600 hover:border-amber-600"
                  >
                    <ExternalLink size={16} />
                    מעבר לאתר ההנצחה
                  </a>
                ) : (
                  <div className="w-full py-3 bg-stone-800/50 text-stone-600 rounded-xl text-center text-sm cursor-not-allowed border border-stone-800">
                    טרם הוקם אתר
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
