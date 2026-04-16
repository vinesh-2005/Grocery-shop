import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PackageSearch, Send, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import './ProductRequestLayout.css';

const RequestProductPage = () => {
    const { userInfo } = useAuth();
    const [productName, setProductName] = useState('');
    const [details, setDetails] = useState('');
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchMyRequests = async () => {
        try {
            const { data } = await axios.get('/api/requests/mine', { withCredentials: true });
            setMyRequests(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching requests', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await axios.post('/api/requests', { productName, details }, { withCredentials: true });
            setMessage({ type: 'success', text: 'Product request submitted successfully!' });
            setProductName('');
            setDetails('');
            fetchMyRequests();
            
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error submitting request' });
        }
        setSubmitLoading(false);
    };

    return (
        <div className="request-product-page animate-fade py-4">
            <div className="container">
                <div className="flex align-center gap-1 mb-2">
                    <PackageSearch size={32} color="var(--primary)" />
                    <h1 className="section-title" style={{ margin: 0 }}>Request a Product</h1>
                </div>
                <p className="mb-2 text-secondary">Can't find what you're looking for? Let us know, and we'll try to add it to our store!</p>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Submit Form */}
                    <div className="card glass">
                        <h3 className="mb-1">Submit Request</h3>
                        {message && (
                            <div className={`message-alert card ${message.type === 'success' ? 'glass-dark' : 'error-msg'} mb-1`}>
                                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                <span>{message.text}</span>
                            </div>
                        )}
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Organic Almond Milk"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Additional Details (Optional)</label>
                                <textarea
                                    className="form-input"
                                    placeholder="Brand preference, quantity, etc."
                                    rows="4"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 flex align-center justify-center gap-1" disabled={submitLoading}>
                                {submitLoading ? 'Submitting...' : <><Send size={18} /> Submit Request</>}
                            </button>
                        </form>
                    </div>

                    {/* Prevoius Requests */}
                    <div className="card glass">
                        <h3 className="mb-1 flex align-center gap-1"><HistoryIcon /> My Request History</h3>
                        {loading ? (
                            <div className="loading" style={{ minHeight: '100px' }}>Loading requests...</div>
                        ) : myRequests.length === 0 ? (
                            <div className="empty-state text-center py-2 text-secondary">
                                <PackageSearch size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                <p>You haven't made any product requests yet.</p>
                            </div>
                        ) : (
                            <div className="request-list flex flex-col gap-1">
                                {myRequests.map((req) => (
                                    <div key={req._id} className="request-item card p-1" style={{ background: 'var(--background-color)', borderLeft: `4px solid var(--${req.status === 'Pending' ? 'accent' : req.status === 'In Inventory' ? 'success' : 'error'})` }}>
                                        <div className="flex justify-between align-center mb-1">
                                            <h4 style={{ margin: 0 }}>{req.productName}</h4>
                                            <span className={`badge badge-${req.status === 'Pending' ? 'pending' : req.status === 'In Inventory' ? 'success' : 'error'}`} style={{ fontSize: '0.7rem' }}>
                                                {req.status}
                                            </span>
                                        </div>
                                        {req.details && <p className="sm-text text-secondary mb-1">{req.details}</p>}
                                        <small className="text-secondary flex align-center gap-05">
                                            <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                                        </small>
                                        
                                        {req.notes && (
                                            <div className="mt-1 p-1 bg-light rounded sm-text" style={{ borderLeft: '2px solid var(--primary)' }}>
                                                <strong>Shop Owner:</strong> {req.notes}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const HistoryIcon = () => <Clock size={24} />;

export default RequestProductPage;
