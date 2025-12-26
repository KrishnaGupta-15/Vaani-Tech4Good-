export const LANGUAGES = [
    { name: "English", native: "English", code: "en-IN" },
    { name: "Hindi", native: "हिन्दी", code: "hi-IN" },
    { name: "Marathi", native: "मराठी", code: "mr-IN" },
    { name: "Bengali", native: "বাংলা", code: "bn-IN" },
    { name: "Tamil", native: "தமிழ்", code: "ta-IN" },
    { name: "Telugu", native: "తెలుగు", code: "te-IN" },
    { name: "Gujarati", native: "ગુજરાતી", code: "gu-IN" },
    { name: "Kannada", native: "ಕನ್ನಡ", code: "kn-IN" },
    { name: "Malayalam", native: "മലയാളം", code: "ml-IN" },
    { name: "Punjabi", native: "ਪੰਜਾਬੀ", code: "pa-IN" },
    { name: "Odia", native: "ଓଡ଼ିଆ", code: "or-IN" },
    { name: "Assamese", native: "অসমীয়া", code: "as-IN" },
    { name: "Maithili", native: "मैथिली", code: "mai-IN" },
    { name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ", code: "sat-IN" },
    { name: "Kashmiri", native: "کأشُر", code: "ks-IN" },
    { name: "Nepali", native: "नेपाली", code: "ne-IN" },
    { name: "Konkani", native: "कोंकणी", code: "gom-IN" },
    { name: "Sindhi", native: "सिन्धी", code: "sd-IN" },
    { name: "Dogri", native: "डोगरी", code: "doi-IN" },
    { name: "Manipuri", native: "মণিপুরী", code: "mni-IN" },
    { name: "Bodo", native: "बर'", code: "brx-IN" },
    { name: "Sanskrit", native: "संस्कृतम्", code: "sa-IN" },
    { name: "Urdu", native: "اُردُو", code: "ur-IN" }
];

export const getLanguageCode = (languageName) => {
    const lang = LANGUAGES.find(l => l.name === languageName);
    return lang ? lang.code : 'en-US';
};
