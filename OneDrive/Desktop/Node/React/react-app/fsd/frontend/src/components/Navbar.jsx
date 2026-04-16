import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  LayoutDashboard, 
  Package, 
  LogOut, 
  CreditCard,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <Package className="logo-icon" />
          <span>Fresh<span>Grocer</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-links">
          <Link to="/" className="nav-link">Shop</Link>
          
          {userInfo ? (
            <div className="user-menu-container">
              {userInfo.role === 'owner' && (
                <Link to="/admin/dashboard" className="nav-link admin-link">Dashboard</Link>
              )}
              {userInfo.role === 'customer' && (
                <>
                  <Link to="/my-orders" className="nav-link">Orders</Link>
                  <Link to="/request-product" className="nav-link">Request Product</Link>
                </>
              )}
              {userInfo.role === 'delivery_agent' && (
                <Link to="/delivery/dashboard" className="nav-link">Deliveries</Link>
              )}
              
              <div 
                className="user-dropdown" 
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <button 
                  className="user-toggle" 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <User size={20} />
                  <span>{userInfo?.name?.split(' ')[0]}</span>
                </button>
                <div className={`dropdown-content glass ${isProfileOpen ? 'show' : ''}`}>
                  <Link to="/profile" onClick={() => setIsProfileOpen(false)}>Profile</Link>
                  {userInfo.role === 'customer' && <Link to="/credit" onClick={() => setIsProfileOpen(false)}>Credit System</Link>}
                  <button onClick={handleLogout} className="logout-btn" style={{ cursor: 'pointer' }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-link login-btn">Login</Link>
          )}

          <Link to="/cart" className="cart-link">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu glass animate-fade">
          <Link to="/" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link to="/cart" onClick={() => setIsOpen(false)}>Cart ({cartCount})</Link>
          
          {userInfo && (
             <>
               {userInfo.role === 'owner' && <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>}
               {userInfo.role === 'delivery_agent' && <Link to="/delivery/dashboard" onClick={() => setIsOpen(false)}>Deliveries</Link>}
               <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
               {userInfo.role === 'customer' && (
                 <>
                   <Link to="/request-product" onClick={() => setIsOpen(false)}>Request Product</Link>
                   <Link to="/credit" onClick={() => setIsOpen(false)}>Credit System</Link>
                 </>
               )}
               <button onClick={handleLogout} className="mobile-logout">Logout</button>
             </>
          )}
          {!userInfo && <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
