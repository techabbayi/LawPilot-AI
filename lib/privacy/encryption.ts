import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = crypto
  .createHash("sha256")
  .update(process.env.JWT_SECRET || "lawpilot_enterprise_secure_jwt_secret_key_2026_x900")
  .digest(); // 32 bytes key

/**
 * Encrypts a sensitive string (e.g. API key) using AES-256-CBC
 */
export function encryptSecret(text: string): string {
  if (!text) return "";
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (e) {
    console.error("Encryption error:", e);
    return text;
  }
}

/**
 * Decrypts an AES-256-CBC encrypted string
 */
export function decryptSecret(cipherText: string): string {
  if (!cipherText || !cipherText.includes(":")) return cipherText;
  try {
    const [ivHex, encryptedHex] = cipherText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (e) {
    console.error("Decryption error:", e);
    return "";
  }
}

/**
 * Masks an API key for safe UI display (e.g., "AIzaSy...9x4A")
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return key ? "••••••••" : "";
  const start = key.slice(0, 6);
  const end = key.slice(-4);
  return `${start}••••••••${end}`;
}

/**
 * Privacy-First PII & Sensitive Financial/Corporate Data Sanitizer for AI Gateway
 * Automatically masks credit cards, Indian PAN, Aadhaar, CIN, GSTIN, LLPIN, emails, phone numbers, and bank details
 */
export function maskSensitivePIIData(text: string): string {
  if (!text) return "";
  let sanitized = text;

  // 1. Credit Card Numbers
  sanitized = sanitized.replace(/\b(?:\d[ -]*?){13,16}\b/g, "[MASKED_CREDIT_CARD]");

  // 2. Indian PAN Cards (5 letters, 4 digits, 1 letter: e.g. ABCDE1234F)
  sanitized = sanitized.replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi, "[MASKED_PAN_NUMBER]");

  // 3. Indian Aadhaar Numbers (12 digits, spaced 4-4-4)
  sanitized = sanitized.replace(/\b\d{4}\s\d{4}\s\d{4}\b/g, "[MASKED_AADHAAR_NUMBER]");

  // 4. Email Addresses
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, "[MASKED_EMAIL_ADDRESS]");

  // 5. Phone Numbers (+91 XXXXXXXXXX or 10-12 digits)
  sanitized = sanitized.replace(/(?:\+91[\s-]?)?\b[6-9]\d{9}\b/g, "[MASKED_PHONE_NUMBER]");

  // 6. Bank IFSC Codes (4 letters, 0, 6 alphanumeric: e.g. SBIN0001234)
  sanitized = sanitized.replace(/\b[A-Z]{4}0[A-Z0-9]{6}\b/gi, "[MASKED_IFSC_CODE]");

  // 7. Indian CIN (Corporate Identity Number - 21 chars: U74999TN2020PTC123456)
  sanitized = sanitized.replace(/\b[UL]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}\b/gi, "[MASKED_CIN_REGISTRATION]");

  // 8. Indian GSTIN (Goods & Services Tax ID - 15 chars: 33ABCDE1234F1Z9)
  sanitized = sanitized.replace(/\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/gi, "[MASKED_GSTIN_NUMBER]");

  // 9. Indian LLPIN (LLP Identification Number - e.g. AAA-1234, AAB-5678)
  sanitized = sanitized.replace(/\b[A-Z]{3}-\d{4}\b/gi, "[MASKED_LLPIN_NUMBER]");

  return sanitized;
}
