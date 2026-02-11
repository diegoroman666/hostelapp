import React, { useState, useEffect } from 'react';

export default function MobileAgendaView({ bookings, onEditBooking, onSendEmail }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [groupedBookings, setGroupedBookings] = useState({});

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    useEffect(() => {
        groupBookingsByDate();
    }, [currentDate, bookings]);

    const groupBookingsByDate = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const groups = {};

        // Initialize all days for the month
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${month + 1}-${i}`; // Key for sorting/access
            groups[i] = [];
        }

        // Fill with bookings
        bookings.forEach(booking => {
            const date = new Date(booking.check_in); // Assuming we group by check-in for agenda
            // Note: In a real agenda, you might want to show stay-overs too, but start with check-ins
            if (date.getMonth() === month && date.getFullYear() === year) {
                const day = date.getDate();
                if (groups[day]) {
                    groups[day].push(booking);
                }
            }
        });

        setGroupedBookings(groups);
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
        setCurrentDate(new Date(newDate));
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="mobile-agenda-view">
            {/* Header - Sticky */}
            <div className="glass-card" style={{
                position: 'sticky',
                top: '70px', // Below navbar
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
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button onClick={() => changeMonth(1)} className="btn btn-outline" style={{ padding: '0.5rem' }}>▶</button>
            </div>

            {/* List of Days */}
            <div className="agenda-list" style={{ paddingBottom: '2rem' }}>
                {Object.keys(groupedBookings).map(day => {
                    const dayBookings = groupedBookings[day];
                    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isToday = new Date().toDateString() === dateObj.toDateString();
                    const dayName = dayNames[dateObj.getDay()];

                    // Skip empty days in the past to reduce clutter? 
                    // Or maybe just show days with bookings + today?
                    // User asked for "AgendaPro style", usually a list.
                    // Let's show all days but compact empty ones.

                    return (
                        <div key={day} style={{ marginBottom: '1rem' }}>
                            {/* Date Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '0.5rem',
                                paddingLeft: '0.5rem',
                                color: isToday ? 'var(--accent-gold)' : 'var(--text-secondary)'
                            }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    width: '40px',
                                    textAlign: 'center'
                                }}>{day}</div>
                                <div style={{
                                    textTransform: 'uppercase',
                                    fontSize: '0.8rem',
                                    letterSpacing: '1px',
                                    fontWeight: '600'
                                }}>{dayName}</div>
                                {isToday && <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>TODAY</span>}
                            </div>

                            {/* Bookings List for the Day */}
                            {dayBookings.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {dayBookings.map(booking => (
                                        <div
                                            key={booking.id}
                                            className="glass-card"
                                            style={{
                                                padding: '1rem',
                                                borderLeft: `4px solid ${booking.status === 'confirmed' ? 'var(--success)' :
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
                                                    {/* Status Badge */}
                                                    <span style={{
                                                        display: 'inline-block',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        background: 'rgba(255,255,255,0.1)',
                                                        marginRight: '0.5rem'
                                                    }}>
                                                        {booking.status}
                                                    </span>
                                                    {formatCurrency(booking.total_amount)}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSendEmail(booking);
                                                    }}
                                                    className="icon-btn"
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        background: 'rgba(255,255,255,0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    ✉️
                                                </button>
                                                <button
                                                    className="icon-btn"
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        background: 'rgba(255,255,255,0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.2rem'
                                                    }}
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
                                    marginLeft: '3.5rem' // Align with content
                                }}>
                                    No check-ins scheduled
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
