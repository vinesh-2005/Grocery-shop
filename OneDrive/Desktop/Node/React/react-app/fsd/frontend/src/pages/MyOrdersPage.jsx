import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, CheckCircle, Clock, Eye, ShoppingCart } from 'lucide-react';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
    const { userInfo } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/orders/mine');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders', error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="loading">Checking your order history...</div>;

    return (
        <div className="my-orders-page animate-fade py-4">
            <div className="container">
                <h1 className="section-title">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="empty-orders card glass text-center flex flex-col items-center p-8">
                        <ShoppingCart size={48} className="icon-faint text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-4">No orders yet. Start shopping to see your history.</p>
                        <Link to="/" className="btn btn-primary mt-1">Go Shopping</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card-row card glass animate-fade">
                                <div className="order-info">
                                    <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                                    <p className="order-date">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                
                                <div className="order-items-preview">
                                    <div className="product-mini-gallery">
                                        {order.orderItems.slice(0, 2).map((item, idx) => (
                                            <div key={idx} className="product-mini-item">
                                                <img src={item.image} alt={item.name} className="product-mini-img" />
                                                <span className="product-mini-name" title={item.name}>{item.name}</span>
                                            </div>
                                        ))}
                                        {order.orderItems.length > 2 && (
                                            <div className="product-mini-more">
                                                +{order.orderItems.length - 2} items
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="order-total">
                                    ₹{order.totalPrice}
                                </div>

                                <div className={`order-status badge badge-${order.status.toLowerCase().replace(' ', '-')}`}>
                                    {order.status}
                                </div>

                                <Link to={`/order/${order._id}`} className="btn-view">
                                    <Eye size={20} /> View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
