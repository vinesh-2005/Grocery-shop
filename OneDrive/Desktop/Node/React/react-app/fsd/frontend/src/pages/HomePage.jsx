import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import Recommendations from '../components/Recommendations';
import { Search, Filter, Plus, ArrowRight } from 'lucide-react';
import './HomePage.css';

const categoryData = [
  { id: 'vegetables', name: 'Vegetables', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=500&q=60' },
  { id: 'fruits', name: 'Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=60' },
  { id: 'grocery', name: 'Grocery', image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=500&q=60' }
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { userInfo } = useAuth();
  const isAdmin = userInfo && (userInfo.role === 'admin' || userInfo.role === 'owner');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data: pData } = await axios.get(`/api/products?keyword=${keyword}&category=${category}`);
      setProducts(pData.products || []);
    } catch (error) {
      console.error('Error fetching main products', error);
    }

    try {
      if (userInfo) {
        const { data: rData } = await axios.get('/api/products/recommendations');
        setRecommendedProducts(rData);
      }
    } catch (error) {
       console.log('User not logged in or no recommendations');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [keyword, category, userInfo]);

  const handleProductAdded = (newProduct) => {
    // If the newly added product matches the currently viewed category (or none), refresh
    if (!category || category === newProduct.category) {
      fetchProducts();
    }
  };

  // Determine what products to show in the grid
  let displayProducts = products.length > 0 ? [...products] : [...recommendedProducts];
  
  // Custom sorting: If viewing default commonly purchased, sort by highest purchase count
  if (!keyword && !category) {
    displayProducts.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
  }

  const showFallback = products.length === 0 && recommendedProducts.length > 0 && !loading;

  return (
    <div className="home-page animate-fade">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Freshness Delivered To <span>Your Doorstep</span></h1>
            <p>Get the best quality organic vegetables, fresh fruits and daily groceries at amazing prices. Unbeatable quality, handpicked for you.</p>
            <div className="hero-search glass">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Search fresh groceries..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className="btn btn-primary">Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="container">
        <Recommendations />
      </section>

      {/* Categories Section */}
      <section className="categories py-4">
        <div className="container">
          <div className="section-header flex justify-between align-center mb-2">
            <h2 className="section-title">Shop by Category</h2>
            {isAdmin && (
               <button className="btn btn-primary btn-sm flex align-center gap-1" onClick={() => setIsAddModalOpen(true)}>
                 <Plus size={16} /> Add Product
               </button>
            )}
          </div>
          <div className="category-grid">
            {categoryData.map((cat) => (
              <div 
                key={cat.id} 
                className={`category-item-card ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(category === cat.id ? '' : cat.id)}
              >
                <div className="category-image">
                    <img src={cat.image} alt={cat.name} />
                    <div className="category-overlay"></div>
                </div>
                <div className="category-info">
                    <h3>{cat.name}</h3>
                    <div className="category-action">
                        <span>Shop Now</span>
                        <ArrowRight size={16} />
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products py-4">
        <div className="container">
          <div className="product-header">
             <h2 className="section-title">
               {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : (keyword ? 'Search Results' : 'Commonly Purchased')}
             </h2>
             <div className="filter-select glass">
                <Filter size={18} />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                   <option value="">All Categories</option>
                   {categoryData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
             </div>
          </div>
          
          {loading ? (
            <div className="loading">Fetching fresh items...</div>
          ) : (
            <>
              {showFallback && (
                <div className="message-alert mb-2" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary-dark)'}}>
                   <span>No direct matches found. Here are some popular recommendations instead!</span>
                </div>
              )}
              
              <div className="product-grid">
                {displayProducts.length === 0 ? (
                  <p>No products available at the moment.</p>
                ) : (
                  displayProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <AddProductModal 
         isOpen={isAddModalOpen} 
         onClose={() => setIsAddModalOpen(false)} 
         onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default HomePage;
