import React from 'react';
import { useGlobal } from '../context/GlobalContext';

export default function Contact() {
    const { t } = useGlobal();

    return (
        <section className="section" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <h2 className="section-title">{t('contact.title')}</h2>
                <p className="section-subtitle">{t('contact.subtitle')}</p>

                <div className="grid grid-3" style={{ marginTop: '3rem' }}>
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                        <h3 className="text-gold" style={{ marginBottom: '1rem' }}>{t('contact.location')}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            123 Constellation Avenue<br />
                            Downtown District<br />
                            City Center, 12345
                        </p>
                    </div>

                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📞</div>
                        <h3 className="text-gold" style={{ marginBottom: '1rem' }}>{t('contact.contactLabel')}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            +1 (555) 123-4567<br />
                            info@scorpius.com<br />
                            WhatsApp: +1 (555) 987-6543
                        </p>
                    </div>

                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕐</div>
                        <h3 className="text-gold" style={{ marginBottom: '1rem' }}>{t('contact.hours')}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {t('contact.reception')}<br />
                            {t('contact.checkin')}<br />
                            {t('contact.checkout')}
                        </p>
                    </div>
                </div>

                <div className="glass-card" style={{ marginTop: '3rem', padding: '0', overflow: 'hidden' }}>
                    <div style={{
                        width: '100%',
                        height: '400px',
                        background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
                            <p>{t('contact.mapPlaceholder')}</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>({t('contact.mapNote')})</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
