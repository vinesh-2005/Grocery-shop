import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Lock, Save, ArrowRight } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
    const { userInfo, updateProfile } = useAuth();
    const [name, setName] = useState(userInfo.name || '');
    const [email, setEmail] = useState(userInfo.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState(userInfo.phone || '');
    const [address, setAddress] = useState(userInfo.address || '');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            await updateProfile({
                id: userInfo._id,
                name,
                email,
                password,
                phone,
                address,
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating profile' });
        }
        setLoading(false);
    };

    return (
        <div className="profile-page animate-fade py-4">
            <div className="container narrow-container">
                <div className="profile-header flex align-center gap-2 mb-2">
                    <div className="profile-avatar glass">
                        <User size={48} />
                    </div>
                    <div className="profile-titles">
                        <h1>Account Settings</h1>
                        <p>Manage your personal information and security.</p>
                        <span className={`badge badge-info mt-1`}>{userInfo.role.replace('_', ' ')}</span>
                    </div>
                </div>

                {message && (
                    <div className={`message-alert card ${message.type === 'success' ? 'glass-dark' : 'error-msg'}`}>
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="profile-content card glass">
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
                                <label className="form-label">Update Address</label>
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
                        </div>

                        <hr className="my-2" />
                        <h3>Change Password</h3>
                        <p className="sm-text mb-1">Leave blank to keep current password.</p>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <div className="input-with-icon">
                                    <Lock className="input-icon" size={18} />
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="New password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <div className="input-with-icon">
                                    <Lock className="input-icon" size={18} />
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary mt-2 flex align-center gap-1" disabled={loading}>
                            {loading ? 'Saving...' : <><Save size={18} /> Update Profile</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
