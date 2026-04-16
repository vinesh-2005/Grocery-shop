import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, CreditCard, Calendar, AlertCircle, Save, History, Search } from 'lucide-react';
import './AdminPages.css';

const UserDuesPage = () => {
    const [usersWithDues, setUsersWithDues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editLimit, setEditLimit] = useState({ userId: null, limit: 0 });

    const fetchDues = async () => {
        try {
            const { data } = await axios.get('/api/credit/dues');
            setUsersWithDues(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dues', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDues();
    }, []);

    const updateLimitHandler = async (userId) => {
        try {
            await axios.put(`/api/credit/limit/${userId}`, { creditLimit: editLimit.limit });
            setEditLimit({ userId: null, limit: 0 });
            fetchDues();
        } catch (error) {
            console.error('Error updating limit', error);
        }
    };

    const filteredDues = usersWithDues.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Processing credit ledger...</div>;

    return (
        <div className="admin-page animate-fade py-4">
            <div className="container">
                <div className="admin-header flex justify-between align-center">
                    <h1 className="section-title">Credit Ledger</h1>
                </div>

                <div className="admin-controls flex gap-2 py-2">
                    <div className="search-box glass flex align-center px-1">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by User Name or Email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="card glass table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Total Due</th>
                                <th>Credit Limit</th>
                                <th>Last Payment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDues.map((user) => (
                                <tr key={user._id}>
                                    <td className="user-cell">
                                        <User size={18} />
                                        <span>{user.name}</span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td className="text-error font-bold">₹{user.totalDue}</td>
                                    <td>
                                        {editLimit.userId === user._id ? (
                                            <div className="edit-limit flex align-center gap-1">
                                                <input 
                                                    type="number" 
                                                    className="form-input sm" 
                                                    value={editLimit.limit}
                                                    onChange={(e) => setEditLimit({...editLimit, limit: e.target.value})}
                                                />
                                                <button className="confirm-btn" onClick={() => updateLimitHandler(user._id)}>
                                                    <Save size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex align-center gap-2">
                                                <span>₹{user.creditLimit}</span>
                                                <button className="btn-edit" onClick={() => setEditLimit({ userId: user._id, limit: user.creditLimit })}>
                                                    <CreditCard size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td>{user.lastPaymentDate ? new Date(user.lastPaymentDate).toLocaleDateString() : 'Never'}</td>
                                    <td className="actions-cell">
                                        <button className="btn-view" title="Transaction History">
                                            <History size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredDues.length === 0 && <div className="p-4 text-center">No users found with active dues.</div>}
                </div>
            </div>
        </div>
    );
};

export default UserDuesPage;
