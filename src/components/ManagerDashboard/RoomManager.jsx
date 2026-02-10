import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function RoomManager() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRoom, setEditingRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        room_type: '',
        description: '',
        price_per_night: '',
        capacity: '',
        image_url: '',
        is_active: true
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data, error } = await supabase
                .from('room_prices')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRooms(data || []);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingRoom) {
                const { error } = await supabase
                    .from('room_prices')
                    .update(formData)
                    .eq('id', editingRoom.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('room_prices')
                    .insert([formData]);

                if (error) throw error;
            }

            fetchRooms();
            resetForm();
            setShowModal(false);
        } catch (error) {
            alert('Error saving room: ' + error.message);
        }
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setFormData({
            room_type: room.room_type,
            description: room.description,
            price_per_night: room.price_per_night,
            capacity: room.capacity,
            image_url: room.image_url || '',
            is_active: room.is_active
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this room type?')) return;

        try {
            const { error } = await supabase
                .from('room_prices')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchRooms();
        } catch (error) {
            alert('Error deleting room: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            room_type: '',
            description: '',
            price_per_night: '',
            capacity: '',
            image_url: '',
            is_active: true
        });
        setEditingRoom(null);
    };

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Room Management</h2>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    + Add New Room Type
                </button>
            </div>

            <div className="grid grid-2">
                {rooms.map(room => (
                    <div key={room.id} className="glass-card">
                        {room.image_url && (
                            <img src={room.image_url} alt={room.room_type} className="service-image" />
                        )}
                        <h3>{room.room_type}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            {room.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-teal)' }}>
                                    ${room.price_per_night}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>per night</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                    {room.capacity}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>guests</div>
                            </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.85rem',
                                background: room.is_active ? 'var(--success)' : 'var(--error)'
                            }}>
                                {room.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-secondary" onClick={() => handleEdit(room)} style={{ flex: 1 }}>
                                Edit
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(room.id)} style={{ flex: 1 }}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '1.5rem' }}>
                            {editingRoom ? 'Edit Room Type' : 'Add New Room Type'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="input-label">Room Type</label>
                                <input
                                    type="text"
                                    name="room_type"
                                    className="input-field"
                                    value={formData.room_type}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., Shared Dorm, Private Room"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Description</label>
                                <textarea
                                    name="description"
                                    className="input-field"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    placeholder="Describe the room..."
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Price per Night ($)</label>
                                <input
                                    type="number"
                                    name="price_per_night"
                                    className="input-field"
                                    value={formData.price_per_night}
                                    onChange={handleInputChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    placeholder="50.00"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Capacity (guests)</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    className="input-field"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    placeholder="4"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Image URL</label>
                                <input
                                    type="url"
                                    name="image_url"
                                    className="input-field"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/room.jpg"
                                />
                            </div>

                            <div className="input-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                        style={{ width: 'auto' }}
                                    />
                                    <span className="input-label" style={{ marginBottom: 0 }}>Active</span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {editingRoom ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowModal(false)}
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
