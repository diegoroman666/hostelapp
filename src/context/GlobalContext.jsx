import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations, currencyRates } from '../data/translations';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [language, setLanguageState] = useState(
        () => localStorage.getItem('site_language') || 'en'
    );
    const [currency, setCurrencyState] = useState(
        () => localStorage.getItem('site_currency') || 'USD'
    );

    const setLanguage = (lang) => {
        localStorage.setItem('site_language', lang);
        setLanguageState(lang);
    };

    const setCurrency = (curr) => {
        localStorage.setItem('site_currency', curr);
        setCurrencyState(curr);
    };

    const t = (path) => {
        const keys = path.split('.');
        let current = translations[language] || translations['en'];
        for (let key of keys) {
            if (current == null || typeof current !== 'object') return path;
            if (current[key] === undefined) return path;
            current = current[key];
        }
        return (typeof current === 'string' || Array.isArray(current)) ? current : path;
    };

    const formatPrice = (amountInUSD) => {
        const rate = currencyRates[currency] || 1;
        const converted = amountInUSD * rate;
        return new Intl.NumberFormat(language, {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
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
