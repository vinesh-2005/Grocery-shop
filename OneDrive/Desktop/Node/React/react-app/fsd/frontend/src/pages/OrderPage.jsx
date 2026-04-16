import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import './OrderPage.css';

const OrderPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/api/orders/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order', error);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Placed': return <Clock size={20} />;
            case 'Accepted': return <CheckCircle size={20} />;
            case 'Assigned': return <Truck size={20} />;
            case 'Out for Delivery': return <Truck size={20} />;
            case 'Delivered': return <Package size={20} />;
            default: return <Clock size={20} />;
        }
    };

    if (loading) return <div className="loading">Fetching order details...</div>;
    if (!order) return <div className="error">Order not found.</div>;

    const steps = ['Placed', 'Accepted', 'Assigned', 'Out for Delivery', 'Delivered'];
    const currentStepIdx = steps.indexOf(order.status);

    return (
        <div className="order-page animate-fade py-4">
            <div className="container">
                <div className="order-header-card card glass">
                   <div className="order-id">
                       Order ID: <span>#{order._id}</span>
                   </div>
                   <div className={`order-status-badge badge badge-${order.status === 'Delivered' ? 'success' : 'info'}`}>
                       {order.status}
                   </div>
                </div>

                {/* Progress Tracker */}
                <section className="order-tracker card glass">
                    <h3>Tracking Status</h3>
                    <div className="tracking-steps">
                        {steps.map((step, index) => (
                            <div key={index} className={`step ${index <= currentStepIdx ? 'active' : ''}`}>
                                <div className="step-point">{getStatusIcon(step)}</div>
                                <span className="step-label">{step}</span>
                                {index < steps.length - 1 && <div className="step-line" />}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="order-grid">
                    <div className="order-main">
                        <section className="card glass order-section">
                            <div className="section-header">
                                <Package size={20} />
                                <h3>Items Purchased</h3>
                            </div>
                            <div className="order-items">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="order-item-row">
                                        <div className="item-main">
                                            <img src={item.image} alt={item.name} />
                                            <div className="item-details">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                <p>₹{item.price} x {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="card glass order-section">
                            <div className="section-header">
                                <Truck size={20} />
                                <h3>Delivery Information</h3>
                            </div>
                            <p><strong>Name:</strong> {order.user.name}</p>
                            <p><strong>Address:</strong> {order.shippingAddress.address}</p>
                            <p><strong>Email:</strong> {order.user.email}</p>
                            
                            {order.deliveryAgent && (
                                <div className="agent-info mt-1 card glass-dark">
                                    <Truck size={18} />
                                    <span>Assigned Agent: {order.deliveryAgent.name}</span>
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="order-sidebar">
                        <section className="card glass summary-card">
                            <h3>Payment Summary</h3>
                            <div className="summary-row">
                                <span>Items Subtotal</span>
                                <span>₹{order.itemsPrice}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>₹{order.shippingPrice}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (GST 5%)</span>
                                <span>₹{order.taxPrice}</span>
                            </div>
                            <hr />
                            <div className="summary-row total">
                                <span>Grand Total</span>
                                <span>₹{order.totalPrice}</span>
                            </div>
                            <div className={`mt-1 p-1 card ${order.isPaid ? 'glass-dark' : 'badge-pending'}`}>
                                <CreditCard size={18} /> 
                                <strong>Payment Method:</strong> {order.paymentMethod}
                                <p>{order.isPaid ? 'Status: Paid' : 'Status: Pending'}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
