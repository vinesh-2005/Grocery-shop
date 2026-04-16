import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import CreditPage from './pages/CreditPage';
import RequestProductPage from './pages/RequestProductPage';

// Admin/Owner Pages
import DashboardPage from './pages/DashboardPage';
import ProductListPage from './pages/ProductListPage';
import ProductEditPage from './pages/ProductEditPage';
import OrderListPage from './pages/OrderListPage';
import UserDuesPage from './pages/UserDuesPage';
import AdminRequestListPage from './pages/AdminRequestListPage';

// Delivery Pages
import DeliveryDashboardPage from './pages/DeliveryDashboardPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content" style={{ minHeight: '80vh' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />


                {/* All-logged-in Routes */}
                <Route element={<ProtectedRoute roles={['customer', 'owner', 'delivery_agent']} />}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/my-orders" element={<MyOrdersPage />} />
                  <Route path="/order/:id" element={<OrderPage />} />
                </Route>

                {/* Customer Routes */}
                <Route element={<ProtectedRoute roles={['customer']} />}>
                  <Route path="/shipping" element={<ShippingPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/place-order" element={<PlaceOrderPage />} />
                  <Route path="/credit" element={<CreditPage />} />
                  <Route path="/request-product" element={<RequestProductPage />} />
                </Route>

                {/* Owner Routes */}
                <Route element={<ProtectedRoute roles={['owner']} />}>
                  <Route path="/admin/dashboard" element={<DashboardPage />} />
                  <Route path="/admin/products" element={<ProductListPage />} />
                  <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
                  <Route path="/admin/orders" element={<OrderListPage />} />
                  <Route path="/admin/requests" element={<AdminRequestListPage />} />
                  <Route path="/admin/dues" element={<UserDuesPage />} />
                </Route>

                {/* Delivery Agent Routes */}
                <Route element={<ProtectedRoute roles={['delivery_agent']} />}>
                  <Route path="/delivery/dashboard" element={<DeliveryDashboardPage />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
