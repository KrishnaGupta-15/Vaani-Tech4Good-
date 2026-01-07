export function redactSensitive(text) {
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED_EMAIL]")
    .replace(/\b(\+91[-\s]?)?[6-9]\d{9}\b/g, "[REDACTED_PHONE]")
    .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, "[REDACTED_CARD]")
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, "[REDACTED_AADHAAR]")
    .replace(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/g, "[REDACTED_PAN]");
}
