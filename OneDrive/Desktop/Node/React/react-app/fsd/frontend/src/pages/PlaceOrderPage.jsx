import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, MapPin, CreditCard, ArrowLeft, CheckCircle, ShoppingCart } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';
import './CheckoutPages.css';

const PlaceOrderPage = () => {
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(0);
    const { 
        cartItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        shippingPrice, 
        taxPrice, 
        totalPrice, 
        clearCart 
    } = useCart();
    
    const { userInfo } = useAuth();

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        } else if (!paymentMethod) {
            navigate('/payment');
        }
    }, [shippingAddress, paymentMethod, navigate]);

    const placeOrderHandler = () => {
        setIsCheckingOut(true);
        let step = 0;
        setCheckoutStep(0);

        const interval = setInterval(() => {
            step += 1;
            setCheckoutStep(step);
            if (step >= 3) {
                clearInterval(interval);
                setTimeout(async () => {
                    try {
                        const { data } = await axios.post('/api/orders', {
                            orderItems: cartItems,
                            shippingAddress,
                            paymentMethod,
                            itemsPrice,
                            shippingPrice,
                            taxPrice,
                            totalPrice,
                        });
                        clearCart();
                        setIsCheckingOut(false);
                        navigate('/order-success');
                    } catch (error) {
                        setIsCheckingOut(false);
                        console.error('Error placing order', error);
                        alert(error.response?.data?.message || 'Failed to place order');
                    }
                }, 600);
            }
        }, 800);
    };

    return (
        <div className="checkout-page animate-fade py-4 relative">
            {isCheckingOut && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center transform scale-100 transition-transform">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 border-4 border-green-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-green-600">
                                <ShoppingCart size={32} className="animate-pulse" />
                            </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {checkoutStep === 0 && "Preparing Checkout..."}
                            {checkoutStep === 1 && "Securing Your Items..."}
                            {checkoutStep === 2 && "Finalizing Order..."}
                            {checkoutStep >= 3 && "Redirecting..."}
                        </h3>
                        
                        <p className="text-sm text-gray-500 mb-6">
                            Please wait while we set up your secure gateway.
                        </p>
                        
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-green-600 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${Math.min((checkoutStep / 3) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                <CheckoutSteps step1 step2 step3 step4 />
                
                <div className="place-order-grid">
                    <div className="order-details">
                        <section className="card glass order-section">
                            <div className="section-header">
                                <MapPin size={20} />
                                <h3>Delivery Information</h3>
                            </div>
                            <p><strong>Address:</strong> {shippingAddress.address}</p>
                            <p><strong>Phone:</strong> {shippingAddress.phone}</p>
                        </section>

                        <section className="card glass order-section">
                            <div className="section-header">
                                <CreditCard size={20} />
                                <h3>Payment Method</h3>
                            </div>
                            <p><strong>Method:</strong> {paymentMethod}</p>
                        </section>

                        <section className="card glass order-section">
                            <div className="section-header">
                                <ShoppingBag size={20} />
                                <h3>Order Items</h3>
                            </div>
                            <div className="order-items-list">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="order-item-row">
                                        <div className="item-main">
                                            <img src={item.image} alt={item.name} />
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </div>
                                        <div className="item-price">
                                            {item.quantity} x ₹{item.price} = ₹{(item.quantity * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="order-summary-sidebar">
                        <div className="card glass summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Items Subtotal</span>
                                <span>₹{itemsPrice}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>₹{shippingPrice}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (GST 5%)</span>
                                <span>₹{taxPrice}</span>
                            </div>
                            <hr />
                            <div className="summary-row total">
                                <span>Grand Total</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            
                            <button 
                                className="btn btn-primary w-100 place-order-btn" 
                                onClick={placeOrderHandler}
                                disabled={cartItems.length === 0}
                            >
                                <CheckCircle size={18} /> Place Order
                            </button>
                            <button type="button" className="btn btn-secondary w-100 mt-1" onClick={() => navigate('/payment')}>
                                <ArrowLeft size={18} /> Choose Another Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;
