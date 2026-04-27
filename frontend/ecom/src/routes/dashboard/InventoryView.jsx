import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories, fetchSuppliers, adjustStock, fetchAllStockMovements } from '../../api/backendCalls';
import { getImage } from './productHelpers';
import { stockLevel, MOVEMENT_BADGE, styles } from './InventoryView.styles';
import { view, table, modal } from './shared.styles';
import Spinner from '../../components/Spinner';

const STOCK_THRESHOLD = 5;

const StockAdjustModal = ({ product, onClose, onSuccess }) => {
  const [adjType,   setAdjType]   = useState('inward');
  const [adjAmount, setAdjAmount] = useState('');
  const [applying,  setApplying]  = useState(false);
  const [error,     setError]     = useState(null);

  const isValid = adjAmount !== '' && (adjType === 'adjustment' ? Number(adjAmount) >= 0 : Number(adjAmount) >= 1);
  const movementTypeMap = { inward: 'IN', adjustment: 'ADJUSTMENT' };

  const apply = async () => {
    if (!isValid) return;
    setApplying(true); setError(null);
    try { await adjustStock(product.id, movementTypeMap[adjType], parseInt(adjAmount)); onSuccess(); onClose(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to update stock. Please try again.'); }
    finally { setApplying(false); }
  };

  return (
    <div className={modal.overlayDark} onClick={onClose}>
      <div className={modal.boxSm} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className={modal.title}>Update Stock</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className={styles.productInfoBox}>
          <img src={getImage(product)} alt={product.name} className={styles.productImg} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
            <p className="text-xs text-gray-500">Current stock: <span className="font-semibold text-gray-700">{product.stockQuantity ?? 0}</span></p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className={styles.adjLabel}>Type</label>
            <select value={adjType} onChange={(e) => { setAdjType(e.target.value); setAdjAmount(''); setError(null); }} className={styles.adjInput}>
              <option value="inward">Inward — adds to current stock</option>
              <option value="adjustment">Adjustment — sets exact stock value</option>
            </select>
          </div>
          <div>
            <label className={styles.adjLabel}>Quantity</label>
            <input type="number" min={adjType === 'adjustment' ? '0' : '1'} value={adjAmount}
              onChange={(e) => setAdjAmount(e.target.value)} placeholder="e.g. 50" className={styles.adjInput} />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button onClick={apply} disabled={!isValid || applying} className={styles.adjApplyBtn}>
            {applying ? 'Applying…' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

const MovementHistoryModal = ({ productMap, onClose }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState('All');

  useEffect(() => {
    fetchAllStockMovements().then((res) => setMovements(res.data || [])).catch(() => setMovements([])).finally(() => setLoading(false));
  }, []);

  const tabs = ['All', 'IN', 'OUT', 'ADJUSTMENT'];
  const displayed = tab === 'All' ? movements : movements.filter((m) => m.movementType === tab);
  const fmt = (dateStr) => dateStr ? new Date(dateStr).toLocaleString() : '—';

  const tabCls = (t) => {
    if (tab !== t) return styles.movTabDefault;
    const map = { IN: styles.movTabIN, OUT: styles.movTabOUT, ADJUSTMENT: styles.movTabADJ };
    return map[t] || styles.movTabAll;
  };

  return (
    <div className={modal.overlayDark} onClick={onClose}>
      <div className={styles.movModalBox} onClick={(e) => e.stopPropagation()}>
        <div className={modal.header}>
          <h3 className={modal.title}>Movement History</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className={styles.movTabsRow}>
          {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={tabCls(t)}>{t}</button>)}
        </div>

        <div className={styles.movTableWrap}>
          {loading ? (
            <div className={styles.movEmptyMsg}>Loading…</div>
          ) : displayed.length === 0 ? (
            <div className={styles.movEmptyMsg}>No movements found.</div>
          ) : (
            <table className={table.root}>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Product</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Type</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Quantity</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Reference Type</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Reference ID</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((m) => (
                  <tr key={m.id} className={table.row}>
                    <td className={`${table.td} text-gray-800 font-medium`}>{productMap[m.productId] || `Product #${m.productId}`}</td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${MOVEMENT_BADGE[m.movementType] || 'bg-gray-100 text-gray-600'}`}>{m.movementType}</span>
                    </td>
                    <td className={styles.movQtyCell}>{m.quantity}</td>
                    <td className={styles.movRefCell}>{m.referenceType || '—'}</td>
                    <td className={styles.movRefIdCell}>{m.referenceId ?? '—'}</td>
                    <td className={styles.movDateCell}>{fmt(m.movementDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const InventoryView = () => {
  const [products, setProducts]         = useState([]);
  const [categoryMap, setCategoryMap]   = useState({});
  const [supplierMap, setSupplierMap]   = useState({});
  const [loading, setLoading]           = useState(false);
  const [search, setSearch]             = useState('');
  const [stockFilter, setStockFilter]   = useState('All');
  const [updateTarget, setUpdateTarget] = useState(null);
  const [refreshKey, setRefreshKey]     = useState(0);
  const [showMovements, setShowMovements] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProducts(0, 1000, 'asc'), fetchCategories(), fetchSuppliers()])
      .then(([pRes, cRes, sRes]) => {
        setProducts(pRes.data.content || []);
        const cm = {}; cRes.data.forEach((c) => { cm[c.id] = c.name; });
        const sm = {}; sRes.data.forEach((s) => { sm[s.id] = s.name; });
        setCategoryMap(cm); setSupplierMap(sm);
      }).catch(() => {}).finally(() => setLoading(false));
  }, [refreshKey]);

  const filtered = products
    .filter((p) => {
      if (stockFilter === 'Active')       return p.active;
      if (stockFilter === 'Inactive')     return !p.active;
      if (stockFilter === 'Low Stock')    return (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) <= STOCK_THRESHOLD;
      if (stockFilter === 'Out of Stock') return (p.stockQuantity ?? 0) === 0;
      return true;
    })
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const lowStockCount   = products.filter((p) => (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) <= STOCK_THRESHOLD).length;
  const outOfStockCount = products.filter((p) => (p.stockQuantity ?? 0) === 0).length;
  const filters = ['All', 'Active', 'Inactive', 'Low Stock', 'Out of Stock'];

  const filterBadge = (f) => {
    if (f === 'Low Stock'    && lowStockCount > 0)   return lowStockCount;
    if (f === 'Out of Stock' && outOfStockCount > 0) return outOfStockCount;
    return null;
  };

  const filterBtnCls = (f) => {
    if (stockFilter !== f) return `${styles.filterBtnBase} ${styles.filterDefault}`;
    const map = { Active: styles.filterActive, Inactive: styles.filterInactive, 'Low Stock': styles.filterLowStock, 'Out of Stock': styles.filterOutStock };
    return `${styles.filterBtnBase} ${map[f] || styles.filterAll}`;
  };

  const badgeCls = (f) => {
    if (stockFilter === f) return `${styles.badgeBase} ${styles.badgeActive}`;
    return `${styles.badgeBase} ${f === 'Low Stock' ? styles.badgeLowStock : styles.badgeOutStock}`;
  };

  return (
    <div className={view.wrapper}>
      <div className={styles.toolbarWrap}>
        <div className={styles.toolbarLeft}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className={styles.searchInput} />
          <button onClick={() => setShowMovements(true)} className={styles.movementBtn}>Movement History</button>
        </div>
        <div className={styles.filterRow}>
          <div className={styles.filterTabs}>
            {filters.map((f) => {
              const badge = filterBadge(f);
              return (
                <button key={f} onClick={() => { setStockFilter(f); setSearch(''); }} className={filterBtnCls(f)}>
                  {f}
                  {badge !== null && <span className={badgeCls(f)}>{badge > 99 ? '99+' : badge}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className={view.tableWrapper}>
          <table className={table.root}>
            <thead>
              <tr className="border-b border-gray-100">
                <th className={`${table.th} w-16`}>Image</th>
                <th className={table.th}>Product</th>
                <th className={table.th}>Category</th>
                <th className={table.th}>Supplier</th>
                <th className={table.th}>Stock Qty</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
              ? <tr><td colSpan={7} className={table.emptyCell}>No products found.</td></tr>
              : filtered.map((p) => {
                  const qty = p.stockQuantity ?? 0;
                  const level = stockLevel(qty, STOCK_THRESHOLD);
                  return (
                    <tr key={p.id} className={table.row}>
                      <td className={table.tdImg}><img src={getImage(p)} alt={p.name} className="w-10 h-10 object-contain" /></td>
                      <td className={`${table.td} text-gray-800 font-medium`}>{p.name}</td>
                      <td className={table.td}><span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{categoryMap[p.categoryId] || '—'}</span></td>
                      <td className={`${table.td} text-gray-600 text-sm`}>{supplierMap[p.supplierId] || '—'}</td>
                      <td className={styles.stockQtyCell}>{qty}</td>
                      <td className={table.td}><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${level.cls}`}>{level.label}</span></td>
                      <td className={table.td}>
                        <button onClick={() => setUpdateTarget(p)} className={styles.updateStockBtn}>Update Stock</button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {updateTarget && (
        <StockAdjustModal product={updateTarget} onClose={() => setUpdateTarget(null)} onSuccess={() => setRefreshKey((k) => k + 1)} />
      )}
      {showMovements && (
        <MovementHistoryModal productMap={Object.fromEntries(products.map((p) => [p.id, p.name]))} onClose={() => setShowMovements(false)} />
      )}
    </div>
  );
};

export default InventoryView;
