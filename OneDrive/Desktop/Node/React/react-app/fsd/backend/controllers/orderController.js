import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import CreditTransaction from '../models/CreditTransaction.js';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../utils/sendEmail.js';
import { getIO } from '../socket.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // If credit payment, check if user has enough credit limit
    if (paymentMethod === 'Credit') {
      const user = await User.findById(req.user._id);
      if (user.totalDue + totalPrice > user.creditLimit) {
        res.status(400);
        throw new Error('Credit limit exceeded. Please pay your dues.');
      }

      // Update user's total due
      user.totalDue += totalPrice;
      await user.save();

      // Log credit transaction
      await CreditTransaction.create({
        user: user._id,
        amount: totalPrice,
        type: 'Credit Purchase',
        description: `Order purchase for ${totalPrice}`,
      });
    }

    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.product,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'Online', // Mock online payment as paid
      paidAt: paymentMethod === 'Online' ? Date.now() : null,
    });

    const createdOrder = await order.save();

    // Update stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.quantity;
        await product.save();
      }
    }

    // Send order confirmation email (non-blocking)
    const orderUser = await User.findById(req.user._id);
    if (orderUser) {
      sendOrderConfirmationEmail(orderUser, createdOrder);
    }

    // Emit new order to delivery agents via socket
    try {
      getIO().emit('new_order', createdOrder);
    } catch (e) {
      console.log('Socket emit failed for new_order:', e);
    }

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email role')
    .populate('deliveryAgent', 'name phone');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Update order to paid (Mock)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Owner/Agent)
const updateOrderStatus = async (req, res) => {
  const { status, agentId } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status || order.status;

    if (agentId) {
      order.deliveryAgent = agentId;
    }

    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    // Send order status update email (non-blocking)
    const customer = await User.findById(order.user);
    if (customer && status) {
      sendOrderStatusEmail(customer.email, customer.name, order._id, status);
    }

    // Emit order update via socket
    try {
      getIO().emit('order_updated', updatedOrder);
    } catch (e) {
      console.log('Socket emit failed for order_updated:', e);
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get recommended products based on past orders
// @route   GET /api/orders/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    
    // Count quantities of each product purchased
    const productCount = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const productId = item.product.toString();
        if (productCount[productId]) {
          productCount[productId] += item.quantity;
        } else {
          productCount[productId] = item.quantity;
        }
      });
    });

    // Sort by quantity, descending
    const sortedProductIds = Object.keys(productCount).sort(
      (a, b) => productCount[b] - productCount[a]
    );

    // Get top 5 product IDs
    const topProductIds = sortedProductIds.slice(0, 5);

    // Fetch the actual product details
    const recommendedProducts = await Product.find({
      _id: { $in: topProductIds },
    });

    res.json(recommendedProducts);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching recommendations');
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Owner
const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

// @desc    Get assigned orders for delivery agent
// @route   GET /api/orders/assigned
// @access  Private/Agent
const getAssignedOrders = async (req, res) => {
  const orders = await Order.find({ deliveryAgent: req.user._id }).populate('user', 'name address phone');
  res.json(orders);
};

// @desc    Get available (unassigned) orders
// @route   GET /api/orders/available
// @access  Private/Agent
const getAvailableOrders = async (req, res) => {
  const orders = await Order.find({ status: 'Placed' }).populate('user', 'name address phone');
  res.json(orders);
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  getAssignedOrders,
  getAvailableOrders,
  getRecommendations,
};
