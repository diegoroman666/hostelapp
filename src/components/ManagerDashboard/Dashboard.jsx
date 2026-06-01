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
    const { t, formatPrice, language } = useGlobal();
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
        if (!session) {
            navigate('/login');
        }
    };

    const fetchStats = async () => {
        try {
            const { data: bookingsData, error } = await supabase
                .from('bookings')
                .select('status, total_amount');

            if (error) throw error;

            const stats = {
                totalBookings: bookingsData.length,
                pendingBookings: bookingsData.filter(b => b.status === 'pending').length,
                confirmedBookings: bookingsData.filter(b => b.status === 'confirmed').length,
                totalRevenue: bookingsData
                    .filter(b => b.status === 'confirmed')
                    .reduce((sum, b) => sum + (b.total_amount || 0), 0)
            };

            setStats(stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*');

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleEditBooking = (booking) => {
        setActiveTab('bookings');
    };

    const handleSendEmail = (booking) => {
        setSelectedBookingForEmail(booking);
        setEmailModalOpen(true);
    };

    const sendConfirmationEmail = async () => {
        setSendingEmail(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        alert(`✅ ${t('dashboard.emailSentAlert')} ${selectedBookingForEmail.guest_email}!\n\n${t('dashboard.emailSentAlert2')}`);
        setSendingEmail(false);
        setEmailModalOpen(false);
        setSelectedBookingForEmail(null);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'agenda':
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>{t('dashboard.agendaTitle')}</h2>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="glass-card" style={{ padding: '0.5rem 1rem', minWidth: '150px' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('dashboard.statPending')}</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.pendingBookings}</div>
                                </div>
                                <div className="glass-card" style={{ padding: '0.5rem 1rem', minWidth: '150px' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('dashboard.statConfirmed')}</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.confirmedBookings}</div>
                                </div>
                            </div>
                        </div>
                        <AdminCalendar bookings={bookings} onEditBooking={handleEditBooking} onSendEmail={handleSendEmail} />
                    </div>
                );
            case 'overview':
                return (
                    <div>
                        <h2 style={{ marginBottom: '2rem' }}>{t('dashboard.overviewTitle')}</h2>
                        <div className="grid grid-2">
                            <div className="glass-card">
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                                    {t('dashboard.statTotalBookings')}
                                </h3>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>
                                    {stats.totalBookings}
                                </div>
                            </div>
                            <div className="glass-card">
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                                    {t('dashboard.statPendingBookings')}
                                </h3>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                                    {stats.pendingBookings}
                                </div>
                            </div>
                            <div className="glass-card">
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                                    {t('dashboard.statConfirmedBookings')}
                                </h3>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>
                                    {stats.confirmedBookings}
                                </div>
                            </div>
                            <div className="glass-card">
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                                    {t('dashboard.statTotalRevenue')}
                                </h3>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-teal)' }}>
                                    {formatPrice(stats.totalRevenue)}
                                </div>
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
                    <h1 style={{ marginBottom: '1rem' }}>{t('dashboard.title')}</h1>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                            className={`btn ${activeTab === 'agenda' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('agenda')}
                        >
                            📅 {t('dashboard.tabAgenda')}
                        </button>
                        <button
                            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            📊 {t('dashboard.tabOverview')}
                        </button>
                        <button
                            className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('bookings')}
                        >
                            📝 {t('dashboard.tabBookings')}
                        </button>
                        <button
                            className={`btn ${activeTab === 'rooms' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('rooms')}
                        >
                            🏠 {t('dashboard.tabRooms')}
                        </button>
                        <button
                            className={`btn ${activeTab === 'services' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('services')}
                        >
                            🛎️ {t('dashboard.tabServices')}
                        </button>
                        <button
                            className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            ⚙️ {t('dashboard.tabSettings')}
                        </button>
                    </div>
                </div>

                {renderContent()}

                {/* Email Preview Modal */}
                {emailModalOpen && selectedBookingForEmail && (
                    <div className="modal-overlay" onClick={() => setEmailModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                            <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ color: 'var(--accent-gold)' }}>📧 {t('dashboard.emailModalTitle')}</h3>
                            </div>

                            <div className="glass-card" style={{ background: 'white', color: '#1a1a1a', padding: '2rem', marginBottom: '1.5rem', fontFamily: 'serif' }}>
                                <div style={{ borderBottom: '2px solid #8b1538', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ margin: 0, color: '#8b1538', fontFamily: 'sans-serif' }}>SCORPIUS HOSTEL</h2>
                                    <div style={{ fontSize: '2rem' }}>♏</div>
                                </div>
                                <h4 style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', margin: '1.5rem 0' }}>{t('dashboard.emailHeading')}</h4>

                                <p>{t('dashboard.emailDear')} <strong>{selectedBookingForEmail.guest_name}</strong>,</p>
                                <p>{t('dashboard.emailIntro')}</p>

                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', marginBottom: '1rem' }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem 0', color: '#666' }}>{t('dashboard.emailConfId')}</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: 'bold', textAlign: 'right' }}>#{selectedBookingForEmail.id.slice(0, 8).toUpperCase()}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem 0', color: '#666' }}>{t('dashboard.emailCheckIn')}</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: 'bold', textAlign: 'right' }}>{new Date(selectedBookingForEmail.check_in).toLocaleDateString(language)}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem 0', color: '#666' }}>{t('dashboard.emailCheckOut')}</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: 'bold', textAlign: 'right' }}>{new Date(selectedBookingForEmail.check_out).toLocaleDateString(language)}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem 0', color: '#666' }}>{t('dashboard.emailGuests')}</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: 'bold', textAlign: 'right' }}>{selectedBookingForEmail.number_of_guests}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: '#666', fontSize: '1.1rem' }}>{t('dashboard.emailTotalAmount')}</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: 'bold', textAlign: 'right', fontSize: '1.1rem', color: '#8b1538' }}>{formatPrice(selectedBookingForEmail.total_amount)}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '2rem', textAlign: 'center' }}>
                                    123 Constellation Ave, City Center • +1 (555) 123-4567 • info@scorpius.com
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    className="btn btn-outline"
                                    style={{ flex: 1 }}
                                    onClick={() => setEmailModalOpen(false)}
                                    disabled={sendingEmail}
                                >
                                    {t('dashboard.emailCancel')}
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                    onClick={sendConfirmationEmail}
                                    disabled={sendingEmail}
                                >
                                    {sendingEmail ? t('dashboard.emailSending') : `🚀 ${t('dashboard.emailSend')}`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
