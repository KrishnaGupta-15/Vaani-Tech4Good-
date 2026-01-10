// export function redactSensitive(text) {
//   return text
//     .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED_EMAIL]")
//     .replace(/\b(\+91[-\s]?)?[6-9]\d{9}\b/g, "[REDACTED_PHONE]")
//     .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, "[REDACTED_CARD]")
//     .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, "[REDACTED_AADHAAR]")
//     .replace(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/g, "[REDACTED_PAN]");
// }

import crypto from "crypto";

function hash(value) {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex")
    .slice(0, 12); 
}

export function redactAndHash(text) {
  let uiText = text;
  let aiText = text;

  //  Phone numbers
  uiText = uiText.replace(/\b\d{10}\b/g, "[PHONE]");
  aiText = aiText.replace(/\b\d{10}\b/g, (m) => `[PHONE_HASH:${hash(m)}]`);

  //  Emails
  uiText = uiText.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    "[EMAIL]"
  );
  aiText = aiText.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    (m) => `[EMAIL_HASH:${hash(m)}]`
  );

  //  Password-like patterns
  uiText = uiText.replace(/password\s*[:=]\s*\S+/i, "password=[REDACTED]");
  aiText = aiText.replace(
    /password\s*[:=]\s*(\S+)/i,
    (_, p1) => `password=[HASH:${hash(p1)}]`
  );

  return { uiText, aiText };
}
