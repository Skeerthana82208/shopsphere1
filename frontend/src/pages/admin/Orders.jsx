import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiShoppingBag, FiSearch, FiFilter, FiClock, FiCheck } from 'react-icons/fi';

const statusBadgeStyles = {
  PLACED: 'bg-blue-50 text-blue-700 border-blue-200',
  CONFIRMED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  SHIPPED: 'bg-amber-50 text-amber-700 border-amber-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

const ORDER_STATUSES = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/orders');
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const { data } = await api.put(`/admin/orders/${orderId}`, {
        orderStatus: newStatus,
      });

      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    statusFilter === 'ALL'
      ? orders
      : orders.filter((o) => o.orderStatus === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-sm text-gray-500">
            View customer orders and update delivery statuses in real-time
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({orders.length})
          </button>
          {ORDER_STATUSES.map((st) => {
            const count = orders.filter((o) => o.orderStatus === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px] tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Order Date</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-gray-400">
                    No orders match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-900">
                      #{ord._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">
                        {ord.user?.name || ord.shippingAddress?.name}
                      </p>
                      <p className="text-gray-400 text-xs">{ord.user?.email || ord.shippingAddress?.phone}</p>
                    </td>
                    <td className="p-4 text-gray-700">
                      <span className="font-semibold">{ord.products.length}</span> items
                    </td>
                    <td className="p-4 font-black text-gray-900 text-sm">
                      ${ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">
                      {new Date(ord.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          statusBadgeStyles[ord.orderStatus] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={ord.orderStatus}
                        disabled={updatingId === ord._id}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-40"
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
