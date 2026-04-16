import { useState } from 'react';
import axios from 'axios';
import { X, Package, Image as ImageIcon, Tag, IndianRupee, Info, Plus } from 'lucide-react';
import './AddProductModal.css';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('vegetables');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/upload', formData, config);
            // Express sends the string directly for this route
            setImage(data);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            setError('Error uploading image');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post('/api/products', {
                name,
                price: Number(price),
                image: image || '/images/sample.jpg',
                category,
                countInStock: Number(countInStock),
                description,
            });
            setLoading(false);
            // Reset form
            setName('');
            setPrice('');
            setImage('');
            setCategory('vegetables');
            setCountInStock('');
            setDescription('');
            if (onProductAdded) onProductAdded(data);
            onClose();
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Failed to add product');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-dark animate-fade">
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>
                <div className="modal-header">
                    <h2><Plus size={24} className="inline mr-1" /> Add New Product</h2>
                    <p>Enter details for the new item under {category.charAt(0).toUpperCase() + category.slice(1)}</p>
                </div>

                {error && <div className="message-alert error-msg mb-2"><span>{error}</span></div>}

                <form onSubmit={submitHandler} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Product Name</label>
                        <div className="input-with-icon">
                            <Package className="input-icon" size={18} />
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Fresh Tomatoes"
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
                                    placeholder="0"
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
                                    placeholder="e.g. 50"
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
                                    <ImageIcon className="input-icon" size={18} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-input"
                                        style={{ padding: '4px', border: 'none', background: 'transparent' }}
                                        onChange={uploadFileHandler}
                                        required={!image}
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
                                placeholder="Detailed description of the product..."
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
