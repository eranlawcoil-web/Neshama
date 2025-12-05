

import { DeceasedProfile, Memory, VisitLog } from '../types';

const STORAGE_KEY = 'neshama_profiles_v7'; // Incremented to v7 to force new rich data load
const STORAGE_VISITS_KEY = 'neshama_visits_v1';
const CURRENT_USER_KEY = 'neshama_current_user';
const SUPER_ADMIN_EMAIL = 'coheneran@yahoo.com';

// In-memory store for verification codes (simulation)
const activeVerificationCodes = new Map<string, string>();

// Helper to handle Z"L suffix
const formatNameWithZL = (name: string): string => {
    if (!name) return '';
    const suffix = ' ז״ל';
    if (name.endsWith(suffix)) return name;
    return `${name}${suffix}`;
};

const cleanNameForSave = (name: string): string => {
    if (!name) return '';
    const suffix = ' ז״ל';
    if (name.endsWith(suffix)) {
        return name.slice(0, -suffix.length); // Remove suffix
    }
    return name;
};

// Initialize with rich, realistic dummy data if empty
const initData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    
    // --- Profile 1: Nature Lover ---
    const daniel: DeceasedProfile = {
      id: 'demo-1',
      fullName: 'דניאל (דני) גולן',
      birthYear: 1954,
      birthDate: '1954-05-14',
      deathYear: 2023,
      deathDate: '2023-11-24',
      hebrewDeathDate: 'י״א בכסלו התשפ״ד',
      email: 'admin@demo.com',
      isPublic: true,
      accountType: 'standard',
      heroImage: 'https://images.unsplash.com/photo-1544979590-7815d383921b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      shortDescription: 'איש האדמה, מדריך טיולים ואבא למופת. אהב את הארץ לאורכה ולרוחבה.',
      bio: `דני נולד בקיבוץ דגניה א׳, בן למייסדי הקיבוץ. את אהבתו לארץ ישראל ינק עוד משחר ילדותו, כשהיה יוצא עם אביו לשדות העמק בזריחה.

שירותו הצבאי בסיירת גולני עיצב את אישיותו הלוחמת והערכית. הוא לחם במלחמת יום הכיפורים ואיבד שם חברים קרובים, חוויה שליוותה אותו כל חייו ועיצבה את השקפת עולמו על חשיבות החיים והשמירה על הבית.

לאחר השחרור, דני הקדיש את חייו לחינוך ואהבת הארץ. הוא היה מדריך טיולים אגדי בחברה להגנת הטבע, והכיר כל שביל, כל נחל וכל פרח. התלמידים שלו מספרים על אדם שידע לספר סיפורים שהפכו כל אבן להיסטוריה מרתקת.

דני היה איש משפחה בכל רמ"ח איבריו. את רעייתו נורית הכיר בטיול בנחל יהודיה, ויחד הקימו בית חם ופתוח במושב במרכז הארץ. הוא היה אבא מסור לשלושת ילדיו וסבא גאה לנכדיו, שתמיד חיכו לטיולי השבת איתו.`,
      graveLocation: 'בית העלמין האזורי עמק חפר, גוש ג׳, שורה 12',
      wazeLink: 'https://waze.com',
      playlistUrl: 'https://youtube.com',
      memories: [
        { 
          id: 'm1', year: 1954, author: 'מערכת', content: 'נולד בקיבוץ דגניה א׳. ילד טבע שגדל בין השדות לכנרת.', 
          isOfficial: true, createdAt: Date.now(), mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1517409433621-e377f374758d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tags: ['birth']
        },
        { 
          id: 'm2', year: 1973, author: 'יוסי פלד', content: 'במלחמת יום הכיפורים. דני סחב את האלונקה במשך קילומטרים ולא ויתר לרגע. גיבור אמיתי.', 
          isOfficial: false, createdAt: Date.now() + 1000, mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 'm3', year: 1985, author: 'תלמידי כיתה י"ב 2', content: 'הטיול השנתי למדבר יהודה. דני לימד אותנו איך להכין קפה שחור אמיתי בשטח וסיפר צ׳יזבטים עד השעות הקטנות.', 
          isOfficial: false, createdAt: Date.now() + 2000, mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 'm6', year: 2023, author: 'מערכת', content: 'הלך לעולמו מוקף במשפחתו האוהבת בביתו שבמושב.', isOfficial: true, createdAt: Date.now() + 4000, tags: ['death']
        },
      ],
      familyMembers: [
        { id: 'f1', name: 'דורון גולן', relation: 'אח', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', birthDate: '1952-03-10', deathDate: '1973-10-06', shortDescription: 'נפל במלחמת יום הכיפורים. היה מוזיקאי מחונן.' }
      ]
    };

    // --- Profile 2: The Artist ---
    const sarah: DeceasedProfile = {
      id: 'demo-2',
      fullName: 'שרה לוי',
      birthYear: 1960,
      birthDate: '1960-02-15',
      deathYear: 2024,
      deathDate: '2024-01-20',
      hebrewDeathDate: 'י׳ בשבט התשפ״ד',
      isPublic: true,
      accountType: 'free',
      email: 'demo@demo.com',
      heroImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80',
      shortDescription: 'אמנית בנשמה, ציירת ופסלת שראתה את העולם בצבעים אחרים.',
      bio: 'שרה הייתה אישה של צבעים, יצירה ומוזיקה. הסטודיו שלה ביפו העתיקה היה מוקד עלייה לרגל לאמנים צעירים.',
      memories: [
          { id: 's1', year: 1960, author: 'מערכת', content: 'נולדה בירושלים למשפחת מוזיקאים.', isOfficial: true, createdAt: Date.now(), tags: ['birth'] },
          { id: 's2', year: 1988, author: 'דנה חברת ילדות', content: 'תערוכת היחיד הראשונה של שרה בפריז. אני זוכרת את ההתרגשות בעיניים שלה כשהיא ראתה את הקהל.', isOfficial: false, createdAt: Date.now(), mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: 's3', year: 2024, author: 'מערכת', content: 'נפרדנו משרה שהשאירה אחריה עולם צבעוני יותר.', isOfficial: true, createdAt: Date.now(), tags: ['death'] }
      ],
      familyMembers: []
    };

    // --- Profile 3: The Musician ---
    const avi: DeceasedProfile = {
        id: 'demo-3',
        fullName: 'אברהם (אבי) ביטון',
        birthYear: 1975,
        birthDate: '1975-08-20',
        deathYear: 2022,
        deathDate: '2022-05-15',
        hebrewDeathDate: 'י״ד באייר התשפ״ב',
        isPublic: true,
        accountType: 'standard',
        email: 'avi@family.com',
        heroImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        shortDescription: 'ניגן על המיתרים של הלב. מוזיקאי, יוצר וחבר יקר.',
        bio: 'אבי חי ונשם מוזיקה. הגיטרה הייתה חלק בלתי נפרד ממנו. הוא ניגן בלהקות רוק בשנות ה-90 ולימים הפך למורה נערץ למוזיקה בקונסרבטוריון העירוני. החיוך שלו והצלילים שהפיק יישארו איתנו לתמיד.',
        memories: [
            { id: 'a1', year: 1975, author: 'מערכת', content: 'נולד בבאר שבע.', isOfficial: true, createdAt: Date.now(), tags: ['birth'] },
            { id: 'a2', year: 1995, author: 'רון המתופף', content: 'ההופעה ברוקסן. אבי שבר מיתר באמצע הסולו אבל המשיך לנגן כאילו כלום לא קרה. הקהל היה בטירוף.', isOfficial: false, createdAt: Date.now(), mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: 'a3', year: 2010, author: 'שירלי התלמידה', content: 'תודה שלימדת אותי לא רק לנגן אלא גם להקשיב. אתה המורה הכי טוב שהיה לי.', isOfficial: false, createdAt: Date.now(), mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: 'a4', year: 2022, author: 'מערכת', content: 'המוזיקה נדמה. יהי זכרו ברוך.', isOfficial: true, createdAt: Date.now(), tags: ['death'] }
        ],
        familyMembers: []
    };

    // --- Profile 4: The Grandmother (Rivka) ---
    const rivka: DeceasedProfile = {
        id: 'demo-4',
        fullName: 'רבקה אהרוני',
        birthYear: 1940,
        birthDate: '1940-11-05',
        deathYear: 2023,
        deathDate: '2023-09-10',
        hebrewDeathDate: 'כ״ד באלול התשפ״ג',
        isPublic: true,
        accountType: 'standard',
        email: 'grandma@family.com',
        heroImage: 'https://images.unsplash.com/photo-1548366565-6bbab241282d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        shortDescription: 'הלב הפועם של המשפחה. ניצולת שואה שהקימה שבט מפואר.',
        bio: 'סבתא רבקה הייתה סמל לניצחון הרוח. היא שרדה את התופת באירופה ועלתה לארץ כדי להקים משפחה לתפארת. הבית שלה היה תמיד מלא ריחות של בישולים וצחוק של נכדים. היא לימדה אותנו מהי אהבת חינם ומהו כוחה של נתינה.',
        memories: [
            { id: 'r1', year: 1940, author: 'מערכת', content: 'נולדה בפולין.', isOfficial: true, createdAt: Date.now(), tags: ['birth'] },
            { id: 'r2', year: 1948, author: 'מערכת', content: 'עלייה לישראל באוניית מעפילים. התחלה חדשה בקיבוץ.', isOfficial: true, createdAt: Date.now(), mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: 'r3', year: 1980, author: 'הנכד יוני', content: 'ארוחות שישי אצל סבתא. הקובה המפורסם והסיפורים שהיית מספרת לנו בסבלנות אין קץ.', isOfficial: false, createdAt: Date.now(), mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: 'r4', year: 2023, author: 'מערכת', content: 'הלכה לעולמה בשיבה טובה, מוקפת בנכדים ונינים.', isOfficial: true, createdAt: Date.now(), tags: ['death'] }
        ],
        familyMembers: [
            { id: 'rf1', name: 'משה אהרוני', relation: 'בעל', imageUrl: 'https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=300&q=80', birthDate: '1938-01-01', deathDate: '2015-06-15', shortDescription: 'איש עבודה ומסור למשפחתו.' }
        ]
    };

    // --- Profile 5: The Young Surfer (Yossi) ---
    const yossi: DeceasedProfile = {
        id: 'demo-5',
        fullName: 'יוסי (ג׳ו) כהן',
        birthYear: 1990,
        birthDate: '1990-07-12',
        deathYear: 2021,
        deathDate: '2021-08-30',
        hebrewDeathDate: 'כ״ב באלול התשפ״א',
        isPublic: true,
        accountType: 'free',
        email: 'joe@surf.com',
        heroImage: 'https://images.unsplash.com/photo-1502680390469-be75c70e0943?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        shortDescription: 'חי את הרגע, אהב את הים ואת החופש.',
        bio: 'יוסי, שכולם קראו לו ג׳ו, היה ילד של ים. לא היה יום שהוא לא בדק את הגלים. החיוך הנצחי שלו והאופטימיות הדביקו את כל מי שפגש. הוא טייל בכל העולם בחיפוש אחרי הגל המושלם, והשאיר חברים בכל יבשת.',
        memories: [
            { id: 'y1', year: 1990, author: 'מערכת', content: 'נולד בתל אביב.', isOfficial: true, createdAt: Date.now(), tags: ['birth'] },
            { id: 'y2', year: 2015, author: 'עמית מהטיול', content: 'קוסטה ריקה. תפסנו את הגל של החיים בסנטה תרזה. לא אשכח את האושר על הפנים שלך.', isOfficial: false, createdAt: Date.now(), mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1415931633537-351070d20b81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: 'y3', year: 2021, author: 'אמא', content: 'הים לקח אותך מאיתנו, אבל אתה תמיד תהיה הגל שלנו.', isOfficial: false, createdAt: Date.now() },
            { id: 'y4', year: 2021, author: 'מערכת', content: 'נקטף בדמי ימיו.', isOfficial: true, createdAt: Date.now(), tags: ['death'] }
        ],
        familyMembers: []
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([daniel, sarah, avi, rivka, yossi]));
  }
};

