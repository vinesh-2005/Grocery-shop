import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  const count = await Product.countDocuments({ ...keyword, ...category });
  const products = await Product.find({ ...keyword, ...category })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Owner
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Owner
const createProduct = async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;

  const product = new Product({
    name: name || 'Sample Name',
    price: price || 0,
    user: req.user._id,
    image: image || '/images/sample.jpg',
    category: category || 'grocery',
    countInStock: countInStock || 0,
    description: description || 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Owner
const updateProduct = async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Get top recommended products for user based on past orders
// @route   GET /api/products/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  
  if (orders.length === 0) {
    const topProducts = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    return res.json(topProducts);
  }

  const productFrequency = {};
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      const productId = item.product.toString();
      productFrequency[productId] = (productFrequency[productId] || 0) + 1;
    });
  });

  const sortedProductIds = Object.keys(productFrequency).sort((a, b) => productFrequency[b] - productFrequency[a]);
  const topProductIds = sortedProductIds.slice(0, 5);

  const recommendedProducts = await Product.find({ _id: { $in: topProductIds } });
  
  res.json(recommendedProducts);
};

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getRecommendations,
};
