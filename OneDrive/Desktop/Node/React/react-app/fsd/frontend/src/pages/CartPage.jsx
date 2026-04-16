import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import './CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(0);
    const { 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        itemsPrice, 
        shippingPrice, 
        taxPrice, 
        totalPrice,
        shippingAddress,
        paymentMethod,
        clearCart
    } = useCart();

    const checkoutHandler = () => {
        navigate('/shipping');
    };

    return (
        <div className="cart-page animate-fade py-4 relative">

            <div className="container">
                <h1 className="section-title">Shopping Cart</h1>
                
                {cartItems.length === 0 ? (
                    <div className="empty-cart card glass animate-fade">
                        <ShoppingCart size={64} className="empty-cart-icon" />
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/" className="btn btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="cart-grid">
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.product} className="cart-item card glass animate-fade">
                                    <img src={item.image} alt={item.name} className="cart-item-image" />
                                    <div className="cart-item-info">
                                        <Link to={`/product/${item.product}`}>
                                            <h3>{item.name}</h3>
                                        </Link>
                                        <p className="cart-item-price">₹{item.price}</p>
                                    </div>
                                    <div className="cart-item-controls">
                                        <div className="qty-selector">
                                            <button onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))}><Minus size={14} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product, Math.min(item.countInStock, item.quantity + 1))}><Plus size={14} /></button>
                                        </div>
                                        <button className="remove-btn" onClick={() => removeFromCart(item.product)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <Link to="/" className="back-link py-1">
                                <ArrowLeft size={18} /> Continue Shopping
                            </Link>
                        </div>

                        <div className="cart-summary flex flex-col gap-2">
                           {/* Removed top message banner */}
                           <div className="card glass summary-card">
                              <h3>Order Summary</h3>
                              <div className="summary-row">
                                 <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                                 <span>₹{itemsPrice}</span>
                              </div>
                              <div className="summary-row">
                                 <span>Shipping</span>
                                 <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
                              </div>
                              <div className="summary-row">
                                 <span>Tax (GST 5%)</span>
                                 <span>₹{taxPrice}</span>
                              </div>
                              <hr />
                              <div className="summary-row total">
                                 <span>Total Amount</span>
                                 <span>₹{totalPrice}</span>
                              </div>
                              <button 
                                 className="btn btn-primary w-100 checkout-btn" 
                                 onClick={checkoutHandler}
                              >
                                 Proceed to Checkout <ArrowRight size={18} />
                              </button>
                           </div>
                           
                           <div className="card glass-dark offers-card">
                               <h4>Available Offers</h4>
                               <p>Get FREE shipping on orders above ₹500!</p>
                           </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
