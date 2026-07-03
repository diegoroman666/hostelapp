import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export default function LegalPage() {
    const { t } = useGlobal();
    const location = useLocation();

    useEffect(() => {
        const id = location.hash?.replace('#', '');
        if (id) {
            const el = document.getElementById(id);
            if (el) {
                setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.hash]);

    return (
        <section className="section">
            <div className="container" style={{ maxWidth: '800px' }}>
                <section id="privacy" className="glass-card" style={{ marginBottom: '2rem', scrollMarginTop: '100px' }}>
                    <h2 className="text-gold" style={{ marginBottom: '1rem' }}>{t('footer.privacyPolicy')}</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
                        {t('legal.privacyIntro')}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
                        {t('legal.privacyBody1')}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                        {t('legal.privacyBody2')}
                    </p>
                </section>

                <section id="terms" className="glass-card" style={{ marginBottom: '2rem', scrollMarginTop: '100px' }}>
                    <h2 className="text-gold" style={{ marginBottom: '1rem' }}>{t('footer.termsOfService')}</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
                        {t('legal.termsIntro')}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
                        {t('legal.termsBody1')}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                        {t('legal.termsBody2')}
                    </p>
                </section>

                <section id="cancellation" className="glass-card" style={{ scrollMarginTop: '100px' }}>
                    <h2 className="text-gold" style={{ marginBottom: '1rem' }}>{t('footer.cancellationPolicy')}</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
                        {t('legal.cancellationIntro')}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                        {t('legal.cancellationBody1')}
                    </p>
                </section>
            </div>
        </section>
    );
}
