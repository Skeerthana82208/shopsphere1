import React from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiDollarSign, FiHeadphones, FiShield } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-900 text-gray-300">
      {/* Value Badges Banner */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl mb-3">
                <FiTruck />
              </div>
              <h4 className="font-semibold text-white text-sm sm:text-base">Fast Delivery</h4>
              <p className="text-xs text-gray-400 mt-1">Free standard shipping on all orders</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center text-2xl mb-3">
                <FiDollarSign />
              </div>
              <h4 className="font-semibold text-white text-sm sm:text-base">Cash on Delivery</h4>
              <p className="text-xs text-gray-400 mt-1">Pay safely at your doorstep</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl mb-3">
                <FiHeadphones />
              </div>
              <h4 className="font-semibold text-white text-sm sm:text-base">24/7 Support</h4>
              <p className="text-xs text-gray-400 mt-1">Dedicated customer support team</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl mb-3">
                <FiShield />
              </div>
              <h4 className="font-semibold text-white text-sm sm:text-base">Authentic Guarantee</h4>
              <p className="text-xs text-gray-400 mt-1">100% genuine guaranteed products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black text-white">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                S
              </span>
              <span>Shop<span className="text-blue-400">Sphere</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Shop Smart. Shop Simple. ShopSphere provides a modern, seamless online shopping experience with premium curated products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Explore
            </h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/products?sort=newest" className="hover:text-white transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h5 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Categories
            </h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/products?category=Electronics" className="hover:text-white transition-colors">Electronics</Link>
              </li>
              <li>
                <Link to="/products?category=Mobile%20Phones" className="hover:text-white transition-colors">Mobile Phones</Link>
              </li>
              <li>
                <Link to="/products?category=Laptops" className="hover:text-white transition-colors">Laptops & Computers</Link>
              </li>
              <li>
                <Link to="/products?category=Shoes" className="hover:text-white transition-colors">Footwear & Shoes</Link>
              </li>
              <li>
                <Link to="/products?category=Books" className="hover:text-white transition-colors">Books & Literature</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Customer Account
            </h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">My Account</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">Order Tracking</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">View Cart</Link>
              </li>
              <li>
                <span className="inline-block mt-2 px-2.5 py-1 text-xs bg-gray-800 text-green-400 rounded-md border border-gray-700">
                  Cash on Delivery Accepted
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} ShopSphere Inc. Intermediate MERN Application. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed & Engineered with React, Node.js & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
