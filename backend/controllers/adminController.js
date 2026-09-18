const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc   Get admin dashboard statistics
// @route  GET /api/admin/dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalOrders = await Order.countDocuments();

    // Calculate revenue from non-cancelled orders
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Recent orders (last 6)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('user', 'name email');

    // Low stock products (stock < 10)
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .populate('category', 'name')
      .sort({ stock: 1 })
      .limit(10);

    // Sales breakdown by orderStatus for chart
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue,
      },
      recentOrders,
      lowStockProducts,
      statusCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching admin dashboard data',
    });
  }
};

// @desc   Get all users (admin view)
// @route  GET /api/admin/users
const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching users',
    });
  }
};

// @desc   Get all orders (admin view)
// @route  GET /api/admin/orders
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching admin orders',
    });
  }
};

// @desc   Update order status (admin)
// @route  PUT /api/admin/orders/:id
const updateAdminOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // If changing to CANCELLED and was not previously CANCELLED, restore stock
    if (orderStatus === 'CANCELLED' && order.orderStatus !== 'CANCELLED') {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.orderStatus = orderStatus;
    await order.save();

    const updatedOrder = await Order.findById(order._id).populate('user', 'name email phone');

    res.json({
      success: true,
      order: updatedOrder,
      message: `Order status updated to ${orderStatus}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating order status',
    });
  }
};

module.exports = {
  getAdminDashboard,
  getAdminUsers,
  getAdminOrders,
  updateAdminOrderStatus,
};
