import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Clock, 
  Package,
  History,
  TrendingUp,
  Users,
  Zap,
  Navigation,
  Star,
  AlertCircle,
  Bell
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import './DeliveryDashboardPage.css';

const playNotificationSound = () => {
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, context.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.3);
    } catch (e) {
        console.error("Audio playback failed", e);
    }
};

const DeliveryDashboardPage = () => {
    const { userInfo } = useContext(AuthContext);
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);

    const fetchData = async () => {
        try {
            const [assignedRes, availableRes] = await Promise.all([
                axios.get('/api/orders/assigned', { withCredentials: true }),
                axios.get('/api/orders/available', { withCredentials: true })
            ]);
            setAssignedOrders(assignedRes.data);
            setAvailableOrders(availableRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Initialize Socket.IO connection
        const socket = io('http://127.0.0.1:5001', {
            withCredentials: true
        });

        socket.on('connect', () => {
            console.log('Socket connected for real-time order updates');
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            setSocketConnected(false);
        });

        socket.on('new_order', (newOrder) => {
            console.log('New real-time order received:', newOrder);
            playNotificationSound();
            
            // Mark as new for animation purposes
            newOrder.isNew = true;
            
            setAvailableOrders(prev => {
                // Ensure no duplicates
                if (prev.find(o => o._id === newOrder._id)) return prev;
                return [newOrder, ...prev];
            });

            // Remove highlight flag after 4 seconds
            setTimeout(() => {
                setAvailableOrders(current => 
                    current.map(o => o._id === newOrder._id ? { ...o, isNew: false } : o)
                );
            }, 4000);
        });

        socket.on('order_updated', (updatedOrder) => {
            // Remove from available if picked up
            if (updatedOrder.status !== 'Placed') {
                setAvailableOrders(prev => prev.filter(o => o._id !== updatedOrder._id));
            }
            
            // Update assigned if it belongs to us
            if (updatedOrder.deliveryAgent === userInfo?._id) {
                setAssignedOrders(prev => {
                    const exists = prev.find(o => o._id === updatedOrder._id);
                    if (exists) {
                        return prev.map(o => o._id === updatedOrder._id ? updatedOrder : o);
                    }
                    return [updatedOrder, ...prev];
                });
            } else {
                setAssignedOrders(prev => prev.filter(o => o._id !== updatedOrder._id));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [userInfo?._id]);

    const updateStatus = async (id, status) => {
        if (id.toString().startsWith('mock_')) {
            alert('This is a mock example delivery. Status updates work for real database orders!');
            return;
        }
        setUpdatingId(id);
        try {
            await axios.put(`/api/orders/${id}/status`, { status, agentId: userInfo?._id }, { withCredentials: true });
            // Socket will broadcast order_updated and handle state, but let's fetch to ensure sync
            fetchData();
        } catch (error) {
            console.error('Error updating status', error);
            if (error.response?.status === 404 || error.response?.data?.message?.includes('found')) {
                alert('Order was already accepted by someone else or not found!');
                fetchData();
            }
        }
        setUpdatingId(null);
    };

    if (loading) return (
        <div className="delivery-loading animate-fade">
            <Truck size={48} className="spin-icon" />
            <p>Gathering orders...</p>
        </div>
    );

    let activeDeliveries = assignedOrders.filter(o => o.status !== 'Delivered');
    let pastDeliveries = assignedOrders.filter(o => o.status === 'Delivered');
    let totalEarnings = pastDeliveries.reduce((sum, o) => sum + o.totalPrice, 0);

    // Provide Example Deliveries if database has none for this agent
    const hasNoOrders = assignedOrders.length === 0 && availableOrders.length === 0;
    if (hasNoOrders) {
        activeDeliveries = [
            {
                _id: 'mock_1',
                status: 'Out for Delivery',
                paymentMethod: 'COD',
                user: { name: 'Priya Sharma' },
                shippingAddress: { address: '12 MG Road, Bengaluru', phone: '9876543210' },
                orderItems: [{ name: 'Fresh Red Tomatoes', quantity: 2 }, { name: 'Organic Bananas', quantity: 1 }],
                totalPrice: 170
            }
        ];
        pastDeliveries = [
            {
                _id: 'mock_comp_1',
                status: 'Delivered',
                user: { name: 'Ananya Reddy' },
                totalPrice: 450,
                deliveredAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        totalEarnings = pastDeliveries.reduce((sum, o) => sum + o.totalPrice, 0);
    }

    const activityFeed = [
        { text: 'Priya Sharma rated you ⭐⭐⭐⭐⭐', time: '2 min ago', icon: Star },
        { text: 'New delivery zone opened: Whitefield', time: '15 min ago', icon: MapPin },
        { text: 'Peak hours bonus: 1.5x pay active!', time: '30 min ago', icon: Zap },
    ];

    const OrderCard = ({ order, type }) => (
        <div 
            className={`assignment-card card glass animate-fade ${expandedOrder === order._id ? 'expanded' : ''} ${order.isNew ? 'new-order' : ''}`}
            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
        >
            <div className="card-top flex justify-between align-center">
                <div className="flex align-center gap-1">
                    <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                    {order.paymentMethod === 'COD' && (
                        <span className="cod-badge">COD</span>
                    )}
                    {order.isNew && (
                        <span className="cod-badge" style={{background:'var(--success)', color:'white', animation: 'pulse-dot 1s infinite'}}>NEW</span>
                    )}
                </div>
                <span className={`status-pill status-${order.status.toLowerCase().replace(/ /g, '-')}`}>
                    {order.status === 'Placed' && <Bell size={14} />}
                    {order.status === 'Assigned' && <AlertCircle size={14} />}
                    {order.status === 'Out for Delivery' && <Navigation size={14} />}
                    {order.status}
                </span>
            </div>
            
            <div className="customer-info mt-1">
                <h4>{order.user?.name || 'Customer'}</h4>
                <div className="info-row">
                    <MapPin size={16} />
                    <p>{order.shippingAddress?.address || 'N/A'}</p>
                </div>
                <div className="info-row">
                    <Phone size={16} />
                    <p>{order.shippingAddress?.phone || 'N/A'}</p>
                </div>
            </div>

            <div className={`order-items-section ${expandedOrder === order._id ? 'show' : ''}`}>
                <div className="order-items mt-1 p-1" style={{ background: 'var(--bg-light)', borderRadius: 'var(--radius)', padding: '10px' }}>
                    <h5 style={{ marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>📦 Items</h5>
                    {order.orderItems?.map((item, index) => (
                        <div key={index} className="flex justify-between sm-text mb-1 pb-1" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <span>{item.name}</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary-dark)' }}>x{item.quantity}</span>
                        </div>
                    ))}
                    <div className="flex justify-between sm-text mt-1 pt-1" style={{ fontWeight: 'bold' }}>
                        <span>Total Amount</span>
                        <span style={{ color: 'var(--primary)' }}>₹{order.totalPrice} ({order.paymentMethod})</span>
                    </div>
                </div>
            </div>

            <div className="assignment-actions flex gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                {type === 'available' && (
                    <button 
                        className="btn btn-success w-100" 
                        onClick={() => updateStatus(order._id, 'Assigned')}
                        disabled={updatingId === order._id}
                    >
                        {updatingId === order._id ? <span className="btn-loading">Accepting...</span> : <><CheckCircle size={18} /> Accept Order</>}
                    </button>
                )}
                {type === 'active' && order.status === 'Assigned' && (
                    <button 
                        className="btn btn-primary w-100" 
                        onClick={() => updateStatus(order._id, 'Out for Delivery')}
                        disabled={updatingId === order._id}
                    >
                        {updatingId === order._id ? <span className="btn-loading">Updating...</span> : <><Truck size={18} /> Start Delivery</>}
                    </button>
                )}
                {type === 'active' && order.status === 'Out for Delivery' && (
                    <button 
                        className="btn btn-success w-100" 
                        onClick={() => updateStatus(order._id, 'Delivered')}
                        disabled={updatingId === order._id}
                    >
                        {updatingId === order._id ? <span className="btn-loading">Confirming...</span> : <><CheckCircle size={18} /> Confirm Delivery</>}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="delivery-dashboard animate-fade py-4">
            <div className="container">
                <div className="dashboard-header flex justify-between align-center mb-2">
                    <div>
                        <h1 className="section-title" style={{ marginBottom: '4px' }}>Delivery Dashboard</h1>
                        <p className="sm-text" style={{ color: 'var(--text-secondary)' }}>Manage your deliveries and track performance</p>
                    </div>
                    <div className="status-indicator flex align-center gap-1 glass">
                        <div className={`status-dot ${socketConnected ? 'online' : ''}`} style={!socketConnected ? {backgroundColor: 'red'} : {}} />
                        <span>{socketConnected ? 'Online & Ready' : 'Connecting...'}</span>
                    </div>
                </div>

                <div className="stats-row mb-2">
                    <div className="stat-card glass animate-fade">
                        <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                            <Bell size={22} color="white" />
                        </div>
                        <div className="stat-data">
                            <span className="stat-value">{availableOrders.length}</span>
                            <span className="stat-label">New Orders</span>
                        </div>
                    </div>
                    <div className="stat-card glass animate-fade">
                        <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)' }}>
                            <Truck size={22} color="white" />
                        </div>
                        <div className="stat-data">
                            <span className="stat-value">{activeDeliveries.length}</span>
                            <span className="stat-label">Active</span>
                        </div>
                    </div>
                    <div className="stat-card glass animate-fade">
                        <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}>
                            <TrendingUp size={22} color="white" />
                        </div>
                        <div className="stat-data">
                            <span className="stat-value">₹{Math.round(totalEarnings)}</span>
                            <span className="stat-label">Earnings</span>
                        </div>
                    </div>
                    <div className="stat-card glass animate-fade">
                        <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                            <CheckCircle size={22} color="white" />
                        </div>
                        <div className="stat-data">
                            <span className="stat-value">{pastDeliveries.length}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                </div>

                <div className="delivery-grid">
                    <div className="active-assignments">
                        {/* Available Orders Section */}
                        <div className="section-header flex align-center gap-1 mb-1">
                            <Bell size={20} color="var(--primary)" />
                            <h3>Incoming Orders ({availableOrders.length})</h3>
                        </div>
                        
                        {availableOrders.length === 0 ? (
                            <div className="card glass p-2 text-center empty-state mb-2" style={{padding: '20px'}}>
                                <p className="sm-text">Waiting for new orders...</p>
                            </div>
                        ) : (
                            <div className="assignments-list mb-2">
                                {availableOrders.map((order) => (
                                    <OrderCard key={order._id} order={order} type="available" />
                                ))}
                            </div>
                        )}

                        <div className="section-header flex align-center gap-1 mb-1 mt-2">
                            <Clock size={20} color="var(--accent)" />
                            <h3>My Active Deliveries ({activeDeliveries.length})</h3>
                        </div>

                        {activeDeliveries.length === 0 && !hasNoOrders ? (
                            <div className="card glass p-4 text-center empty-state">
                                <Package size={48} className="icon-faint" />
                                <p>No active assignments at the moment.</p>
                                <span className="sm-text" style={{ color: 'var(--text-secondary)' }}>Accept orders to see them here.</span>
                            </div>
                        ) : (
                            <div className="assignments-list">
                                {activeDeliveries.map((order) => (
                                    <OrderCard key={order._id} order={order} type="active" />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="delivery-sidebar">
                        <div className="section-header flex align-center gap-1 mb-1">
                            <History size={20} color="var(--primary)" />
                            <h3>Recently Completed ({pastDeliveries.length})</h3>
                        </div>
                        <div className="history-list mb-2">
                            {pastDeliveries.length === 0 && !hasNoOrders ? (
                                <p className="p-2 card glass text-center">No delivery history yet.</p>
                            ) : (
                                pastDeliveries.slice(0, 5).map((order) => (
                                    <div key={order._id} className="history-item card glass flex align-center justify-between animate-fade">
                                        <div className="info">
                                            <strong>{order.user?.name || 'Customer'}</strong>
                                            <p className="sm-text">₹{order.totalPrice} · {new Date(order.deliveredAt || order.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                        <CheckCircle size={20} color="var(--success)" />
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="section-header flex align-center gap-1 mb-1">
                            <Zap size={20} color="var(--accent)" />
                            <h3>Live Activity</h3>
                        </div>
                        <div className="activity-feed glass mb-2">
                            {activityFeed.map((item, idx) => (
                                <div key={idx} className="activity-item animate-fade" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="activity-icon-wrap">
                                        <item.icon size={14} />
                                    </div>
                                    <div className="activity-text">
                                        <p>{item.text}</p>
                                        <span className="activity-time">{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboardPage;
