const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc   Place COD Order
// @route  POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, items: directItems } = req.body;

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required (name, phone, address, city, state, pincode)',
      });
    }

    let orderItems = [];

    if (directItems && Array.isArray(directItems) && directItems.length > 0) {
      orderItems = directItems;
    } else {
      // Fetch user's cart
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Your cart is empty. Add products before placing an order.',
        });
      }

      orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        quantity: item.quantity,
        price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
      }));
    }

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order',
      });
    }

    // Check stock for all items
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || item.product}`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
        });
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    const finalOrderProducts = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      const itemSubtotal = effectivePrice * item.quantity;
      totalAmount += itemSubtotal;

      finalOrderProducts.push({
        product: product._id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        price: effectivePrice,
      });

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      products: finalOrderProducts,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
      },
      totalAmount,
      paymentMethod: 'COD',
      orderStatus: 'PLACED',
    });

    // Clear the customer's cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], updatedAt: Date.now() });

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully with Cash on Delivery',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error placing order',
    });
  }
};

// @desc   Get customer's orders
// @route  GET /api/orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('products.product', 'name image price brand');

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching orders',
    });
  }
};

// @desc   Get single order by ID
// @route  GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('products.product', 'name image brand price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Ensure only the owner or an admin can access
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching order',
    });
  }
};

// @desc   Cancel order (Customer can cancel if status is PLACED)
// @route  PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Authorization check
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (order.orderStatus !== 'PLACED') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because its current status is "${order.orderStatus}". Orders can only be cancelled when status is "PLACED".`,
      });
    }

    // Restore product stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.orderStatus = 'CANCELLED';
    await order.save();

    res.json({
      success: true,
      order,
      message: 'Order cancelled successfully and product stock restored',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error cancelling order',
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
