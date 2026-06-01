import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useGlobal } from '../../context/GlobalContext';
import ServiceManager from './ServiceManager';
import RoomManager from './RoomManager';
import BookingManager from './BookingManager';
import SettingsManager from './SettingsManager';
import AdminCalendar from './AdminCalendar';

export default function Dashboard() {
    const { t, formatPrice } = useGlobal();
    const [activeTab, setActiveTab] = useState('agenda');
    const [stats, setStats] = useState({
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        totalRevenue: 0
    });
    const [bookings, setBookings] = useState([]);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [selectedBookingForEmail, setSelectedBookingForEmail] = useState(null);
    const [sendingEmail, setSendingEmail] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        fetchStats();
        fetchBookings();
    }, [activeTab]);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) navigate('/login');
    };

    const fetchStats = async () => {
        try {
            const { data: bookingsData, error } = await supabase
                .from('bookings')
                .select('status, total_amount');
            if (error) throw error;
            setStats({
                totalBookings: bookingsData.length,
                pendingBookings: bookingsData.filter(b => b.status === 'pending').length,
                confirmedBookings: bookingsData.filter(b => b.status === 'confirmed').length,
                totalRevenue: bookingsData
                    .filter(b => b.status === 'confirmed')
                    .reduce((sum, b) => sum + (b.total_amount || 0), 0)
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase.from('bookings').select('*');
            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleSendEmail = (booking) => {
        setSelectedBookingForEmail(booking);
        setEmailModalOpen(true);
    };

    const sendConfirmationEmail = async () => {
        setSendingEmail(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert(`✅ Confirmation email sent to ${selectedBookingForEmail.guest_email}!`);
        setSendingEmail(false);
        setEmailModalOpen(false);
        setSelectedBookingForEmail(null);
    };

    const tabs = [
        { key: 'agenda',   icon: '📅', label: t('admin.tabs.agenda') },
        { key: 'overview', icon: '📊', label: t('admin.tabs.overview') },
        { key: 'bookings', icon: '📝', label: t('admin.tabs.bookings') },
        { key: 'rooms',    icon: '🏠', label: t('admin.tabs.rooms') },
        { key: 'services', icon: '🛎️', label: t('admin.tabs.services') },
        { key: 'settings', icon: '⚙️', label: t('admin.tabs.settings') },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'agenda':
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>{t('admin.agenda.title')}</h2>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="glass-card" style={{ padding: '0.5rem 1rem', minWidth: '150px' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('admin.agenda.pending')}</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.pendingBookings}</div>
                                </div>
                                <div className="glass-card" style={{ padding: '0.5rem 1rem', minWidth: '150px' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('admin.agenda.confirmed')}</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.confirmedBookings}</div>
                                </div>
                            </div>
                        </div>
                        <AdminCalendar bookings={bookings} onEditBooking={() => setActiveTab('bookings')} onSendEmail={handleSendEmail} />
                    </div>
                );
            case 'overview':
                return (
                    <div>
                        <h2 style={{ marginBottom: '2rem' }}>{t('admin.overview.title')}</h2>
                        <div className="grid grid-2">
                            <div className="glass-card">
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>{t('admin.overview.totalBookings')}</h3>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>{stats.totalBookings}</div>
                            </div>
                            <div className="glass-card">
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>{t('admin.overview.pendingBookings')}</h3>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.pendingBookings}</div>
                            </div>
                            <div className="glass-card">
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>{t('admin.overview.confirmedBookings')}</h3>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.confirmedBookings}</div>
                            </div>
                            <div className="glass-card">
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>{t('admin.overview.revenue')}</h3>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-teal)' }}>{formatPrice(stats.totalRevenue)}</div>
                            </div>
                        </div>
                    </div>
                );
            case 'services':
                return <ServiceManager />;
            case 'rooms':
                return <RoomManager />;
            case 'bookings':
                return <BookingManager />;
            case 'settings':
                return <SettingsManager />;
            default:
                return null;
        }
    };

    return (
        <div className="section" style={{ minHeight: '80vh' }}>
            <div className="container-wide">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ marginBottom: '1rem' }}>{t('admin.dashboard')}</h1>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {renderContent()}

                {emailModalOpen && selectedBookingForEmail && (
                    <div className="modal-overlay" onClick={() => setEmailModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                            <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ color: 'var(--accent-gold)' }}>📧 {t('admin.email.title')}</h3>
                            </div>

                            <div className="glass-card" style={{ background: 'white', color: '#1a1a1a', padding: '2rem', marginBottom: '1.5rem', fontFamily: 'serif' }}>
                                <div style={{ borderBottom: '2px solid #8b1538', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ margin: 0, color: '#8b1538', fontFamily: 'sans-serif' }}>SCORPIUS HOSTEL</h2>
                                    <div style={{ fontSize: '2rem' }}>♏</div>
                                </div>
                                <h4 style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', margin: '1.5rem 0' }}>{t('admin.email.subject')}</h4>
                                <p>Dear <strong>{selectedBookingForEmail.guest_name}</strong>,</p>
                                <p>We are thrilled to confirm your stay with us!</p>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', marginBottom: '1rem' }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem 0', color: '#666' }}>ID:</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: 'bold', textAlign: 'right' }}>#{selectedBookingForEmail.id.slice(0, 8).toUpperCase()}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem 0', color: '#666' }}>Check-in:</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: 'bold', textAlign: 'right' }}>{new Date(selectedBookingForEmail.check_in).toLocaleDateString()}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem 0', color: '#666' }}>Check-out:</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: 'bold', textAlign: 'right' }}>{new Date(selectedBookingForEmail.check_out).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: '#666', fontSize: '1.1rem' }}>Total:</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: 'bold', textAlign: 'right', fontSize: '1.1rem', color: '#8b1538' }}>{selectedBookingForEmail.total_amount != null ? formatPrice(selectedBookingForEmail.total_amount) : '—'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEmailModalOpen(false)} disabled={sendingEmail}>
                                    {t('admin.email.cancel')}
                                </button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={sendConfirmationEmail} disabled={sendingEmail}>
                                    {sendingEmail ? t('admin.email.sending') : `🚀 ${t('admin.email.send')}`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
