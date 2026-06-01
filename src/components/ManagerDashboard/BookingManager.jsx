import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useGlobal } from '../../context/GlobalContext';

export default function BookingManager() {
    const { t, formatPrice, language } = useGlobal();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          room_prices (room_type, price_per_night)
        `)
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
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchBookings();
        } catch (error) {
            alert(t('bookingManager.errorUpdate') + error.message);
        }
    };

    const deleteBooking = async (id) => {
        if (!confirm(t('bookingManager.confirmDelete'))) return;

        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchBookings();
        } catch (error) {
            alert(t('bookingManager.errorDelete') + error.message);
        }
    };

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>{t('bookingManager.title')}</h2>

            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter('all')}
                >
                    {t('bookingManager.filterAll')} ({bookings.length})
                </button>
                <button
                    className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter('pending')}
                >
                    {t('bookingManager.filterPending')} ({bookings.filter(b => b.status === 'pending').length})
                </button>
                <button
                    className={`btn ${filter === 'confirmed' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter('confirmed')}
                >
                    {t('bookingManager.filterConfirmed')} ({bookings.filter(b => b.status === 'confirmed').length})
                </button>
                <button
                    className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter('cancelled')}
                >
                    {t('bookingManager.filterCancelled')} ({bookings.filter(b => b.status === 'cancelled').length})
                </button>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="glass-card text-center">
                    <p>{t('bookingManager.noBookings')}</p>
                </div>
            ) : (
                <div className="glass-card" style={{ overflowX: 'auto' }}>
                    <style>{`
                        .booking-table { width: 100%; min-width: 500px; border-collapse: collapse; font-size: 0.8rem; }
                        .booking-table th, .booking-table td {
                            border: 1px solid rgba(255,255,255,0.15);
                            padding: 0.45rem 0.5rem;
                            text-align: left;
                            white-space: nowrap;
                        }
                        .booking-table th {
                            background: rgba(255,255,255,0.05);
                            font-weight: 600;
                        }
                        .booking-select {
                            padding: 0.2rem 0.4rem;
                            border-radius: var(--radius-full);
                            font-size: 0.78rem;
                            border: none;
                            cursor: pointer;
                            color: #fff;
                            outline: none;
                        }
                    `}</style>
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th>{t('bookingManager.colName')}</th>
                                <th>{t('bookingManager.colEmail')}</th>
                                <th>{t('bookingManager.colPhone')}</th>
                                <th>{t('bookingManager.colCheckIn')}</th>
                                <th>{t('bookingManager.colCheckOut')}</th>
                                <th>{t('bookingManager.colRoomType')}</th>
                                <th>{t('bookingManager.colGuests')}</th>
                                <th>{t('bookingManager.colTotal')}</th>
                                <th>{t('bookingManager.colStatus')}</th>
                                <th>{t('bookingManager.colActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map(booking => (
                                <tr key={booking.id}>
                                    <td>{booking.guest_name}</td>
                                    <td>{booking.guest_email}</td>
                                    <td>{booking.guest_phone || t('common.na')}</td>
                                    <td>{new Date(booking.check_in).toLocaleDateString(language)}</td>
                                    <td>{new Date(booking.check_out).toLocaleDateString(language)}</td>
                                    <td>{booking.room_prices?.room_type || t('common.na')}</td>
                                    <td>{booking.number_of_guests}</td>
                                    <td>{formatPrice(booking.total_amount)}</td>
                                    <td>
                                        <select
                                            className="booking-select"
                                            value={booking.status}
                                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                            style={{
                                                background:
                                                    booking.status === 'confirmed' ? 'var(--success)' :
                                                        booking.status === 'cancelled' ? 'var(--error)' :
                                                            'var(--warning)'
                                            }}
                                        >
                                            <option value="pending">{t('bookingManager.statusPending')}</option>
                                            <option value="confirmed">{t('bookingManager.statusConfirmed')}</option>
                                            <option value="cancelled">{t('bookingManager.statusCancelled')}</option>
                                            <option value="checked_in">{t('bookingManager.statusCheckedIn')}</option>
                                            <option value="checked_out">{t('bookingManager.statusCheckedOut')}</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            className="booking-select"
                                            defaultValue=""
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                if (!v) return;
                                                if (v === 'confirm') updateBookingStatus(booking.id, 'confirmed');
                                                else if (v === 'cancel') updateBookingStatus(booking.id, 'cancelled');
                                                else if (v === 'reconsider') updateBookingStatus(booking.id, 'pending');
                                                else if (v === 'delete') deleteBooking(booking.id);
                                                e.target.selectedIndex = 0;
                                            }}
                                            style={{ background: 'var(--accent-gradient, #6b21a8)' }}
                                        >
                                            <option value="">⋮</option>
                                            {booking.status === 'pending' && (
                                                <option value="confirm">{t('bookingManager.actConfirm')}</option>
                                            )}
                                            {['pending', 'confirmed'].includes(booking.status) && (
                                                <option value="cancel">{t('bookingManager.actCancel')}</option>
                                            )}
                                            {booking.status === 'cancelled' && (
                                                <option value="reconsider">{t('bookingManager.actReconsider')}</option>
                                            )}
                                            <option value="delete">{t('bookingManager.actDelete')} 🗑️</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
