import { useState } from 'react';
import { createCategory, updateCategory } from '../api/backendCalls';

// category prop = edit mode; no category = create mode
const AddCategoryModal = ({ onClose, onSuccess, category }) => {
  const isEdit = !!category;

  const [form, setForm] = useState({
    name:        isEdit ? (category.name        ?? '') : '',
    description: isEdit ? (category.description ?? '') : '',
  });
  const [visible, setVisible]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isEdit) {
        await updateCategory(category.id, form.name.trim(), form.description.trim());
      } else {
        await createCategory(form.name.trim(), form.description.trim());
      }
      onSuccess?.();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} category.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${visible ? 'bg-black/50' : 'bg-black/0'}`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ✕
        </button>

        <h2 className="text-base font-semibold text-gray-800 mb-6">
          {isEdit ? 'Update Category' : 'New Category'}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Electronics"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Electronic devices and gadgets"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors resize-none"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            disabled={submitting || !form.name.trim()}
            className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-md"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
