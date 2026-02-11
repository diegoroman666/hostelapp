import React from 'react';
import { useGlobal } from '../context/GlobalContext';

export default function ServiceCard({ service, quantity, onQuantityChange, formatPrice }) {
    const { t } = useGlobal();

    const handleIncrement = () => {
        onQuantityChange(service.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            onQuantityChange(service.id, quantity - 1);
        }
    };

    if (!service.is_active) return null;

    // Resilience check: ensures we don't try to translate if key is missing or literally "undefined"
    const isValidKey = service.key && service.key !== 'undefined' && service.key !== null;

    // Translation logic using keys with robust fallback
    const displayName = isValidKey ? (t(`servicesList.${service.key}.name`) || service.name) : service.name;
    const displayDesc = isValidKey ? (t(`servicesList.${service.key}.desc`) || service.description) : service.description;

    return (
        <div className="glass-card service-card">
            {service.image_url && (
                <img
                    src={service.image_url}
                    alt={displayName}
                    className="service-image"
                />
            )}
            <div className="service-details">
                <div className="service-header">
                    <h4>{displayName}</h4>
                    <span className="service-price">{formatPrice(service.price)}</span>
                </div>
                <p>{displayDesc}</p>
            </div>

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
