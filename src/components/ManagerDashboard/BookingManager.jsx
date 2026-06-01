import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useGlobal } from '../../context/GlobalContext';

export default function BookingManager() {
    const { t, formatPrice } = useGlobal();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [notifyModal, setNotifyModal] = useState(null); // waitlist guest to notify

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*, room_prices (room_type, price_per_night)')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
            if (error) throw error;
            fetchBookings();
        } catch (error) {
            alert('Error updating booking: ' + error.message);
        }
    };

    const deleteBooking = async (id) => {
        if (!confirm(t('admin.bookingMgr.deleteConfirm'))) return;
        try {
            const { error } = await supabase.from('bookings').delete().eq('id', id);
            if (error) throw error;
            fetchBookings();
        } catch (error) {
            alert('Error deleting booking: ' + error.message);
        }
    };

    // Check if a room is now free for a waitlist entry
    const isRoomNowFreeForWaitlist = (waitlistEntry) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Find active bookings for the same room that end before or on today
        const activeBlockers = bookings.filter(b =>
            b.room_type_id === waitlistEntry.room_type_id &&
            b.status !== 'cancelled' &&
            b.status !== 'waitlist' &&
            b.id !== waitlistEntry.id &&
            new Date(b.check_out) > today
        );
        return activeBlockers.length === 0;
    };

    const activeBookings    = bookings.filter(b => b.status !== 'waitlist');
    const waitlistBookings  = bookings.filter(b => b.status === 'waitlist');

    const filteredActive = filter === 'all'
        ? activeBookings
        : filter === 'waitlist'
            ? waitlistBookings
            : activeBookings.filter(b => b.status === filter);

    if (loading) return <div className="spinner"></div>;

    const filterBtns = [
        { key: 'all',       label: `${t('admin.bookingMgr.all')} (${activeBookings.length})` },
        { key: 'pending',   label: `${t('admin.bookingMgr.pending')} (${activeBookings.filter(b => b.status === 'pending').length})` },
        { key: 'confirmed', label: `${t('admin.bookingMgr.confirmed')} (${activeBookings.filter(b => b.status === 'confirmed').length})` },
        { key: 'cancelled', label: `${t('admin.bookingMgr.cancelled')} (${activeBookings.filter(b => b.status === 'cancelled').length})` },
        { key: 'waitlist',  label: `🔔 ${t('availability.waitlistLabel')} (${waitlistBookings.length})`, highlight: waitlistBookings.some(w => isRoomNowFreeForWaitlist(w)) },
    ];

    const displayList = filter === 'waitlist' ? waitlistBookings : filteredActive;

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>{t('admin.bookingMgr.title')}</h2>

            {/* Filter tabs */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {filterBtns.map(btn => (
                    <button
                        key={btn.key}
                        className={`btn ${filter === btn.key ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter(btn.key)}
                        style={btn.highlight ? { borderColor: 'var(--accent-gold)', color: filter === btn.key ? undefined : 'var(--accent-gold)' } : {}}
                    >
                        {btn.label}
                        {btn.highlight && <span style={{ marginLeft: '0.4rem', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-gold)', display: 'inline-block', verticalAlign: 'middle' }} />}
                    </button>
                ))}
            </div>

            {/* Waitlist note if any room is free */}
            {filter === 'waitlist' && waitlistBookings.some(w => isRoomNowFreeForWaitlist(w)) && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(255,215,0,0.1)', border: '1px solid var(--accent-gold)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🔔</span>
                    <div>
                        <strong style={{ color: 'var(--accent-gold)' }}>{t('availability.roomFreeNow')}</strong>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>{t('availability.waitlistNote')}</p>
                    </div>
                </div>
            )}

            {displayList.length === 0 ? (
                <div className="glass-card text-center">
                    <p>{filter === 'waitlist' ? t('availability.noWaitlist') : t('admin.bookingMgr.noBookings')}</p>
                </div>
            ) : (
                <div className="glass-card" style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ minWidth: '600px' }}>
                        <thead>
                            <tr>
                                <th>{t('admin.bookingMgr.guestName')}</th>
                                <th>{t('admin.bookingMgr.email')}</th>
                                <th>{t('admin.bookingMgr.phone')}</th>
                                <th>{t('admin.bookingMgr.checkin')}</th>
                                <th>{t('admin.bookingMgr.checkout')}</th>
                                <th>{t('admin.bookingMgr.roomType')}</th>
                                <th>{t('admin.bookingMgr.guests')}</th>
                                <th>{t('admin.bookingMgr.total')}</th>
                                <th>{t('admin.bookingMgr.status')}</th>
                                <th>{t('admin.bookingMgr.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayList.map(booking => {
                                const isWaitlist = booking.status === 'waitlist';
                                const roomFreeForThis = isWaitlist && isRoomNowFreeForWaitlist(booking);

                                return (
                                    <tr key={booking.id} style={roomFreeForThis ? { background: 'rgba(255,215,0,0.07)' } : {}}>
                                        <td>
                                            {booking.guest_name}
                                            {roomFreeForThis && <span style={{ marginLeft: '0.4rem', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>⭐</span>}
                                        </td>
                                        <td>{booking.guest_email}</td>
                                        <td>{booking.guest_phone || 'N/A'}</td>
                                        <td>{new Date(booking.check_in).toLocaleDateString()}</td>
                                        <td>{new Date(booking.check_out).toLocaleDateString()}</td>
                                        <td>{booking.room_prices?.room_type || 'N/A'}</td>
                                        <td>{booking.number_of_guests}</td>
                                        <td>{booking.total_amount != null ? formatPrice(booking.total_amount) : '—'}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.85rem',
                                                background:
                                                    booking.status === 'confirmed' ? 'var(--success)' :
                                                    booking.status === 'cancelled' ? 'var(--error)' :
                                                    booking.status === 'waitlist'  ? 'var(--accent-purple)' : 'var(--warning)'
                                            }}>
                                                {booking.status === 'confirmed' ? t('admin.bookingMgr.confirmed') :
                                                 booking.status === 'cancelled' ? t('admin.bookingMgr.cancelled') :
                                                 booking.status === 'waitlist'  ? `🔔 ${t('availability.waitlistLabel')}` :
                                                 t('admin.bookingMgr.pending')}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                                {isWaitlist ? (
                                                    <>
                                                        {/* Notify button — shown prominently if room is free */}
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: roomFreeForThis ? 'var(--accent-gold)' : undefined, color: roomFreeForThis ? '#000' : undefined }}
                                                            onClick={() => setNotifyModal(booking)}
                                                        >
                                                            {roomFreeForThis ? `⭐ ${t('availability.notifyGuest')}` : `✉️ ${t('availability.notifyGuest')}`}
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary"
                                                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                                            onClick={() => updateBookingStatus(booking.id, 'pending')}
                                                        >
                                                            {t('availability.confirmWaitlist')}
                                                        </button>
                                                        <button
                                                            className="btn btn-danger"
                                                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                                            onClick={() => deleteBooking(booking.id)}
                                                        >
                                                            {t('availability.removeWaitlist')}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {booking.status === 'pending' && (
                                                            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                                                                {t('admin.bookingMgr.confirm')}
                                                            </button>
                                                        )}
                                                        {booking.status !== 'cancelled' ? (
                                                            <button className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                                                                {t('admin.bookingMgr.cancel')}
                                                            </button>
                                                        ) : (
                                                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--accent-teal)' }} onClick={() => updateBookingStatus(booking.id, 'pending')}>
                                                                {t('admin.bookingMgr.reconsider')}
                                                            </button>
                                                        )}
                                                        <button className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => deleteBooking(booking.id)}>
                                                            {t('admin.bookingMgr.delete')}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Notify Modal */}
            {notifyModal && (
                <div className="modal-overlay" onClick={() => setNotifyModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
                            🔔 {t('availability.notifyGuest')}
                        </h3>

                        {isRoomNowFreeForWaitlist(notifyModal) && (
                            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,215,0,0.1)', border: '1px solid var(--accent-gold)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--accent-gold)', fontWeight: '600' }}>
                                ⭐ {t('availability.roomFreeNow')}
                            </div>
                        )}

                        <div className="glass-card" style={{ marginBottom: '1.5rem', lineHeight: '2' }}>
                            <p><strong>{t('admin.bookingMgr.guestName')}:</strong> {notifyModal.guest_name}</p>
                            <p><strong>{t('admin.bookingMgr.email')}:</strong>
                                <a href={`mailto:${notifyModal.guest_email}`} style={{ color: 'var(--accent-gold)', marginLeft: '0.5rem' }}>{notifyModal.guest_email}</a>
                            </p>
                            {notifyModal.guest_phone && (
                                <p><strong>{t('admin.bookingMgr.phone')}:</strong>
                                    <a href={`tel:${notifyModal.guest_phone}`} style={{ color: 'var(--accent-gold)', marginLeft: '0.5rem' }}>{notifyModal.guest_phone}</a>
                                </p>
                            )}
                            <p><strong>{t('admin.bookingMgr.checkin')}:</strong> {new Date(notifyModal.check_in).toLocaleDateString()}</p>
                            <p><strong>{t('admin.bookingMgr.checkout')}:</strong> {new Date(notifyModal.check_out).toLocaleDateString()}</p>
                            <p><strong>{t('admin.bookingMgr.roomType')}:</strong> {notifyModal.room_prices?.room_type || '—'}</p>
                        </div>

                        <div style={{ background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
{`Subject: Your waitlisted room is now available! 🎉

Hello ${notifyModal.guest_name},

Great news! The room you requested is now available.
Your requested dates: ${new Date(notifyModal.check_in).toLocaleDateString()} → ${new Date(notifyModal.check_out).toLocaleDateString()}

Please contact us to confirm your booking before someone else takes it.

📞 +1 (555) 123-4567
✉️ info@scorpius.com

— Scorpius Hostel Team`}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a
                                href={`mailto:${notifyModal.guest_email}?subject=Your waitlisted room is now available!&body=Hello ${encodeURIComponent(notifyModal.guest_name)},%0A%0AGreat news! The room you requested is now available.%0AYour dates: ${new Date(notifyModal.check_in).toLocaleDateString()} to ${new Date(notifyModal.check_out).toLocaleDateString()}%0A%0APlease contact us to confirm your booking.%0A%0A— Scorpius Hostel`}
                                className="btn btn-primary"
                                style={{ flex: 1, textAlign: 'center' }}
                            >
                                📧 {t('admin.email.send')}
                            </a>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setNotifyModal(null)}>
                                {t('admin.bookingMgr.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
