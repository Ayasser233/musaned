// Translation System
const currentLangKey = 'language';
let currentLang = localStorage.getItem(currentLangKey) || 'en';
let translations = {};

// Load translations
async function loadTranslations() {
    try {
        const response = await fetch('../js/translations.json');
        translations = await response.json();
        applyTranslations();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Get nested object value using dot notation
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => (current ? current[key] : undefined), obj);
}

// Apply translations to the page (exposed)
function applyTranslations() {
    const langObj = translations[currentLang];
    if (!langObj) return;

    // Set document direction and lang
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', langObj.direction || (currentLang === 'ar' ? 'rtl' : 'ltr'));

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedValue(langObj, key);

        if (value !== undefined && value !== null) {
            const tag = element.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') {
                element.placeholder = value;
            } else if (element.hasAttribute('data-i18n-html')) {
                element.innerHTML = value;
            } else {
                element.textContent = value;
            }
        }
    });

    // Update language switcher button(s)
    document.querySelectorAll('.lang-switcher-btn').forEach((btn) => {
        btn.textContent = currentLang === 'en' ? 'العربية' : 'English';
    });

    // Emit event for other scripts and components (e.g., header/footer loader)
    const ev = new CustomEvent('i18n:updated', { detail: { lang: currentLang } });
    document.dispatchEvent(ev);
}

// Set language programmatically
function setLanguage(lang) {
    if (!lang) return;
    currentLang = lang;
    localStorage.setItem(currentLangKey, currentLang);
    applyTranslations();
}

// Toggle language convenience
function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
}

// Expose API to window for other scripts
window.i18n = {
    setLanguage,
    toggleLanguage,
    applyTranslations,
    loadTranslations,
    get current() { return currentLang; }
};

// Backwards-compatibility global functions
window.setLanguage = setLanguage;
window.switchLanguage = toggleLanguage;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadTranslations);
