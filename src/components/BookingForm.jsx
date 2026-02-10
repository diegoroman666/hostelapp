import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ServiceCard from './ServiceCard';
import PriceCalculator from './PriceCalculator';

// Enhanced demo data
const DEMO_ROOMS = [
    { id: '1', room_type: 'Constellation Dorm (4 beds)', price_per_night: 28, capacity: 4, is_active: true },
    { id: '2', room_type: 'Galaxy Dorm (6 beds)', price_per_night: 24, capacity: 6, is_active: true },
    { id: '3', room_type: 'Nebula Dorm (8 beds)', price_per_night: 20, capacity: 8, is_active: true },
    { id: '4', room_type: 'Meteor Private (Single)', price_per_night: 55, capacity: 1, is_active: true },
    { id: '5', room_type: 'Comet Private (Double)', price_per_night: 75, capacity: 2, is_active: true },
    { id: '6', room_type: 'Supernova Suite', price_per_night: 95, capacity: 2, is_active: true }
];

const DEMO_SERVICES = [
    { id: '1', name: 'Continental Breakfast', description: 'Fresh pastries, fruits, coffee & juice', price: 8, is_active: true, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400', category: 'breakfast' },
    { id: '2', name: 'Full English Breakfast', description: 'Eggs, bacon, sausage, beans, toast', price: 12, is_active: true, image_url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400', category: 'breakfast' },
    { id: '3', name: 'Vegan Breakfast Bowl', description: 'Organic granola, fruits, plant milk', price: 10, is_active: true, image_url: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400', category: 'breakfast' },
    { id: '4', name: 'Pancake Stack', description: 'Fluffy pancakes with maple syrup', price: 9, is_active: true, image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', category: 'breakfast' },
    { id: '5', name: 'Laundry Service', description: 'Professional wash & fold service', price: 12, is_active: true, image_url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', category: 'service' },
    { id: '6', name: 'Bike Rental (Full Day)', description: 'Explore the city on two wheels', price: 15, is_active: true, image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400', category: 'service' },
    { id: '7', name: 'Airport Shuttle', description: 'Convenient airport transfer', price: 25, is_active: true, image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400', category: 'service' },
    { id: '8', name: 'City Walking Tour', description: 'Guided 3-hour city highlights tour', price: 30, is_active: true, image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400', category: 'service' },
    { id: '9', name: 'Pub Crawl Night', description: 'Experience local nightlife', price: 20, is_active: true, image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400', category: 'service' },
    { id: '10', name: 'Yoga Class', description: 'Morning yoga session', price: 8, is_active: true, image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', category: 'service' }
];

export default function BookingForm() {
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
                setRoomTypes(data);
                setDemoMode(false);
            }
        } catch (error) {
            console.warn('Using demo room data - Supabase not configured');
            setDemoMode(true);
        }
    };

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('is_active', true);

            if (error) {
                console.warn('Using demo service data - Supabase not configured');
                return;
            }

            if (data && data.length > 0) {
                setServices(data);
            }
        } catch (error) {
            console.warn('Using demo service data - Supabase not configured');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (new Date(formData.check_in) >= new Date(formData.check_out)) {
                throw new Error('Check-out date must be after check-in date');
            }

            const selectedRoom = roomTypes.find(r => r.id === formData.room_type_id);
            const total = calculateTotal();
            const nights = calculateNights();

            const bookingData = {
                ...formData,
                selected_services: serviceQuantities,
                total_amount: total,
                status: 'pending'
            };

            if (demoMode) {
                // Demo mode - show modal
                setBookingDetails({
                    ...bookingData,
                    room_type: selectedRoom.room_type,
                    nights: nights,
                    services: getSelectedServices()
                });
                setShowConfirmationModal(true);

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
            } else {
                const { data, error } = await supabase
                    .from('bookings')
                    .insert([bookingData])
                    .select();

                if (error) throw error;

                setBookingDetails({
                    ...bookingData,
                    room_type: selectedRoom.room_type,
                    nights: nights,
                    services: getSelectedServices()
                });
                setShowConfirmationModal(true);

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
            }

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to submit booking. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const selectedRoom = roomTypes.find(r => r.id === formData.room_type_id);
    const breakfastServices = services.filter(s => s.category === 'breakfast');
    const otherServices = services.filter(s => s.category !== 'breakfast');
    const nights = calculateNights();
    const total = calculateTotal();

    return (
        <>
            <section id="booking" className="section">
                <div className="container">
                    <h2 className="section-title">Reserve Your Constellation</h2>
                    <p className="section-subtitle">
                        Book your cosmic journey with us and experience stellar hospitality
                    </p>

                    {demoMode && (
                        <div className="toast toast-warning" style={{ position: 'relative', bottom: 'auto', right: 'auto', marginBottom: '2rem' }}>
                            ⚠️ Demo Mode Active: Configure Supabase to enable real bookings
                        </div>
                    )}

                    {/* Guest Form - Centered */}
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <form onSubmit={handleSubmit} className="glass-card">
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Guest Information</h3>

                            <div className="input-group">
                                <label className="input-label">Full Name *</label>
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
                                <label className="input-label">Email *</label>
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
                                <label className="input-label">Phone</label>
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
                                    <label className="input-label">Check-in Date *</label>
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
                                    <label className="input-label">Check-out Date *</label>
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
                                <label className="input-label">Room Type *</label>
                                <select
                                    name="room_type_id"
                                    className="input-field"
                                    value={formData.room_type_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select your constellation</option>
                                    {roomTypes.map(room => (
                                        <option key={room.id} value={room.id}>
                                            {room.room_type} - ${room.price_per_night}/night
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Number of Guests *</label>
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
                                {loading ? 'Processing...' : '🌟 Confirm Reservation'}
                            </button>
                        </form>
                    </div>

                    {/* Detailed Budget Breakdown */}
                    {(formData.check_in && formData.check_out && selectedRoom) && (
                        <div style={{ maxWidth: '600px', margin: '2rem auto 0' }}>
                            <div className="glass-card">
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)', textAlign: 'center' }}>
                                    📊 Budget Breakdown
                                </h3>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div className="price-row">
                                        <span>Room: {selectedRoom.room_type}</span>
                                        <span>${selectedRoom.price_per_night}/night</span>
                                    </div>
                                    <div className="price-row">
                                        <span>Number of nights</span>
                                        <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                                    </div>
                                    <div className="price-row" style={{ fontWeight: '600', color: 'var(--accent-gold)' }}>
                                        <span>Room Subtotal</span>
                                        <span>${(selectedRoom.price_per_night * nights).toFixed(2)}</span>
                                    </div>
                                </div>

                                {getSelectedServices().length > 0 && (
                                    <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                        <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Additional Services:</h4>
                                        {getSelectedServices().map(service => {
                                            const quantity = serviceQuantities[service.id];
                                            return (
                                                <div key={service.id} className="price-row">
                                                    <span>{service.name} × {quantity}</span>
                                                    <span>${(service.price * quantity).toFixed(2)}</span>
                                                </div>
                                            );
                                        })}
                                        <div className="price-row" style={{ fontWeight: '600', color: 'var(--accent-gold)', marginTop: '0.5rem' }}>
                                            <span>Services Subtotal</span>
                                            <span>${services.reduce((sum, s) => sum + (s.price * (serviceQuantities[s.id] || 0)), 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="price-total" style={{ fontSize: '1.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--accent-scorpio)' }}>
                                    <span>Total Amount</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                                        💳 Payment will be processed upon arrival
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Breakfast Options */}
                    <div style={{ maxWidth: '1000px', margin: '3rem auto 0' }}>
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)', textAlign: 'center' }}>🍳 Breakfast Options</h3>
                            <div className="grid grid-4">
                                {breakfastServices.map(service => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        quantity={serviceQuantities[service.id] || 0}
                                        onQuantityChange={handleServiceQuantityChange}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Services */}
                    <div style={{ maxWidth: '1000px', margin: '2rem auto 0' }}>
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)', textAlign: 'center' }}>✨ Additional Services</h3>
                            <div className="grid grid-3">
                                {otherServices.map(service => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        quantity={serviceQuantities[service.id] || 0}
                                        onQuantityChange={handleServiceQuantityChange}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Confirmation Modal */}
            {showConfirmationModal && bookingDetails && (
                <div className="modal-overlay" onClick={() => setShowConfirmationModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                                Reservation Submitted!
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Thank you for choosing Scorpius Hostel
                            </p>
                        </div>

                        <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'var(--bg-tertiary)' }}>
                            <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Booking Summary</h3>
                            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                <p><strong>Guest:</strong> {bookingDetails.guest_name}</p>
                                <p><strong>Email:</strong> {bookingDetails.guest_email}</p>
                                <p><strong>Check-in:</strong> {new Date(bookingDetails.check_in).toLocaleDateString()}</p>
                                <p><strong>Check-out:</strong> {new Date(bookingDetails.check_out).toLocaleDateString()}</p>
                                <p><strong>Room:</strong> {bookingDetails.room_type}</p>
                                <p><strong>Nights:</strong> {bookingDetails.nights}</p>
                                {bookingDetails.services.length > 0 && (
                                    <p><strong>Services:</strong> {bookingDetails.services.map(s => s.name).join(', ')}</p>
                                )}
                                <p style={{ fontSize: '1.25rem', color: 'var(--accent-gold)', marginTop: '1rem' }}>
                                    <strong>Total:</strong> ${bookingDetails.total_amount.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: '1.6' }}>
                                📧 <strong>A confirmation email will be sent to:</strong><br />
                                {bookingDetails.guest_email}
                            </p>
                        </div>

                        <button
                            onClick={() => setShowConfirmationModal(false)}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
