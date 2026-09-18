const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc   Get user cart
// @route  GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discountPrice image stock brand category',
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out items whose product might have been deleted
    const validItems = cart.items.filter((item) => item.product !== null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching cart',
    });
  }
};

// @desc   Add item to cart
// @route  POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const qtyToAdd = Number(quantity);

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + qtyToAdd;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${product.stock})`,
        });
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      if (qtyToAdd > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${product.stock})`,
        });
      }
      cart.items.push({ product: productId, quantity: qtyToAdd });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discountPrice image stock brand category',
    });

    res.json({
      success: true,
      cart: updatedCart,
      message: 'Product added to cart',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding to cart',
    });
  }
};

// @desc   Update item quantity in cart
// @route  PUT /api/cart/:productId
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock})`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not in cart',
      });
    }

    cart.items[itemIndex].quantity = qty;
    cart.updatedAt = Date.now();
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discountPrice image stock brand category',
    });

    res.json({
      success: true,
      cart: updatedCart,
      message: 'Cart updated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating cart item',
    });
  }
};

// @desc   Remove item from cart
// @route  DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.updatedAt = Date.now();
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discountPrice image stock brand category',
    });

    res.json({
      success: true,
      cart: updatedCart,
      message: 'Item removed from cart',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error removing item from cart',
    });
  }
};

// @desc   Clear entire cart
// @route  DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.updatedAt = Date.now();
      await cart.save();
    }

    res.json({
      success: true,
      cart: { user: req.user._id, items: [] },
      message: 'Cart cleared',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error clearing cart',
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
