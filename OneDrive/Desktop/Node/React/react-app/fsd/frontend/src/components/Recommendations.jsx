import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get('/api/orders/recommendations', config);
        setRecommendations(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const addToCartHandler = (id) => {
    navigate(`/cart/${id}?qty=1`);
  };

  if (loading) return null;
  if (error || recommendations.length === 0) return null;

  return (
    <div className="recommendations-section">
      <div className="rec-header">
        <Sparkles />
        <h2>Recommended for You</h2>
      </div>
      <p className="rec-subtitle">
        Based on your previous orders, we thought you might want to buy these freshly picked items again!
      </p>

      <div className="rec-grid">
        {recommendations.map((product) => (
          <div key={product._id} className="rec-card">
            
            {/* THIS creates the small boxed image UI */}
            <div className="rec-image-box">
              <img src={product.image} alt={product.name} />
              <div className="rec-price-badge">
                ₹{product.price}
              </div>
            </div>

            <div className="rec-content">
              <h3 className="rec-title" title={product.name}>
                {product.name}
              </h3>
              
              <div className="rec-rating">
                <Star />
                <span>{product.rating || '4.5'} ({product.numReviews || '12'})</span>
              </div>
              
              <div className="rec-actions">
                <button
                  onClick={() => addToCartHandler(product._id)}
                  disabled={product.countInStock === 0}
                  className={`rec-btn ${product.countInStock > 0 ? 'btn-active' : 'btn-disabled'}`}
                >
                  <ShoppingCart size={18} />
                  {product.countInStock > 0 ? 'Buy Again' : 'Out of Stock'}
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
