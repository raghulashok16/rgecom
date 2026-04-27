import { useState, useEffect } from 'react';
import { fetchSuppliers, deleteSupplier } from '../../api/backendCalls';
import AddSupplierModal from '../../components/AddSupplierModal';
import { view, table, btn, modal } from './shared.styles';
import Spinner from '../../components/Spinner';

const SuppliersView = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try { const res = await fetchSuppliers(); setSuppliers(res.data); }
      catch (err) { setError(err.response?.data?.message || 'Failed to load suppliers.'); setSuppliers([]); }
      finally { setLoading(false); }
    };
    load();
  }, [refreshKey]);

  const handleSuccess = () => setRefreshKey((k) => k + 1);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteSupplier(deleteTarget.id); setDeleteTarget(null); handleSuccess(); }
    catch { setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  return (
    <div className={view.wrapper}>
      <div className={view.toolbar}>
        <button onClick={() => setCreateOpen(true)} className={btn.create}>
          <span className="text-lg leading-none">+</span> Create Supplier
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
                <th className={table.th}>Contact Person</th>
                <th className={table.th}>Phone</th>
                <th className={table.th}>Email</th>
                <th className={table.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0
                ? <tr><td colSpan={5} className={table.emptyCell}>No suppliers found.</td></tr>
                : suppliers.map((s) => (
                    <tr key={s.id} className={table.row}>
                      <td className={`${table.td} text-gray-800 font-medium`}>{s.name}</td>
                      <td className={`${table.td} text-gray-700`}>{s.contactPerson || '—'}</td>
                      <td className={`${table.td} text-gray-600`}>{s.phone || '—'}</td>
                      <td className={`${table.td} text-gray-600`}>{s.email || '—'}</td>
                      <td className={table.td}>
                        <div className={btn.actions}>
                          <button onClick={() => setEditSupplier(s)} className={btn.update}>Update</button>
                          <button onClick={() => setDeleteTarget(s)} className={btn.deleteSoft}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {createOpen && <AddSupplierModal onClose={() => setCreateOpen(false)} onSuccess={handleSuccess} />}
      {editSupplier && (
        <AddSupplierModal supplier={editSupplier} onClose={() => setEditSupplier(null)} onSuccess={() => { setEditSupplier(null); handleSuccess(); }} />
      )}

      {deleteTarget && (
        <div className={modal.overlay} onClick={() => setDeleteTarget(null)}>
          <div className={modal.box} onClick={(e) => e.stopPropagation()}>
            <h3 className={modal.title}>Delete Supplier?</h3>
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

export default SuppliersView;
