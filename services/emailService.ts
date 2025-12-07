
/**
 * Email Service
 * 
 * To make emails work for real, sign up for free at https://www.emailjs.com/
 * 1. Create an account
 * 2. Create a generic Email Service (e.g. Gmail)
 * 3. Create an Email Template with a variable {{code}}
 * 4. Replace the keys below.
 */

// If you want to use real emails, import emailjs:
// import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // e.g., 'service_xyz'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // e.g., 'template_abc'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // e.g., 'user_123456'

export const sendRealEmail = async (toEmail: string, code: string) => {
    // UNCOMMENT THIS BLOCK TO ENABLE REAL EMAILS AFTER ADDING KEYS
    /*
    try {
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                to_email: toEmail,
                code: code, // Ensure your EmailJS template has {{code}} variable
                site_name: 'אתר הנצחה'
            },
            EMAILJS_PUBLIC_KEY
        );
        console.log(`[EMAIL SERVICE] Email sent successfully to ${toEmail}`);
        return true;
    } catch (error) {
        console.error('[EMAIL SERVICE] Failed to send email:', error);
        return false;
    }
    */
   
    // --- FALLBACK SIMULATION (For Demo Purposes) ---
    // Since we don't have the user's keys yet, we log to console so they can login.
    // In production, this block would be removed.
    console.log(`%c[EMAIL SERVICE] ----------------------------------------`, 'color: #10b981');
    console.log(`%cTo: ${toEmail}`, 'color: #10b981; font-weight: bold;');
    console.log(`%cCode: ${code}`, 'color: #10b981; font-weight: bold; font-size: 16px;');
    console.log(`%c[EMAIL SERVICE] ----------------------------------------`, 'color: #10b981');
    return true;
};
