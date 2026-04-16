import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, Edit, Package, Search, IndianRupee, AlertCircle } from 'lucide-react';
import './AdminPages.css';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products');
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product', error);
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const { data } = await axios.post('/api/products');
            navigate(`/admin/product/${data._id}/edit`);
        } catch (error) {
            console.error('Error creating product', error);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Fetching entire inventory...</div>;

    return (
        <div className="admin-page animate-fade py-4">
            <div className="container">
                <div className="admin-header flex justify-between align-center">
                    <h1 className="section-title">Inventory Management</h1>
                    <button className="btn btn-primary" onClick={createProductHandler}>
                        <Plus size={20} /> Add New Item
                    </button>
                </div>

                <div className="admin-controls flex gap-2 py-2">
                    <div className="search-box glass flex align-center px-1">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or category..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="card glass table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Item Info</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product._id}>
                                    <td className="item-cell">
                                        <img src={product.image} alt={product.name} />
                                        <span>{product.name}</span>
                                    </td>
                                    <td><span className="badge badge-info">{product.category}</span></td>
                                    <td>₹{product.price}</td>
                                    <td>
                                        <span className={`stock-level ${product.countInStock <= (product.lowStockThreshold || 10) ? 'low-stock' : ''}`}>
                                            {product.countInStock}
                                        </span>
                                        {product.countInStock <= (product.lowStockThreshold || 10) && (
                                            <AlertCircle size={14} color="var(--error)" className="inline ml-1" />
                                        )}
                                    </td>
                                    <td className="actions-cell">
                                        <button className="btn-edit" onClick={() => navigate(`/admin/product/${product._id}/edit`)}>
                                            <Edit size={18} />
                                        </button>
                                        <button className="btn-delete" onClick={() => deleteHandler(product._id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && <div className="p-4 text-center">No products found in inventory.</div>}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
