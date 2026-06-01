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

    // Translate the raw status from DB ("pending", "confirmed", …) for display
    const translateStatus = (status) => {
        const map = {
            pending: 'bookingManager.statusPending',
            confirmed: 'bookingManager.statusConfirmed',
            cancelled: 'bookingManager.statusCancelled',
            checked_in: 'bookingManager.statusCheckedIn',
            checked_out: 'bookingManager.statusCheckedOut'
        };
        return map[status] ? t(map[status]) : status;
    };

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
                    <table className="table" style={{ minWidth: '600px' }}>
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
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.85rem',
                                            background:
                                                booking.status === 'confirmed' ? 'var(--success)' :
                                                    booking.status === 'cancelled' ? 'var(--error)' :
                                                        'var(--warning)'
                                        }}>
                                            {translateStatus(booking.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {booking.status === 'pending' && (
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                                >
                                                    {t('bookingManager.actConfirm')}
                                                </button>
                                            )}
                                            {booking.status !== 'cancelled' ? (
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                                >
                                                    {t('bookingManager.actCancel')}
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--accent-teal)' }}
                                                    title={t('bookingManager.actReconsider')}
                                                    onClick={() => updateBookingStatus(booking.id, 'pending')}
                                                >
                                                    {t('bookingManager.actReconsider')}
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                onClick={() => deleteBooking(booking.id)}
                                            >
                                                {t('bookingManager.actDelete')}
                                            </button>
                                        </div>
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
