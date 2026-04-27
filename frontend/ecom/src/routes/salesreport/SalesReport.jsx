import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllOrdersAdmin, getSupplierPerformance } from '../../api/backendCalls';
import { styles } from './SalesReport.styles';

const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SUPPLIER_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6'];

const SalesReport = () => {
  const [searchParams] = useSearchParams();
  const month = Number(searchParams.get('month')) || new Date().getMonth() + 1;
  const year  = Number(searchParams.get('year'))  || new Date().getFullYear();

  const [orders, setOrders]                     = useState([]);
  const [supplierPerformance, setSupplierPerf]  = useState([]);
  const [loading, setLoading]                   = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAllOrdersAdmin(null, 0, 1000, undefined, month, year),
      getSupplierPerformance(month, year),
    ]).then(([oRes, sRes]) => {
      setOrders(oRes.data.content || []);
      setSupplierPerf(sRes.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const activeOrders  = orders.filter((o) => o.status !== 'CANCELLED');
  const totalOrders   = activeOrders.length;
  const pendingOrders = orders.filter((o) => o.status === 'ORDERED').length;
  const totalSales    = activeOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  // Weekly sales
  const weeklyData = [0, 0, 0, 0, 0];
  activeOrders.forEach((o) => {
    const d = o.timeline?.orderedAt;
    if (d) {
      const day = parseInt(d.split('/')[0]);
      weeklyData[Math.min(Math.floor((day - 1) / 7), 4)] += o.totalAmount || 0;
    }
  });
  const maxWeekly = Math.max(...weeklyData, 1);

  // Top 5 customers
  const custMap = {};
  orders.forEach((o) => {
    const key = o.username || o.customerName || o.customerEmail || '—';
    if (!custMap[key]) custMap[key] = { name: key, count: 0, total: 0 };
    custMap[key].count++;
    custMap[key].total += o.totalAmount || 0;
  });
  const topCustomers = Object.values(custMap).sort((a, b) => b.total - a.total).slice(0, 5);

  const maxSupplier = Math.max(...supplierPerformance.map((s) => s.totalRevenue), 1);

  const monthName   = MONTHS_FULL[month - 1];
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDate   = `01 ${monthName} ${year}`;
  const endDate     = `${daysInMonth} ${monthName} ${year}`;

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* Print button — hidden when printing */}
      <div className={styles.printBar}>
        <button onClick={() => window.print()} className={styles.printBtn}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      {/* A4 Page */}
      <div className={styles.card}>

        {/* Report Header */}
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Monthly Sales Report</h1>
          <p className={styles.headerSubtitle}>{monthName} {year}</p>
          <div className={styles.headerMeta}>
            <div>
              <p className={styles.headerMetaLabel}>Start Date</p>
              <p className={styles.headerMetaValue}>{startDate}</p>
            </div>
            <div>
              <p className={styles.headerMetaLabel}>End Date</p>
              <p className={styles.headerMetaValue}>{endDate}</p>
            </div>
            <div>
              <p className={styles.headerMetaLabel}>Generated</p>
              <p className={styles.headerMetaValue}>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className={styles.body}>

          {/* Stat Cards */}
          <div>
            <h2 className={styles.sectionLabel}>Overview</h2>
            <div className={styles.statGrid}>
              <div className={styles.statCardBlue}>
                <p className={styles.statLabelBlue}>Orders This Month</p>
                <p className={styles.statValueBlue}>{totalOrders.toLocaleString()}</p>
                <p className={styles.statMetaBlue}>Total orders placed</p>
              </div>
              <div className={styles.statCardOrange}>
                <p className={styles.statLabelOrange}>Pending Orders</p>
                <p className={styles.statValueOrange}>{pendingOrders.toLocaleString()}</p>
                <p className={styles.statMetaOrange}>Awaiting confirmation</p>
              </div>
              <div className={styles.statCardGreen}>
                <p className={styles.statLabelGreen}>Total Sales</p>
                <p className={styles.statValueGreen}>₹{totalSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p className={styles.statMetaGreen}>Revenue this month</p>
              </div>
            </div>
          </div>

          {/* Weekly Sales Chart */}
          <div>
            <h2 className={styles.sectionLabel}>Weekly Sales</h2>
            <div className={styles.chartBox}>
              <div className={styles.chartBars}>
                {weeklyData.map((v, i) => (
                  <div key={i} className={styles.chartBarCol}>
                    <span className={styles.chartBarLabel}>
                      {v > 0 ? `₹${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}` : ''}
                    </span>
                    <div
                      className="w-full rounded-t-lg"
                      style={{
                        height: `${Math.round((v / maxWeekly) * 110)}px`,
                        minHeight: v > 0 ? '6px' : '2px',
                        backgroundColor: v > 0 ? `hsl(${220 + i * 15}, 70%, ${55 - i * 3}%)` : '#e5e7eb',
                      }}
                    />
                    <span className={styles.chartBarWeek}>W{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supplier Performance */}
          <div>
            <h2 className={styles.sectionLabel}>Supplier Performance</h2>
            <div className={styles.supplierBox}>
              {supplierPerformance.length === 0 ? (
                <p className={styles.supplierEmpty}>No supplier data available</p>
              ) : (
                <div className={styles.supplierList}>
                  {supplierPerformance.map((s, i) => {
                    const color = SUPPLIER_COLORS[i % SUPPLIER_COLORS.length];
                    const pct   = Math.round((s.totalRevenue / maxSupplier) * 100);
                    return (
                      <div key={s.supplierName}>
                        <div className={styles.supplierRow}>
                          <span className={styles.supplierName}>{s.supplierName}</span>
                          <span className={styles.supplierRev}>₹{s.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className={styles.supplierTrack}>
                          <div className={styles.supplierFill} style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Top 5 Customers */}
          <div>
            <h2 className={styles.sectionLabel}>Top 5 Customers</h2>
            <div className={styles.tableWrapper}>
              {topCustomers.length === 0 ? (
                <p className={styles.tableEmpty}>No customer data available</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className={styles.thead}>
                    <tr>
                      <th className={`${styles.th} w-8`}>#</th>
                      <th className={styles.th}>Customer</th>
                      <th className={styles.th}>Orders</th>
                      <th className={styles.th}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((c, i) => (
                      <tr key={c.name} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                        <td className={styles.tdRank}>{i + 1}</td>
                        <td className={styles.tdName}>{c.name}</td>
                        <td className={styles.tdOrders}>{c.count}</td>
                        <td className={styles.tdAmount}>₹{c.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            ECOM — Auto-generated Sales Report · {monthName} {year}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SalesReport;
