

import { DeceasedProfile, Memory } from '../types';

const STORAGE_KEY = 'neshama_profiles_v6'; 
const CURRENT_USER_KEY = 'neshama_current_user';
const SUPER_ADMIN_EMAIL = 'coheneran@yahoo.com';

// In-memory store for verification codes (simulation)
const activeVerificationCodes = new Map<string, string>();

// Initialize with rich, realistic dummy data if empty
const initData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const dummyProfile: DeceasedProfile = {
      id: 'demo-1',
      fullName: 'דניאל (דני) גולן',
      birthYear: 1954,
      birthDate: '1954-05-14',
      deathYear: 2023,
      deathDate: '2023-11-24',
      hebrewDeathDate: 'י״א בכסלו התשפ״ד',
      email: 'admin@demo.com',
      isPublic: true,
      heroImage: 'https://images.unsplash.com/photo-1544979590-7815d383921b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      shortDescription: 'איש האדמה, מדריך טיולים ואבא למופת. אהב את הארץ לאורכה ולרוחבה.',
      bio: `דני נולד בקיבוץ דגניה א׳, בן למייסדי הקיבוץ. את אהבתו לארץ ישראל ינק עוד משחר ילדותו, כשהיה יוצא עם אביו לשדות העמק בזריחה.

שירותו הצבאי בסיירת גולני עיצב את אישיותו הלוחמת והערכית. הוא לחם במלחמת יום הכיפורים ואיבד שם חברים קרובים, חוויה שליוותה אותו כל חייו ועיצבה את השקפת עולמו על חשיבות החיים והשמירה על הבית.

לאחר השחרור, דני הקדיש את חייו לחינוך ואהבת הארץ. הוא היה מדריך טיולים אגדי בחברה להגנת הטבע, והכיר כל שביל, כל נחל וכל פרח. התלמידים שלו מספרים על אדם שידע לספר סיפורים שהפכו כל אבן להיסטוריה מרתקת.

דני היה איש משפחה בכל רמ"ח איבריו. את רעייתו נורית הכיר בטיול בנחל יהודיה, ויחד הקימו בית חם ופתוח במושב במרכז הארץ. הוא היה אבא מסור לשלושת ילדיו וסבא גאה לנכדיו, שתמיד חיכו לטיולי השבת איתו.

בשנותיו האחרונות התנדב בעמותות למען נוער בסיכון, שם שילב את אהבתו לטבע עם הרצון לתת לאחר. דני השאיר אחריו מורשת של אהבת אדם, אהבת הארץ, ופשטות כובשת. יהי זכרו ברוך.`,
      graveLocation: 'בית העלמין האזורי עמק חפר, גוש ג׳, שורה 12',
      wazeLink: 'https://waze.com/ul?ll=32.3456,34.9012&navigate=yes',
      playlistUrl: 'https://www.youtube.com/watch?v=F-3k1nKj2qM&list=PLMcThd22goGYItbYq58O4Yw5rL0qZc9Y-',
      memories: [
        { 
          id: 'm1', 
          year: 1954, 
          author: 'מערכת', 
          content: 'נולד בקיבוץ דגניה א׳, בן שני ליצחק ורבקה. ילד טבע שגדל בין השדות לכנרת.', 
          isOfficial: true, 
          createdAt: Date.now(),
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1517409433621-e377f374758d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          tags: ['birth']
        },
        { 
          id: 'm2', 
          year: 1972, 
          author: 'יוסי פלד', 
          content: 'הגיוס לגולני. אני זוכר את דני בבקו״ם, עם הקיטבג הגדול והחיוך הביישן. כבר אז ידענו שהוא יהיה מפקד.', 
          isOfficial: false, 
          createdAt: Date.now() + 1000,
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 'm3', 
          year: 1978, 
          author: 'מערכת', 
          content: 'החתונה עם נורית בגן האירועים בקיבוץ. ערב בלתי נשכח של ריקודים עד אור הבוקר.', 
          isOfficial: true, 
          createdAt: Date.now() + 2000,
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 'm6', 
          year: 2023, 
          author: 'מערכת', 
          content: 'דני הלך לעולמו מוקף במשפחתו האוהבת בביתו שבמושב. יהי זכרו ברוך.', 
          isOfficial: true, 
          createdAt: Date.now() + 4000,
          tags: ['death']
        },
      ],
      familyMembers: [
        { 
            id: 'f1', 
            name: 'דורון גולן', 
            relation: 'אח', 
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            birthDate: '1952-03-10',
            deathDate: '1973-10-06',
            shortDescription: 'נפל במלחמת יום הכיפורים. היה מוזיקאי מחונן וקצין שריון.',
            memorialUrl: '#'
        },
        { 
            id: 'f2', 
            name: 'יצחק גולן', 
            relation: 'אבא', 
            imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
            birthDate: '1920-01-15',
            deathDate: '1995-04-20',
            shortDescription: 'ממקימי הקיבוץ, חקלאי ואיש רוח.',
            memorialUrl: '#'
        }
      ]
    };
    
    const dummyProfile2: DeceasedProfile = {
      id: 'demo-2',
      fullName: 'שרה לוי',
      birthYear: 1960,
      deathYear: 2024,
      isPublic: true,
      email: 'demo@demo.com',
      heroImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80',
      shortDescription: 'אמא, סבתא ואומנית בנשמה.',
      bio: 'שרה הייתה אישה של צבעים ומוזיקה.',
      memories: [],
      familyMembers: []
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([dummyProfile, dummyProfile2]));
  }
};

