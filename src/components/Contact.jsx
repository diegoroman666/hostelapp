import React from 'react';
import { useGlobal } from '../context/GlobalContext';

export default function Contact() {
    const { t, siteSettings } = useGlobal();

    const address = siteSettings.contact_address;
    const phone = siteSettings.contact_phone || '+1 (555) 123-4567';
    const email = siteSettings.contact_email || 'info@scorpius.com';
    const whatsapp = siteSettings.contact_whatsapp || '+1 (555) 987-6543';

    return (
        <section className="section" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <h2 className="section-title">{t('contact.title')}</h2>
                <p className="section-subtitle">
                    {t('contact.subtitle')}
                </p>

                <div className="grid grid-3" style={{ marginTop: '3rem' }}>
                    {/* Location */}
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                        <h3 className="text-gold" style={{ marginBottom: '1rem' }}>{t('contact.location')}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {address ? address : (
                                <>
                                    {t('contact.address1')}<br />
                                    {t('contact.address2')}<br />
                                    {t('contact.address3')}
                                </>
                            )}
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📞</div>
                        <h3 className="text-gold" style={{ marginBottom: '1rem' }}>{t('contact.contactCard')}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            📞 {phone}<br />
                            ✉️ {email}<br />
                            💬 {whatsapp}
                        </p>
                    </div>

                    {/* Hours */}
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕐</div>
                        <h3 className="text-gold" style={{ marginBottom: '1rem' }}>{t('contact.hoursCard')}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {t('contact.reception247')}<br />
                            {t('contact.checkInTime')}<br />
                            {t('contact.checkOutTime')}
                        </p>
                    </div>
                </div>

                {/* Map */}
                <div className="glass-card" style={{ marginTop: '3rem', padding: '0', overflow: 'hidden' }}>
                    <iframe
                        title="Scorpius Hostel - Gabriela Mistral 622, Vicuña"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1673!2d-70.7093!3d-30.0313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sGabriela%20Mistral%20622%2C%20Vicu%C3%B1a!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl"
                        style={{ width: '100%', height: '400px', border: '0', display: 'block' }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    );
}
