
import { DeceasedProfile, Memory } from '../types';

const STORAGE_KEY = 'neshama_profiles_v4'; // Incremented version to force new data load for demo
const CURRENT_USER_KEY = 'neshama_current_user';

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
          mediaUrl: 'https://images.unsplash.com/photo-1517409433621-e377f374758d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
          id: 'm4', 
          year: 1995, 
          author: 'המשפחה', 
          content: 'הטיול הגדול למזרח. דני לקח את כולנו לחודש בהודו. תמונה מהפסגות של ההימלאיה.', 
          isOfficial: true, 
          createdAt: Date.now() + 2500,
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 'm5', 
          year: 2010, 
          author: 'נועה הבת', 
          content: 'אבא מקבל תעודת הוקרה על מפעל חיים בחברה להגנת הטבע. גאווה גדולה.', 
          isOfficial: false, 
          createdAt: Date.now() + 3000,
          mediaType: 'video',
          mediaUrl: 'https://www.youtube.com/watch?v=dummy-video-link'
        },
        { 
          id: 'm6', 
          year: 2023, 
          author: 'מערכת', 
          content: 'דני הלך לעולמו מוקף במשפחתו האוהבת בביתו שבמושב. יהי זכרו ברוך.', 
          isOfficial: true, 
          createdAt: Date.now() + 4000 
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify([dummyProfile]));
  }
};

export const getProfiles = (): DeceasedProfile[] => {
  initData();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProfile = (profile: DeceasedProfile): boolean => {
  try {
    const profiles = getProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return true;
  } catch (e) {
    console.error("Storage failed", e);
    return false;
  }
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
