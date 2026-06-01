import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { supabase } from '../lib/supabaseClient';
import ServiceCard from './ServiceCard';
import { useGlobal } from '../context/GlobalContext';

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

// ─── Availability Status Panel ────────────────────────────────────────────────
function AvailabilityPanel({ availability, t, formatDate }) {
    if (!availability.checked) return null;

    if (availability.checking) {
        return (
            <div style={{ padding: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.2rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                <span style={{ color: 'var(--text-secondary)' }}>{t('availability.checking')}</span>
            </div>
        );
    }

    if (availability.available) {
        return (
            <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.12)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.3rem' }}>✅</span>
                <span style={{ color: 'var(--success)', fontWeight: '600' }}>{t('availability.available')}</span>
            </div>
        );
    }

    // No disponible — banner compacto tras cerrar el modal
    return (
        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--error)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: availability.nextAvailable ? '0.5rem' : 0 }}>
                🚫 {t('availability.unavailable')}
            </div>
            {availability.nextAvailable && (
                <div style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', fontWeight: '600' }}>
                    📅 {t('availability.freeFrom')}: <strong>{formatDate(availability.nextAvailable.toISOString().split('T')[0])}</strong>
                </div>
            )}
        </div>
    );
}

// ─── Main BookingForm ─────────────────────────────────────────────────────────
export default function BookingForm() {
    const { t, formatPrice, language } = useGlobal();

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
    const [showReviewModal, setShowReviewModal] = useState(false);

    // ── Availability state ──
    const [availability, setAvailability] = useState({ checked: false, checking: false, available: null, nextAvailable: null });
    const [showUnavailableModal, setShowUnavailableModal] = useState(false);

    useEffect(() => {
        fetchRoomTypes();
        fetchServices();
    }, []);

    // Re-check availability whenever room or dates change
    useEffect(() => {
        if (formData.room_type_id && formData.check_in && formData.check_out) {
            checkAvailability();
        } else {
            setAvailability({ checked: false, checking: false, available: null, nextAvailable: null });
        }
    }, [formData.room_type_id, formData.check_in, formData.check_out]);

    const fetchRoomTypes = async () => {
        try {
            const { data, error } = await supabase.from('room_prices').select('*').eq('is_active', true);
            if (error) { setDemoMode(true); return; }
            if (data && data.length > 0) { setRoomTypes(data); setDemoMode(false); }
        } catch { setDemoMode(true); }
    };

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase.from('services').select('*').eq('is_active', true);
            if (error) return;
            if (data && data.length > 0) setServices(data);
        } catch { console.warn('Using demo service data'); }
    };

    // ── Availability checker ──────────────────────────────────────────────────
    const checkAvailability = async () => {
        setAvailability(prev => ({ ...prev, checked: true, checking: true }));

        try {
            const reqStart = new Date(formData.check_in + 'T12:00:00');
            const reqEnd   = new Date(formData.check_out + 'T12:00:00');

            const { data, error } = await supabase
                .from('bookings')
                .select('id, check_in, check_out, status')
                .eq('room_type_id', formData.room_type_id)
                .not('status', 'in', '("cancelled")')
                .order('check_in', { ascending: true });

            if (error) {
                setAvailability({ checked: true, checking: false, available: true, nextAvailable: null });
                return;
            }

            // Reservas que se solapan con las fechas pedidas
            const conflicts = (data || []).filter(b => {
                const bStart = new Date(b.check_in + 'T12:00:00');
                const bEnd   = new Date(b.check_out + 'T12:00:00');
                return bStart < reqEnd && bEnd > reqStart;
            });

            if (conflicts.length === 0) {
                setAvailability({ checked: true, checking: false, available: true, nextAvailable: null });
                return;
            }

            // Último checkout entre todos los conflictos → primer día disponible
            const lastCheckout = conflicts.reduce((latest, b) => {
                const d = new Date(b.check_out + 'T12:00:00');
                return d > latest ? d : latest;
            }, new Date(0));

            setAvailability({ checked: true, checking: false, available: false, nextAvailable: lastCheckout });
            setShowUnavailableModal(true);

        } catch {
            setAvailability({ checked: true, checking: false, available: true, nextAvailable: null });
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr + 'T12:00:00').toLocaleDateString(language);
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
        return Math.ceil(Math.abs(new Date(formData.check_out) - new Date(formData.check_in)) / (1000 * 60 * 60 * 24));
    };

    const calculateTotal = () => {
        const selectedRoom = roomTypes.find(r => r.id === formData.room_type_id);
        if (!selectedRoom || !formData.check_in || !formData.check_out) return 0;
        const nights = calculateNights();
        const roomTotal = nights * selectedRoom.price_per_night;
        const serviceTotal = services.reduce((total, service) => total + (service.price * (serviceQuantities[service.id] || 0)), 0);
        return roomTotal + serviceTotal;
    };

    const getSelectedServices = () => services.filter(s => serviceQuantities[s.id] > 0);

    const handleReview = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        if (availability.checked && availability.available === false) {
            setMessage({ type: 'error', text: t('availability.unavailable') });
            return;
        }
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
            const bookingData = { ...formData, selected_services: serviceQuantities, total_amount: total, status: 'pending' };
            const roomName = getRoomName(selectedRoom);

            if (demoMode) {
                setBookingDetails({ ...bookingData, room_type: roomName, price_per_night: selectedRoom.price_per_night, nights, services: getSelectedServices() });
                setShowReviewModal(false);
                setShowConfirmationModal(true);
                resetForm();
            } else {
                const { error, data } = await supabase.from('bookings').insert([bookingData]).select();
                if (error) {
                    if (error.code === '42501' || error.message.includes('row-level security')) {
                        console.warn('RLS issue');
                    } else throw error;
                }
                setBookingDetails({ ...bookingData, id: data?.[0]?.id || `RES-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, room_type: roomName, price_per_night: selectedRoom.price_per_night, nights, services: getSelectedServices() });
                setShowReviewModal(false);
                setShowConfirmationModal(true);
                resetForm();
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to submit booking.' });
            setShowReviewModal(false);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ guest_name: '', guest_email: '', guest_phone: '', check_in: '', check_out: '', room_type_id: '', number_of_guests: 1 });
        setServiceQuantities({});
        setAvailability({ checked: false, checking: false, available: null, nextAvailable: null });
    };

    const getRoomName = (room) => {
        if (!room) return 'Rooms';
        const key = room.key || room.room_type?.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
        const translated = t(`rooms.${key}`);
        return translated && translated !== `rooms.${key}` ? translated : room.room_type;
    };

    const downloadBookingPDF = () => {
        if (!bookingDetails) return;

        const doc  = new jsPDF({ unit: 'mm', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();   // 210mm
        const pageH = doc.internal.pageSize.getHeight();  // 297mm
        const M    = 18;           // margen lateral
        const CW   = pageW - M*2;  // 174mm ancho útil

        // Anclas de columnas — descripcion 36%, cantidad 50%, precio 68%, subtotal 100%
        const C_DESC_LIMIT = M + CW * 0.36; // límite de texto de la primera columna
        const C_QTY        = M + CW * 0.50; // centro columna cantidad
        const C_UNIT       = M + CW * 0.68; // centro columna precio unitario
        const C_SUB        = M + CW - 1;    // borde derecho subtotal

        const ROW_H  = 10; // alto de cada fila de tabla
        const SEC_GAP = 7; // espacio entre secciones

        let y = 0;

        // ── CABECERA ──────────────────────────────────────────────
        doc.setFillColor(13, 13, 32);
        doc.rect(0, 0, pageW, 54, 'F');

        // Destellos decorativos
        doc.setFillColor(212, 175, 55);
        [[28,10],[72,7],[148,13],[182,8],[55,24],[196,22],[18,38],[165,32]].forEach(([x,yy]) => {
            doc.circle(x, yy, 0.45, 'F');
        });
        doc.setFillColor(255, 255, 255);
        [[100,6],[130,18],[40,42],[170,45]].forEach(([x,yy]) => {
            doc.circle(x, yy, 0.25, 'F');
        });

        doc.setTextColor(212, 175, 55);
        doc.setFontSize(26);
        doc.setFont('helvetica', 'bold');
        doc.text('SCORPIUS HOSTEL', pageW / 2, 23, { align: 'center' });

        doc.setTextColor(185, 185, 215);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Comprobante de Reserva', pageW / 2, 35, { align: 'center' });

        doc.setTextColor(110, 110, 145);
        doc.setFontSize(8);
        doc.text(`Emitido: ${new Date().toLocaleDateString(language)}`, pageW / 2, 46, { align: 'center' });

        y = 62;

        // ── BADGE N° RESERVA ──────────────────────────────────────
        doc.setFillColor(212, 175, 55);
        doc.roundedRect(M, y, CW, 13, 3, 3, 'F');
        doc.setTextColor(13, 13, 32);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`N° Reserva: ${bookingDetails.id || 'DEMO'}`, pageW / 2, y + 9, { align: 'center' });
        y += 13 + SEC_GAP;

        // ── INFO HUESPED ──────────────────────────────────────────
        const hasPhone = !!bookingDetails.guest_phone;
        const guestH = hasPhone ? 38 : 30;
        doc.setFillColor(238, 238, 252);
        doc.roundedRect(M, y, CW, guestH, 2, 2, 'F');
        doc.setDrawColor(190, 190, 230);
        doc.setLineWidth(0.25);
        doc.roundedRect(M, y, CW, guestH, 2, 2, 'S');

        doc.setTextColor(13, 13, 32);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMACION DEL HUESPED', M + 4, y + 7);

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(35, 35, 65);
        doc.text(`Nombre: ${bookingDetails.guest_name}`, M + 4, y + 16);
        doc.text(`Huespedes: ${bookingDetails.number_of_guests}`, M + CW * 0.55 + 2, y + 16);
        doc.text(`Email: ${bookingDetails.guest_email}`, M + 4, y + 24);
        if (hasPhone) {
            doc.text(`Tel: ${bookingDetails.guest_phone}`, M + CW * 0.55 + 2, y + 24);
            doc.text(`Estado: Pendiente de confirmacion`, M + 4, y + 32);
        } else {
            doc.text(`Estado: Pendiente de confirmacion`, M + CW * 0.55 + 2, y + 24);
        }
        y += guestH + SEC_GAP;

        // ── DETALLES ESTADIA ──────────────────────────────────────
        doc.setFillColor(238, 238, 252);
        doc.roundedRect(M, y, CW, 30, 2, 2, 'F');
        doc.setDrawColor(190, 190, 230);
        doc.roundedRect(M, y, CW, 30, 2, 2, 'S');

        doc.setTextColor(13, 13, 32);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('DETALLES DE LA ESTADIA', M + 4, y + 7);

        const ciStr = new Date(bookingDetails.check_in  + 'T12:00:00').toLocaleDateString(language);
        const coStr = new Date(bookingDetails.check_out + 'T12:00:00').toLocaleDateString(language);

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(35, 35, 65);
        doc.text(`Check-in:  ${ciStr}`,   M + 4,              y + 17);
        doc.text(`Check-out: ${coStr}`,   M + CW * 0.55 + 2,  y + 17);
        doc.text(`Noches: ${bookingDetails.nights}`,                   M + 4,              y + 25);
        doc.text(`Habitacion: ${bookingDetails.room_type || '—'}`,     M + CW * 0.55 + 2,  y + 25);
        y += 30 + SEC_GAP;

        // ── TABLA PRESUPUESTO ─────────────────────────────────────
        doc.setTextColor(13, 13, 32);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('PRESUPUESTO DETALLADO', M, y + 7);
        y += 11;

        // Encabezado de tabla
        doc.setFillColor(13, 13, 32);
        doc.roundedRect(M, y, CW, ROW_H, 1, 1, 'F');
        doc.setTextColor(212, 175, 55);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text('Descripcion',  M + 3,  y + 7);
        doc.text('Cant.',        C_QTY,  y + 7, { align: 'center' });
        doc.text('P. Unitario',  C_UNIT, y + 7, { align: 'center' });
        doc.text('Subtotal',     C_SUB,  y + 7, { align: 'right' });
        y += ROW_H + 1;

        // Helper para dibujar una fila
        const drawRow = (desc, qty, unitPriceStr, subtotalStr, shade) => {
            doc.setFillColor(shade ? 246 : 240, shade ? 246 : 240, shade ? 253 : 250);
            doc.rect(M, y, CW, ROW_H, 'F');

            // Truncar descripcion si excede el limite de columna
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            let label = desc;
            const maxW = C_DESC_LIMIT - M - 3;
            while (doc.getTextWidth(label) > maxW && label.length > 4) {
                label = label.slice(0, -1);
            }
            if (label !== desc) label += '..';

            doc.setTextColor(30, 30, 60);
            doc.text(label,       M + 3,  y + 7);
            doc.text(String(qty), C_QTY,  y + 7, { align: 'center' });
            doc.text(unitPriceStr, C_UNIT, y + 7, { align: 'center' });
            doc.setFont('helvetica', 'bold');
            doc.text(subtotalStr,  C_SUB,  y + 7, { align: 'right' });

            // Borde inferior sutil
            doc.setDrawColor(210, 210, 230);
            doc.setLineWidth(0.1);
            doc.line(M, y + ROW_H, M + CW, y + ROW_H);

            y += ROW_H + 1;
        };

        // Fila habitacion
        const roomSubtotal = (bookingDetails.price_per_night || 0) * (bookingDetails.nights || 0);
        drawRow(
            bookingDetails.room_type || 'Habitacion',
            `${bookingDetails.nights} noche(s)`,
            formatPrice(bookingDetails.price_per_night || 0),
            formatPrice(roomSubtotal),
            true
        );

        // Linea separadora dorada antes de servicios
        const selectedSvcs = bookingDetails.services || [];
        const svcQtys = bookingDetails.selected_services || {};

        if (selectedSvcs.length > 0) {
            doc.setDrawColor(212, 175, 55);
            doc.setLineWidth(0.4);
            doc.line(M, y - 1, M + CW, y - 1);
        }

        // Filas de servicios
        selectedSvcs.forEach((svc, i) => {
            const qty = svcQtys[svc.id] || 1;
            drawRow(svc.name, qty, formatPrice(svc.price), formatPrice(svc.price * qty), i % 2 === 0);
        });

        // Fila TOTAL
        y += 1;
        doc.setFillColor(13, 13, 32);
        doc.roundedRect(M, y, CW, 14, 1, 1, 'F');
        doc.setTextColor(212, 175, 55);
        doc.setFontSize(12.5);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL', M + 4, y + 10);
        doc.text(formatPrice(bookingDetails.total_amount || 0), C_SUB, y + 10, { align: 'right' });
        y += 14;

        // ── PIE DE PAGINA (anclado al fondo) ──────────────────────
        const footerY = pageH - 14;
        doc.setFillColor(13, 13, 32);
        doc.rect(0, footerY - 2, pageW, 16, 'F');
        doc.setTextColor(100, 100, 135);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'italic');
        doc.text(
            'Gracias por elegir Scorpius Hostel. Esperamos que disfrutes tu estadia!',
            pageW / 2, footerY + 5, { align: 'center' }
        );

        const safeId = String(bookingDetails.id || 'reserva').replace(/[^a-zA-Z0-9]/g, '-');
        const fileName = `comprobante-scorpius-${safeId}.pdf`;
        const pdfBlob = doc.output('blob');

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // Internet Explorer / Edge Legacy
            window.navigator.msSaveOrOpenBlob(pdfBlob, fileName);
        } else {
            const url  = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 150);
        }
    };

    const selectedRoom = roomTypes.find(r => r.id === formData.room_type_id);
    const nights = calculateNights();
    const total = calculateTotal();
    const canSubmit = availability.available !== false;

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

                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <form onSubmit={handleReview} className="glass-card">
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>{t('booking.title')}</h3>

                            <div className="input-group">
                                <label className="input-label">{t('booking.name')} *</label>
                                <input type="text" name="guest_name" className="input-field" value={formData.guest_name} onChange={handleInputChange} required placeholder="John Doe" />
                            </div>

                            <div className="input-group">
                                <label className="input-label">{t('booking.email')} *</label>
                                <input type="email" name="guest_email" className="input-field" value={formData.guest_email} onChange={handleInputChange} required placeholder="john@example.com" />
                            </div>

                            <div className="input-group">
                                <label className="input-label">{t('booking.phone')}</label>
                                <input type="tel" name="guest_phone" className="input-field" value={formData.guest_phone} onChange={handleInputChange} placeholder="+1 234 567 8900" />
                            </div>

                            <div className="grid grid-2">
                                <div className="input-group">
                                    <label className="input-label">{t('booking.checkin')} *</label>
                                    <input type="date" name="check_in" className="input-field" value={formData.check_in} onChange={handleInputChange} required min={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">{t('booking.checkout')} *</label>
                                    <input type="date" name="check_out" className="input-field" value={formData.check_out} onChange={handleInputChange} required min={formData.check_in || new Date().toISOString().split('T')[0]} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">{t('booking.roomType')} *</label>
                                <select name="room_type_id" className="input-field" value={formData.room_type_id} onChange={handleInputChange} required>
                                    <option value="">{t('hero.title')}</option>
                                    {roomTypes.map(room => (
                                        <option key={room.id} value={room.id}>
                                            {getRoomName(room)} — {formatPrice(room.price_per_night)}/{t('booking.night')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ── Availability Status ── */}
                            <AvailabilityPanel availability={availability} t={t} formatDate={formatDate} />

                            <div className="input-group">
                                <label className="input-label">{t('booking.guests')} *</label>
                                <input type="number" name="number_of_guests" className="input-field" value={formData.number_of_guests} onChange={handleInputChange} required min="1" max="10" />
                            </div>

                            {message.text && (
                                <div className={`toast toast-${message.type}`} style={{ position: 'relative', bottom: 'auto', right: 'auto', marginBottom: '1rem' }}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', opacity: canSubmit ? 1 : 0.5 }}
                                disabled={loading || !canSubmit}
                            >
                                {loading ? 'Processing...' : `📋 ${t('booking.bookBtn')}`}
                            </button>

                            {!canSubmit && availability.checked && (
                                <p style={{ textAlign: 'center', color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                                    🚫 {t('availability.unavailable')}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Budget breakdown + services (only when available) */}
                    {(formData.check_in && formData.check_out && selectedRoom && availability.available) && (
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
                                            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>{t('booking.services')}:</h4>
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

                            {/* Services */}
                            <div style={{ maxWidth: '1000px', margin: '3rem auto 0' }}>
                                <div className="glass-card">
                                    <h3 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', textAlign: 'center' }}>🍳 {t('booking.categories.essentials')}</h3>
                                    <div className="grid grid-3">
                                        {services.filter(s => {
                                            const cat = s.category?.toLowerCase() || '';
                                            const name = s.name?.toLowerCase() || '';
                                            return ['essentials', 'breakfast', 'breakfasts'].includes(cat) || name.includes('breakfast') || name.includes('desayuno') || name.includes('laundry') || name.includes('lavandería');
                                        }).map(service => (
                                            <ServiceCard key={service.id} service={service} quantity={serviceQuantities[service.id] || 0} onQuantityChange={handleServiceQuantityChange} formatPrice={formatPrice} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ maxWidth: '1000px', margin: '2rem auto 0' }}>
                                <div className="glass-card">
                                    <h3 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', textAlign: 'center' }}>✨ {t('booking.categories.activities')}</h3>
                                    <div className="grid grid-3">
                                        {services.filter(s => {
                                            const cat = s.category?.toLowerCase() || '';
                                            const name = s.name?.toLowerCase() || '';
                                            const isEssential = ['essentials', 'breakfast', 'breakfasts'].includes(cat) || name.includes('breakfast') || name.includes('desayuno') || name.includes('laundry') || name.includes('lavandería');
                                            return !isEssential;
                                        }).map(service => (
                                            <ServiceCard key={service.id} service={service} quantity={serviceQuantities[service.id] || 0} onQuantityChange={handleServiceQuantityChange} formatPrice={formatPrice} />
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
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>📋 {t('booking.reviewTitle')}</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{t('booking.reviewSubtitle')}</p>
                        </div>
                        <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'var(--glass-bg)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text-secondary)' }}>
                                <div><strong>{t('booking.name')}:</strong><br />{formData.guest_name}</div>
                                <div><strong>{t('booking.email')}:</strong><br />{formData.guest_email}</div>
                                <div><strong>{t('booking.checkin')}:</strong><br />{new Date(formData.check_in).toLocaleDateString()}</div>
                                <div><strong>{t('booking.checkout')}:</strong><br />{new Date(formData.check_out).toLocaleDateString()}</div>
                                <div style={{ gridColumn: '1 / -1' }}><strong>{t('booking.roomType')}:</strong><br />{getRoomName(selectedRoom)}</div>
                            </div>
                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid var(--accent-scorpio)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.1rem' }}>{t('booking.total')}:</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>{formatPrice(total)}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setShowReviewModal(false)} className="btn btn-outline" style={{ flex: 1 }} disabled={loading}>✏️ {t('booking.editBtn')}</button>
                            <button onClick={confirmBooking} className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? '...' : `✅ ${t('booking.confirmBtn')}`}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmationModal && bookingDetails && (
                <div className="modal-overlay" onClick={() => setShowConfirmationModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>{t('booking.successTitle')}</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{t('booking.successSubtitle')}</p>
                        </div>
                        <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'var(--bg-tertiary)' }}>
                            <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>{t('booking.summaryTitle')}</h3>
                            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                <p><strong>{t('booking.name')}:</strong> {bookingDetails.guest_name}</p>
                                <p><strong>{t('booking.email')}:</strong> {bookingDetails.guest_email}</p>
                                <p><strong>{t('booking.checkin')}:</strong> {new Date(bookingDetails.check_in + 'T12:00:00').toLocaleDateString()}</p>
                                <p><strong>{t('booking.checkout')}:</strong> {new Date(bookingDetails.check_out + 'T12:00:00').toLocaleDateString()}</p>
                                <p><strong>{t('booking.roomType')}:</strong> {bookingDetails.room_type}</p>
                                {(bookingDetails.services || []).length > 0 && (
                                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
                                        <p style={{ marginBottom: '0.4rem' }}><strong>{t('booking.services') || 'Servicios'}:</strong></p>
                                        {(bookingDetails.services || []).map(svc => {
                                            const qty = (bookingDetails.selected_services || {})[svc.id] || 1;
                                            return (
                                                <p key={svc.id} style={{ paddingLeft: '0.75rem', fontSize: '0.9rem' }}>
                                                    • {svc.name} × {qty} — {formatPrice(svc.price * qty)}
                                                </p>
                                            );
                                        })}
                                    </div>
                                )}
                                <p style={{ fontSize: '1.25rem', color: 'var(--accent-gold)', marginTop: '1rem' }}>
                                    <strong>{t('booking.total')}:</strong> {formatPrice(bookingDetails.total_amount)}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={downloadBookingPDF} className="btn btn-outline" style={{ flex: 1 }}>📥 {t('booking.printVoucher')}</button>
                            <button onClick={() => setShowConfirmationModal(false)} className="btn btn-primary" style={{ flex: 1 }}>{t('booking.closeBtn')}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Habitacion No Disponible */}
            {showUnavailableModal && (
                <div className="modal-overlay" onClick={() => setShowUnavailableModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🚫</div>
                        <h2 style={{ color: 'var(--error)', marginBottom: '0.75rem' }}>
                            Habitación No Disponible
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                            Las fechas seleccionadas ya están reservadas para esta habitación.
                        </p>
                        {availability.nextAvailable && (
                            <div style={{
                                padding: '1rem 1.25rem',
                                background: 'rgba(212,175,55,0.1)',
                                border: '1px solid var(--accent-gold)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1.5rem'
                            }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                                    Próxima disponibilidad a partir de:
                                </p>
                                <p style={{ color: 'var(--accent-gold)', fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>
                                    📅 {formatDate(availability.nextAvailable.toISOString().split('T')[0])}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={() => setShowUnavailableModal(false)}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
