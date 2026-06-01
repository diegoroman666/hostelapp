import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';

export default function MobileAgendaView({ bookings, onEditBooking, onSendEmail }) {
    const { t, formatPrice } = useGlobal();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [groupedBookings, setGroupedBookings] = useState({});

    useEffect(() => {
        groupBookingsByDate();
    }, [currentDate, bookings]);

    const groupBookingsByDate = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const groups = {};
        for (let i = 1; i <= daysInMonth; i++) groups[i] = [];

        bookings.forEach(booking => {
            const date = new Date(booking.check_in);
            if (date.getMonth() === month && date.getFullYear() === year) {
                const day = date.getDate();
                if (groups[day]) groups[day].push(booking);
            }
        });

        setGroupedBookings(groups);
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
        setCurrentDate(new Date(newDate));
    };

    const monthNames = t('calendar.months');
    const dayNames = t('calendar.days');

    const getStatusLabel = (status) => {
        if (status === 'confirmed') return t('calendar.confirmed');
        if (status === 'cancelled') return t('calendar.cancelled');
        return t('calendar.pending');
    };

    return (
        <div className="mobile-agenda-view">
            {/* Header sticky */}
            <div className="glass-card" style={{
                position: 'sticky',
                top: '70px',
                zIndex: 90,
                marginBottom: '1rem',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(10px)'
            }}>
                <button onClick={() => changeMonth(-1)} className="btn btn-outline" style={{ padding: '0.5rem' }}>◀</button>
                <h3 style={{ margin: 0, color: 'var(--accent-gold)', fontSize: '1.2rem' }}>
                    {Array.isArray(monthNames) ? monthNames[currentDate.getMonth()] : ''} {currentDate.getFullYear()}
                </h3>
                <button onClick={() => changeMonth(1)} className="btn btn-outline" style={{ padding: '0.5rem' }}>▶</button>
            </div>

            {/* Days list */}
            <div className="agenda-list" style={{ paddingBottom: '2rem' }}>
                {Object.keys(groupedBookings).map(day => {
                    const dayBookings = groupedBookings[day];
                    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isToday = new Date().toDateString() === dateObj.toDateString();
                    const dayName = Array.isArray(dayNames) ? dayNames[dateObj.getDay()] : '';

                    return (
                        <div key={day} style={{ marginBottom: '1rem' }}>
                            {/* Date header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '0.5rem',
                                paddingLeft: '0.5rem',
                                color: isToday ? 'var(--accent-gold)' : 'var(--text-secondary)'
                            }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>{day}</div>
                                <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: '600' }}>{dayName}</div>
                                {isToday && (
                                    <span style={{
                                        fontSize: '0.7rem',
                                        padding: '2px 8px',
                                        background: 'var(--accent-scorpio)',
                                        borderRadius: 'var(--radius-full)',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        {t('calendar.today').toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {/* Bookings for the day */}
                            {dayBookings.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {dayBookings.map(booking => (
                                        <div
                                            key={booking.id}
                                            className="glass-card"
                                            style={{
                                                padding: '1rem',
                                                borderLeft: `4px solid ${
                                                    booking.status === 'confirmed' ? 'var(--success)' :
                                                    booking.status === 'cancelled' ? 'var(--error)' : 'var(--warning)'
                                                }`,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                            onClick={() => onEditBooking(booking)}
                                        >
                                            <div style={{ overflow: 'hidden' }}>
                                                <h4 style={{ margin: '0 0 0.3rem', color: 'var(--text-primary)' }}>
                                                    {booking.guest_name}
                                                </h4>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                                                    {booking.room_type}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--accent-scorpio-light)' }}>
                                                    <span style={{ display: 'inline-block', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', marginRight: '0.5rem' }}>
                                                        {getStatusLabel(booking.status)}
                                                    </span>
                                                    {formatPrice(booking.total_amount)}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onSendEmail(booking); }}
                                                    className="icon-btn"
                                                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    ✉️
                                                </button>
                                                <button
                                                    className="icon-btn"
                                                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
                                                >
                                                    👉
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    padding: '0.8rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.9rem',
                                    fontStyle: 'italic',
                                    marginLeft: '3.5rem'
                                }}>
                                    {t('calendar.noCheckIns')}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