export const getProfiles = (): DeceasedProfile[] => {
  try {
    initData();
    const data = localStorage.getItem(STORAGE_KEY);
    const profiles: DeceasedProfile[] = data ? JSON.parse(data) : [];
    
    // Automatically Append Z"L to names on retrieval
    return profiles.map(p => ({
        ...p,
        fullName: formatNameWithZL(p.fullName)
    }));

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
            existingBirth.year = birthYear;
            existingBirth.content = `נולד/ה בתאריך ${profile.birthDate.split('-').reverse().join('.')}. תחילתו של מסע החיים.`;
        } else {
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
    const profiles = getProfiles(); // This gets them WITH Z"L
    
    // When saving, we want to strip the Z"L from the *incoming* profile to avoid double saving it in DB
    // However, since getProfiles adds it, we need to be careful.
    // Let's strip it from the incoming profile's name.
    const profileToSave = {
        ...profile,
        fullName: cleanNameForSave(profile.fullName)
    };
    
    // Auto-sync milestones before saving
    const syncedProfile = syncMilestones(profileToSave);

    // We need to find index based on ID
    // Note: getProfiles returns data with Z"L, but we want to save raw data.
    // So we should re-fetch raw data? Or just map the existing profiles to clean names?
    // Let's just work with the loaded profiles and clean them before saving.
    
    // Find index in the array of currently loaded profiles (which have Z"L)
    const index = profiles.findIndex(p => p.id === syncedProfile.id);
    
    if (index >= 0) {
        // Clean the existing profiles in the array too before saving back
        profiles[index] = syncedProfile;
    } else {
        profiles.push(syncedProfile);
    }
    
    // Prepare for storage: Clean ALL names in the array to be safe
    const storageReadyProfiles = profiles.map(p => ({
        ...p,
        fullName: cleanNameForSave(p.fullName)
    }));
    
    const stringified = JSON.stringify(storageReadyProfiles);
    if (stringified.length > 4500000) { 
         throw new Error("QuotaExceededError");
    }
    
    localStorage.setItem(STORAGE_KEY, stringified);
    
    // Return the profile WITH the Z"L so the UI updates correctly
    return {
        ...syncedProfile,
        fullName: formatNameWithZL(syncedProfile.fullName)
    };

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
        isDraft: true,
        accountType: 'standard' 
    };
};

