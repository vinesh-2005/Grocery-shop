import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Package, ShoppingBag, Users, IndianRupee, TrendingUp, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, PackageSearch
} from 'lucide-react';
import './DashboardPage.css';

const DashboardPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showStockModal, setShowStockModal] = useState(false);
    const [isAddingStock, setIsAddingStock] = useState(false);
    const [stockAdded, setStockAdded] = useState(false);

    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await axios.get('/api/analytics/dashboard');
                setAnalytics(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching analytics', error);
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const COLORS = ['#2E7D32', '#FF9800', '#2196F3', '#F44336'];

    const handleAddStock = () => {
        setIsAddingStock(true);
        setTimeout(() => {
            setIsAddingStock(false);
            setStockAdded(true);
            setTimeout(() => {
                setShowStockModal(false);
                setStockAdded(false);
            }, 3000); // Close after 3 seconds
        }, 1500); // Simulate API call
    };

    const handleViewOrdersClick = async () => {
        // As requested, connecting View Orders to Delivery Login
        await logout();
        navigate('/login');
    };

    if (loading) return <div className="loading">Processing store analytics...</div>;

    const stats = [
        { title: 'Total Orders', value: '100', icon: <ShoppingBag />, change: '+24%', color: '#e8f5e9', text: '#2e7d32' },
        { title: 'Gross Revenue', value: '₹50000', icon: <IndianRupee />, change: '+18.5%', color: '#fff3e0', text: '#ef6c00' },
        { title: 'Active Customers', value: '100', icon: <Users />, change: '+12%', color: '#e3f2fd', text: '#1565c0' },
        { title: 'Total Products', value: '100', icon: <Package />, change: '+4%', color: '#f3e5f5', text: '#7b1fa2' },
        { title: 'Profit Margin', value: '32.8%', icon: <TrendingUp />, change: '+5.2%', color: '#e8f5e9', text: '#2e7d32' },
        { title: 'Loss/Wastage', value: '1.5%', icon: <ArrowDownRight />, change: '-1.2%', color: '#ffebee', text: '#d32f2f' },
    ];

    return (
        <div className="dashboard-page animate-fade py-4">
            <div className="container">
                <div className="dashboard-heading flex justify-between align-center">
                    <h1 className="section-title">Store Dashboard</h1>
                    <div className="date-badge glass">Last 7 Days Reporting</div>
                </div>

                <div className="stats-grid">
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-card card glass animate-fade" style={{'--index': i}}>
                            <div className="stat-info">
                                <span className="stat-title">{stat.title}</span>
                                <h2 className="stat-value">{stat.value}</h2>
                                <div className="stat-change flex">
                                   {stat.change.startsWith('+') ? <ArrowUpRight size={14} color="var(--success)" /> : null}
                                   <span className={stat.change.startsWith('+') ? 'text-success' : ''}>{stat.change}</span>
                                   <span className="sm-text">vs last week</span>
                                </div>
                            </div>
                            <div className="stat-icon" style={{ backgroundColor: stat.color, color: stat.text }}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="charts-grid mt-2">
                    {/* Revenue & Growth Chart */}
                    <div className="chart-container card glass">
                        <div className="chart-header">
                            <h3>Revenue Overview</h3>
                            <p>Daily performance and order volume</p>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analytics.orderStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Value (₹)" />
                                    <Bar dataKey="orders" fill="var(--primary-light)" radius={[4, 4, 0, 0]} name="Orders" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Payment Distribution */}
                    <div className="chart-container card glass">
                        <div className="chart-header">
                            <h3>Payment Methods</h3>
                            <p>Volume by payment category</p>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={analytics.revenueByPaymentData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="total"
                                        nameKey="_id"
                                    >
                                        {analytics.revenueByPaymentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="inventory-section mt-2 grid">
                    <div className="card glass inventory-alert-card flex align-center gap-2">
                        <div className="alert-icon"><AlertTriangle size={32} color="var(--accent)" /></div>
                        <div>
                           <h3>Inventory Alert</h3>
                           <p>4 products are running below threshold levels. Consider restocking.</p>
                        </div>
                        <button className="btn btn-primary ml-auto" onClick={() => setShowStockModal(true)}>Manage Stock</button>
                    </div>

                    <div className="card glass orders-status-card flex justify-between align-center p-2">
                       <div className="status-group flex align-center gap-1">
                          <Clock size={20} color="var(--accent)" />
                          <div>
                            <strong>{analytics.pendingOrders} Pending</strong>
                            <p className="sm-text">Awaiting fulfillment</p>
                          </div>
                       </div>
                       <div className="status-group flex align-center gap-1">
                          <CheckCircle size={20} color="var(--success)" />
                          <div>
                            <strong>{analytics.completedOrders} Delivered</strong>
                            <p className="sm-text">In last 24 hours</p>
                          </div>
                       </div>
                       <button className="btn btn-secondary" onClick={handleViewOrdersClick}>View Orders</button>
                    </div>
                </div>

                {/* Customer Requests Quick Link */}
                <div className="card glass mt-2 flex align-center justify-between p-2">
                    <div className="flex align-center gap-2">
                         <div className="alert-icon" style={{background: 'var(--primary-light)', padding: '12px', borderRadius: '50%'}}>
                             <PackageSearch size={32} color="var(--primary-dark)" />
                         </div>
                         <div>
                            <h3>Customer Product Requests</h3>
                            <p>Review and fulfill items requested by your customers missing from the inventory.</p>
                         </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/admin/requests')}>View Requests</button>
                </div>
            </div>

            {/* Interactive Stock Management Modal */}
            {showStockModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="modal-content card glass animate-fade" style={{ width: '400px', backgroundColor: 'var(--surface-color)', color: 'var(--text-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <AlertTriangle color="var(--accent)" />
                            <h2 style={{ margin: 0 }}>Stock Management</h2>
                        </div>
                        
                        <p style={{ marginBottom: '12px' }}>The following popular items are critically low:</p>
                        
                        <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '20px', backgroundColor: 'var(--background-color)', borderRadius: '8px', padding: '12px' }}>
                            <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>🍅 Fresh Red Tomatoes <strong style={{ color: 'var(--accent)' }}>(2 kg left)</strong></li>
                            <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>🍌 Organic Bananas <strong style={{ color: 'var(--accent)' }}>(5 kg left)</strong></li>
                            <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>🫑 Green Bell Peppers <strong style={{ color: 'var(--accent)' }}>(1 kg left)</strong></li>
                            <li style={{ padding: '8px 0' }}>🍎 Kashmir Apples <strong style={{ color: 'var(--accent)' }}>(4 kg left)</strong></li>
                        </ul>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {stockAdded ? (
                                <div className="text-success font-bold flex align-center justify-center gap-1" style={{ padding: '10px', backgroundColor: 'var(--background-color)', borderRadius: '8px' }}>
                                    <CheckCircle size={20} /> Stock successfully replenished!
                                </div>
                            ) : (
                                <button 
                                    className="btn btn-primary flex align-center justify-center gap-1"
                                    onClick={handleAddStock}
                                    disabled={isAddingStock}
                                    style={{ width: '100%', padding: '12px' }}
                                >
                                    <Package size={18} /> {isAddingStock ? 'Updating Inventory Server...' : 'Add Quick Stock (Example)'}
                                </button>
                            )}
                            <button className="btn btn-secondary flex justify-center" style={{ width: '100%' }} onClick={() => setShowStockModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
