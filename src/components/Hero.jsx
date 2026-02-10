import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Hero() {
    const [settings, setSettings] = useState({
        hostel_name: 'SCORPIUS HOSTEL',
        hero_description: 'Where the stars align for unforgettable journeys. Experience cosmic comfort in the heart of the city.',
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

            if (error) {
                console.warn('Using demo data - Supabase not configured:', error.message);
                setLoading(false);
                return;
            }

            if (data && data.length > 0) {
                const settingsObj = {};
                data.forEach(item => {
                    settingsObj[item.key] = item.value;
                });
                setSettings(prev => ({ ...prev, ...settingsObj }));
            }
        } catch (error) {
            console.warn('Using demo data - Supabase not configured:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="hero">
            {settings.hero_image && (
                <img
                    src={settings.hero_image}
                    alt="Scorpius Hostel"
                    className="hero-background"
                />
            )}
            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="scorpio-symbol" style={{ fontSize: '4rem' }}>♏</span>
                    <br />
                    {settings.hostel_name}
                </h1>
                <p className="hero-subtitle">{settings.hero_description}</p>
                <a href="#booking" className="btn btn-primary btn-lg">
                    🌟 Reserve Your Constellation
                </a>
            </div>
        </section>
    );
}
