import { Package, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer py-4 glass">
            <div className="container">
                <div className="footer-top grid">
                    <div className="footer-brand">
                        <Link to="/" className="logo">
                            <Package className="logo-icon" />
                            <span>Fresh<span>Grocer</span></span>
                        </Link>
                        <p className="mt-1">Bringing the freshest produce from the farm to your table, with ease and trust.</p>
                        <div className="social-links flex gap-1 mt-1">
                            {/* Icons removed to solve import crash */}
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Shop Categories</h4>
                        <ul>
                            <li><Link to="/?category=vegetables">Vegetables</Link></li>
                            <li><Link to="/?category=fruits">Fresh Fruits</Link></li>
                            <li><Link to="/?category=grocery">Daily Groceries</Link></li>
                            <li><Link to="/?category=other">Other Items</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Customer Care</h4>
                        <ul>
                            <li><Link to="/profile">My Account</Link></li>
                            <li><Link to="/my-orders">Track Orders</Link></li>
                            <li><Link to="/credit">Credit System</Link></li>
                            <li><Link to="/shipping">Shipping Policy</Link></li>
                        </ul>
                    </div>

                    <div className="footer-newsletter">
                        <h4>Subscribe</h4>
                        <p>Get updates on fresh arrivals and weekly discounts.</p>
                        <div className="newsletter-form mt-1">
                            <input type="email" placeholder="Email address" className="form-input" />
                            <button className="btn btn-primary mt-1 w-100">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="footer-features py-2 grid">
                    <div className="feature-item flex align-center gap-1">
                        <ShieldCheck size={24} className="icon" />
                        <div>
                           <h5>Secure Payments</h5>
                           <p>100% Secure Transaction</p>
                        </div>
                    </div>
                    <div className="feature-item flex align-center gap-1">
                        <Truck size={24} className="icon" />
                        <div>
                           <h5>Fast Delivery</h5>
                           <p>Under 24 hour delivery</p>
                        </div>
                    </div>
                    <div className="feature-item flex align-center gap-1">
                        <RefreshCw size={24} className="icon" />
                        <div>
                           <h5>Easy Returns</h5>
                           <p>Freshness Guaranteed</p>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom flex justify-between py-1">
                    <p>&copy; 2026 FreshGrocer. Built with 💚 for healthy living.</p>
                    <div className="footer-legal flex gap-1">
                        <Link to="/terms">Terms</Link>
                        <Link to="/privacy">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
