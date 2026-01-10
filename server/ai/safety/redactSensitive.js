
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
