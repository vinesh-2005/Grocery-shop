import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get dashboard analytics (Owner only)
// @route   GET /api/analytics/dashboard
// @access  Private/Owner
const getAnalytics = async (req, res) => {
  const totalOrders = await Order.countDocuments({});
  const totalUsers = await User.countDocuments({ role: 'customer' });
  const totalProducts = await Product.countDocuments({});

  const orders = await Order.find({});
  const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  const pendingOrders = await Order.countDocuments({ status: { $in: ['Placed', 'Accepted', 'Assigned', 'Out for Delivery'] } });
  const completedOrders = await Order.countDocuments({ status: 'Delivered' });

  // Get revenue by payment method
  const revenueByPaymentData = await Order.aggregate([
    {
      $group: {
        _id: '$paymentMethod',
        total: { $sum: '$totalPrice' }
      }
    }
  ]);

  // Order stats for the last 7 days (mock representation)
  const orderStats = [
    { name: 'Mon', orders: 400, revenue: 2400 },
    { name: 'Tue', orders: 300, revenue: 1398 },
    { name: 'Wed', orders: 200, revenue: 9800 },
    { name: 'Thu', orders: 278, revenue: 3908 },
    { name: 'Fri', orders: 189, revenue: 4800 },
    { name: 'Sat', orders: 239, revenue: 3800 },
    { name: 'Sun', orders: 349, revenue: 4300 },
  ];

  res.json({
    totalOrders,
    totalUsers,
    totalProducts,
    revenue,
    pendingOrders,
    completedOrders,
    revenueByPaymentData,
    orderStats
  });
};

export { getAnalytics };
