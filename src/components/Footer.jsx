import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export default function Footer() {
    const { t, siteSettings } = useGlobal();
    const currentYear = new Date().getFullYear();

    const hostelName = siteSettings.hostel_name || t('brand');
    const address = siteSettings.contact_address || t('contact.address1');
    const phone = siteSettings.contact_phone || '+1 (555) 123-4567';
    const email = siteSettings.contact_email || 'info@scorpius.com';
    const whatsapp = siteSettings.contact_whatsapp || '+1 (555) 987-6543';
    const facebookUrl = siteSettings.social_facebook || 'https://www.xn--turismovicua-khb.cl/lugar/scorpius-hostel/';
    const instagramUrl = siteSettings.social_instagram || 'https://www.instagram.com/scorpiushostel/';
    const bookingUrl = siteSettings.social_booking || 'https://www.booking.com/hotel/cl/scorpius-hostel.es.html';

    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--glass-border)',
            padding: '4rem 0 2rem'
        }}>
            <div className="container">
                {/* Footer Columns */}
                <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
                    {/* About Column */}
                    <div>
                        <h4 style={{
                            color: 'var(--accent-gold)',
                            marginBottom: '1rem',
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.2rem'
                        }}>
                            ♏ {hostelName}
                        </h4>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            lineHeight: '1.6'
                        }}>
                            {t('footer.aboutText')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            color: 'var(--accent-gold)',
                            marginBottom: '1rem',
                            fontSize: '1.1rem'
                        }}>
                            {t('footer.quickLinks')}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link to="/" style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    transition: 'var(--transition)'
                                }} className="footer-link">
                                    {t('nav.home')}
                                </Link>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link to="/booking" style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem'
                                }} className="footer-link">
                                    {t('nav.book')}
                                </Link>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <a href="#amenities" style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem'
                                }} className="footer-link">
                                    {t('amenities.title')}
                                </a>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link to="/login" style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem'
                                }} className="footer-link">
                                    {t('nav.login')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{
                            color: 'var(--accent-gold)',
                            marginBottom: '1rem',
                            fontSize: '1.1rem'
                        }}>
                            {t('footer.contactHeader')}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                📍 {address}
                            </li>
                            <li style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                📞 {phone}
                            </li>
                            <li style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                ✉️ {email}
                            </li>
                            <li style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                💬 WhatsApp: {whatsapp}
                            </li>
                        </ul>
                    </div>

                    {/* Social & Hours */}
                    <div>
                        <h4 style={{
                            color: 'var(--accent-gold)',
                            marginBottom: '1rem',
                            fontSize: '1.1rem'
                        }}>
                            {t('footer.followUs')}
                        </h4>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                            fontSize: '1.5rem'
                        }}>
                            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" style={{
                                color: 'var(--text-secondary)',
                                transition: 'var(--transition)'
                            }} className="social-link" aria-label="Facebook">📘</a>
                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{
                                color: 'var(--text-secondary)',
                                transition: 'var(--transition)'
                            }} className="social-link" aria-label="Instagram">📷</a>
                            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" style={{
                                color: 'var(--text-secondary)',
                                transition: 'var(--transition)'
                            }} className="social-link" aria-label="Booking.com">🏨</a>
                        </div>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            marginBottom: '0.3rem'
                        }}>
                            <strong>{t('footer.reception247')}</strong>
                        </p>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem'
                        }}>
                            {t('footer.checkInTime')}<br />
                            {t('footer.checkOutTime')}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div style={{
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '2rem',
                    marginTop: '2rem'
                }}>
                    {/* Bottom Row */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            margin: 0
                        }}>
                            © {currentYear} {hostelName}. {t('footer.copyright')}
                        </p>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            margin: 0
                        }}>
                            {t('footer.developedBy')} <span style={{
                                color: 'var(--accent-gold)',
                                fontWeight: '600'
                            }}>Informatik-2026 IEI</span>
                        </p>
                    </div>

                    {/* Legal Links */}
                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        gap: '2rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link to="/legal#privacy" style={{
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.85rem'
                        }} className="footer-link">
                            {t('footer.privacyPolicy')}
                        </Link>
                        <Link to="/legal#terms" style={{
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.85rem'
                        }} className="footer-link">
                            {t('footer.termsOfService')}
                        </Link>
                        <Link to="/legal#cancellation" style={{
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.85rem'
                        }} className="footer-link">
                            {t('footer.cancellationPolicy')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
