import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiBox, FiClock, FiX, FiCheck, FiShoppingBag, FiInfo } from 'react-icons/fi';

const statusBadgeStyles = {
  PLACED: 'bg-blue-100 text-blue-800 border-blue-200',
  CONFIRMED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  SHIPPED: 'bg-amber-100 text-amber-800 border-amber-200',
  DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? This will restore the items to stock.')) {
      try {
        setCancellingId(orderId);
        const { data } = await api.put(`/orders/${orderId}/cancel`);
        if (data.success) {
          toast.success(data.message || 'Order cancelled');
          // Update order locally
          setOrders((prev) =>
            prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: 'CANCELLED' } : ord))
          );
          if (selectedOrder && selectedOrder._id === orderId) {
            setSelectedOrder((prev) => ({ ...prev, orderStatus: 'CANCELLED' }));
          }
        }
      } catch (err) {
        toast.error(err.message || 'Could not cancel order');
      } finally {
        setCancellingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">
          <FiBox />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">No Orders Found</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          You haven't placed any orders yet. Once you place an order, you can track its delivery status here.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order History</h1>
        <p className="text-sm text-gray-500">Track and manage your past and active purchases</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isPlaced = order.orderStatus === 'PLACED';

          return (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Top Row: ID, Date, Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">ORDER ID:</span>
                    <span className="font-mono font-bold text-sm text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FiClock className="text-gray-400" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      statusBadgeStyles[order.orderStatus] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.orderStatus}
                  </span>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3.5 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                  >
                    <FiInfo /> View Details
                  </button>

                  {isPlaced && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingId === order._id}
                      className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-semibold text-red-700 transition-colors disabled:opacity-50"
                    >
                      {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>

              {/* Middle Row: Items preview & Total */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {order.products.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-2 text-xs"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 object-contain rounded"
                        />
                      )}
                      <span className="font-medium text-gray-800 line-clamp-1 max-w-[140px]">
                        {item.name}
                      </span>
                      <span className="text-gray-400">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-gray-400">Payment: COD</div>
                  <div className="text-lg font-black text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <FiX className="text-xl" />
            </button>

            <div>
              <div className="inline-block text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                Order Details
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Order #{selectedOrder._id.slice(-8).toUpperCase()}
              </h3>
              <p className="text-xs text-gray-400">Full ID: {selectedOrder._id}</p>
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-xs text-gray-600 font-medium">Current Status:</span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  statusBadgeStyles[selectedOrder.orderStatus]
                }`}
              >
                {selectedOrder.orderStatus}
              </span>
            </div>

            {/* Shipping Address */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider">Shipping Address:</h4>
              <p className="text-gray-800 font-medium">{selectedOrder.shippingAddress?.name}</p>
              <p className="text-gray-600">{selectedOrder.shippingAddress?.address}</p>
              <p className="text-gray-600">
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{' '}
                {selectedOrder.shippingAddress?.pincode}
              </p>
              <p className="text-gray-600">Phone: {selectedOrder.shippingAddress?.phone}</p>
            </div>

            {/* Products breakdown */}
            <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2">Purchased Items:</h4>
              {selectedOrder.products.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    {p.image && <img src={p.image} alt={p.name} className="w-8 h-8 object-contain rounded" />}
                    <div>
                      <p className="font-semibold text-gray-800">{p.name}</p>
                      <p className="text-gray-400">
                        ${p.price.toFixed(2)} × {p.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">${(p.price * p.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Total and actions */}
            <div className="pt-2 border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Total Amount:</span>
                <span className="text-xl font-black text-blue-600">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </span>
              </div>

              {selectedOrder.orderStatus === 'PLACED' && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder._id)}
                  className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel Order (Restores Inventory)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
