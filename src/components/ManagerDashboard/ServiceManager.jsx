import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ServiceManager() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        is_active: true
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
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
            if (editingService) {
                const { error } = await supabase
                    .from('services')
                    .update(formData)
                    .eq('id', editingService.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('services')
                    .insert([formData]);

                if (error) throw error;
            }

            fetchServices();
            resetForm();
            setShowModal(false);
        } catch (error) {
            alert('Error saving service: ' + error.message);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            image_url: service.image_url || '',
            is_active: service.is_active
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchServices();
        } catch (error) {
            alert('Error deleting service: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            image_url: '',
            is_active: true
        });
        setEditingService(null);
    };

    const openNewServiceModal = () => {
        resetForm();
        setShowModal(true);
    };

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Service Management</h2>
                <button className="btn btn-primary" onClick={openNewServiceModal}>
                    + Add New Service
                </button>
            </div>

            <div className="grid grid-3">
                {services.map(service => (
                    <div key={service.id} className="glass-card">
                        {service.image_url && (
                            <img src={service.image_url} alt={service.name} className="service-image" />
                        )}
                        <h3>{service.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            {service.description}
                        </p>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-teal)', marginBottom: '1rem' }}>
                            ${service.price}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.85rem',
                                background: service.is_active ? 'var(--success)' : 'var(--error)'
                            }}>
                                {service.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-secondary" onClick={() => handleEdit(service)} style={{ flex: 1 }}>
                                Edit
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(service.id)} style={{ flex: 1 }}>
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
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="input-label">Service Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input-field"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., Breakfast Included"
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
                                    placeholder="Describe the service..."
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="input-field"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    placeholder="10.00"
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
                                    placeholder="https://example.com/image.jpg"
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
                                    {editingService ? 'Update' : 'Create'}
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
