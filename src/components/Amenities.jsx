import React from 'react';

export default function Amenities() {
    const amenities = [
        {
            icon: '🍳',
            title: 'Gourmet Kitchen',
            description: 'Fully equipped kitchen with premium appliances'
        },
        {
            icon: '🔒',
            title: 'Secure Lockers',
            description: 'Personal lockers in every room'
        },
        {
            icon: '📶',
            title: 'High-Speed WiFi',
            description: 'Free fiber optic internet throughout'
        },
        {
            icon: '🏋️',
            title: 'Fitness Center',
            description: 'Modern gym with cardio and weights'
        },
        {
            icon: '🧘',
            title: 'Yoga Studio',
            description: 'Daily morning yoga sessions'
        },
        {
            icon: '🎮',
            title: 'Game Room',
            description: 'Pool table, board games, and console gaming'
        },
        {
            icon: '💼',
            title: 'Coworking Space',
            description: 'Quiet workspace with desks and power outlets'
        },
        {
            icon: '🌿',
            title: 'Rooftop Terrace',
            description: 'Panoramic city views and BBQ area'
        },
        {
            icon: '🎬',
            title: 'Movie Nights',
            description: 'Weekly film screenings in our lounge'
        },
        {
            icon: '🔐',
            title: '24/7 Reception',
            description: 'Round-the-clock assistance and security'
        },
        {
            icon: '🧺',
            title: 'Laundry Facilities',
            description: 'Washers and dryers available'
        },
        {
            icon: '🚿',
            title: 'Hot Showers',
            description: 'Clean, modern bathrooms with hot water'
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
