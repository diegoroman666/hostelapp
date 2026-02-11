import React from 'react';
import { useGlobal } from '../context/GlobalContext';

export default function Amenities() {
    const { t } = useGlobal();

    const amenities = [
        {
            icon: '🍳',
            title: t('amenities.kitchen.title'),
            description: t('amenities.kitchen.desc')
        },
        {
            icon: '🔒',
            title: t('amenities.lockers.title'),
            description: t('amenities.lockers.desc')
        },
        {
            icon: '📶',
            title: t('amenities.wifi.title'),
            description: t('amenities.wifi.desc')
        },
        {
            icon: '🏋️',
            title: t('amenities.gym.title'),
            description: t('amenities.gym.desc')
        },
        {
            icon: '🧘',
            title: t('amenities.yoga.title'),
            description: t('amenities.yoga.desc')
        },
        {
            icon: '🎮',
            title: t('amenities.game.title'),
            description: t('amenities.game.desc')
        },
        {
            icon: '💼',
            title: t('amenities.coworking.title'),
            description: t('amenities.coworking.desc')
        },
        {
            icon: '🌿',
            title: t('amenities.terrace.title'),
            description: t('amenities.terrace.desc')
        },
        {
            icon: '🎬',
            title: t('amenities.movie.title'),
            description: t('amenities.movie.desc')
        },
        {
            icon: '🔐',
            title: t('amenities.reception.title'),
            description: t('amenities.reception.desc')
        },
        {
            icon: '🧺',
            title: t('amenities.laundry.title'),
            description: t('amenities.laundry.desc')
        },
        {
            icon: '🚿',
            title: t('amenities.showers.title'),
            description: t('amenities.showers.desc')
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <h2 className="section-title">Cosmic Amenities</h2>
                <p className="section-subtitle">
                    Everything you need for an extraordinary stay among the stars
                </p>

                <div className="amenities-grid">
                    {amenities.map((amenity, index) => (
                        <div key={index} className="amenity-card">
                            <div className="amenity-icon">{amenity.icon}</div>
                            <h3 className="amenity-title">{amenity.title}</h3>
                            <p className="amenity-description">{amenity.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
