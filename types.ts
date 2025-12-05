
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
  email: string; // Used for "login" simulation
  memories: Memory[];
  familyMembers: RelatedPerson[];
}

export interface User {
  email: string;
  isAdmin: boolean;
}
