import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CreditCard, Wallet, Banknote, ArrowLeft, ArrowRight } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';
import './CheckoutPages.css';

const PaymentPage = () => {
    const { paymentMethod, savePaymentMethod } = useCart();
    const [method, setMethod] = useState(paymentMethod || 'COD');
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        savePaymentMethod(method);
        navigate('/place-order');
    };

    const paymentOptions = [
        { id: 'COD', label: 'Ready Cash (COD)', icon: <Banknote size={24} />, description: 'Pay with cash upon handoff.' },
        { id: 'Online', label: 'Online Payment', icon: <CreditCard size={24} />, description: 'Pay securely via gateway simulator.' },
        { id: 'Credit', label: 'Store Credit (Udhar)', icon: <Wallet size={24} />, description: 'Add to your monthly due amount.' },
    ];

    return (
        <div className="checkout-page animate-fade py-4">
            <div className="container narrow-container">
                <CheckoutSteps step1 step2 step3 />
                
                <div className="payment-container card glass">
                    <div className="checkout-header">
                        <Wallet className="checkout-icon" />
                        <h1>Payment Method</h1>
                        <p>Select your preferred way to pay.</p>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="payment-options">
                            {paymentOptions.map((option) => (
                                <div 
                                    key={option.id} 
                                    className={`payment-option card glass ${method === option.id ? 'active' : ''}`}
                                    onClick={() => setMethod(option.id)}
                                >
                                    <div className="option-icon">{option.icon}</div>
                                    <div className="option-info">
                                        <h4>{option.label}</h4>
                                        <p>{option.description}</p>
                                    </div>
                                    <div className="radio-indicator">
                                        <div className={`radio-outer ${method === option.id ? 'checked' : ''}`}>
                                            <div className="radio-inner" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/shipping')}>
                                <ArrowLeft size={18} /> Back to Shipping
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Complete Order <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
