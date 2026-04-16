import { Link } from 'react-router-dom';
import { ShoppingCart, Truck, CreditCard, CheckCircle } from 'lucide-react';
import './CheckoutSteps.css';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <nav className="checkout-steps-nav py-2">
            <div className="checkout-steps flex justify-between align-center">
                <div className={`step-item ${step1 ? 'active' : ''}`}>
                    {step1 ? (
                        <Link to="/login" className="step-link">
                            <CheckCircle size={20} />
                            <span>Sign In</span>
                        </Link>
                    ) : (
                        <div className="step-disabled">
                            <CheckCircle size={20} />
                            <span>Sign In</span>
                        </div>
                    )}
                </div>

                <div className="step-divider" />

                <div className={`step-item ${step2 ? 'active' : ''}`}>
                    {step2 ? (
                        <Link to="/shipping" className="step-link">
                            <Truck size={20} />
                            <span>Shipping</span>
                        </Link>
                    ) : (
                        <div className="step-disabled">
                            <Truck size={20} />
                            <span>Shipping</span>
                        </div>
                    )}
                </div>

                <div className="step-divider" />

                <div className={`step-item ${step3 ? 'active' : ''}`}>
                    {step3 ? (
                        <Link to="/payment" className="step-link">
                            <CreditCard size={20} />
                            <span>Payment</span>
                        </Link>
                    ) : (
                        <div className="step-disabled">
                            <CreditCard size={20} />
                            <span>Payment</span>
                        </div>
                    )}
                </div>

                <div className="step-divider" />

                <div className={`step-item ${step4 ? 'active' : ''}`}>
                    {step4 ? (
                        <Link to="/place-order" className="step-link">
                            <ShoppingCart size={20} />
                            <span>Place Order</span>
                        </Link>
                    ) : (
                        <div className="step-disabled">
                            <ShoppingCart size={20} />
                            <span>Place Order</span>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default CheckoutSteps;
