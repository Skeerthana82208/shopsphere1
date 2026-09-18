import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiTag } from 'react-icons/fi';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catsRes, featuredRes, latestRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?featured=true&limit=8'),
          api.get('/products?sort=newest&limit=8'),
        ]);

        if (catsRes.data.success) setCategories(catsRes.data.categories || []);
        if (featuredRes.data.success) setFeaturedProducts(featuredRes.data.products || []);
        if (latestRes.data.success) setLatestProducts(latestRes.data.products || []);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 text-white py-16 sm:py-24 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl mt-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              New Season Catalog Ready
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Shop Smart. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Shop Simple.
              </span> <br />
              ShopSphere.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              Explore 100+ premium verified products across electronics, fashion, tech, home goods, and books. Easy Cash on Delivery on all orders.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                <FiShoppingBag /> Shop Now
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/15 backdrop-blur-sm transition-all"
              >
                Browse Categories <FiArrowRight />
              </a>
            </div>

            {/* Micro value badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <FiTruck className="text-blue-400 text-base" /> Free Delivery
              </div>
              <div className="flex items-center gap-2">
                <FiTag className="text-blue-400 text-base" /> Cash on Delivery
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="text-blue-400 text-base" /> Verified Stock
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">Explore our 10 curated collections</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            All Products <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative h-44 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm sm:text-base leading-tight group-hover:text-blue-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-300 mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              Handpicked Deals
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            View More <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              Fresh Inventory
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Latest Arrivals
            </h2>
          </div>
          <Link
            to="/products?sort=newest"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            See All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
