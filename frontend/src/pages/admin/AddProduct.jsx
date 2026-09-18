import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiPlusCircle, FiPackage } from 'react-icons/fi';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    discountPrice: '',
    image: '',
    stock: '',
    isFeatured: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.categories || []);
          if (data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, category: data.categories[0]._id }));
          }
        }
      } catch (err) {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.brand || !formData.category || !formData.price || !formData.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post('/products', {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        stock: formData.stock ? Number(formData.stock) : 0,
      });

      if (data.success) {
        toast.success('Product created successfully!');
        navigate('/admin/products');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 mb-2"
        >
          <FiArrowLeft /> Back to Products
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Add New Product</h1>
        <p className="text-sm text-gray-500">Create a new item to list in the ShopSphere store</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Sony WH-1000XM6 Wireless Headphones"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Brand Name *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                placeholder="e.g. Sony"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Product Description *
            </label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Provide key features, technical specs, and highlights..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Category, Price, Discount Price, Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Regular Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="199.99"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Discount Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="169.99"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Initial Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="25"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Image URL & Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Image URL * (Unsplash or direct image link)
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
            />
            {formData.image && (
              <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-xl w-24 h-24 flex items-center justify-center overflow-hidden">
                <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-800">
              Highlight as Featured Product on Homepage
            </label>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/products"
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <FiPlusCircle /> {submitting ? 'Creating Product...' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
