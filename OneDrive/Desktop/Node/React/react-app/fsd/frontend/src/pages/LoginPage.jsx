import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, userInfo } = useAuth();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      if (redirect === '/') {
          if (userInfo.role === 'owner') navigate('/admin/dashboard');
          else if (userInfo.role === 'delivery_agent') navigate('/delivery/dashboard');
          else navigate('/');
      } else {
          navigate(redirect);
      }
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="auth-page animate-fade">
      <div className="auth-container glass">
        <div className="auth-header">
           <LogIn className="auth-icon" />
           <h1>Welcome Back</h1>
           <p>Log in to manage your groceries and orders.</p>
        </div>

        {error && <div className="error-message glass">{error}</div>}

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-input" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">Log In</button>
        </form>

        <div className="auth-footer">
           New Customer? <Link to={`/register?redirect=${redirect}`}>Register Here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
