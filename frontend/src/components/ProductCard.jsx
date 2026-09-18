import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(product._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product._id, 1);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Product Image Area */}
      <Link to={`/products/${product._id}`} className="relative block aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Save ${(product.price - product.discountPrice).toFixed(0)}
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            inWishlist
              ? 'bg-red-50 text-red-500 shadow-md'
              : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 hover:bg-white shadow-sm'
          }`}
        >
          <FiHeart className={`text-base ${inWishlist ? 'fill-red-500' : ''}`} />
        </button>

        {/* Stock status overlay if out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span className="font-semibold text-blue-600 uppercase tracking-wider">{product.brand}</span>
          <span className="truncate ml-2 text-gray-400">{product.category?.name}</span>
        </div>

        <Link
          to={`/products/${product._id}`}
          className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 text-sm transition-colors mb-2"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating & Stock Indicator */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <FiStar className="fill-amber-400 stroke-amber-400 text-xs" />
            <span>{product.rating > 0 ? product.rating.toFixed(1) : 'New'}</span>
            {product.numReviews > 0 && (
              <span className="text-gray-400 font-normal">({product.numReviews})</span>
            )}
          </div>

          <div>
            {isOutOfStock ? (
              <span className="text-red-600 font-medium">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-medium">Only {product.stock} left</span>
            ) : (
              <span className="text-emerald-600 font-medium">In Stock</span>
            )}
          </div>
        </div>

        {/* Price & Cart Button */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-gray-900">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center p-2.5 rounded-xl transition-all ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-95'
            }`}
            title="Add to Cart"
          >
            <FiShoppingCart className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
