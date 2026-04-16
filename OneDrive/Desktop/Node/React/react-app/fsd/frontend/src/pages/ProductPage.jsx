import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product', error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        addToCart(product, qty);
        navigate('/cart');
    };

    if (loading) return <div className="loading">Loading item details...</div>;
    if (!product) return <div className="error">Product not found.</div>;

    return (
        <div className="product-details-page animate-fade py-4">
            <div className="container">
                <Link to="/" className="back-link">
                    <ArrowLeft size={18} /> Back to Shop
                </Link>

                <div className="product-details-grid">
                    <div className="product-details-image card glass">
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className="product-details-info">
                        <span className="product-category-tag">{product.category}</span>
                        <h1 className="product-title">{product.name}</h1>
                        <div className="product-rating">
                           <ShieldCheck size={18} color="var(--primary)" />
                           <span>Quality Guaranteed</span>
                        </div>
                        
                        <p className="product-description">{product.description}</p>
                        
                        <div className="product-price-section">
                            <span className="current-price">₹{product.price}</span>
                            <span className="price-label">Inclusive of all taxes</span>
                        </div>

                        <div className="product-stock-status">
                            Status: <span className={product.countInStock > 0 ? 'instock' : 'outofstock'}>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {product.countInStock > 0 && (
                            <div className="purchase-controls card glass">
                                <div className="qty-selector">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={18} /></button>
                                    <span>{qty}</span>
                                    <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))}><Plus size={18} /></button>
                                </div>
                                <button className="btn btn-primary add-to-cart-large" onClick={addToCartHandler}>
                                    <ShoppingCart size={20} /> Add to Cart
                                </button>
                            </div>
                        )}

                        <div className="delivery-info">
                            <div className="info-item">
                                <Truck size={20} />
                                <div>
                                    <h4>Fast Delivery</h4>
                                    <p>Within 24 hours in your area.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
