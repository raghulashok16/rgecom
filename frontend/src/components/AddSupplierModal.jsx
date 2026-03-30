import { useState } from 'react';
import { createSupplier, updateSupplier } from '../api/backendCalls';

// supplier prop = edit mode; no supplier = create mode
const AddSupplierModal = ({ onClose, onSuccess, supplier }) => {
  const isEdit = !!supplier;

  const [form, setForm] = useState({
    name:          isEdit ? (supplier.name          ?? '') : '',
    contactPerson: isEdit ? (supplier.contactPerson ?? '') : '',
    phone:         isEdit ? (supplier.phone         ?? '') : '',
    email:         isEdit ? (supplier.email         ?? '') : '',
    address:       isEdit ? (supplier.address       ?? '') : '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isEdit) {
        await updateSupplier(
          supplier.id,
          form.name.trim(),
          form.contactPerson.trim(),
          form.phone.trim(),
          form.email.trim(),
          form.address.trim(),
        );
      } else {
        await createSupplier(
          form.name.trim(),
          form.contactPerson.trim(),
          form.phone.trim(),
          form.email.trim(),
          form.address.trim(),
        );
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} supplier.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ✕
        </button>

        <h2 className="text-base font-semibold text-gray-800 mb-6">
          {isEdit ? 'Update Supplier' : 'New Supplier'}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. TechSupply Co."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact Person</label>
            <input
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 555-1234"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. contact@co.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. 123 Tech Street, Silicon Valley, CA"
              rows={2}
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

export default AddSupplierModal;
