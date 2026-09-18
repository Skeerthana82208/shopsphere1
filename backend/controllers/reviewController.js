const Review = require('../models/Review');
const Product = require('../models/Product');

// Helper to recalculate and update product average rating and count
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const rating =
    numReviews > 0
      ? Number((reviews.reduce((acc, item) => acc + item.rating, 0) / numReviews).toFixed(1))
      : 0;

  await Product.findByIdAndUpdate(productId, { rating, numReviews });
};

// @desc   Get all reviews for a product
// @route  GET /api/products/:productId/reviews
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching reviews',
    });
  }
};

// @desc   Add review to a product
// @route  POST /api/products/:productId/reviews
const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both rating (1-5) and comment',
      });
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product. You can edit your existing review.',
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: numericRating,
      comment: comment.trim(),
    });

    await updateProductRating(productId);

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      review: populatedReview,
      message: 'Review added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding review',
    });
  }
};

// @desc   Update own review
// @route  PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check authorization
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    if (rating !== undefined) {
      const numericRating = Number(rating);
      if (numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5',
        });
      }
      review.rating = numericRating;
    }

    if (comment) {
      review.comment = comment.trim();
    }

    await review.save();
    await updateProductRating(review.product);

    const updatedReview = await Review.findById(review._id).populate('user', 'name');

    res.json({
      success: true,
      review: updatedReview,
      message: 'Review updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating review',
    });
  }
};

// @desc   Delete review
// @route  DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting review',
    });
  }
};

module.exports = {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
};
