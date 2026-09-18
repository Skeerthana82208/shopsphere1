import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiAlertTriangle,
  FiArrowRight,
  FiGrid,
  FiList,
} from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/admin/dashboard');
        if (data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
          setLowStockProducts(data.lowStockProducts || []);
          setStatusCounts(data.statusCounts || []);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Quick Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded">
            ShopSphere Management Portal
          </span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/products"
            className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/categories"
            className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Manage Categories
          </Link>
          <Link
            to="/admin/orders"
            className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/users"
            className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            View Users
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Products */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Products</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalProducts || 0}</h3>
            <Link to="/admin/products" className="text-xs text-blue-600 hover:underline font-semibold mt-2 inline-block">
              View catalog &rarr;
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
            <FiPackage />
          </div>
        </div>

        {/* Card 2: Users */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Customers</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalUsers || 0}</h3>
            <Link to="/admin/users" className="text-xs text-purple-600 hover:underline font-semibold mt-2 inline-block">
              View user list &rarr;
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
            <FiUsers />
          </div>
        </div>

        {/* Card 3: Orders */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalOrders || 0}</h3>
            <Link to="/admin/orders" className="text-xs text-amber-600 hover:underline font-semibold mt-2 inline-block">
              Update statuses &rarr;
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
            <FiShoppingBag />
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              ${(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className="text-[11px] text-green-600 font-semibold mt-2 inline-block">
              From COD Deliveries
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-2xl">
            <FiDollarSign />
          </div>
        </div>
      </div>

      {/* Simple Sales Breakdown Visual Chart */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">Order Volume by Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {statusCounts.map((item) => (
            <div key={item._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center space-y-1">
              <span className="text-xs font-bold text-gray-600">{item._id}</span>
              <div className="text-2xl font-black text-blue-600">{item.count}</div>
              <div className="text-[11px] text-gray-400 font-medium">${item.revenue.toFixed(0)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Low Stock Alert & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alert List (stock < 10) */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FiAlertTriangle className="text-amber-500" /> Low Stock Products (&lt; 10 units)
            </h2>
            <Link to="/admin/products" className="text-xs font-semibold text-blue-600 hover:underline">
              Manage
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">All products are adequately stocked!</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {lowStockProducts.map((p) => (
                <div key={p._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded-lg border border-gray-100" />
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-gray-400">{p.brand} • {p.category?.name}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-bold shrink-0">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders List */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recent Customer Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentOrders.map((ord) => (
              <div key={ord._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-semibold text-gray-900 font-mono">
                    #{ord._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-gray-500">{ord.user?.name || ord.shippingAddress?.name || 'Customer'}</p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-gray-900">${ord.totalAmount.toFixed(2)}</span>
                  <div className="mt-0.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
