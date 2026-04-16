import { useState, useEffect } from 'react';
import axios from 'axios';
import { PackageSearch, CheckCircle, Clock, XCircle, Search, Save } from 'lucide-react';

const AdminRequestListPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get('/api/requests', { withCredentials: true });
            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching requests', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (id, status, currentNotes) => {
        let notes = currentNotes;
        if (status === 'Rejected' || status === 'In Inventory') {
            const promptText = status === 'In Inventory' 
                ? 'Optional: Add a note (e.g. "Arriving tomorrow", "Now in stock!")' 
                : 'Optional: Reason for rejecting?';
            const userO = window.prompt(promptText, currentNotes || '');
            if (userO !== null) {
                notes = userO;
            } else {
                return; // User cancelled
            }
        }
        
        setUpdatingId(id);
        try {
            await axios.put(`/api/requests/${id}`, { status, notes }, { withCredentials: true });
            fetchRequests();
        } catch (error) {
            console.error('Error updating resource', error);
        }
        setUpdatingId(null);
    };

    return (
        <div className="admin-page animate-fade py-4">
            <div className="container">
                <div className="flex align-center gap-1 mb-2">
                    <PackageSearch size={32} color="var(--primary)" />
                    <h1 className="section-title" style={{ margin: 0 }}>Customer Product Requests</h1>
                </div>

                <div className="card glass">
                    {loading ? (
                        <div className="loading" style={{ minHeight: '200px' }}>Loading requests...</div>
                    ) : requests.length === 0 ? (
                        <div className="empty-state text-center py-4 text-secondary">
                            <Search size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                            <p>No product requests from customers yet.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="admin-table w-100">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Requested Product</th>
                                        <th>Details</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map(req => (
                                        <tr key={req._id}>
                                            <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <strong>{req.user?.name}</strong><br/>
                                                <small className="text-secondary">{req.user?.phone}</small>
                                            </td>
                                            <td style={{ fontWeight: 'bold' }}>{req.productName}</td>
                                            <td>{req.details || '-'}</td>
                                            <td>
                                                <span 
                                                    className={`badge badge-${req.status === 'Pending' ? 'pending' : req.status === 'In Inventory' ? 'success' : 'error'}`}
                                                    style={{ position: 'relative', top: 'auto', right: 'auto', display: 'inline-block' }}
                                                >
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td>
                                                {updatingId === req._id ? (
                                                    <span className="sm-text text-secondary">Updating...</span>
                                                ) : (
                                                    <div className="flex gap-05">
                                                        {req.status !== 'In Inventory' && (
                                                            <button 
                                                                className="btn btn-sm btn-success flex align-center gap-05"
                                                                onClick={() => handleStatusUpdate(req._id, 'In Inventory', req.notes)}
                                                                title="Mark as In Inventory"
                                                            >
                                                                <CheckCircle size={14} />
                                                            </button>
                                                        )}
                                                        {req.status !== 'Rejected' && (
                                                            <button 
                                                                className="btn btn-sm"
                                                                style={{ background: 'var(--error)', color: 'white' }}
                                                                onClick={() => handleStatusUpdate(req._id, 'Rejected', req.notes)}
                                                                title="Reject Request"
                                                            >
                                                                <XCircle size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                                {req.notes && (
                                                    <div className="mt-05 sm-text text-secondary">
                                                        <em>Note: {req.notes}</em>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminRequestListPage;
