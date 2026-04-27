import { useState, useEffect } from 'react';
import { fetchCategories, fetchSupplierProducts } from '../../api/backendCalls';
import AddProductModal from '../../components/AddProductModal';
import Pagination from './Pagination';
import { getImage } from './productHelpers';
import { styles } from './MyProductsView.styles';
import { view, table, btn, input } from './shared.styles';

const MyProductsView = ({ onAddNew, externalRefreshKey = 0 }) => {
  const PAGE_SIZE = 10;
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchCategories().then((res) => { const map = {}; res.data.forEach((c) => { map[c.id] = c.name; }); setCategoryMap(map); }).catch(() => {});
  }, []);

  useEffect(() => { setPage(0); }, [searchQuery]);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetchSupplierProducts(0, 1000, 'asc');
        setAllProducts(res.data.content);
      } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data?.message || '';
        if (status === 401) { window.location.href = '/auth'; return; }
        setError((status === 404 && msg.includes('No supplier account linked'))
          ? 'Your account is not linked to a supplier. Please contact the administrator.'
          : msg || 'Failed to load products.');
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshKey, externalRefreshKey]);

  const filtered = searchQuery ? allProducts.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())) : allProducts;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const products = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className={view.wrapper}>
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
      </div>

      {error && (
        <div className={view.errorWrapper}>
          <p className={view.errorTitle}>{error}</p>
          <button onClick={() => { setError(null); setRefreshKey((k) => k + 1); }} className={btn.retry}>Try Again</button>
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
                <th className={table.th}>Price</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Added</th>
                <th className={table.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className={table.loadingRow}>
                      {Array.from({ length: 6 }).map((__, j) => <td key={j} className={table.td}><div className={table.loadingCell} /></td>)}
                    </tr>
                  ))
                : products.length === 0
                ? <tr><td colSpan={6} className={table.emptyCell}>No products found.</td></tr>
                : products.map((p) => (
                    <tr key={p.id} className={table.row}>
                      <td className={table.tdImg}><img src={getImage(p)} alt={p.name} className={styles.productImg} /></td>
                      <td className={`${table.td} text-gray-800`}>{p.name}</td>
                      <td className={table.td}><span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{categoryMap[p.categoryId] || '—'}</span></td>
                      <td className={`${table.td} text-gray-700 font-medium`}>₹{p.price.toFixed(2)}</td>
                      <td className={table.td}>
                        <span className={p.active ? styles.activeBadge : styles.pendingBadge}>{p.active ? 'Active' : 'Pending'}</span>
                      </td>
                      <td className={styles.addedCell}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                      <td className={table.td}>
                        <button onClick={() => setEditProduct(p)} className={styles.editBtn}>Edit</button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {editProduct && (
        <AddProductModal product={editProduct} isSupplier onClose={() => setEditProduct(null)} onSuccess={() => { setEditProduct(null); setRefreshKey((k) => k + 1); }} />
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default MyProductsView;
