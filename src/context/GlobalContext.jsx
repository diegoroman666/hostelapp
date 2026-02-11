import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations, currencyRates } from '../data/translations';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [currency, setCurrency] = useState('USD');

    // Helper to get nested translation
    const t = (path) => {
        const keys = path.split('.');
        let current = translations[language];
        for (let key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }
        return current;
    };

    // Helper to format currency
    const formatPrice = (amountInUSD) => {
        const rate = currencyRates[currency];
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
