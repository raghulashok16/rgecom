import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SelectDropdown from './ui/SelectDropdown';
import { createProduct, createSupplierProduct, updateProduct, fetchSuppliers, fetchCategories } from '../api/backendCalls';

// product prop = edit mode (pre-filled); no product = create mode
// isSupplier = true → new products are created with active: false
const AddProductModal = ({ onClose, onSuccess, product, isSupplier }) => {
  const isEdit = !!product;
  const supplierId = useSelector((state) => state.auth.supplierId);

  const [form, setForm] = useState({
    name:        isEdit ? (product.name        ?? '') : '',
    description: isEdit ? (product.description ?? '') : '',
    price:       isEdit ? (product.price       ?? '') : '',
    categoryId:  isEdit ? (product.categoryId  ?? '') : '',
    supplierId:  isEdit ? (product.supplierId  ?? '') : '',
    imageUrl:    isEdit ? (product.imageUrl    ?? '') : '',
    active:      isEdit ? (product.active      ?? true) : (isSupplier ? false : true),
  });
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res.data)).catch(() => {});
    if (!isSupplier) {
      fetchSuppliers().then((res) => setSuppliers(res.data)).catch(() => {});
    }
  }, [isSupplier]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isEdit) {
        await updateProduct(
          product.id,
          form.name.trim(),
          form.description.trim(),
          parseFloat(form.price),
          form.categoryId ? parseInt(form.categoryId) : null,
          !isSupplier && form.supplierId ? parseInt(form.supplierId) : (product.supplierId ?? null),
          form.imageUrl.trim() || null,
          form.active,
        );
      } else if (isSupplier) {
        // POST /products/supplier — supplierId from JWT claim, active set to false by backend
        await createSupplierProduct(
          form.name.trim(),
          form.description.trim(),
          parseFloat(form.price),
          form.categoryId ? parseInt(form.categoryId) : null,
          form.imageUrl.trim() || null,
          supplierId,
        );
      } else {
        // POST /products — admin: explicit supplierId and active flag
        await createProduct(
          form.name.trim(),
          form.description.trim(),
          parseFloat(form.price),
          form.categoryId ? parseInt(form.categoryId) : null,
          form.supplierId ? parseInt(form.supplierId) : null,
          form.imageUrl.trim() || null,
          form.active,
        );
      }
      onSuccess?.();
      if (isSupplier && !isEdit) {
        setSuccessMsg('Product submitted successfully. Contact admin for approval and activation.');
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} product.`);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ✕
        </button>

        <h2 className="text-base font-semibold text-gray-800 mb-6">
          {isEdit ? 'Update Product' : 'New Product'}
        </h2>

        {/* Two-column grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">

          {/* Left column */}
          <div className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className={labelCls}>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Laptop"
                className={inputCls}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. High-performance laptop with 16GB RAM"
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Price */}
            <div>
              <label className={labelCls}>Price (₹)</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 1299.99"
                className={inputCls}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Category */}
            <div>
              <label className={labelCls}>Category</label>
              <SelectDropdown
                value={String(form.categoryId)}
                onChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Please select"
              />
            </div>

            {/* Supplier (admin only) */}
            {!isSupplier && (
              <div>
                <label className={labelCls}>Supplier</label>
                <SelectDropdown
                  value={String(form.supplierId)}
                  onChange={(v) => setForm((f) => ({ ...f, supplierId: v }))}
                  options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
                  placeholder="Please select"
                />
              </div>
            )}

            {/* Image URL */}
            <div>
              <label className={labelCls}>Image URL</label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={inputCls}
              />
              {form.imageUrl.trim() && (
                <img
                  src={form.imageUrl.trim()}
                  alt="preview"
                  onError={(e) => { e.target.style.display = 'none'; }}
                  onLoad={(e) => { e.target.style.display = 'block'; }}
                  className="mt-2 h-20 w-full object-contain rounded-lg border border-gray-100 bg-gray-50"
                />
              )}
            </div>

            {/* Active Status — hidden for suppliers (they cannot control activation) */}
            {!isSupplier && (
              <div>
                <label className={labelCls}>Active Status</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, active: true }))}
                    className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${form.active ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, active: false }))}
                    className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${!form.active ? 'bg-red-500 text-white border-red-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            )}

            {/* Pending approval notice for supplier create */}
            {isSupplier && !isEdit && (
              <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-xs text-yellow-700">Product will be submitted for admin approval and listed as inactive until reviewed.</p>
              </div>
            )}
          </div>

        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}

        {successMsg ? (
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 text-center">{successMsg}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.name.trim() || !form.price}
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
        )}
      </div>
    </div>
  );
};

export default AddProductModal;
