import emailjs from '@emailjs/browser';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export async function sendBookingConfirmation(booking) {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        console.warn('EmailJS not configured — skipping email send.');
        return { ok: false, reason: 'not_configured' };
    }

    const params = {
        to_email:    booking.guest_email,
        to_name:     booking.guest_name,
        booking_id:  (booking.id || '').toString().slice(-8).toUpperCase(),
        check_in:    new Date(booking.check_in).toLocaleDateString('es-CL'),
        check_out:   new Date(booking.check_out).toLocaleDateString('es-CL'),
        room_type:   booking.room_type || booking.room_type_id,
        nights:      booking.nights ?? '',
        total:       booking.total_amount,
        guests:      booking.number_of_guests,
    };

    try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);
        return { ok: true };
    } catch (err) {
        console.error('EmailJS error:', err);
        return { ok: false, reason: err?.text || err?.message || 'unknown' };
    }
}
