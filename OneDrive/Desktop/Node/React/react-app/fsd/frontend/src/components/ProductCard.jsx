import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Edit2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  
  const isAdmin = userInfo && (userInfo.role === 'admin' || userInfo.role === 'owner');

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <div className="product-card card glass-dark animate-fade">
      <div className="product-image" style={{ display: 'block', position: 'relative' }}>
        <Link to={`/product/${product._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img src={product.image} alt={product.name} />
          {product.purchaseCount > 100 && <span className="badge badge-bestseller animate-pulse-slow">Best Seller 🔥</span>}
          {product.purchaseCount > 50 && product.purchaseCount <= 100 && <span className="badge badge-popular">Popular 🌟</span>}
          {product.countInStock === 0 && <span className="out-of-stock">Out of Stock</span>}
        </Link>
        {isAdmin && (
          <button 
            onClick={(e) => { e.preventDefault(); navigate(`/admin/product/${product._id}/edit`); }}
            className="edit-product-btn"
            title="Edit Product"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
      
      <div className="product-info">
        <Link to={`/product/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-category">{product.category}</p>
        {(product.purchaseCount > 0) && (
          <p className="simulated-activity-text sm-text" style={{ color: 'var(--primary)', marginTop: '2px' }}>
            {product.purchaseCount}+ users purchased this item
          </p>
        )}
        
        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
