import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function BookingManager() {
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
            alert('Error updating booking: ' + error.message);
        }
    };

    const deleteBooking = async (id) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;

        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchBookings();
        } catch (error) {
            alert('Error deleting booking: ' + error.message);
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
            <h2 style={{ marginBottom: '2rem' }}>Booking Management</h2>

            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter('all')}
                >
                    All ({bookings.length})
                </button>
                <button
                    className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({bookings.filter(b => b.status === 'pending').length})
                </button>
                <button
                    className={`btn ${filter === 'confirmed' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter('confirmed')}
                >
                    Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
                </button>
                <button
                    className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter('cancelled')}
                >
                    Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
                </button>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="glass-card text-center">
                    <p>No bookings found.</p>
                </div>
            ) : (
                <div className="glass-card" style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ minWidth: '600px' }}>
                        <thead>
                            <tr>
                                <th>Guest Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Room Type</th>
                                <th>Guests</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map(booking => (
                                <tr key={booking.id}>
                                    <td>{booking.guest_name}</td>
                                    <td>{booking.guest_email}</td>
                                    <td>{booking.guest_phone || 'N/A'}</td>
                                    <td>{new Date(booking.check_in).toLocaleDateString()}</td>
                                    <td>{new Date(booking.check_out).toLocaleDateString()}</td>
                                    <td>{booking.room_prices?.room_type || 'N/A'}</td>
                                    <td>{booking.number_of_guests}</td>
                                    <td>${booking.total_amount?.toFixed(2)}</td>
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
                                            {booking.status}
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
                                                    Confirm
                                                </button>
                                            )}
                                            {booking.status !== 'cancelled' ? (
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--accent-teal)' }}
                                                    title="Reactivate Booking"
                                                    onClick={() => updateBookingStatus(booking.id, 'pending')}
                                                >
                                                    Reconsider
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                onClick={() => deleteBooking(booking.id)}
                                            >
                                                Delete
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
