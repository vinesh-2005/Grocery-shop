import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Package, Image, Tag, IndianRupee, Info } from 'lucide-react';
import './AdminPages.css';

const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            setMessage({ type: 'error', text: 'Error uploading image' });
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setDescription(data.description);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product', error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/products/${id}`, {
                name,
                price,
                image,
                category,
                countInStock,
                description,
            });
            setMessage({ type: 'success', text: 'Product updated successfully!' });
            setTimeout(() => navigate('/admin/products'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        }
    };

    if (loading) return <div className="loading">Loading product data...</div>;

    return (
        <div className="admin-page animate-fade py-4">
            <div className="container narrow-container">
                <Link to="/admin/products" className="back-link mb-2">
                    <ArrowLeft size={18} /> Back to Inventory
                </Link>

                <div className="card glass">
                    <div className="checkout-header">
                        <Package className="checkout-icon" />
                        <h1>Edit Product</h1>
                        <p>Modify details for #{id.slice(-6).toUpperCase()}</p>
                    </div>

                    {message && (
                        <div className={`message-alert card ${message.type === 'success' ? 'glass-dark' : 'error-msg'}`}>
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label className="form-label">Product Name</label>
                            <div className="input-with-icon">
                                <Package className="input-icon" size={18} />
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Price (₹)</label>
                                <div className="input-with-icon">
                                    <IndianRupee className="input-icon" size={18} />
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Stock Count</label>
                                <div className="input-with-icon">
                                    <Tag className="input-icon" size={18} />
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={countInStock}
                                        onChange={(e) => setCountInStock(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                className="form-input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="vegetables">Vegetables</option>
                                <option value="fruits">Fruits</option>
                                <option value="grocery">Grocery</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Product Image</label>
                            <div className="flex align-center gap-1">
                                {image && (
                                    <img src={image} alt="Preview" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)'}} />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div className="input-with-icon" style={{ padding: '4px 0' }}>
                                        <Image className="input-icon" size={18} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="form-input"
                                            style={{ padding: '4px', border: 'none', background: 'transparent' }}
                                            onChange={uploadFileHandler}
                                        />
                                    </div>
                                    {uploading && <div className="sm-text mt-1 text-primary">Uploading image...</div>}
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <div className="input-with-icon">
                                <Info className="input-icon" size={18} />
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-2">
                             <Save size={18} /> Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductEditPage;
