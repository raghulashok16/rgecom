import { useState, useEffect } from 'react';
import { fetchInventory, fetchProducts, fetchCategories } from '../../api/backendCalls';
import { styles } from './LowStockReport.styles';

const STOCK_THRESHOLD = 5;

const LowStockReport = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchInventory(),
      fetchProducts(0, 1000, 'asc'),
      fetchCategories(),
    ]).then(([invRes, prodRes, catRes]) => {
      const products   = prodRes.data.content || [];
      const categories = catRes.data || [];
      const catMap  = {};
      categories.forEach((c) => { catMap[c.id] = c.name; });
      const prodMap = {};
      products.forEach((p) => { prodMap[p.id] = p; });

      const merged = (invRes.data || [])
        .filter((inv) => (inv.quantity ?? 0) <= STOCK_THRESHOLD)
        .map((inv) => {
          const prod = prodMap[inv.productId] || {};
          return {
            productId:   inv.productId,
            productName: inv.productName || prod.name || '—',
            category:    catMap[prod.categoryId] || '—',
            price:       prod.price ?? 0,
            quantity:    inv.quantity ?? 0,
            lastUpdated: inv.lastUpdated,
          };
        })
        .sort((a, b) => a.quantity - b.quantity);

      setItems(merged);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const outOfStock = items.filter((i) => i.quantity === 0).length;
  const lowStock   = items.filter((i) => i.quantity > 0).length;

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.printBar}>
        <button onClick={() => window.print()} className={styles.printBtn}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      <div className={styles.card}>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Low Stock Alert Report</h1>
          <p className={styles.headerSubtitle}>Products at or below {STOCK_THRESHOLD} units — immediate attention required</p>
          <p className={styles.headerDate}>Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <div className={styles.body}>

          {/* Summary */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCardRed}>
              <p className={styles.summaryLabelRed}>Out of Stock</p>
              <p className={styles.summaryValueRed}>{outOfStock}</p>
              <p className={styles.summaryMetaRed}>Need immediate restock</p>
            </div>
            <div className={styles.summaryCardOrange}>
              <p className={styles.summaryLabelOrange}>Low Stock</p>
              <p className={styles.summaryValueOrange}>{lowStock}</p>
              <p className={styles.summaryMetaOrange}>1–{STOCK_THRESHOLD} units remaining</p>
            </div>
            <div className={styles.summaryCardGray}>
              <p className={styles.summaryLabelGray}>Total Affected</p>
              <p className={styles.summaryValueGray}>{items.length}</p>
              <p className={styles.summaryMetaGray}>Products requiring attention</p>
            </div>
          </div>

          {/* Table */}
          <div>
            <h2 className={styles.sectionLabel}>Low Stock &amp; Out of Stock Products</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={`${styles.th} w-8`}>#</th>
                    <th className={styles.th}>Product</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Price</th>
                    <th className={styles.th}>Stock Qty</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    const isOut = item.quantity === 0;
                    return (
                      <tr key={item.productId} className={isOut ? styles.rowOut : i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                        <td className={styles.tdRank}>{i + 1}</td>
                        <td className={styles.tdName}>{item.productName}</td>
                        <td className={styles.tdCategory}>{item.category}</td>
                        <td className={styles.tdPrice}>₹{item.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                        <td className={styles.tdQty}>{item.quantity}</td>
                        <td className="px-4 py-3">
                          <span className={isOut ? styles.badgeOut : styles.badgeLow}>
                            {isOut ? 'Out of Stock' : 'Low Stock'}
                          </span>
                        </td>
                        <td className={styles.tdDate}>
                          {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                  {items.length === 0 && (
                    <tr><td colSpan={7} className={styles.emptyCell}>All products are adequately stocked</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.footer}>
            ECOM — Low Stock Alert Report · {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockReport;
