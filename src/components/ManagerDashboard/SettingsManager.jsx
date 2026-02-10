import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SettingsManager() {
    const [settings, setSettings] = useState({
        hostel_name: '',
        hero_description: '',
        hero_image: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
            // Update each setting
            for (const [key, value] of Object.entries(settings)) {
                const { error } = await supabase
                    .from('site_settings')
                    .upsert({ key, value }, { onConflict: 'key' });

                if (error) throw error;
            }

            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error saving settings: ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Site Settings</h2>

            <div className="glass-card" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Hostel Name</label>
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
                        <label className="input-label">Hero Description</label>
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
                        <label className="input-label">Hero Image URL</label>
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
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </form>
            </div>
        </div>
    );
}
