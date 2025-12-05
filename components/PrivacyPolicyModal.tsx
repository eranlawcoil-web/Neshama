
import React from 'react';
import { X, Shield, FileText, Lock } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white text-stone-900 w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="bg-stone-100 p-6 border-b border-stone-200 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-serif-hebrew font-bold flex items-center gap-2 text-stone-800">
            <Shield className="text-amber-600" size={24} />
            תנאי שימוש ומדיניות פרטיות
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto leading-relaxed text-stone-700 space-y-6">
          
          <section>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
              <FileText size={18} className="text-amber-500" />
              1. כללי
            </h3>
            <p>
              ברוכים הבאים לאתר ההנצחה (להלן: "האתר"). השימוש באתר כפוף לתנאים המפורטים להלן.
              מטרת האתר היא לאפשר הנצחה מכובדת, שיתוף זיכרונות ותמונות של יקירים שהלכו לעולמם.
              בעת השימוש באתר, הנך מסכים לתנאים אלו במלואם.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
              <Lock size={18} className="text-amber-500" />
              2. פרטיות ואבטחת מידע
            </h3>
            <p>
              אנו מכבדים את פרטיות המשתמשים. המידע הנאסף (כגון כתובות אימייל לצורך אימות) נשמר במאגרי המידע של האתר
              ואינו מועבר לצדדים שלישיים לצרכים מסחריים.
              <br />
              האתר נוקט באמצעי זהירות מקובלים על מנת לשמור, ככל האפשר, על סודיות המידע.
              עם זאת, בהיותו אתר הפועל בסביבה מקוונת, אין באפשרותנו להבטיח חסינות מוחלטת מפני חדירות למחשבים.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
              3. תכנים אסורים
            </h3>
            <p>
              חל איסור מוחלט להעלות לאתר תכנים פוגעניים, משמיצים, גזעניים, פורנוגרפיים או כל תוכן הפוגע בכבוד האדם ובכבוד הנפטר.
              הנהלת האתר שומרת לעצמה את הזכות להסיר כל תוכן שאינו עומד בסטנדרטים של הנצחה מכובדת, ללא הודעה מוקדמת.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
              4. זכויות יוצרים
            </h3>
            <p>
              המשתמש מצהיר כי הוא בעל הזכויות בתוכן שהוא מעלה (תמונות, טקסטים, סרטונים) או שקיבל אישור מבעל הזכויות להעלותם.
              אין להעתיק או לעשות שימוש מסחרי בתכנים המופיעים באתר ללא אישור בכתב מהנהלת האתר.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
              5. תשלומים וביטולים
            </h3>
            <p>
              שירותי הפרימיום באתר (כגון פתיחת אתר לציבור) כרוכים בתשלום דמי מנוי שנתיים.
              ניתן לבטל את המנוי בכל עת דרך ממשק הניהול או בפנייה לשירות הלקוחות. החידוש הינו אוטומטי אלא אם בוטל מראש.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-stone-100 text-sm text-stone-500 text-center">
            עודכן לאחרונה: פברואר 2024
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-stone-50 border-t border-stone-200">
          <button 
            onClick={onClose}
            className="w-full bg-stone-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors"
          >
            אישור וסגירה
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
