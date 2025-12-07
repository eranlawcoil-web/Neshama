

import { DeceasedProfile, Memory, VisitLog, SystemConfig } from '../types';

const STORAGE_KEY = 'neshama_profiles_v9'; // Bumped version to ensure new data loads
const STORAGE_VISITS_KEY = 'neshama_visits_v1';
const STORAGE_CONFIG_KEY = 'neshama_config_v1';
const CURRENT_USER_KEY = 'neshama_current_user';

const DEFAULT_SUPER_ADMIN = 'coheneran@yahoo.com';

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

// --- Config Management ---
export const getSystemConfig = (): SystemConfig => {
    try {
        const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            // Ensure backwards compatibility with defaults
            return {
                superAdminEmails: parsed.superAdminEmails || [DEFAULT_SUPER_ADMIN],
                projectName: parsed.projectName || 'אתר הנצחה',
                pricing: {
                    originalPrice: parsed.pricing?.originalPrice ?? 300,
                    currentPrice: parsed.pricing?.currentPrice ?? 150,
                    currency: parsed.pricing?.currency || '₪'
                }
            };
        }
    } catch (e) {
        console.error("Error reading config", e);
    }
    
    // Default Config
    return {
        superAdminEmails: [DEFAULT_SUPER_ADMIN],
        projectName: 'אתר הנצחה',
        pricing: {
            originalPrice: 300,
            currentPrice: 150,
            currency: '₪'
        }
    };
};

export const saveSystemConfig = (config: SystemConfig) => {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
};

export const isSuperAdmin = (email: string): boolean => {
    const config = getSystemConfig();
    return config.superAdminEmails.includes(email.trim().toLowerCase());
};

// --- Data Init ---
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
      showInCommunity: true,
      heroImage: 'https://images.unsplash.com/photo-1544979590-7815d383921b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      shortDescription: 'איש האדמה, מדריך טיולים ואבא למופת. אהב את הארץ לאורכה ולרוחבה.',
      bio: `דני נולד בקיבוץ דגניה א׳, בן למייסדי הקיבוץ. כל חייו היו שזורים באהבת הארץ. כמדריך טיולים, הוא הכיר כל שביל וכל אבן מהחרמון ועד אילת. הוא היה אבא מסור לשלושה ילדים וסבא גאה לחמישה נכדים.`,
      graveLocation: 'בית העלמין האזורי עמק חפר, גוש ג׳, שורה 12',
      memories: [
          { id: 'm1', year: 1973, author: 'מערכת', content: 'שירת כלוחם בסיירת שקד במלחמת יום הכיפורים.', isOfficial: true, createdAt: Date.now(), tags: [] },
          { id: 'm2', year: 1985, author: 'יוסי (חבר)', content: 'הטיול הגדול שלנו לדרום אמריקה. דני סחב אותנו לפסגות הכי גבוהות.', isOfficial: false, createdAt: Date.now(), mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' }
      ],
      familyMembers: [],
      lastUpdated: Date.now()
    };

    // --- Profile 2: The Artist ---
    const sarah: DeceasedProfile = {
      id: 'demo-2',
      fullName: 'שרה לוי',
      birthYear: 1960,
      birthDate: '1960-02-15',
      deathYear: 2024,
      deathDate: '2024-01-20',
      isPublic: true,
      accountType: 'free',
      showInCommunity: true,
      email: 'demo@demo.com',
      heroImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80',
      shortDescription: 'אמנית בנשמה, ציירת ופסלת שראתה את העולם בצבעים אחרים.',
      bio: 'שרה הייתה אישה של צבעים. הסטודיו שלה היה תמיד פתוח לכולם, מלא בריחות של צבעי שמן וטרפנטין. היא האמינה שאמנות יכולה לרפא את הנפש.',
      memories: [],
      familyMembers: [],
      lastUpdated: Date.now() - 100000
    };

    // --- Profile 3: The Cantor/Musician ---
    const avraham: DeceasedProfile = {
        id: 'demo-3',
        fullName: 'אברהם (אבי) ביטון',
        birthYear: 1948,
        birthDate: '1948-08-20',
        deathYear: 2022,
        deathDate: '2022-05-10',
        isPublic: true,
        accountType: 'standard',
        showInCommunity: true,
        email: 'avi@family.com',
        heroImage: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=1920&q=80',
        shortDescription: 'פייטן וחזן שקולו הרטיט לבבות. איש של מסורת וניגון.',
        bio: 'אברהם גדל בבית מוזיקלי במרוקו ועלה לארץ כנער. קול הטנור שלו היה סימן ההיכר של בית הכנסת השכונתי במשך 40 שנה.',
        memories: [],
        familyMembers: [],
        lastUpdated: Date.now() - 200000
    };

    // --- Profile 4: The Grandmother ---
    const rivka: DeceasedProfile = {
        id: 'demo-4',
        fullName: 'רבקה אהרוני',
        birthYear: 1935,
        birthDate: '1935-12-05',
        deathYear: 2021,
        deathDate: '2021-09-15',
        isPublic: true,
        accountType: 'standard',
        showInCommunity: true,
        email: 'grandma@family.com',
        heroImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1920&q=80',
        shortDescription: 'עמוד התווך של המשפחה, בשלנית בחסד ואשת חינוך.',
        bio: 'סבתא רבקה הייתה המורה המיתולוגית של בית הספר היסודי. דורות של תלמידים זוכרים אותה. המטבח שלה היה הלב הפועם של המשפחה בימי שישי.',
        memories: [],
        familyMembers: [],
        lastUpdated: Date.now() - 300000
    };

    // --- Profile 5: The Surfer/Youth ---
    const yossi: DeceasedProfile = {
        id: 'demo-5',
        fullName: 'יוסי (ג׳ו) כהן',
        birthYear: 1995,
        birthDate: '1995-07-22',
        deathYear: 2023,
        deathDate: '2023-10-07',
        isPublic: true,
        accountType: 'free',
        showInCommunity: true,
        email: 'joe@surf.com',
        heroImage: 'https://images.unsplash.com/photo-1502680390469-be75c702a180?auto=format&fit=crop&w=1920&q=80',
        shortDescription: 'ילד של ים, גלישה וחופש. החיוך שלו האיר כל חדר.',
        bio: 'יוסי אהב את הים יותר מכל. הוא היה מדריך גלישה שנתן השראה לאלפי ילדים להתמודד עם הפחדים שלהם ולקפוץ למים.',
        memories: [],
        familyMembers: [],
        lastUpdated: Date.now() - 400000
    };

    const initialProfiles = [daniel, sarah, avraham, rivka, yossi];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProfiles));
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

