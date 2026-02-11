import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useGlobal } from '../context/GlobalContext';

export default function Hero() {
    const { t } = useGlobal();
    const [settings, setSettings] = useState({
        hero_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('key, value');

            if (data && data.length > 0) {
                const settingsObj = {};
                data.forEach(item => {
                    if (item.key === 'hero_image') {
                        settingsObj[item.key] = item.value;
                    }
                });
                setSettings(prev => ({ ...prev, ...settingsObj }));
            }
        } catch (error) {
            console.warn('Using demo data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="hero">
            {settings.hero_image && (
                <img
                    src={settings.hero_image}
                    alt={t('brand')}
                    className="hero-background"
                />
            )}
            <div className="hero-content">
                <h1 className="hero-title">
                    {t('brand')}
                </h1>
                <p className="hero-subtitle">{t('hero.subtitle')}</p>
                <a href="#booking" className="btn btn-primary btn-lg">
                    🌟 {t('hero.title')}
                </a>
            </div>
        </section>
    );
}
