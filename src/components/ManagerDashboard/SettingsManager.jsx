import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useGlobal } from '../../context/GlobalContext';

export default function SettingsManager() {
    const { t, refreshSettings } = useGlobal();
    const [settings, setSettings] = useState({
        hostel_name: '',
        hero_description: '',
        hero_image: '',
        logo_url: '',
        contact_address: '',
        contact_phone: '',
        contact_email: '',
        contact_whatsapp: '',
        social_facebook: '',
        social_instagram: '',
        social_booking: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [revertingLogo, setRevertingLogo] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('key, value');

            if (error) throw error;

            if (data) {
                const settingsObj = {};
                data.forEach(item => {
                    settingsObj[item.key] = item.value;
                });
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
                const { error } = await supabase
                    .from('site_settings')
                    .upsert({ key, value }, { onConflict: 'key' });

                if (error) throw error;
            }

            // Propagate changes to the public site (navbar, hero, footer, contact) live
            await refreshSettings();
            setMessage({ type: 'success', text: t('settingsManager.success') });
        } catch (error) {
            setMessage({ type: 'error', text: t('settingsManager.errorSave') + error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleRevertLogo = async () => {
        setRevertingLogo(true);
        setMessage({ type: '', text: '' });
        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({ key: 'logo_url', value: '' }, { onConflict: 'key' });

            if (error) throw error;

            setSettings(prev => ({ ...prev, logo_url: '' }));
            await refreshSettings();
            setMessage({ type: 'success', text: t('settingsManager.logoReverted') });
        } catch (error) {
            setMessage({ type: 'error', text: t('settingsManager.errorSave') + error.message });
        } finally {
            setRevertingLogo(false);
        }
    };

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>{t('settingsManager.title')}</h2>

            <div className="glass-card" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">{t('settingsManager.lblHostelName')}</label>
                        <input
                            type="text"
                            name="hostel_name"
                            className="input-field"
                            value={settings.hostel_name}
                            onChange={handleInputChange}
                            placeholder={t('settingsManager.phHostelName')}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('settingsManager.lblHeroDescription')}</label>
                        <textarea
                            name="hero_description"
                            className="input-field"
                            value={settings.hero_description}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder={t('settingsManager.phHeroDescription')}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('settingsManager.lblHeroImageUrl')}</label>
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
                                    style={{
                                        width: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'cover',
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('settingsManager.lblLogoUrl')}</label>
                        <input
                            type="url"
                            name="logo_url"
                            className="input-field"
                            value={settings.logo_url}
                            onChange={handleInputChange}
                            placeholder="https://example.com/logo.png"
                        />
                        {settings.logo_url && (
                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <img
                                    src={settings.logo_url}
                                    alt="Logo preview"
                                    style={{
                                        height: '48px',
                                        width: '48px',
                                        objectFit: 'contain',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-tertiary)',
                                        padding: '4px'
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleRevertLogo}
                                    disabled={revertingLogo}
                                >
                                    {revertingLogo ? t('settingsManager.saving') : t('settingsManager.revertLogo')}
                                </button>
                            </div>
                        )}
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '2rem 0' }} />
                    <h3 style={{ marginBottom: '1rem' }}>{t('settingsManager.contactSection')}</h3>

                    <div className="input-group">
                        <label className="input-label">{t('settingsManager.lblContactAddress')}</label>
                        <input
                            type="text"
                            name="contact_address"
                            className="input-field"
                            value={settings.contact_address}
                            onChange={handleInputChange}
                            placeholder="Gabriela Mistral 622, Vicuña, Chile"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('settingsManager.lblContactPhone')}</label>
                        <input
                            type="text"
                            name="contact_phone"
                            className="input-field"
                            value={settings.contact_phone}
                            onChange={handleInputChange}
                            placeholder="+56 9 1234 5678"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('settingsManager.lblContactEmail')}</label>
                        <input
                            type="email"
                            name="contact_email"
                            className="input-field"
                            value={settings.contact_email}
                            onChange={handleInputChange}
                            placeholder="info@scorpiushostel.cl"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('settingsManager.lblContactWhatsapp')}</label>
                        <input
                            type="text"
                            name="contact_whatsapp"
                            className="input-field"
                            value={settings.contact_whatsapp}
                            onChange={handleInputChange}
                            placeholder="+56 9 8765 4321"
                        />
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '2rem 0' }} />
                    <h3 style={{ marginBottom: '1rem' }}>{t('settingsManager.socialSection')}</h3>

                    <div className="input-group">
                        <label className="input-label">{t('settingsManager.lblFacebook')}</label>
                        <input
                            type="url"
                            name="social_facebook"
                            className="input-field"
                            value={settings.social_facebook}
                            onChange={handleInputChange}
                            placeholder="https://facebook.com/tu-hostel"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('settingsManager.lblInstagram')}</label>
                        <input
                            type="url"
                            name="social_instagram"
                            className="input-field"
                            value={settings.social_instagram}
                            onChange={handleInputChange}
                            placeholder="https://instagram.com/tu-hostel"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('settingsManager.lblBooking')}</label>
                        <input
                            type="url"
                            name="social_booking"
                            className="input-field"
                            value={settings.social_booking}
                            onChange={handleInputChange}
                            placeholder="https://www.booking.com/hotel/cl/tu-hostel.es.html"
                        />
                    </div>

                    {message.text && (
                        <div className={`toast toast-${message.type}`} style={{ position: 'relative', bottom: 'auto', right: 'auto', marginBottom: '1rem' }}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={saving}
                    >
                        {saving ? t('settingsManager.saving') : t('settingsManager.save')}
                    </button>
                </form>
            </div>
        </div>
    );
}
