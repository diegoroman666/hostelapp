import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export default function Footer() {
    const { t } = useGlobal();
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--glass-border)',
            padding: '4rem 0 2rem'
        }}>
            <div className="container">
                <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
                    {/* About */}
                    <div>
                        <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>
                            ♏ SCORPIUS
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            {t('footer.about')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                            {t('footer.quickLinks')}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }} className="footer-link">
                                    {t('nav.home')}
                                </Link>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link to="/booking" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }} className="footer-link">
                                    {t('nav.book')}
                                </Link>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <a href="#amenities" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }} className="footer-link">
                                    {t('footer.amenities')}
                                </a>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }} className="footer-link">
                                    {t('nav.login')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                            {t('footer.contactLabel')}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>📍 123 Constellation Ave</li>
                            <li style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>📞 +1 (555) 123-4567</li>
                            <li style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✉️ info@scorpius.com</li>
                            <li style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>💬 WhatsApp: +1 (555) 987-6543</li>
                        </ul>
                    </div>

                    {/* Social & Hours */}
                    <div>
                        <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                            {t('footer.followUs')}
                        </h4>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                            <a href="#" style={{ color: 'var(--text-secondary)', transition: 'var(--transition)' }} className="social-link">📘</a>
                            <a href="#" style={{ color: 'var(--text-secondary)', transition: 'var(--transition)' }} className="social-link">📷</a>
                            <a href="#" style={{ color: 'var(--text-secondary)', transition: 'var(--transition)' }} className="social-link">🐦</a>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                            <strong>{t('footer.reception')}</strong>
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            {t('footer.checkin')}<br />
                            {t('footer.checkout')}
                        </p>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                            © {currentYear} Scorpius Hostel. {t('footer.rights')}
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                            {t('footer.developed')} <span style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>INFORMATIK 2026</span>
                        </p>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} className="footer-link">
                            {t('footer.privacy')}
                        </a>
                        <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} className="footer-link">
                            {t('footer.terms')}
                        </a>
                        <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }} className="footer-link">
                            {t('footer.cancellation')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
