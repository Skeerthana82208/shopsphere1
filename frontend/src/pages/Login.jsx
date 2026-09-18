import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiLock, FiMail, FiArrowRight, FiUserCheck } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      toast.success('Welcome back!');
      navigate(redirect);
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@shopsphere.com');
    setPassword('Admin@123');
  };

  const fillDemoCustomer = () => {
    setEmail('john@example.com');
    setPassword('Password@123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold shadow-sm">
            S
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Sign In to ShopSphere
          </h1>
          <p className="text-xs text-gray-500">
            Access your account, orders, wishlist, and cart
          </p>
        </div>

        {/* 1-Click Quick Demo Login Pill Buttons */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-center space-y-2">
          <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
            Quick Demo Accounts
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="flex-1 py-1.5 px-3 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <FiUserCheck /> Admin Demo
            </button>
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="flex-1 py-1.5 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <FiUserCheck /> Customer Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              />
              <FiMail className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              />
              <FiLock className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? 'Signing in...' : 'Sign In'} <FiArrowRight />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
