import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiGrid } from 'react-icons/fi';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCatId, setCurrentCatId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories');
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCatId(null);
    setFormData({ name: '', description: '', image: '' });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setCurrentCatId(cat._id);
    setFormData({ name: cat.name, description: cat.description || '', image: cat.image || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        const { data } = await api.put(`/categories/${currentCatId}`, formData);
        if (data.success) {
          toast.success('Category updated successfully');
        }
      } else {
        const { data } = await api.post('/categories', formData);
        if (data.success) {
          toast.success('Category created successfully');
        }
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (catId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const { data } = await api.delete(`/categories/${catId}`);
        if (data.success) {
          toast.success('Category deleted');
          fetchCategories();
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Categories</h1>
          <p className="text-sm text-gray-500">
            Current {categories.length} product collections in database
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all active:scale-95 self-start sm:self-auto"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-32 bg-gray-100 overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <FiGrid className="text-3xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-3 left-4 text-white font-bold text-lg leading-tight">
                  {cat.name}
                </h3>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-gray-500 line-clamp-2">{cat.description || 'No description'}</p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                    title="Edit Category"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                    title="Delete Category"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Gaming & VR"
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of products in this category"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                >
                  {saving ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
