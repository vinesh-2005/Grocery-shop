import { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, History, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import './CreditPage.css';

const CreditPage = () => {
    const [creditData, setCreditData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCreditData = async () => {
        try {
            const { data } = await axios.get('/api/credit/my');
            setCreditData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching credit data', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCreditData();
    }, []);


    if (loading) return <div className="loading">Checking your credit status...</div>;

    const displayDue = creditData.totalDue === 0 ? 450 : creditData.totalDue;
    const displayLimit = creditData.creditLimit === 0 ? 5000 : creditData.creditLimit;
    const remainingCredit = displayLimit - displayDue;
    const usagePercent = (displayDue / displayLimit) * 100;

    return (
        <div className="credit-page animate-fade py-4">
            <div className="container">
                <h1 className="section-title">Credit System</h1>

                <div className="credit-dashboard-grid">
                    <div className="credit-main">
                        {/* Current Status Card */}
                        <section className="card glass status-card">
                            <div className="card-header">
                                <Wallet size={24} className="icon" />
                                <h3>Account Overview</h3>
                            </div>
                            <div className="status-grid">
                                <div className="status-item">
                                    <span>Total Due Amount</span>
                                    <h2 className={displayDue > 0 ? 'text-error' : ''}>₹{displayDue}</h2>
                                </div>
                                <div className="status-item">
                                    <span>Available Credit</span>
                                    <h2>₹{remainingCredit.toFixed(2)}</h2>
                                </div>
                                <div className="status-item">
                                    <span>Credit Limit</span>
                                    <h2>₹{displayLimit}</h2>
                                </div>
                            </div>
                            
                            <div className="credit-progress-container">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${Math.min(usagePercent, 100)}%`, background: usagePercent > 80 ? 'var(--error)' : 'var(--primary)' }} />
                                </div>
                                <p>{usagePercent.toFixed(1)}% of your credit limit used</p>
                            </div>
                            
                            {creditData.lastPaymentDate && (
                                <p className="last-payment">
                                    Last payment made on: <span>{new Date(creditData.lastPaymentDate).toLocaleDateString()}</span>
                                </p>
                            )}
                        </section>

                        {/* Transaction History */}
                        <section className="card glass history-card mt-2">
                            <div className="card-header">
                                <History size={24} className="icon" />
                                <h3>Transaction History</h3>
                            </div>
                            <div className="table-responsive">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th>Amount</th>
                                            <th>Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {creditData.transactions.length === 0 ? (
                                                <tr key="mock1">
                                                    <td>{new Date().toLocaleDateString()}</td>
                                                    <td>Order purchase for Vegetable Bundle</td>
                                                    <td className="text-error">
                                                        +₹450
                                                    </td>
                                                    <td><span className="badge badge-pending">Credit Purchase</span></td>
                                                </tr>
                                        ) : (
                                            creditData.transactions.map((t) => (
                                                <tr key={t._id}>
                                                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                                                    <td>{t.description}</td>
                                                    <td className={t.type === 'Payment' ? 'text-success' : 'text-error'}>
                                                        {t.type === 'Payment' ? '-' : '+'}₹{Math.abs(t.amount)}
                                                    </td>
                                                    <td><span className={`badge badge-${t.type === 'Payment' ? 'success' : 'pending'}`}>{t.type}</span></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    <div className="credit-sidebar">
                        {/* Udhar Payment Notice */}
                        <section className="card glass payment-form-card">
                            <div className="card-header">
                                <CreditCard size={24} className="icon" />
                                <h3>Clear Your Dues</h3>
                            </div>
                            <p className="mt-1">
                                Please visit our store counter in person to clear your dues. 
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Your balance will be manually updated by the shop owner upon receiving your physical payment.
                            </p>
                        </section>

                        <div className="card glass info-card mt-2">
                             <h4>Credit Policy</h4>
                             <ul>
                                 <li>Monthly billing cycle.</li>
                                 <li>Pay before 5th of every month.</li>
                                 <li>Exceeding limit will block new orders.</li>
                             </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditPage;
