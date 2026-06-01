import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations, currencyRates } from '../data/translations';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

// Map language codes to BCP 47 locale tags for Intl
const LOCALE_MAP = {
    en: 'en-US',
    es: 'es-CL',
    de: 'de-DE',
    fr: 'fr-FR',
    it: 'it-IT'
};

export const GlobalProvider = ({ children }) => {
    // Initialise from localStorage so language/currency persist between visits
    const [language, setLanguageState] = useState(() => {
        if (typeof window === 'undefined') return 'en';
        const saved = localStorage.getItem('language');
        return saved && translations[saved] ? saved : 'en';
    });
    const [currency, setCurrencyState] = useState(() => {
        if (typeof window === 'undefined') return 'USD';
        const saved = localStorage.getItem('currency');
        return saved && currencyRates[saved] ? saved : 'USD';
    });

    const setLanguage = (lang) => {
        setLanguageState(lang);
        try { localStorage.setItem('language', lang); } catch (e) { }
    };

    const setCurrency = (curr) => {
        setCurrencyState(curr);
        try { localStorage.setItem('currency', curr); } catch (e) { }
    };

    // Helper to get nested translation. Returns the key itself if not found.
    const t = (path) => {
        if (!path) return '';
        const keys = path.split('.');
        let current = translations[language] || translations.en;
        for (let key of keys) {
            if (current == null || current[key] === undefined) {
                // fall back to English so the UI never breaks
                current = translations.en;
                for (let k2 of keys) {
                    if (current == null || current[k2] === undefined) return path;
                    current = current[k2];
                }
                return current;
            }
            current = current[key];
        }
        return current;
    };

    // Helper to format a USD amount into the selected currency for the
    // selected language locale. Safe against null/undefined/NaN amounts.
    const formatPrice = (amountInUSD) => {
        const value = Number(amountInUSD);
        if (!Number.isFinite(value)) {
            return new Intl.NumberFormat(LOCALE_MAP[language] || 'en-US', {
                style: 'currency',
                currency: currency || 'USD',
                maximumFractionDigits: 0
            }).format(0);
        }
        const rate = currencyRates[currency] ?? 1;
        const converted = value * rate;
        return new Intl.NumberFormat(LOCALE_MAP[language] || 'en-US', {
            style: 'currency',
            currency: currency || 'USD',
            maximumFractionDigits: currency === 'CLP' ? 0 : 2
        }).format(converted);
    };

    const value = {
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        formatPrice
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};
