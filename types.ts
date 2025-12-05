

export type MediaType = 'image' | 'video' | 'audio' | null;

export interface Memory {
  id: string;
  year: number;
  author: string; // "Admin" or User Name
  content: string;
  isOfficial: boolean; // True if added by admin (milestone), False if guest
  createdAt: number;
  mediaType?: MediaType;
  mediaUrl?: string; // URL or Base64
  locationName?: string; // e.g. "Hospital", "Event Hall"
  locationUrl?: string; // Google Maps / Waze link
  tags?: string[];
}

export interface RelatedPerson {
  id: string;
  name: string;
  relation: string; // e.g., "Brother", "Spouse"
  imageUrl?: string;
  birthDate?: string;
  deathDate?: string;
  shortDescription?: string;
  memorialUrl?: string; // Link to their site
}

export interface DeceasedProfile {
  id: string;
  fullName: string;
  birthYear: number;
  birthDate?: string; // Full date string YYYY-MM-DD
  deathYear: number;
  deathDate?: string; // Full date string YYYY-MM-DD
  hebrewDeathDate?: string;
  heroImage: string; // Base64 or URL
  bio: string; // The main long bio
  shortDescription?: string; // Short "About" section
  graveLocation?: string;
  wazeLink?: string;
  playlistUrl?: string;
  email: string; // The owner's email
  memories: Memory[];
  familyMembers: RelatedPerson[];
  
  // New fields for management
  isPublic: boolean; // False = Draft/Private, True = Paid/Public
  isDraft?: boolean; // True during initial creation before first save
  subscriptionExpiry?: number;
  accountType?: 'free' | 'standard'; // 'free' = VIP/Community (No payment needed), 'standard' = Needs payment
  
  // Marketing & Updates
  showInCommunity?: boolean; // Manually force to show in carousel
  lastUpdated?: number;
  lastUpdatedBy?: string;
}

export interface User {
  email: string;
  isAdmin: boolean;
}

export interface VisitLog {
    id: string;
    profileId: string;
    profileName: string;
    visitorEmail: string; // "Guest" or email
    timestamp: number;
    actionType: 'visit' | 'update' | 'create'; // To distinguish simple visits from edits
}

export interface SystemConfig {
    superAdminEmails: string[];
    pricing: {
        originalPrice: number; // e.g. 300 (Crossed out)
        currentPrice: number;  // e.g. 150 (Actual)
        currency: string;
    };
}