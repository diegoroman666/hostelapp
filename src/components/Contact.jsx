import React from 'react';

export default function Contact() {
    return (
        <section className="section" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <h2 className="section-title">Find Us Among the Stars</h2>
                <p className="section-subtitle">
                    Visit us or get in touch - we're here to make your stay unforgettable
                </p>

                <div className="grid grid-3" style={{ marginTop: '3rem' }}>
                    {/* Location */}
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                        <h3 className="text-gold" style={{ marginBottom: '1rem' }}>Location</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            123 Constellation Avenue<br />
                            Downtown District<br />
                            City Center, 12345
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📞</div>
                        <h3 className="text-gold" style={{ marginBottom: '1rem' }}>Contact</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Phone: +1 (555) 123-4567<br />
                            Email: info@scorpius.com<br />
                            WhatsApp: +1 (555) 987-6543
                        </p>
                    </div>

                    {/* Hours */}
                    <div className="glass-card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕐</div>
                        <h3 className="text-gold" style={{ marginBottom: '1rem' }}>Reception Hours</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            24/7 Reception<br />
                            Check-in: 2:00 PM<br />
                            Check-out: 11:00 AM
                        </p>
                    </div>
                </div>

                {/* Map Placeholder */}
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
                            <p>Google Maps Integration</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                (Add your Google Maps embed code here)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
