import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiShield,
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiCheck,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const inWishlist = product ? isInWishlist(product._id) : false;

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      const [prodRes, revRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/products/${id}/reviews`),
      ]);

      if (prodRes.data.success) {
        setProduct(prodRes.data.product);
      }
      if (revRes.data.success) {
        setReviews(revRes.data.reviews || []);
      }
    } catch (err) {
      toast.error('Failed to load product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product._id, quantity);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please log in to submit a review');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      if (editingReviewId) {
        // Edit existing review
        const { data } = await api.put(`/reviews/${editingReviewId}`, {
          rating: reviewRating,
          comment: reviewComment.trim(),
        });
        if (data.success) {
          toast.success('Review updated!');
          setEditingReviewId(null);
        }
      } else {
        // Add new review
        const { data } = await api.post(`/products/${id}/reviews`, {
          rating: reviewRating,
          comment: reviewComment.trim(),
        });
        if (data.success) {
          toast.success('Review posted!');
        }
      }
      setReviewComment('');
      setReviewRating(5);
      // Refresh reviews & product to update average rating
      fetchProductAndReviews();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (rev) => {
    setEditingReviewId(rev._id);
    setReviewRating(rev.rating);
    setReviewComment(rev.comment);
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteReview = async (revId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        const { data } = await api.delete(`/reviews/${revId}`);
        if (data.success) {
          toast.info('Review deleted');
          fetchProductAndReviews();
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  const myExistingReview = reviews.find(
    (r) => r.user?._id === user?._id || r.user === user?._id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <span>/</span>
        <Link
          to={`/products?category=${encodeURIComponent(product.category?.name || '')}`}
          className="hover:text-blue-600"
        >
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* Product Image */}
        <div className="relative bg-white border border-gray-200 rounded-3xl overflow-hidden p-6 flex items-center justify-center aspect-square shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain max-h-[500px] hover:scale-105 transition-transform duration-500"
          />

          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              Save ${(product.price - product.discountPrice).toFixed(2)}
            </span>
          )}

          <button
            onClick={handleWishlistToggle}
            aria-label="Wishlist"
            className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              inWishlist
                ? 'bg-red-50 text-red-500 shadow-md'
                : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white shadow'
            }`}
          >
            <FiHeart className={`text-xl ${inWishlist ? 'fill-red-500' : ''}`} />
          </button>
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                {product.brand}
              </span>
              <span className="text-xs text-gray-500">{product.category?.name}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`text-sm ${
                      star <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {product.rating > 0 ? product.rating.toFixed(1) : 'No ratings yet'}
              </span>
              <span className="text-sm text-gray-400">({reviews.length} customer reviews)</span>
            </div>

            {/* Price section */}
            <div className="pt-2 flex items-baseline gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-3xl sm:text-4xl font-black text-gray-900">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl sm:text-4xl font-black text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Low Stock: Only {product.stock} units left!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <FiCheck /> In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">About this item</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Add to Cart & Quantity Selector */}
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-gray-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                <FiShoppingCart className="text-lg" /> Add to Cart
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 border rounded-xl font-medium transition-all ${
                  inWishlist
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiHeart className={inWishlist ? 'fill-red-500' : ''} />
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-500">
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <FiTruck className="text-blue-600 text-base" />
                <span>Cash on Delivery Supported</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <FiShield className="text-green-600 text-base" />
                <span>100% Genuine Brand Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="pt-10 border-t border-gray-200 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <p className="text-sm text-gray-500">
              Based on {reviews.length} authentic verified feedback ratings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Submission Form */}
          <div id="review-form" className="lg:col-span-1 bg-white p-6 border border-gray-200 rounded-2xl shadow-sm h-fit">
            <h3 className="font-bold text-gray-900 text-base mb-1">
              {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Share your honest feedback on this item
            </p>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating Select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Rating Score:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setReviewRating(num)}
                        className="p-1 focus:outline-none"
                      >
                        <FiStar
                          className={`text-2xl transition-colors ${
                            num <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-600 ml-2">
                      {reviewRating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Feedback:
                  </label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="What did you like or dislike about this product?"
                    className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
                  >
                    {submittingReview
                      ? 'Saving...'
                      : editingReviewId
                      ? 'Update Review'
                      : 'Submit Review'}
                  </button>

                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReviewId(null);
                        setReviewComment('');
                        setReviewRating(5);
                      }}
                      className="px-3 py-2.5 border border-gray-300 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-gray-600 mb-3">You must be logged in to leave a review.</p>
                <Link
                  to="/login"
                  className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                >
                  Log In to Review
                </Link>
              </div>
            )}
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((rev) => {
                const isAuthor = user && (rev.user?._id === user._id || rev.user === user._id);
                return (
                  <div
                    key={rev._id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">
                            {rev.user?.name || 'Verified Customer'}
                          </h4>
                          <span className="text-[11px] text-gray-400">
                            {new Date(rev.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Author Controls */}
                      {isAuthor && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditReview(rev)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                            title="Edit Review"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                            title="Delete Review"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Rating stars */}
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`text-xs ${
                            star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed pt-1">{rev.comment}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
