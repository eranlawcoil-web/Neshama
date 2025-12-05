

import { DeceasedProfile, Memory, VisitLog, SystemConfig } from '../types';

const STORAGE_KEY = 'neshama_profiles_v8'; // Bumped version
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
    const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (raw) {
        return JSON.parse(raw);
    }
    // Default Config
    return {
        superAdminEmails: [DEFAULT_SUPER_ADMIN],
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
      bio: `דני נולד בקיבוץ דגניה א׳...`,
      graveLocation: 'בית העלמין האזורי עמק חפר, גוש ג׳, שורה 12',
      memories: [],
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
      bio: 'שרה הייתה אישה של צבעים...',
      memories: [],
      familyMembers: [],
      lastUpdated: Date.now()
    };
    
    // Minimal data for others to save space in this view, 
    // assuming similar structure to previous mock data but with 'isPublic: true'
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify([daniel, sarah]));
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
    
    // 2. Get recent 5 profiles (sorted by update or creation)
    const recent = [...allProfiles]
        .sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0))
        .slice(0, 5);
        
    // 3. Combine and deduplicate
    const combined = [...pinned];
    recent.forEach(p => {
        if (!combined.find(c => c.id === p.id)) {
            combined.push(p);
        }
    });
    
    return combined;
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