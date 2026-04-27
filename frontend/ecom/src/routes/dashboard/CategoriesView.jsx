import { useState, useEffect } from 'react';
import { fetchCategories, deleteCategory } from '../../api/backendCalls';
import AddCategoryModal from '../../components/AddCategoryModal';
import { view, table, btn, modal } from './shared.styles';
import Spinner from '../../components/Spinner';

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try { const res = await fetchCategories(); setCategories(res.data); }
      catch (err) { setError(err.response?.data?.message || 'Failed to load categories.'); setCategories([]); }
      finally { setLoading(false); }
    };
    load();
  }, [refreshKey]);

  const handleSuccess = () => { setRefreshKey((k) => k + 1); window.dispatchEvent(new Event('categories-changed')); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteCategory(deleteTarget.id); setDeleteTarget(null); handleSuccess(); }
    catch { setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  return (
    <div className={view.wrapper}>
      <div className={view.toolbar}>
        <button onClick={() => setCreateOpen(true)} className={btn.create}>
          <span className="text-lg leading-none">+</span> Create Category
        </button>
      </div>

      {error && (
        <div className={view.errorWrapper}>
          <p className={view.errorTitle}>{error}</p>
          <button onClick={() => setRefreshKey((k) => k + 1)} className={btn.retry}>Try Again</button>
        </div>
      )}

      {!error && loading && <Spinner />}

      {!error && !loading && (
        <div className={view.tableWrapper}>
          <table className={table.root}>
            <thead>
              <tr className="border-b border-gray-100">
                <th className={table.th}>Name</th>
                <th className={table.th}>Description</th>
                <th className={table.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0
                ? <tr><td colSpan={3} className={table.emptyCell}>No categories found.</td></tr>
                : categories.map((c) => (
                    <tr key={c.id} className={table.row}>
                      <td className={`${table.td} text-gray-800 font-medium`}>{c.name}</td>
                      <td className={`${table.td} text-gray-600`}>{c.description || '—'}</td>
                      <td className={table.td}>
                        <div className={btn.actions}>
                          <button onClick={() => setEditCategory(c)} className={btn.update}>Update</button>
                          <button onClick={() => setDeleteTarget(c)} className={btn.deleteSoft}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {createOpen && <AddCategoryModal onClose={() => setCreateOpen(false)} onSuccess={handleSuccess} />}
      {editCategory && (
        <AddCategoryModal category={editCategory} onClose={() => setEditCategory(null)} onSuccess={() => { setEditCategory(null); handleSuccess(); }} />
      )}

      {deleteTarget && (
        <div className={modal.overlay} onClick={() => setDeleteTarget(null)}>
          <div className={modal.box} onClick={(e) => e.stopPropagation()}>
            <h3 className={modal.title}>Delete Category?</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete <span className="font-medium text-gray-700">{deleteTarget.name}</span>? This action cannot be undone.
            </p>
            <div className={modal.footer}>
              <button onClick={() => setDeleteTarget(null)} className={modal.btnCancel}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className={modal.btnDelete}>{deleting ? 'Deleting…' : 'Yes, Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesView;
