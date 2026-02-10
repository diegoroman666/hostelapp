import React from 'react';

export default function PriceCalculator({
    checkIn,
    checkOut,
    roomPrice,
    roomType,
    services,
    serviceQuantities
}) {
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
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Price Summary</h3>

            {roomType && (
                <div className="price-row">
                    <span>{roomType} × {nights} night{nights !== 1 ? 's' : ''}</span>
                    <span>${roomTotal.toFixed(2)}</span>
                </div>
            )}

            {services.map(service => {
                const quantity = serviceQuantities[service.id] || 0;
                if (quantity === 0) return null;
                return (
                    <div key={service.id} className="price-row">
                        <span>{service.name} × {quantity}</span>
                        <span>${(service.price * quantity).toFixed(2)}</span>
                    </div>
                );
            })}

            <div className="price-row price-total">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
            </div>
        </div>
    );
}
