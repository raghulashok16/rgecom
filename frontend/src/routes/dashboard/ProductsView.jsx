import { useState, useEffect } from 'react';
import { fetchProducts, searchProducts, fetchCategories, fetchSuppliers, deleteProduct } from '../../api/backendCalls';
import AddProductModal from '../../components/AddProductModal';
import Pagination from './Pagination';
import { getImage } from './productHelpers';
import { styles } from './ProductsView.styles';
import { view, table, btn, input, modal } from './shared.styles';

const errorMessages = {
  400: 'Bad request. Please check your search input.',
  401: 'Unauthorized. Please log in again.',
  500: 'Server error. Please try again later.',
};

const PAGE_SIZE_PRODUCTS = 10;

const ProductsView = ({ onAddNew, externalRefreshKey = 0 }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [categoryMap, setCategoryMap] = useState({});
  const [supplierMap, setSupplierMap] = useState({});

  useEffect(() => {
    fetchCategories().then((res) => { const map = {}; res.data.forEach((c) => { map[c.id] = c.name; }); setCategoryMap(map); }).catch(() => {});
    fetchSuppliers().then((res) => { const map = {}; res.data.forEach((s) => { map[s.id] = s.name; }); setSupplierMap(map); }).catch(() => {});
  }, []);

  useEffect(() => { setPage(0); }, [searchQuery, activeFilter]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = searchQuery ? await searchProducts(searchQuery, 0, 1000, 'asc') : await fetchProducts(0, 1000, 'asc');
        setAllProducts(res.data.content);
      } catch (err) {
        const status = err.response?.status;
        setError({ status, message: err.response?.data?.message || errorMessages[status] || 'An unexpected error occurred.' });
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchQuery, refreshKey, externalRefreshKey]);

  const filtered = activeFilter === 'all' ? allProducts : allProducts.filter((p) => activeFilter === 'active' ? p.active : !p.active);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE_PRODUCTS);
  const displayedProducts = filtered.slice(page * PAGE_SIZE_PRODUCTS, (page + 1) * PAGE_SIZE_PRODUCTS);

  const filterTabCls = (f) => {
    if (f === activeFilter) {
      if (f === 'active')   return styles.filterTabActive;
      if (f === 'inactive') return styles.filterTabInactive;
      return styles.filterTabAll;
    }
    return styles.filterTabDefault;
  };

  return (
    <div className={view.wrapper}>
      {/* Toolbar */}
      <div className={view.toolbar}>
        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(searchInput)}
          placeholder="Search products..." className={`${input.search} w-72`} />
        <button onClick={() => setSearchQuery(searchInput)} className={btn.search}>Search</button>
        {searchQuery && <button onClick={() => { setSearchQuery(''); setSearchInput(''); }} className={btn.clear}>Clear</button>}
        {onAddNew && (
          <button onClick={onAddNew} className={styles.addBtn}>
            <span className="text-base leading-none">+</span> Add new product
          </button>
        )}
        <div className={styles.filterTabsWrapper}>
          {['all', 'active', 'inactive'].map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={filterTabCls(f)}>{f}</button>
          ))}
        </div>
      </div>

      {error && (
        <div className={view.errorWrapper}>
          <p className={styles.errorStatus}>{error.status || '!'}</p>
          <p className={styles.errorMsg}>{error.message}</p>
          <button onClick={() => { setError(null); setSearchQuery(''); setSearchInput(''); }} className={styles.errorRetry}>Try Again</button>
        </div>
      )}

      {!error && (
        <div className={view.tableWrapper}>
          <table className={table.root}>
            <thead>
              <tr className="border-b border-gray-100">
                <th className={`${table.th} w-16`}>Image</th>
                <th className={table.th}>Name</th>
                <th className={table.th}>Category</th>
                <th className={table.th}>Supplier</th>
                <th className={table.th}>Price</th>
                <th className={table.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className={table.loadingRow}>
                      {Array.from({ length: 5 }).map((__, j) => <td key={j} className={table.td}><div className={table.loadingCell} /></td>)}
                    </tr>
                  ))
                : displayedProducts.length === 0
                ? <tr><td colSpan={6} className={table.emptyCell}>{activeFilter === 'all' ? 'No products found.' : `No ${activeFilter} products found.`}</td></tr>
                : displayedProducts.map((p) => (
                    <tr key={p.id} className={table.row}>
                      <td className={table.tdImg}><img src={getImage(p)} alt={p.name} className={styles.productImg} /></td>
                      <td className={`${table.td} text-gray-800`}>{p.name}</td>
                      <td className={table.td}><span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{categoryMap[p.categoryId] || '—'}</span></td>
                      <td className={`${table.td} text-gray-600 text-sm`}>{supplierMap[p.supplierId] || '—'}</td>
                      <td className={styles.priceCell}>₹{p.price.toFixed(2)}</td>
                      <td className={table.td}>
                        <div className={btn.actions}>
                          <button onClick={() => setEditProduct(p)} className={btn.update}>Update</button>
                          <button onClick={() => setDeleteTarget(p)} className={btn.delete}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {editProduct && (
        <AddProductModal product={editProduct} onClose={() => setEditProduct(null)} onSuccess={() => { setEditProduct(null); setRefreshKey((k) => k + 1); }} />
      )}

      {deleteTarget && (
        <div className={modal.overlayDark} onClick={() => !deleting && setDeleteTarget(null)}>
          <div className={modal.boxSm} onClick={(e) => e.stopPropagation()}>
            <div className={modal.deleteIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-center text-base font-semibold text-gray-800 mb-1">Delete Product</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              Are you sure you want to delete <span className="font-medium text-gray-700">"{deleteTarget.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className={`flex-1 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors`}>Cancel</button>
              <button disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  try { await deleteProduct(deleteTarget.id); setDeleteTarget(null); setRefreshKey((k) => k + 1); }
                  catch { setDeleteTarget(null); setRefreshKey((k) => k + 1); }
                  finally { setDeleting(false); }
                }}
                className="flex-1 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 transition-colors">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsView;
