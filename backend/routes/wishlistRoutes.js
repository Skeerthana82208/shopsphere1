const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// @desc   Get customer's wishlist
// @route  GET /api/wishlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'category', select: 'name' },
    });

    const validWishlist = (user.wishlist || []).filter((item) => item !== null);

    res.json({
      success: true,
      count: validWishlist.length,
      wishlist: validWishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching wishlist',
    });
  }
});

// @desc   Add product to wishlist
// @route  POST /api/wishlist/:productId
router.post('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const user = await User.findById(req.user._id);

    const alreadyInWishlist = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadyInWishlist) {
      return res.status(400).json({
        success: false,
        message: 'Product is already in your wishlist',
      });
    }

    user.wishlist.push(productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'category', select: 'name' },
    });

    res.json({
      success: true,
      wishlist: updatedUser.wishlist,
      message: 'Product added to wishlist',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding to wishlist',
    });
  }
});

// @desc   Remove product from wishlist
// @route  DELETE /api/wishlist/:productId
router.delete('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'category', select: 'name' },
    });

    res.json({
      success: true,
      wishlist: updatedUser.wishlist,
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error removing from wishlist',
    });
  }
});

module.exports = router;
