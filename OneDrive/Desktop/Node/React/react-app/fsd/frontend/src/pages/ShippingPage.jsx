import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MapPin, Phone, ArrowLeft, ArrowRight, Truck, Store } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';
import './CheckoutPages.css';

const ShippingPage = () => {
    const { shippingAddress, saveShippingAddress } = useCart();
    const [deliveryMode, setDeliveryMode] = useState(shippingAddress.address === 'Store Pickup' ? 'pickup' : 'delivery');
    const [address, setAddress] = useState(shippingAddress.address === 'Store Pickup' ? '' : (shippingAddress.address || ''));
    const [phone, setPhone] = useState(shippingAddress.phone || '');

    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        saveShippingAddress({ 
            address: deliveryMode === 'pickup' ? 'Store Pickup' : address, 
            phone 
        });
        navigate('/payment');
    };

    return (
        <div className="checkout-page animate-fade py-4">
            <div className="container narrow-container">
                <CheckoutSteps step1 step2 />
                
                <div className="shipping-container card glass">
                    <div className="checkout-header">
                        <Truck className="checkout-icon" />
                        <h1>Shipping Details</h1>
                        <p>Where should we deliver your fresh groceries?</p>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="payment-options mb-2">
                             <div 
                                 className={`payment-option card glass ${deliveryMode === 'delivery' ? 'active' : ''}`}
                                 onClick={() => setDeliveryMode('delivery')}
                             >
                                 <div className="option-icon"><Truck size={24} /></div>
                                 <div className="option-info">
                                     <h4>Home Delivery</h4>
                                     <p>We deliver directly to your doorstep.</p>
                                 </div>
                                 <div className="radio-indicator">
                                     <div className={`radio-outer ${deliveryMode === 'delivery' ? 'checked' : ''}`}>
                                         <div className="radio-inner" />
                                     </div>
                                 </div>
                             </div>

                             <div 
                                 className={`payment-option card glass ${deliveryMode === 'pickup' ? 'active' : ''}`}
                                 onClick={() => setDeliveryMode('pickup')}
                             >
                                 <div className="option-icon"><Store size={24} /></div>
                                 <div className="option-info">
                                     <h4>Store Pickup</h4>
                                     <p>Pick up from our store. (No shipping fees!)</p>
                                 </div>
                                 <div className="radio-indicator">
                                     <div className={`radio-outer ${deliveryMode === 'pickup' ? 'checked' : ''}`}>
                                         <div className="radio-inner" />
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {deliveryMode === 'delivery' && (
                            <div className="form-group animate-fade">
                                <label className="form-label">Delivery Address</label>
                                <div className="input-with-icon">
                                    <MapPin className="input-icon" size={18} />
                                    <textarea
                                        className="form-input"
                                        placeholder="Enter full address"
                                        rows="3"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <div className="input-with-icon">
                                <Phone className="input-icon" size={18} />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="checkout-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cart')}>
                                <ArrowLeft size={18} /> Back to Cart
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Continue to Payment <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;
