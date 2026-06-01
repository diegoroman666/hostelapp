import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useGlobal } from '../../context/GlobalContext';

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

const CURRENCIES = [
    { code: 'USD', label: '$ USD' },
    { code: 'CLP', label: '$ CLP' },
    { code: 'EUR', label: '€ EUR' },
];

export default function SettingsManager() {
    const { language, setLanguage, currency, setCurrency, t } = useGlobal();

    const [settings, setSettings] = useState({ hostel_name: '', hero_description: '', hero_image: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase.from('site_settings').select('key, value');
            if (error) throw error;
            if (data) {
                const settingsObj = {};
                data.forEach(item => { settingsObj[item.key] = item.value; });
                setSettings(prev => ({ ...prev, ...settingsObj }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            for (const [key, value] of Object.entries(settings)) {
                const { error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
                if (error) throw error;
            }
            setMessage({ type: 'success', text: t('admin.settings.saved') });
        } catch (error) {
            setMessage({ type: 'error', text: t('admin.settings.saveError') + error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>{t('admin.settings.title')}</h2>

            {/* Language & Currency */}
            <div className="glass-card" style={{ maxWidth: '800px', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>
                    🌍 {t('admin.settings.langCurrency')}
                </h3>

                <div className="input-group">
                    <label className="input-label">{t('admin.settings.siteLanguage')}</label>
                    <div className="pill-selector" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                type="button"
                                className={`pill-btn ${language === lang.code ? 'active' : ''}`}
                                onClick={() => setLanguage(lang.code)}
                                style={{ fontSize: '0.95rem' }}
                            >
                                {lang.flag} {lang.label}
                            </button>
                        ))}
                    </div>
                    <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {t('admin.settings.langNote')}
                    </p>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">{t('admin.settings.currency')}</label>
                    <div className="pill-selector">
                        {CURRENCIES.map(curr => (
                            <button
                                key={curr.code}
                                type="button"
                                className={`pill-btn ${currency === curr.code ? 'active' : ''}`}
                                onClick={() => setCurrency(curr.code)}
                            >
                                {curr.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hostel Settings Form */}
            <div className="glass-card" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">{t('admin.settings.hostelName')}</label>
                        <input
                            type="text"
                            name="hostel_name"
                            className="input-field"
                            value={settings.hostel_name}
                            onChange={handleInputChange}
                            placeholder="Paradise Hostel"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('admin.settings.heroDescription')}</label>
                        <textarea
                            name="hero_description"
                            className="input-field"
                            value={settings.hero_description}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Your home away from home..."
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('admin.settings.heroImageUrl')}</label>
                        <input
                            type="url"
                            name="hero_image"
                            className="input-field"
                            value={settings.hero_image}
                            onChange={handleInputChange}
                            placeholder="https://example.com/hero.jpg"
                        />
                        {settings.hero_image && (
                            <div style={{ marginTop: '1rem' }}>
                                <img
                                    src={settings.hero_image}
                                    alt="Hero preview"
                                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                />
                            </div>
                        )}
                    </div>

                    {message.text && (
                        <div className={`toast toast-${message.type}`} style={{ position: 'relative', bottom: 'auto', right: 'auto', marginBottom: '1rem' }}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
                        {saving ? t('admin.settings.saving') : t('admin.settings.save')}
                    </button>
                </form>
            </div>
        </div>
    );
}
