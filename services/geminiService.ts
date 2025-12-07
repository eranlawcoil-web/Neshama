import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  let apiKey = '';
  try {
    // Direct access allows build tools (Vite/Webpack) to replace this with the string literal
    apiKey = process.env.API_KEY || '';
  } catch (e) {
    console.warn("API Key access failed", e);
  }

  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTribute = async (name: string, keywords: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "המערכת אינה מחוברת ל-AI כעת (חסר מפתח API).";

  try {
    const prompt = `
      כתוב הספד קצר, מרגש ומכובד בעברית עבור ${name}.
      השתמש במילות המפתח הבאות כדי לבנות את הטקסט: ${keywords}.
      הטקסט צריך להיות בגוף שלישי, מתאים לאתר הנצחה. מקסימום 3 פסקאות.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "לא ניתן היה לייצר טקסט.";
  } catch (error) {
    console.error("Error generating tribute:", error);
    return "אירעה שגיאה ביצירת הטקסט.";
  }
};

export const polishMemory = async (text: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return text;

  try {
    const prompt = `
      שפר את הניסוח של הזיכרון הבא כדי שיהיה מכובד, רהוט ומרגש יותר, אך שמור על המשמעות המקורית.
      הטקסט הוא: "${text}"
      החזר רק את הטקסט המשופר בעברית.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    console.error("Error polishing memory:", error);
    return text;
  }
};