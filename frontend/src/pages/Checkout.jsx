import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  FiCheckCircle,
  FiTruck,
  FiUser,
  FiPhone,
  FiMapPin,
  FiArrowRight,
  FiShield,
  FiDollarSign,
} from 'react-icons/fi';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, cartSubtotal, fetchCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Validate fields
    const { name, phone, address, city, state, pincode } = shippingAddress;
    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error('Please complete all shipping address fields');
      return;
    }

    try {
      setPlacingOrder(true);
      const { data } = await api.post('/orders', {
        shippingAddress,
      });

      if (data.success) {
        setOrderSuccess(data.order);
        await fetchCart(); // Refresh cart in state
        toast.success('Order placed successfully with Cash on Delivery!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Success Confirmation Screen
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-sm">
          <FiCheckCircle />
        </div>

        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Order Successfully Placed!
        </h1>

        <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
          Thank you for your purchase. Your order <span className="font-mono font-bold text-gray-900">#{orderSuccess._id.slice(-8).toUpperCase()}</span> has been confirmed for Cash on Delivery.
        </p>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 text-left shadow-sm space-y-3 max-w-lg mx-auto">
          <div className="flex justify-between text-sm py-1 border-b border-gray-100">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-mono font-semibold text-gray-900">{orderSuccess._id}</span>
          </div>
          <div className="flex justify-between text-sm py-1 border-b border-gray-100">
            <span className="text-gray-500">Payment Method:</span>
            <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
              Cash on Delivery (COD)
            </span>
          </div>
          <div className="flex justify-between text-sm py-1 border-b border-gray-100">
            <span className="text-gray-500">Total Amount Due:</span>
            <span className="text-lg font-bold text-gray-900">
              ${orderSuccess.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-gray-500 pt-1">
            <span className="font-semibold text-gray-700">Delivery Address:</span>{' '}
            {orderSuccess.shippingAddress.name}, {orderSuccess.shippingAddress.address},{' '}
            {orderSuccess.shippingAddress.city}, {orderSuccess.shippingAddress.state} -{' '}
            {orderSuccess.shippingAddress.pincode}. Phone: {orderSuccess.shippingAddress.phone}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            to="/orders"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-sm transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const grandTotal = cartSubtotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-gray-500">Complete your shipping address and confirm your COD order</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Shipping Address Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FiMapPin className="text-blue-600" /> Delivery & Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Recipient Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleChange}
                    required
                    placeholder="Recipient's Name"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                  <FiUser className="absolute left-3.5 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 555-0100"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                  <FiPhone className="absolute left-3.5 top-3 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleChange}
                required
                placeholder="House No, Street, Apartment or Landmark"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  State/Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleChange}
                  required
                  placeholder="State"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Pincode / ZIP *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={shippingAddress.pincode}
                  onChange={handleChange}
                  required
                  placeholder="ZIP / Pincode"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Notice (COD Only) */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                <FiDollarSign />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  Payment Method: Cash on Delivery (COD)
                </h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Pay cash directly to the courier agent when your package arrives at your doorstep. No prepayment required.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Review Sidebar */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Review Items ({cartItems.length})
          </h2>

          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-2">
            {cartItems.map((item) => {
              if (!item.product) return null;
              const product = item.product;
              const effectivePrice =
                product.discountPrice > 0 ? product.discountPrice : product.price;

              return (
                <div key={product._id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-contain rounded-lg border border-gray-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-bold text-gray-800 shrink-0">
                    ${(effectivePrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Total Due (COD):</span>
              <span className="text-2xl font-black text-blue-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={placingOrder}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
          >
            {placingOrder ? 'Processing Order...' : 'Place Order (Cash on Delivery)'} <FiArrowRight />
          </button>

          <p className="text-center text-[11px] text-gray-400">
            By clicking Place Order, you confirm your order and agree to pay cash upon delivery.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
