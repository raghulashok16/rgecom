import { useState, useEffect, useMemo } from 'react';
import { fetchAllOrdersAdmin, getSupplierPerformance, fetchAllStockMovements, fetchProducts } from '../../api/backendCalls';
import { MONTHS_FULL, styles } from './SalesView.styles';
import Spinner from '../../components/Spinner';

const SalesView = () => {
  const now = new Date();
  const [month, setMonth]         = useState(now.getMonth() + 1);
  const [year, setYear]           = useState(now.getFullYear());
  const [orders, setOrders]       = useState([]);
  const [supplierPerformance, setSupplierPerf] = useState([]);
  const [movements, setMovements] = useState([]);
  const [productInfoMap, setProductInfoMap] = useState({});
  const [loading, setLoading]     = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  useEffect(() => {
    Promise.all([fetchAllStockMovements(), fetchProducts(0, 1000, 'asc')])
      .then(([mRes, pRes]) => {
        setMovements(mRes.data || []);
        const map = {};
        (pRes.data.content || []).forEach((p) => { map[p.id] = { name: p.name, price: p.price }; });
        setProductInfoMap(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAllOrdersAdmin(null, 0, 1000, undefined, month, year), getSupplierPerformance(month, year)])
      .then(([oRes, sRes]) => { setOrders(oRes.data.content || []); setSupplierPerf(sRes.data || []); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [month, year]);

  const { activeOrders, totalOrders, pendingOrders, totalSales, weeklyData, maxWeekly, topCustomers } = useMemo(() => {
    const activeOrders  = orders.filter((o) => o.status !== 'CANCELLED');
    const totalOrders   = activeOrders.length;
    const pendingOrders = orders.filter((o) => o.status === 'ORDERED').length;
    const totalSales    = activeOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

    const weeklyData = [0, 0, 0, 0, 0];
    activeOrders.forEach((o) => {
      const d = o.timeline?.orderedAt;
      if (d) { const day = parseInt(d.split('/')[0]); weeklyData[Math.min(Math.floor((day - 1) / 7), 4)] += o.totalAmount || 0; }
    });
    const maxWeekly = Math.max(...weeklyData, 1);

    const custMap = {};
    orders.forEach((o) => {
      const key = o.username || o.customerName || o.customerEmail || '—';
      if (!custMap[key]) custMap[key] = { name: key, count: 0, total: 0 };
      custMap[key].count++;
      custMap[key].total += o.totalAmount || 0;
    });
    const topCustomers = Object.values(custMap).sort((a, b) => b.total - a.total).slice(0, 5);

    return { activeOrders, totalOrders, pendingOrders, totalSales, weeklyData, maxWeekly, topCustomers };
  }, [orders]);

  const maxSupplier = useMemo(
    () => Math.max(...supplierPerformance.map((s) => s.totalRevenue), 1),
    [supplierPerformance]
  );

  const topProducts = useMemo(() => {
    const productSalesMap = {};
    movements
      .filter((m) => m.movementType === 'OUT' && m.referenceType === 'ORDER')
      .filter((m) => {
        if (!m.movementDate) return false;
        const d = new Date(m.movementDate);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      })
      .forEach((m) => {
        const info = productInfoMap[m.productId];
        const name = info?.name || `Product #${m.productId}`;
        if (!productSalesMap[m.productId]) productSalesMap[m.productId] = { name, unitsSold: 0, revenue: 0 };
        productSalesMap[m.productId].unitsSold += m.quantity || 0;
        productSalesMap[m.productId].revenue  += (info?.price || 0) * (m.quantity || 0);
      });
    return Object.values(productSalesMap).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 8);
  }, [movements, productInfoMap, month, year]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Sales Dashboard</h2>
          <p className={styles.pageSubtitle}>{MONTHS_FULL[month - 1]} {year}</p>
        </div>
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Filter by Month</span>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={styles.filterSelect}>
            {MONTHS_FULL.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={styles.filterSelect}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className={styles.statGrid}>
            <div className={styles.card}>
              <p className={styles.cardLabel}>Orders This Month</p>
              <p className={styles.cardValueGray}>{totalOrders.toLocaleString()}</p>
              <p className={styles.cardMeta}>Total orders placed</p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardLabel}>Pending Orders</p>
              <p className={styles.cardValueOrange}>{pendingOrders.toLocaleString()}</p>
              <p className={styles.cardMeta}>Awaiting confirmation</p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardLabel}>Total Sales</p>
              <p className={styles.cardValueGreen}>₹{totalSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              <p className={styles.cardMeta}>Revenue this month</p>
            </div>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Weekly Sales</h3>
              <div className={styles.barChart}>
                {weeklyData.map((v, i) => (
                  <div key={i} className={styles.barCol}>
                    <span className={styles.barLabel}>{v > 0 ? `₹${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}` : ''}</span>
                    <div className={styles.barEl} style={{ height: `${Math.round((v / maxWeekly) * 130)}px`, minHeight: v > 0 ? '6px' : '2px', opacity: v > 0 ? 1 : 0.15 }} />
                    <span className={styles.barWeekLabel}>W{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Supplier Performance</h3>
              {supplierPerformance.length === 0 ? (
                <div className="flex items-center justify-center h-44 text-sm text-gray-400">No data available</div>
              ) : (
                <div className={styles.supplierList}>
                  {supplierPerformance.map((s) => (
                    <div key={s.supplierName}>
                      <div className={styles.supplierRow}>
                        <span className={styles.supplierName}>{s.supplierName}</span>
                        <span className={styles.supplierRev}>₹{s.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className={styles.supplierBar}>
                        <div className={styles.supplierFill} style={{ width: `${Math.round((s.totalRevenue / maxSupplier) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Top 5 Customers</h3>
              {topCustomers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No customer data available</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className={`${styles.topCustTh} w-8`}>#</th>
                      <th className={styles.topCustTh}>Customer</th>
                      <th className={styles.topCustTh}>Orders</th>
                      <th className={styles.topCustTh}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((c, i) => (
                      <tr key={c.name} className={styles.topCustRow}>
                        <td className={styles.topCustRank}>{i + 1}</td>
                        <td className={styles.topCustName}>{c.name}</td>
                        <td className={styles.topCustOrders}>{c.count}</td>
                        <td className={styles.topCustAmount}>₹{c.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Top Selling Products</h3>
              {topProducts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No product sales data available</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className={`${styles.topCustTh} w-8`}>#</th>
                      <th className={styles.topCustTh}>Product</th>
                      <th className={styles.topCustTh}>Units Sold</th>
                      <th className={styles.topCustTh}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((p, i) => (
                      <tr key={p.name} className={styles.topCustRow}>
                        <td className={styles.topCustRank}>{i + 1}</td>
                        <td className={`${styles.topCustName} max-w-40 truncate`}>{p.name}</td>
                        <td className={styles.topCustOrders}>{p.unitsSold}</td>
                        <td className={styles.topCustAmount}>₹{p.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesView;
