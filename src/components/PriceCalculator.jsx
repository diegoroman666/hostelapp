import React from 'react';
import { useGlobal } from '../context/GlobalContext';

export default function PriceCalculator({
    checkIn,
    checkOut,
    roomPrice,
    roomType,
    services,
    serviceQuantities
}) {
    const { t, formatPrice } = useGlobal();

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const calculateServiceTotal = () => {
        return services.reduce((total, service) => {
            const quantity = serviceQuantities[service.id] || 0;
            return total + (service.price * quantity);
        }, 0);
    };

    const nights = calculateNights();
    const roomTotal = nights * (roomPrice || 0);
    const serviceTotal = calculateServiceTotal();
    const grandTotal = roomTotal + serviceTotal;

    return (
        <div className="price-summary">
            <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>{t('booking.breakdown')}</h3>

            {roomType && (
                <div className="price-row">
                    <span>{roomType} × {nights} {nights !== 1 ? t('booking.nights') : t('booking.night')}</span>
                    <span>{formatPrice(roomTotal)}</span>
                </div>
            )}

            {services.map(service => {
                const quantity = serviceQuantities[service.id] || 0;
                if (quantity === 0) return null;
                return (
                    <div key={service.id} className="price-row">
                        <span>{service.name} × {quantity}</span>
                        <span>{formatPrice(service.price * quantity)}</span>
                    </div>
                );
            })}

            <div className="price-row price-total">
                <span>{t('booking.total')}</span>
                <span>{formatPrice(grandTotal)}</span>
            </div>
        </div>
    );
}
