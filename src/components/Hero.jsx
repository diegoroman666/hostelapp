import React from 'react';
import { useGlobal } from '../context/GlobalContext';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop';

export default function Hero() {
    const { t, siteSettings } = useGlobal();

    const heroImage = siteSettings.hero_image || DEFAULT_HERO_IMAGE;
    const hostelName = siteSettings.hostel_name || t('brand');
    const logoUrl = siteSettings.logo_url;

    return (
        <section className="hero">
            {heroImage && (
                <img
                    src={heroImage}
                    alt={hostelName}
                    className="hero-background"
                />
            )}
            <div className="hero-content">
                <h1 className="hero-title">
                    {logoUrl
                        ? <img src={logoUrl} alt={hostelName} className="hero-logo-img" />
                        : <span className="scorpio-symbol" style={{ fontSize: '4rem' }}>♏</span>}
                    <br />
                    {hostelName}
                </h1>
                <p className="hero-subtitle">{t('hero.subtitle')}</p>
                <a href="#booking" className="btn btn-primary btn-lg">
                    🌟 {t('hero.title')}
                </a>
            </div>
        </section>
    );
}
