import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Gift, ArrowRight, Navigation } from 'lucide-react';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
    const [deliveryTime] = useState(() => Math.floor(Math.random() * 20) + 15); // 15 to 35 mins
    const [points] = useState(() => Math.floor(Math.random() * 150) + 50); // 50 to 200 points
    const [orderId] = useState(() => 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase());

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="order-success-page">
            <div className="success-card">
                {/* Header Banner */}
                <div className="success-header">
                    <div className="success-icon-wrapper">
                        <CheckCircle size={48} />
                    </div>
                    <h1>Order Confirmed!</h1>
                    <p>Thank you for shopping with FreshGrocer.</p>
                    <span className="order-id-badge">
                        {orderId}
                    </span>
                </div>

                {/* Content Section */}
                <div className="success-content">
                    <div className="success-grid">
                        {/* Delivery Estimate */}
                        <div className="info-box delivery">
                            <div className="info-icon">
                                <Clock size={24} />
                            </div>
                            <div className="info-text">
                                <h3>Arriving In</h3>
                                <p>approx. <strong>{deliveryTime} minutes</strong></p>
                                <p style={{fontSize: '0.8rem', color: '#f57c00', marginTop: '4px'}}>Our agent is preparing your package.</p>
                            </div>
                        </div>

                        {/* Reward Points */}
                        <div className="info-box points">
                            <div className="info-icon">
                                <Gift size={24} />
                            </div>
                            <div className="info-text">
                                <h3>Fresh Points Earned!</h3>
                                <p>You earned <strong>{points} points</strong></p>
                                <p style={{fontSize: '0.8rem', color: '#8e24aa', marginTop: '4px'}}>Redeemable on your next grocery box.</p>
                            </div>
                        </div>
                    </div>



                    <div className="success-actions">
                        <Link to="/my-orders" className="btn btn-secondary btn-block">
                            View My Orders
                        </Link>
                        <Link to="/" className="btn btn-primary btn-block">
                            Continue Shopping <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
