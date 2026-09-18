import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">
          <FiHeart />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          Save your favorite items here so you can easily review them and add them to your cart later.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95"
        >
          Explore Catalog <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
        <p className="text-sm text-gray-500">
          You have {wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          if (!product) return null;
          const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

          return (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-red-500 hover:bg-red-50 flex items-center justify-center shadow-sm transition-colors"
                  title="Remove from Wishlist"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                  {product.brand}
                </div>

                <Link
                  to={`/products/${product._id}`}
                  className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 text-sm mb-2"
                >
                  {product.name}
                </Link>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div>
                    {hasDiscount ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-gray-900">
                          ${product.discountPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-base font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product._id, 1);
                      removeFromWishlist(product._id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm active:scale-95 transition-all"
                  >
                    <FiShoppingCart className="text-xs" /> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
