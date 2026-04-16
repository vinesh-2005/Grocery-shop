import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Lock, Mail, Phone, MapPin, Briefcase, Eye, EyeOff } from 'lucide-react';
import './AuthPages.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { register, userInfo } = useAuth();

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
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await register({ name, email, password, role, phone, address });
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="auth-page animate-fade">
            <div className="auth-container glass register-container">
                <div className="auth-header">
                    <UserPlus className="auth-icon" />
                    <h1>Create Account</h1>
                    <p>Join FreshGrocer for a healthier lifestyle.</p>
                </div>

                {error && <div className="error-message glass">{error}</div>}

                <form onSubmit={submitHandler}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div className="input-with-icon">
                                <User className="input-icon" size={18} />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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

                        <div className="form-group">
                            <label className="form-label">Select Role</label>
                            <div className="input-with-icon">
                                <Briefcase className="input-icon" size={18} />
                                <select
                                    className="form-input"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="customer">Customer</option>
                                    <option value="owner">Shop Owner</option>
                                    <option value="delivery_agent">Delivery Agent</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <div className="input-with-icon">
                            <MapPin className="input-icon" size={18} />
                            <textarea
                                className="form-input"
                                placeholder="Enter full address"
                                rows="2"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-grid">
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

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="input-with-icon">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </form>

                <div className="auth-footer">
                    Already a member? <Link to={`/login?redirect=${redirect}`}>Login Here</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
