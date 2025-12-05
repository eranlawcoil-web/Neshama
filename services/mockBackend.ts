
import { DeceasedProfile, Memory } from '../types';

const STORAGE_KEY = 'neshama_profiles_v3';
const CURRENT_USER_KEY = 'neshama_current_user';

// Initialize with some dummy data if empty
const initData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const dummyProfile: DeceasedProfile = {
      id: 'demo-1',
      fullName: 'ישראל ישראלי',
      birthYear: 1950,
      birthDate: '1950-05-14',
      deathYear: 2023,
      deathDate: '2023-04-24',
      hebrewDeathDate: 'ג׳ באייר התשפ״ג',
      email: 'admin@demo.com',
      heroImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      shortDescription: 'איש של אנשים, אוהב אדם וטבע. השאיר אחריו מורשת של נתינה ואהבה.',
      bio: 'ישראל היה עמוד התווך של המשפחה. נולד בחיפה של שנות ה-50, גדל על הכרמל והתחנך על ברכי אהבת הארץ. שירותו הצבאי בצנחנים עיצב את אישיותו החזקה אך הרגישה. אהב את הים, את השקיעות, ומעל הכל - את נכדיו.',
      graveLocation: 'בית העלמין חיפה, שער ברוש, גוש ד׳, חלקה 2',
      wazeLink: 'https://waze.com/ul?ll=32.7940,34.9896&navigate=yes',
      playlistUrl: 'https://www.youtube.com/watch?v=5jXGgZ0hZgI&list=PLMcThd22goGYItbYq58O4Yw5rL0qZc9Y-',
      memories: [
        { 
          id: 'm1', 
          year: 1950, 
          author: 'מערכת', 
          content: 'נולד בבית החולים רמב״ם בחיפה, בן בכור לשרה ומשה.', 
          isOfficial: true, 
          createdAt: Date.now(),
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1519681393784-d8e5b5a4570e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 'm2', 
          year: 1975, 
          author: 'יוסי כהן', 
          content: 'הכרנו באוניברסיטה, תמיד היה עם גיטרה ביד וחיוך על הפנים.', 
          isOfficial: false, 
          createdAt: Date.now() + 1000,
          mediaType: 'audio',
          mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        },
        { 
          id: 'm3', 
          year: 1980, 
          author: 'מערכת', 
          content: 'נישא לרחל אהבת חייו בחתונה צנועה ומרגשת בקיבוץ.', 
          isOfficial: true, 
          createdAt: Date.now() + 2000,
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 'm4', 
          year: 2023, 
          author: 'מערכת', 
          content: 'הלך לעולמו בשיבה טובה, מוקף במשפחתו האוהבת.', 
          isOfficial: true, 
          createdAt: Date.now() + 3000 
        },
      ],
      familyMembers: [
        { 
            id: 'f1', 
            name: 'שרה ישראלי', 
            relation: 'אמא', 
            imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
            birthDate: '1925-01-01',
            deathDate: '2010-05-15',
            shortDescription: 'אם המשפחה, אוהבת אדם ואדמה.',
            memorialUrl: '#'
        },
        { 
            id: 'f2', 
            name: 'משה ישראלי', 
            relation: 'אבא', 
            imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
            birthDate: '1920-03-10',
            deathDate: '2005-11-20',
            shortDescription: 'חלוץ ובונה הארץ.',
            memorialUrl: '#'
        }
      ]
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([dummyProfile]));
  }
};

export const getProfiles = (): DeceasedProfile[] => {
  initData();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProfile = (profile: DeceasedProfile): void => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

export const loginMock = (email: string): boolean => {
  const profiles = getProfiles();
  const found = profiles.find(p => p.email === email);
  if (found) {
    localStorage.setItem(CURRENT_USER_KEY, email);
    return true;
  }
  return false;
};

export const logoutMock = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUserEmail = (): string | null => {
  return localStorage.getItem(CURRENT_USER_KEY);
};