export const createProfileForUser = (ownerEmail: string): DeceasedProfile | null => {
     const newProfile = createNewDraft();
     newProfile.email = ownerEmail;
     newProfile.isDraft = false; 
     newProfile.isPublic = false; 
     newProfile.accountType = 'free'; 
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

export const sendVerificationCode = (email: string): string => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`[SIMULATION] Verification code for ${email}: ${code}`);
    activeVerificationCodes.set(email, code);
    return code;
}

export const verifyCode = (email: string, code: string): boolean => {
    const storedCode = activeVerificationCodes.get(email);
    if (storedCode && storedCode === code) {
        activeVerificationCodes.delete(email); 
        return true;
    }
    return false;
};

export const logVisit = (profile: DeceasedProfile, visitorEmail?: string) => {
    try {
        const rawVisits = localStorage.getItem(STORAGE_VISITS_KEY);
        const visits: VisitLog[] = rawVisits ? JSON.parse(rawVisits) : [];
        
        const newVisit: VisitLog = {
            id: Date.now().toString(),
            profileId: profile.id,
            profileName: formatNameWithZL(profile.fullName),
            visitorEmail: visitorEmail || 'אורח',
            timestamp: Date.now()
        };
        visits.unshift(newVisit);
        if(visits.length > 1000) visits.length = 1000;
        localStorage.setItem(STORAGE_VISITS_KEY, JSON.stringify(visits));
    } catch (e) {
        console.error("Failed to log visit", e);
    }
}

export const getVisitLogs = (): VisitLog[] => {
    try {
        const rawVisits = localStorage.getItem(STORAGE_VISITS_KEY);
        return rawVisits ? JSON.parse(rawVisits) : [];
    } catch (e) {
        return [];
    }
}
