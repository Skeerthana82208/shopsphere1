import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductList from '../components/ProductList';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters from URL
  const selectedCategory = searchParams.get('category') || 'All';
  const searchTerm = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [inputSearch, setInputSearch] = useState(searchTerm);

  // Sync input when URL search changes
  useEffect(() => {
    setInputSearch(searchTerm);
  }, [searchTerm]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.set('category', selectedCategory);
        }
        if (searchTerm) {
          queryParams.set('search', searchTerm);
        }
        if (currentSort) {
          queryParams.set('sort', currentSort);
        }
        queryParams.set('page', currentPage);
        queryParams.set('limit', '12');

        const { data } = await api.get(`/products?${queryParams.toString()}`);
        if (data.success) {
          setProducts(data.products || []);
          setTotalPages(data.pages || 1);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, searchTerm, currentSort, currentPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter/search change
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', inputSearch.trim());
  };

  const clearAllFilters = () => {
    setInputSearch('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Explore All Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing <span className="font-semibold text-gray-800">{totalCount}</span> products found
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              placeholder="Search by name or brand..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none shadow-sm"
            />
            <FiSearch className="absolute left-3.5 top-3 text-gray-400" />
            {inputSearch && (
              <button
                type="button"
                onClick={() => {
                  setInputSearch('');
                  updateParam('search', '');
                }}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Categories Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none flex-1 max-w-full">
            <button
              onClick={() => updateParam('category', 'All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateParam('category', cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <FiSliders /> Sort by:
            </span>
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="text-xs font-medium text-gray-800 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filters indicator */}
        {(selectedCategory !== 'All' || searchTerm) && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500">Active filters:</span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">
                Category: {selectedCategory}
                <button onClick={() => updateParam('category', 'All')} className="hover:text-blue-900">
                  <FiX />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">
                Search: "{searchTerm}"
                <button onClick={() => updateParam('search', '')} className="hover:text-blue-900">
                  <FiX />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="ml-auto text-red-600 hover:underline font-medium"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Product List Grid with Pagination */}
      <ProductList
        products={products}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => updateParam('page', page)}
        emptyMessage="Try adjusting your search terms or category filters."
      />
    </div>
  );
};

export default Products;
