import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, User, CheckCircle, Truck, Eye, Clock, XCircle, Search } from 'lucide-react';
import './AdminPages.css';

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/orders');
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatusHandler = async (id, status) => {
        try {
            await axios.put(`/api/orders/${id}/status`, { status });
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status', error);
        }
    };

    const filteredOrders = orders.filter(o => 
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading store orders...</div>;

    return (
        <div className="admin-page animate-fade py-4">
            <div className="container">
                <div className="admin-header flex justify-between align-center">
                    <h1 className="section-title">Order Management</h1>
                </div>

                <div className="admin-controls flex gap-2 py-2">
                    <div className="search-box glass flex align-center px-1">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by Order ID or User..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="card glass table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Cusomter</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        <Link to={`/order/${order._id}`} className="order-id-link">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </Link>
                                    </td>
                                    <td>{order.user.name}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>₹{order.totalPrice}</td>
                                    <td>
                                        <span className={`badge badge-${order.status.toLowerCase().replace(' ', '-')}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="btn-view" onClick={() => navigate(`/order/${order._id}`)}>
                                            <Eye size={18} />
                                        </button>
                                        {order.status === 'Placed' && (
                                            <button className="btn-success" onClick={() => updateStatusHandler(order._id, 'Accepted')}>
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        {order.status === 'Accepted' && (
                                            <button className="btn-info" onClick={() => updateStatusHandler(order._id, 'Assigned')}>
                                                <Truck size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && <div className="p-4 text-center">No orders found.</div>}
                </div>
            </div>
        </div>
    );
};

export default OrderListPage;
