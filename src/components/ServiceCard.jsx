import React from 'react';

export default function ServiceCard({ service, quantity, onQuantityChange }) {
    const handleIncrement = () => {
        onQuantityChange(service.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            onQuantityChange(service.id, quantity - 1);
        }
    };

    if (!service.is_active) return null;

    return (
        <div className="glass-card service-card">
            {service.image_url && (
                <img
                    src={service.image_url}
                    alt={service.name}
                    className="service-image"
                />
            )}
            <h3 className="service-title">{service.name}</h3>
            <p className="service-description">{service.description}</p>
            <div className="service-price">${service.price}</div>

            <div className="service-quantity">
                <button
                    className="quantity-btn"
                    onClick={handleDecrement}
                    disabled={quantity === 0}
                >
                    −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                    className="quantity-btn"
                    onClick={handleIncrement}
                >
                    +
                </button>
            </div>
        </div>
    );
}
