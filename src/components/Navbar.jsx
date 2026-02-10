import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('night');

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
    };

    const toggleTheme = () => {
        const newTheme = theme === 'night' ? 'day' : 'night';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-logo">
                    <span className="scorpio-symbol">♏</span>
                    SCORPIUS
                </Link>
                <div className="navbar-links">
                    <Link to="/" className="navbar-link">Home</Link>
                    <Link to="/booking" className="navbar-link">Book Now</Link>
                    <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
                        {theme === 'night' ? '☀️' : '🌙'}
                    </button>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                            <button onClick={handleLogout} className="btn btn-outline">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Manager Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