export const getProfiles = (): DeceasedProfile[] => {
  try {
    initData();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse profiles", e);
    return [];
  }
};

export const getProfileById = (id: string): DeceasedProfile | undefined => {
    const profiles = getProfiles();
    return profiles.find(p => p.id === id);
}

// Automatically adds or updates Birth and Death milestones based on profile dates
const syncMilestones = (profile: DeceasedProfile): DeceasedProfile => {
    let updatedMemories = [...(profile.memories || [])];

    // 1. Sync Birth
    if (profile.birthDate) {
        const birthYear = parseInt(profile.birthDate.split('-')[0]);
        const existingBirth = updatedMemories.find(m => m.tags?.includes('birth'));
        
        if (existingBirth) {
            // Update existing
            existingBirth.year = birthYear;
            existingBirth.content = `נולד/ה בתאריך ${profile.birthDate.split('-').reverse().join('.')}. תחילתו של מסע החיים.`;
        } else {
            // Create new
            updatedMemories.push({
                id: `auto-birth-${Date.now()}`,
                year: birthYear,
                author: 'מערכת',
                content: `נולד/ה בתאריך ${profile.birthDate.split('-').reverse().join('.')}. תחילתו של מסע החיים.`,
                isOfficial: true,
                createdAt: Date.now(),
                tags: ['birth']
            });
        }
    }

    // 2. Sync Death
    if (profile.deathDate) {
        const deathYear = parseInt(profile.deathDate.split('-')[0]);
        const existingDeath = updatedMemories.find(m => m.tags?.includes('death'));
        
        if (existingDeath) {
            existingDeath.year = deathYear;
        } else {
             updatedMemories.push({
                id: `auto-death-${Date.now()}`,
                year: deathYear,
                author: 'מערכת',
                content: `הלך/ה לעולמו/ה. יהי זכרו/ה ברוך.`,
                isOfficial: true,
                createdAt: Date.now(),
                tags: ['death']
            });
        }
    }

    return { ...profile, memories: updatedMemories };
};

export const saveProfile = (profile: DeceasedProfile): DeceasedProfile | null => {
  try {
    const profiles = getProfiles();
    
    // Auto-sync milestones before saving
    const syncedProfile = syncMilestones(profile);

    const index = profiles.findIndex(p => p.id === syncedProfile.id);
    if (index >= 0) {
      profiles[index] = syncedProfile;
    } else {
      profiles.push(syncedProfile);
    }
    
    // Safety check for size before saving
    const stringified = JSON.stringify(profiles);
    if (stringified.length > 4500000) { // ~4.5MB limit check
         throw new Error("QuotaExceededError");
    }
    
    localStorage.setItem(STORAGE_KEY, stringified);
    return syncedProfile;
  } catch (e) {
    console.error("Storage failed", e);
    return null;
  }
};

export const createNewDraft = (): DeceasedProfile => {
    return {
        id: `draft-${Date.now()}`,
        fullName: 'שם הנפטר/ת',
        birthYear: 1950,
        deathYear: 2024,
        heroImage: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        bio: 'כאן תוכלו לכתוב את סיפור החיים המרגש...',
        shortDescription: 'משפט קצר שמתאר את המהות...',
        email: '',
        memories: [],
        familyMembers: [],
        isPublic: false,
        isDraft: true
    };
};

// Super Admin Feature: Create a profile for someone else
export const createProfileForUser = (ownerEmail: string): DeceasedProfile | null => {
     const newProfile = createNewDraft();
     newProfile.email = ownerEmail;
     newProfile.isDraft = false; // It's a real profile, just empty
     newProfile.isPublic = false; // Private until paid/published (optional logic)
     return saveProfile(newProfile);
}

export const loginMock = (email: string): boolean => {
  localStorage.setItem(CURRENT_USER_KEY, email);
  return true;
};

export const logoutMock = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUserEmail = (): string | null => {
  return localStorage.getItem(CURRENT_USER_KEY);
};

export const isSuperAdmin = (email: string): boolean => {
    return email === SUPER_ADMIN_EMAIL;
}

// Generate a random 4 digit code and store it
export const sendVerificationCode = (email: string): string => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`[SIMULATION] Verification code for ${email}: ${code}`);
    activeVerificationCodes.set(email, code);
    return code;
}

export const verifyCode = (email: string, code: string): boolean => {
    const storedCode = activeVerificationCodes.get(email);
    if (storedCode && storedCode === code) {
        activeVerificationCodes.delete(email); // Invalidate after use
        return true;
    }
    return false;
};
