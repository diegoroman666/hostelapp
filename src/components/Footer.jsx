import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

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
                            ♏ SCORPIUS
                        </h4>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            lineHeight: '1.6'
                        }}>
                            Where the stars align for unforgettable journeys. Experience cosmic comfort in the heart of the city.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            color: 'var(--accent-gold)',
                            marginBottom: '1rem',
                            fontSize: '1.1rem'
                        }}>
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link to="/" style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    transition: 'var(--transition)'
                                }} className="footer-link">
                                    Home
                                </Link>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link to="/booking" style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem'
                                }} className="footer-link">
                                    Book Now
                                </Link>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <a href="#amenities" style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem'
                                }} className="footer-link">
                                    Amenities
                                </a>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link to="/login" style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem'
                                }} className="footer-link">
                                    Manager Login
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
                            Contact
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                📍 123 Constellation Ave
                            </li>
                            <li style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                📞 +1 (555) 123-4567
                            </li>
                            <li style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                ✉️ info@scorpius.com
                            </li>
                            <li style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                💬 WhatsApp: +1 (555) 987-6543
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
                            Follow Us
                        </h4>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                            fontSize: '1.5rem'
                        }}>
                            <a href="#" style={{
                                color: 'var(--text-secondary)',
                                transition: 'var(--transition)'
                            }} className="social-link">📘</a>
                            <a href="#" style={{
                                color: 'var(--text-secondary)',
                                transition: 'var(--transition)'
                            }} className="social-link">📷</a>
                            <a href="#" style={{
                                color: 'var(--text-secondary)',
                                transition: 'var(--transition)'
                            }} className="social-link">🐦</a>
                        </div>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            marginBottom: '0.3rem'
                        }}>
                            <strong>24/7 Reception</strong>
                        </p>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem'
                        }}>
                            Check-in: 2:00 PM<br />
                            Check-out: 11:00 AM
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
                            © {currentYear} Scorpius Hostel. All rights reserved.
                        </p>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            margin: 0
                        }}>
                            Developed by <span style={{
                                color: 'var(--accent-gold)',
                                fontWeight: '600'
                            }}>INFORMATIK 2026</span>
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
                        <a href="#" style={{
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.85rem'
                        }} className="footer-link">
                            Privacy Policy
                        </a>
                        <a href="#" style={{
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.85rem'
                        }} className="footer-link">
                            Terms of Service
                        </a>
                        <a href="#" style={{
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.85rem'
                        }} className="footer-link">
                            Cancellation Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
