import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ServiceCard from './ServiceCard';
import { useGlobal } from '../context/GlobalContext';

// Enhanced demo data
const DEMO_ROOMS = [
    { id: '1', room_type: 'Constellation Dorm (4 beds)', price_per_night: 28, capacity: 4, is_active: true, key: 'constellation' },
    { id: '2', room_type: 'Galaxy Dorm (6 beds)', price_per_night: 24, capacity: 6, is_active: true, key: 'galaxy' },
    { id: '3', room_type: 'Nebula Dorm (8 beds)', price_per_night: 20, capacity: 8, is_active: true, key: 'nebula' },
    { id: '4', room_type: 'Meteor Private (Single)', price_per_night: 55, capacity: 1, is_active: true, key: 'meteor' },
    { id: '5', room_type: 'Comet Private (Double)', price_per_night: 75, capacity: 2, is_active: true, key: 'comet' },
    { id: '6', room_type: 'Supernova Suite', price_per_night: 95, capacity: 2, is_active: true, key: 'supernova' }
];

const DEMO_SERVICES = [
    { id: '1', name: 'Continental Breakfast', description: 'Fresh pastries, fruits, coffee & juice', price: 8, is_active: true, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400', category: 'essentials' },
    { id: '2', name: 'Full English Breakfast', description: 'Eggs, bacon, sausage, beans, toast', price: 12, is_active: true, image_url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400', category: 'essentials' },
    { id: '3', name: 'Vegan Breakfast Bowl', description: 'Organic granola, fruits, plant milk', price: 10, is_active: true, image_url: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400', category: 'essentials' },
    { id: '4', name: 'Laundry Service', description: 'Professional wash & fold service', price: 12, is_active: true, image_url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', category: 'essentials' },
    { id: '5', name: 'Late Check-out', description: 'Extend your stay until 4 PM', price: 15, is_active: true, image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400', category: 'essentials' },
    { id: '6', name: 'Bike Rental (Full Day)', description: 'Explore the city on two wheels', price: 15, is_active: true, image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400', category: 'activities' },
    { id: '7', name: 'Airport Shuttle', description: 'Convenient airport transfer', price: 25, is_active: true, image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400', category: 'activities' },
    { id: '8', name: 'City Walking Tour', description: 'Guided 3-hour city highlights tour', price: 30, is_active: true, image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400', category: 'activities' },
    { id: '9', name: 'Pub Crawl Night', description: 'Experience local nightlife', price: 20, is_active: true, image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400', category: 'activities' },
    { id: '10', name: 'Yoga Class', description: 'Morning yoga session', price: 8, is_active: true, image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', category: 'activities' }
];

export default function BookingForm() {
    const { t, formatPrice, language } = useGlobal(); // Hook for translations/currency

    const [formData, setFormData] = useState({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        check_in: '',
        check_out: '',
        room_type_id: '',
        number_of_guests: 1
    });

    const [roomTypes, setRoomTypes] = useState(DEMO_ROOMS);
    const [services, setServices] = useState(DEMO_SERVICES);
    const [serviceQuantities, setServiceQuantities] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [demoMode, setDemoMode] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    useEffect(() => {
        fetchRoomTypes();
        fetchServices();
    }, []);

    const fetchRoomTypes = async () => {
        try {
            const { data, error } = await supabase
                .from('room_prices')
                .select('*')
                .eq('is_active', true);

            if (error) {
                console.warn('Using demo room data - Supabase not configured');
                setDemoMode(true);
                return;
            }

            if (data && data.length > 0) {
                // Map DB data to include translation keys if possible, or use standard naming convention
                // For now we use the demo keys as fallback or matching logic
                setRoomTypes(data);
                setDemoMode(false);
            }
        } catch (error) {
            setDemoMode(true);
        }
    };

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase.from('services').select('*').eq('is_active', true);
            if (error) return;
            if (data && data.length > 0) setServices(data);
        } catch (error) {
            console.warn('Using demo service data');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceQuantityChange = (serviceId, quantity) => {
        setServiceQuantities(prev => ({ ...prev, [serviceId]: quantity }));
    };

    const calculateNights = () => {
        if (!formData.check_in || !formData.check_out) return 0;
        const start = new Date(formData.check_in);
        const end = new Date(formData.check_out);
        return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    };

    const calculateTotal = () => {
        const selectedRoom = roomTypes.find(r => r.id === formData.room_type_id);
        if (!selectedRoom || !formData.check_in || !formData.check_out) return 0;

        const nights = calculateNights();
        const roomTotal = nights * selectedRoom.price_per_night;
        const serviceTotal = services.reduce((total, service) => {
            const quantity = serviceQuantities[service.id] || 0;
            return total + (service.price * quantity);
        }, 0);

        return roomTotal + serviceTotal;
    };

    const getSelectedServices = () => {
        return services.filter(service => serviceQuantities[service.id] > 0);
    };

    const [showReviewModal, setShowReviewModal] = useState(false);

    const handleReview = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            if (new Date(formData.check_in) >= new Date(formData.check_out)) {
                throw new Error('Check-out date must be after check-in date');
            }
            setShowReviewModal(true);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    const confirmBooking = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const selectedRoom = roomTypes.find(r => r.id === formData.room_type_id);
            const total = calculateTotal();
            const nights = calculateNights();

            const bookingData = {
                ...formData,
                selected_services: serviceQuantities,
                total_amount: total,
                status: 'pending'
            };

            const roomName = t(`rooms.${selectedRoom.key}`) || selectedRoom.room_type;

            if (demoMode) {
                setBookingDetails({
                    ...bookingData,
                    room_type: roomName,
                    price_per_night: selectedRoom.price_per_night,
                    nights: nights,
                    services: getSelectedServices()
                });
                setShowReviewModal(false);
                setShowConfirmationModal(true);
                resetForm();
            } else {
                const { error, data } = await supabase.from('bookings').insert([bookingData]).select();

                if (error) {
                    console.error('Supabase error:', error);
                    if (error.code === '42501' || error.message.includes('row-level security')) {
                        console.warn('Booking inserted but RLS prevented immediate selection.');
                    } else {
                        throw error;
                    }
                }
                setBookingDetails({
                    ...bookingData,
                    id: data?.[0]?.id || `RES-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    room_type: roomName,
                    price_per_night: selectedRoom.price_per_night,
                    nights: nights,
                    services: getSelectedServices()
                });
                setShowReviewModal(false);
                setShowConfirmationModal(true);
                resetForm();
            }

        } catch (error) {
            console.error('Booking Error:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to submit booking.' });
            setShowReviewModal(false);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            guest_name: '',
            guest_email: '',
            guest_phone: '',
            check_in: '',
            check_out: '',
            room_type_id: '',
            number_of_guests: 1
        });
        setServiceQuantities({});
    };

    const selectedRoom = roomTypes.find(r => r.id === formData.room_type_id);
    const breakfastServices = services.filter(s => s.category === 'breakfast');
    const otherServices = services.filter(s => s.category !== 'breakfast');
    const nights = calculateNights();
    const total = calculateTotal();

    // Helper to get translated room name
    const getRoomName = (room) => {
        if (!room) return 'Rooms';
        const key = room.key || room.room_type?.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
        const translated = t(`rooms.${key}`);
        return translated && translated !== `rooms.${key}` ? translated : room.room_type;
    };

    const handlePrintVoucher = () => {
        window.print();
    };

    return (
        <>
            <section id="booking" className="section">
                <div className="container">
                    <h2 className="section-title">{t('hero.title')}</h2>
                    <p className="section-subtitle">{t('hero.subtitle')}</p>

                    {demoMode && (
                        <div className="toast toast-warning" style={{ position: 'relative', bottom: 'auto', right: 'auto', marginBottom: '2rem' }}>
                            ⚠️ Demo Mode Active
                        </div>
                    )}

                    {/* Guest Form */}
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <form onSubmit={handleReview} className="glass-card">
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>{t('booking.title')}</h3>

                            <div className="input-group">
                                <label className="input-label">{t('booking.name')} *</label>
                                <input
                                    type="text"
                                    name="guest_name"
                                    className="input-field"
                                    value={formData.guest_name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">{t('booking.email')} *</label>
                                <input
                                    type="email"
                                    name="guest_email"
                                    className="input-field"
                                    value={formData.guest_email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">{t('booking.phone')}</label>
                                <input
                                    type="tel"
                                    name="guest_phone"
                                    className="input-field"
                                    value={formData.guest_phone}
                                    onChange={handleInputChange}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>

                            <div className="grid grid-2">
                                <div className="input-group">
                                    <label className="input-label">{t('booking.checkin')} *</label>
                                    <input
                                        type="date"
                                        name="check_in"
                                        className="input-field"
                                        value={formData.check_in}
                                        onChange={handleInputChange}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">{t('booking.checkout')} *</label>
                                    <input
                                        type="date"
                                        name="check_out"
                                        className="input-field"
                                        value={formData.check_out}
                                        onChange={handleInputChange}
                                        required
                                        min={formData.check_in || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">{t('booking.roomType')} *</label>
                                <select
                                    name="room_type_id"
                                    className="input-field"
                                    value={formData.room_type_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">{t('hero.title')}</option>
                                    {roomTypes.map(room => (
                                        <option key={room.id} value={room.id}>
                                            {getRoomName(room)} - {formatPrice(room.price_per_night)}/{t('booking.night')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">{t('booking.guests')} *</label>
                                <input
                                    type="number"
                                    name="number_of_guests"
                                    className="input-field"
                                    value={formData.number_of_guests}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    max="10"
                                />
                            </div>

                            {message.text && (
                                <div className={`toast toast-${message.type}`} style={{ position: 'relative', bottom: 'auto', right: 'auto', marginBottom: '1rem' }}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : `📋 ${t('booking.bookBtn')}`}
                            </button>
                        </form>
                    </div>

                    {/* Detailed Budget Breakdown */}
                    {(formData.check_in && formData.check_out && selectedRoom) && (
                        <>
                            <div style={{ maxWidth: '600px', margin: '2rem auto 0' }}>
                                <div className="glass-card">
                                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)', textAlign: 'center' }}>
                                        📊 {t('booking.breakdown')}
                                    </h3>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div className="price-row">
                                            <span>{t('booking.roomType')}: {getRoomName(selectedRoom)}</span>
                                            <span>{formatPrice(selectedRoom.price_per_night)}/{t('booking.night')}</span>
                                        </div>
                                        <div className="price-row">
                                            <span>{t('booking.nights')}</span>
                                            <span>{nights} {nights === 1 ? t('booking.night') : t('booking.nights')}</span>
                                        </div>
                                        <div className="price-row" style={{ fontWeight: '600', color: 'var(--accent-gold)' }}>
                                            <span>{t('booking.roomSubtotal')}</span>
                                            <span>{formatPrice(selectedRoom.price_per_night * nights)}</span>
                                        </div>
                                    </div>

                                    {getSelectedServices().length > 0 && (
                                        <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>{t('booking.services')} ({t('booking.servicesSubtotal')}):</h4>
                                            {getSelectedServices().map(service => {
                                                const quantity = serviceQuantities[service.id];
                                                return (
                                                    <div key={service.id} className="price-row">
                                                        <span>{service.name} × {quantity}</span>
                                                        <span>{formatPrice(service.price * quantity)}</span>
                                                    </div>
                                                );
                                            })}
                                            <div className="price-row" style={{ fontWeight: '600', color: 'var(--accent-gold)', marginTop: '0.5rem' }}>
                                                <span>{t('booking.servicesSubtotal')}</span>
                                                <span>{formatPrice(services.reduce((sum, s) => sum + (s.price * (serviceQuantities[s.id] || 0)), 0))}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="price-total" style={{ fontSize: '1.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--accent-scorpio)' }}>
                                        <span>{t('booking.total')}</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>

                                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                                            💳 {t('booking.paymentNote')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Categorized Services */}
                            <div style={{ maxWidth: '1000px', margin: '3rem auto 0' }}>
                                <div className="glass-card">
                                    <h3 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', textAlign: 'center' }}>
                                        🍳 {t('booking.categories.essentials')}
                                    </h3>
                                    <div className="grid grid-3">
                                        {services.filter(s => {
                                            const cat = s.category?.toLowerCase() || '';
                                            const name = s.name?.toLowerCase() || '';
                                            return ['essentials', 'breakfast', 'breakfasts'].includes(cat) ||
                                                name.includes('breakfast') ||
                                                name.includes('desayuno') ||
                                                name.includes('laundry') ||
                                                name.includes('lavandería');
                                        }).map(service => (
                                            <ServiceCard
                                                key={service.id}
                                                service={service}
                                                quantity={serviceQuantities[service.id] || 0}
                                                onQuantityChange={handleServiceQuantityChange}
                                                formatPrice={formatPrice}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ maxWidth: '1000px', margin: '2rem auto 0' }}>
                                <div className="glass-card">
                                    <h3 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', textAlign: 'center' }}>
                                        ✨ {t('booking.categories.activities')}
                                    </h3>
                                    <div className="grid grid-3">
                                        {services.filter(s => {
                                            const cat = s.category?.toLowerCase() || '';
                                            const name = s.name?.toLowerCase() || '';
                                            const isEssential = ['essentials', 'breakfast', 'breakfasts'].includes(cat) ||
                                                name.includes('breakfast') ||
                                                name.includes('desayuno') ||
                                                name.includes('laundry') ||
                                                name.includes('lavandería');
                                            return !isEssential;
                                        }).map(service => (
                                            <ServiceCard
                                                key={service.id}
                                                service={service}
                                                quantity={serviceQuantities[service.id] || 0}
                                                onQuantityChange={handleServiceQuantityChange}
                                                formatPrice={formatPrice}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                                📋 {t('booking.reviewTitle')}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                {t('booking.reviewSubtitle')}
                            </p>
                        </div>

                        <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'var(--glass-bg)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text-secondary)' }}>
                                <div>
                                    <strong>{t('booking.name')}:</strong><br />{formData.guest_name}
                                </div>
                                <div>
                                    <strong>{t('booking.email')}:</strong><br />{formData.guest_email}
                                </div>
                                <div>
                                    <strong>{t('booking.checkin')}:</strong><br />{new Date(formData.check_in).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>{t('booking.checkout')}:</strong><br />{new Date(formData.check_out).toLocaleDateString()}
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <strong>{t('booking.roomType')}:</strong><br />{getRoomName(selectedRoom)}
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid var(--accent-scorpio)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.1rem' }}>{t('booking.total')}:</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>{formatPrice(total)}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="btn btn-outline"
                                style={{ flex: 1 }}
                                disabled={loading}
                            >
                                ✏️ {t('booking.editBtn')}
                            </button>
                            <button
                                onClick={confirmBooking}
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                disabled={loading}
                            >
                                {loading ? '...' : `✅ ${t('booking.confirmBtn')}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmationModal && bookingDetails && (
                <div className="modal-overlay" onClick={() => setShowConfirmationModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                                {t('booking.successTitle')}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                {t('booking.successSubtitle')}
                            </p>
                        </div>

                        <div className="glass-card no-print" style={{ marginBottom: '1.5rem', background: 'var(--bg-tertiary)' }}>
                            <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>{t('booking.summaryTitle')}</h3>
                            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                <p><strong>{t('booking.name')}:</strong> {bookingDetails.guest_name}</p>
                                <p><strong>{t('booking.email')}:</strong> {bookingDetails.guest_email}</p>
                                <p><strong>{t('booking.checkin')}:</strong> {new Date(bookingDetails.check_in).toLocaleDateString()}</p>
                                <p><strong>{t('booking.checkout')}:</strong> {new Date(bookingDetails.check_out).toLocaleDateString()}</p>
                                <p><strong>{t('booking.roomType')}:</strong> {bookingDetails.room_type}</p>
                                <p style={{ fontSize: '1.25rem', color: 'var(--accent-gold)', marginTop: '1rem' }}>
                                    <strong>{t('booking.total')}:</strong> {formatPrice(bookingDetails.total_amount)}
                                </p>
                            </div>
                        </div>

                        {/* Professional Printable Voucher (Hidden on UI, shown on print) */}
                        <div id="voucher-to-print" className="print-only">
                            <div style={{ padding: '40px', background: 'white', color: '#1a1a1a', border: '5px solid #8b1538', fontFamily: 'serif' }}>
                                <div style={{ textAlign: 'center', borderBottom: '2px solid #8b1538', paddingBottom: '20px', marginBottom: '30px' }}>
                                    <h1 style={{ margin: 0, color: '#8b1538', fontSize: '32px' }}>{t('brand')}</h1>
                                    <p style={{ margin: '5px 0', color: '#666' }}>{t('hero.subtitle')}</p>
                                </div>
                                <h2 style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '4px', margin: '30px 0' }}>{t('booking.voucherTitle')}</h2>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                    <div style={{ padding: '15px', border: '1px solid #ddd' }}>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>{t('booking.name')}</p>
                                        <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{bookingDetails.guest_name}</p>
                                    </div>
                                    <div style={{ padding: '15px', border: '1px solid #ddd' }}>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>{t('booking.voucherId')}</p>
                                        <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>#{bookingDetails.id?.toString().slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div style={{ padding: '15px', border: '1px solid #ddd' }}>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>{t('booking.checkin')}</p>
                                        <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{new Date(bookingDetails.check_in).toLocaleDateString(language)}</p>
                                    </div>
                                    <div style={{ padding: '15px', border: '1px solid #ddd' }}>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>{t('booking.checkout')}</p>
                                        <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{new Date(bookingDetails.check_out).toLocaleDateString(language)}</p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>{t('booking.roomTypeLabel')}</p>
                                    <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#8b1538' }}>{bookingDetails.room_type}</p>
                                </div>

                                <div style={{ marginTop: '50px', borderTop: '2px solid #8b1538', paddingTop: '20px', textAlign: 'center' }}>
                                    <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{t('brand')} • City Center • +1 555-SCORPIUS</p>
                                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>{t('booking.paymentNote')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="no-print" style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handlePrintVoucher}
                                className="btn btn-outline"
                                style={{ flex: 1 }}
                            >
                                🖨️ {t('booking.printVoucher')}
                            </button>
                            <button
                                onClick={() => setShowConfirmationModal(false)}
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                            >
                                {t('booking.closeBtn')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
