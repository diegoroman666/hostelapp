import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useGlobal } from '../context/GlobalContext';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('night');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Consume Global Context
    const { language, setLanguage, currency, setCurrency, t } = useGlobal();

    useEffect(() => {
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Load theme from localStorage
        const savedTheme = localStorage.getItem('theme') || 'night';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsMenuOpen(false);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'night' ? 'day' : 'night';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <>
            <nav className="navbar">
                <div className="container navbar-content-mobile">
                    {/* LEFT: Hamburger Menu */}
                    <button
                        className="menu-toggle-btn"
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <span style={{ fontSize: '1.5rem' }}>☰</span>
                    </button>

                    {/* CENTER: Logo */}
                    <Link to="/" className="navbar-logo-center" onClick={() => setIsMenuOpen(false)}>
                        <span className="scorpio-symbol">♏</span>
                        <span className="logo-text">SCORPIUS</span>
                    </Link>

                    {/* RIGHT: Quick Actions */}
                    <div className="navbar-actions-right">
                        <button onClick={toggleTheme} className="icon-btn" title="Toggle theme">
                            {theme === 'night' ? '☀️' : '🌙'}
                        </button>
                        {user ? (
                            <Link to="/dashboard" className="icon-btn profile-btn">👤</Link>
                        ) : (
                            <Link to="/login" className="icon-btn login-btn">🔑</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* SIDEBAR DRAWER (Overlay) */}
            <div className={`sidebar-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)} />

            {/* SIDEBAR CONTENT */}
            <aside className={`sidebar-drawer ${isMenuOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <span className="sidebar-title">{t('nav.dashboard') || 'Menu'}</span>
                    <button className="close-btn" onClick={() => setIsMenuOpen(false)}>✕</button>
                </div>

                <div className="sidebar-body">
                    {/* Navigation Links */}
                    <div className="sidebar-section">
                        <h4 className="sidebar-heading">Navigation</h4>
                        <nav className="sidebar-nav-links">
                            <Link to="/" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>🏠 {t('nav.home')}</Link>
                            <Link to="/booking" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>📅 {t('nav.book')}</Link>
                            {user && <Link to="/dashboard" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>📊 {t('nav.dashboard')}</Link>}
                            {user && <button onClick={handleLogout} className="sidebar-link logout-link">🚪 {t('nav.logout')}</button>}
                        </nav>
                    </div>

                    <hr className="sidebar-divider" />

                    {/* Internationalization (I18n) */}
                    <div className="sidebar-section">
                        <h4 className="sidebar-heading">Language 🌍</h4>
                        <div className="pill-selector">
                            {['EN', 'ES', 'DE', 'FR', 'IT'].map(lang => (
                                <button
                                    key={lang}
                                    className={`pill-btn ${language === lang.toLowerCase() ? 'active' : ''}`}
                                    onClick={() => setLanguage(lang.toLowerCase())}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h4 className="sidebar-heading">Currency 💰</h4>
                        <div className="pill-selector">
                            {['USD', 'CLP', 'EUR'].map(curr => (
                                <button
                                    key={curr}
                                    className={`pill-btn ${currency === curr ? 'active' : ''}`}
                                    onClick={() => setCurrency(curr)}
                                >
                                    {curr}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <p>© 2026 Scorpius Hostel</p>
                </div>
            </aside>
        </>
    );
}
