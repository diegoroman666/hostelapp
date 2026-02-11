import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import MobileAgendaView from './MobileAgendaView';

export default function AdminCalendar({ bookings, onEditBooking, onSendEmail }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Tipos de habitaciones para colores
    const roomColors = {
        'Constellation Dorm': 'var(--accent-purple)',
        'Galaxy Dorm': 'var(--accent-teal)',
        'Nebula Dorm': 'var(--accent-scorpio)',
        'Meteor Private': 'var(--warning)',
        'Comet Private': 'var(--success)',
        'Supernova Suite': 'var(--accent-gold)'
    };

    useEffect(() => {
        generateCalendar(currentDate);
    }, [currentDate, bookings]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const generateCalendar = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay(); // 0 = Sunday

        const days = [];

        // Previous month filler days
        for (let i = 0; i < startingDay; i++) {
            days.push({ day: '', active: false });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDayDate = new Date(year, month, i);
            const dayBookings = bookings.filter(booking => {
                const checkIn = new Date(booking.check_in);
                // Ajustar zona horaria si es necesario, comparamos solo fechas
                return checkIn.getDate() === i &&
                    checkIn.getMonth() === month &&
                    checkIn.getFullYear() === year;
            });

            days.push({
                day: i,
                active: true,
                date: currentDayDate,
                bookings: dayBookings
            });
        }

        setCalendarDays(days);
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
        setCurrentDate(new Date(newDate));
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div style={{ position: 'relative' }}>
            {/* View Toggle Button */}
            <div style={{ position: 'absolute', top: '-40px', right: '0', zIndex: 10 }}>
                <button
                    onClick={() => setIsMobile(!isMobile)}
                    className="btn btn-sm btn-outline"
                    style={{
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {isMobile ? '🖥️ Desktop View' : '📱 Agenda View'}
                </button>
            </div>

            {isMobile ? (
                <MobileAgendaView bookings={bookings} onEditBooking={onEditBooking} onSendEmail={onSendEmail} />
            ) : (
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    {/* Header del Calendario */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(0,0,0,0.2)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, color: 'var(--accent-gold)' }}>
                            📅 {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => changeMonth(-1)} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>◀</button>
                            <button onClick={() => setCurrentDate(new Date())} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Today</button>
                            <button onClick={() => changeMonth(1)} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>▶</button>
                        </div>
                    </div>

                    {/* Grid del Calendario */}
                    <div style={{ padding: '1.5rem' }}>
                        {/* Días de la semana */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                        </div>

                        {/* Días */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
                            {calendarDays.map((item, index) => (
                                <div
                                    key={index}
                                    className="calendar-date-cell"
                                    style={{
                                        minHeight: '120px',
                                        background: item.active ? 'rgba(255,255,255,0.03)' : 'transparent',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '0.25rem',
                                        border: item.active ? '1px solid var(--glass-border)' : 'none',
                                        opacity: item.active ? 1 : 0.3,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {item.active && (
                                        <>
                                            <div style={{
                                                fontWeight: 'bold',
                                                marginBottom: '0.5rem',
                                                color: item.date.toDateString() === new Date().toDateString() ? 'var(--accent-gold)' : 'inherit'
                                            }}>
                                                {item.day}
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                {item.bookings.map(booking => {
                                                    const bookingColor = booking.status === 'confirmed' ? 'var(--success)' :
                                                        booking.status === 'cancelled' ? 'var(--error)' : 'var(--warning)';

                                                    return (
                                                        <div
                                                            key={booking.id}
                                                            style={{
                                                                fontSize: '0.75rem',
                                                                padding: '0.25rem 0.5rem',
                                                                background: 'rgba(0,0,0,0.3)',
                                                                borderLeft: `3px solid ${bookingColor}`,
                                                                borderRadius: '4px',
                                                                marginBottom: '0.25rem',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                transition: 'var(--transition)'
                                                            }}
                                                            className="calendar-event"
                                                        >
                                                            <div
                                                                onClick={() => onEditBooking(booking)}
                                                                style={{ cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1 }}
                                                                title={`${booking.guest_name} - $${booking.total_amount}`}
                                                            >
                                                                <div style={{ fontWeight: 'bold' }}>{booking.guest_name}</div>
                                                                <div style={{ opacity: 0.8 }}>${booking.total_amount}</div>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onSendEmail(booking);
                                                                }}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    fontSize: '1.2rem',
                                                                    padding: '0 0.2rem',
                                                                    opacity: 0.7,
                                                                    transition: 'all 0.2s',
                                                                    marginLeft: '4px'
                                                                }}
                                                                title="Send Confirmation Email"
                                                                onMouseEnter={(e) => { e.target.style.opacity = 1; e.target.style.transform = 'scale(1.2)'; }}
                                                                onMouseLeave={(e) => { e.target.style.opacity = 0.7; e.target.style.transform = 'scale(1)'; }}
                                                            >
                                                                ✉️
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leyenda */}
                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)' }}></div> Pending
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }}></div> Confirmed
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--error)' }}></div> Cancelled
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', color: 'var(--text-muted)' }}>
                            ℹ️ Click on a booking to see details and options (⋮)
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
