import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiShield, FiTruck } from 'react-icons/fi';

const Cart = () => {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart, clearCart, loadingCart } = useCart();
  const navigate = useNavigate();

  if (loadingCart) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">
          <FiShoppingBag />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          Explore our wide range of products and discover great deals across electronics, fashion, books and more.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95"
        >
          Start Shopping <FiArrowRight />
        </Link>
      </div>
    );
  }

  const shipping = 0; // Free Shipping
  const grandTotal = cartSubtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-gray-500">
            Review your {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} before checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline self-start sm:self-auto"
        >
          Clear entire cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm divide-y divide-gray-100">
            {cartItems.map((item) => {
              if (!item.product) return null;
              const product = item.product;
              const effectivePrice =
                product.discountPrice > 0 ? product.discountPrice : product.price;
              const itemTotal = effectivePrice * item.quantity;

              return (
                <div
                  key={product._id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4 flex-1">
                    <Link
                      to={`/products/${product._id}`}
                      className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center p-1"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                        {product.brand}
                      </span>
                      <Link
                        to={`/products/${product._id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 text-sm line-clamp-2 transition-colors"
                      >
                        {product.name}
                      </Link>
                      <div className="text-xs text-gray-500">
                        Price: ${effectivePrice.toFixed(2)} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden shadow-sm">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product._id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30 text-sm"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(product._id, Math.min(product.stock, item.quantity + 1))
                        }
                        disabled={item.quantity >= product.stock}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30 text-sm"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <div className="text-base font-bold text-gray-900">
                        ${itemTotal.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove item"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-gray-900">${cartSubtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Delivery & Shipping:</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Payment Mode:</span>
              <span className="font-semibold text-gray-800">Cash on Delivery</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Estimated Total:</span>
              <span className="text-2xl font-black text-blue-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
          >
            Proceed to Checkout <FiArrowRight />
          </button>

          {/* Guarantees micro-box */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <FiTruck className="text-blue-600 text-sm" /> Fast delivery with COD guarantee
            </div>
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <FiShield className="text-green-600 text-sm" /> Pay upon delivery at your door
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
