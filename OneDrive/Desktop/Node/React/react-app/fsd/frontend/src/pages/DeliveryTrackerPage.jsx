import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Phone, MessageSquare, User, ArrowLeft, Package, Clock, CheckCircle } from 'lucide-react';
import './DeliveryTrackerPage.css';

const DeliveryTrackerPage = () => {
    const [timeLeft] = useState(() => Math.floor(Math.random() * 20) + 10);
    const [driverName] = useState('Rahul M.');
    const [vehicle] = useState('Honda Activa • TN 45 BQ 8920');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="tracker-page">
            <div className="container">
                <Link to="/order-success" className="back-link py-1 mb-2" style={{display: 'inline-flex', alignItems: 'center', gap: '5px', color:'var(--primary)'}}>
                    <ArrowLeft size={18} /> Back
                </Link>
                
                <div className="tracker-container">
                    {/* Live Map Placeholder UI */}
                    <div className="map-container">
                        <div className="map-overlay">
                            <Navigation size={24} />
                            <span>Arriving in {timeLeft} mins</span>
                        </div>
                    </div>

                    <div className="tracker-details">
                        {/* Driver Info Card */}
                        <div className="driver-card">
                            <div className="driver-avatar">
                                <User size={32} />
                            </div>
                            <div className="driver-info">
                                <h3>{driverName}</h3>
                                <p><strong>★ 4.9</strong> • {vehicle}</p>
                            </div>
                            <div className="contact-actions">
                                <button className="icon-btn" title="Call Driver">
                                    <Phone size={20} />
                                </button>
                                <button className="icon-btn" title="Message Driver">
                                    <MessageSquare size={20} />
                                </button>
                            </div>
                        </div>

                        <h3 style={{marginBottom: '1.5rem', color: '#1e293b'}}>Delivery Status</h3>

                        {/* Interactive Timeline */}
                        <div className="delivery-timeline">
                            <div className="timeline-item completed">
                                <h4>Order Confirmed</h4>
                                <p className="flex align-center gap-1"><CheckCircle size={14} color="var(--success)"/> We have received your order details.</p>
                            </div>
                            
                            <div className="timeline-item completed">
                                <h4>Order Packed</h4>
                                <p className="flex align-center gap-1"><Package size={14} color="var(--success)" /> Store has securely packed your fresh groceries.</p>
                            </div>
                            
                            <div className="timeline-item active">
                                <h4>Out for Delivery</h4>
                                <p className="flex align-center gap-1"><Navigation size={14} color="var(--primary)"/> Rahul is on the way to your location.</p>
                            </div>
                            
                            <div className="timeline-item">
                                <h4>Delivered</h4>
                                <p className="flex align-center gap-1"><Clock size={14} /> Expected in {timeLeft} minutes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryTrackerPage;