export const getCommunityProfiles = (): DeceasedProfile[] => {
    const allProfiles = getProfiles().filter(p => p.isPublic);
    
    // 1. Get manually pinned profiles
    const pinned = allProfiles.filter(p => p.showInCommunity);
    
    // 2. Get recent profiles (sorted by update or creation), excluding already pinned ones to avoid duplicates
    const recent = allProfiles
        .filter(p => !pinned.find(pin => pin.id === p.id))
        .sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
        
    // 3. Combine: Pinned first, then fill remainder with recent to ensure at least 5 if possible
    const combined = [...pinned, ...recent];
    
    // Return at least the top 5 (or all if less than 5)
    return combined.slice(0, Math.max(5, combined.length));
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
    const profiles = getProfiles();
    
    const currentUser = getCurrentUserEmail() || 'Admin';
    
    // Strip Z"L
    const profileToSave = {
        ...profile,
        fullName: cleanNameForSave(profile.fullName),
        lastUpdated: Date.now(),
        lastUpdatedBy: currentUser
    };
    
    // Auto-sync milestones
    const syncedProfile = syncMilestones(profileToSave);

    const index = profiles.findIndex(p => p.id === syncedProfile.id);
    
    if (index >= 0) {
        profiles[index] = syncedProfile;
        logVisit(syncedProfile, currentUser, 'update'); // Log update action
    } else {
        profiles.push(syncedProfile);
        logVisit(syncedProfile, currentUser, 'create'); // Log create action
    }
    
    // Prepare for storage
    const storageReadyProfiles = profiles.map(p => ({
        ...p,
        fullName: cleanNameForSave(p.fullName)
    }));
    
    const stringified = JSON.stringify(storageReadyProfiles);
    if (stringified.length > 4500000) { 
         throw new Error("QuotaExceededError");
    }
    
    localStorage.setItem(STORAGE_KEY, stringified);
    
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
        fullName: 'שם המונצח/ת',
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

// --- Verification Logic ---
export const sendVerificationCode = (email: string): void => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Log ONLY to console (Simulating sending to email server)
    // The user MUST check the console or their "email"
    console.log(`%c[EMAIL SERVICE] Verification Code for ${email}: ${code}`, 'color: #f59e0b; font-weight: bold; font-size: 14px;');
    
    activeVerificationCodes.set(email, code);
}

export const verifyCode = (email: string, code: string): boolean => {
    const storedCode = activeVerificationCodes.get(email);
    if (storedCode && storedCode === code) {
        activeVerificationCodes.delete(email); 
        return true;
    }
    return false;
};

export const logVisit = (profile: DeceasedProfile, visitorEmail?: string, actionType: 'visit' | 'update' | 'create' = 'visit') => {
    try {
        const rawVisits = localStorage.getItem(STORAGE_VISITS_KEY);
        const visits: VisitLog[] = rawVisits ? JSON.parse(rawVisits) : [];
        
        const newVisit: VisitLog = {
            id: Date.now().toString(),
            profileId: profile.id,
            profileName: formatNameWithZL(profile.fullName),
            visitorEmail: visitorEmail || 'אורח',
            timestamp: Date.now(),
            actionType
        };
        visits.unshift(newVisit);
        if(visits.length > 2000) visits.length = 2000; // Keep last 2000 events
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
