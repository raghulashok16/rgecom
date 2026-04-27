import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllOrdersAdmin } from '../../api/backendCalls';
import { STATUS_CONFIG, STATUS_BAR_COLORS, styles } from './SalesDispatchReport.styles';

const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SalesDispatchReport = () => {
  const [searchParams] = useSearchParams();
  const month = Number(searchParams.get('month')) || new Date().getMonth() + 1;
  const year  = Number(searchParams.get('year'))  || new Date().getFullYear();

  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrdersAdmin(null, 0, 1000, undefined, month, year)
      .then((res) => setOrders(res.data.content || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeOrders    = orders.filter((o) => o.status !== 'CANCELLED');
  const totalSales      = activeOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const dispatched      = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'DELIVERED');
  const delivered       = orders.filter((o) => o.status === 'DELIVERED');
  const pending         = orders.filter((o) => o.status === 'ORDERED' || o.status === 'PAYMENT');
  const cancelled       = orders.filter((o) => o.status === 'CANCELLED');

  const statusCounts = {};
  orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

  const monthName   = MONTHS_FULL[month - 1];
  const daysInMonth = new Date(year, month, 0).getDate();

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
          <h1 className={styles.headerTitle}>Sales &amp; Dispatch Report</h1>
          <p className={styles.headerSubtitle}>{monthName} {year}</p>
          <div className={styles.headerMeta}>
            <div>
              <p className={styles.headerMetaLabel}>Period</p>
              <p className={styles.headerMetaValue}>01 {monthName} – {daysInMonth} {monthName} {year}</p>
            </div>
            <div>
              <p className={styles.headerMetaLabel}>Total Orders</p>
              <p className={styles.headerMetaValue}>{orders.length}</p>
            </div>
            <div>
              <p className={styles.headerMetaLabel}>Total Revenue</p>
              <p className={styles.headerMetaValue}>₹{totalSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div>
              <p className={styles.headerMetaLabel}>Generated</p>
              <p className={styles.headerMetaValue}>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className={styles.body}>

          {/* Summary Stats */}
          <div>
            <h2 className={styles.sectionLabel}>Order Summary</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCardBlue}>
                <p className={styles.summaryLabelBlue}>Pending</p>
                <p className={styles.summaryValueBlue}>{pending.length}</p>
              </div>
              <div className={styles.summaryCardPurple}>
                <p className={styles.summaryLabelPurple}>Dispatched</p>
                <p className={styles.summaryValuePurple}>{dispatched.length}</p>
              </div>
              <div className={styles.summaryCardGreen}>
                <p className={styles.summaryLabelGreen}>Delivered</p>
                <p className={styles.summaryValueGreen}>{delivered.length}</p>
              </div>
              <div className={styles.summaryCardRed}>
                <p className={styles.summaryLabelRed}>Cancelled</p>
                <p className={styles.summaryValueRed}>{cancelled.length}</p>
              </div>
            </div>
          </div>

          {/* Status Breakdown Bar */}
          {orders.length > 0 && (
            <div>
              <h2 className={styles.sectionLabel}>Status Distribution</h2>
              <div className={styles.distBox}>
                <div className={styles.distBar}>
                  {Object.entries(statusCounts).map(([status, count]) => {
                    const pct = Math.round((count / orders.length) * 100);
                    return pct > 0 ? (
                      <div
                        key={status}
                        className={`${STATUS_BAR_COLORS[status] || 'bg-gray-400'} ${styles.distBarSegment}`}
                        style={{ width: `${pct}%` }}
                      >
                        {pct > 8 ? `${pct}%` : ''}
                      </div>
                    ) : null;
                  })}
                </div>
                <div className={styles.distLegend}>
                  {Object.entries(statusCounts).map(([status, count]) => {
                    const cfg = STATUS_CONFIG[status] || { label: status, cls: 'bg-gray-100 text-gray-700' };
                    return (
                      <span key={status} className={`${styles.distBadge} ${cfg.cls}`}>
                        {cfg.label}: {count}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div>
            <h2 className={styles.sectionLabel}>All Orders</h2>
            <div className={styles.tableWrapper}>
              <table className="w-full" style={{ fontSize: '11px' }}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={`${styles.th} w-6`}>#</th>
                    <th className={`${styles.th} w-28`}>Order No.</th>
                    <th className={`${styles.th} w-20`}>Customer</th>
                    <th className={styles.th}>Item</th>
                    <th className={`${styles.th} w-20`}>Amount</th>
                    <th className={`${styles.th} w-20`}>Status</th>
                    <th className={`${styles.th} w-20`}>Ordered</th>
                    <th className={`${styles.th} w-20`}>Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => {
                    const cfg = STATUS_CONFIG[o.status] || { label: o.status, cls: 'bg-gray-100 text-gray-700' };
                    const itemLabel = o.firstItemName
                      ? o.extraItemsCount > 0 ? `${o.firstItemName} +${o.extraItemsCount}` : o.firstItemName
                      : '—';
                    return (
                      <tr key={o.id} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                        <td className={styles.tdRank}>{i + 1}</td>
                        <td className={styles.tdOrderNo}>{o.orderNumber}</td>
                        <td className={styles.tdCustomer}>{o.username || o.customerName || '—'}</td>
                        <td className={styles.tdItem} style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{itemLabel}</td>
                        <td className={styles.tdAmount}>₹{(o.totalAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                        <td className={styles.tdDate}>
                          <span className={`${styles.statusBadge} ${cfg.cls}`}>{cfg.label}</span>
                        </td>
                        <td className={styles.tdDate}>{o.timeline?.orderedAt || '—'}</td>
                        <td className={styles.tdDate}>{o.timeline?.deliveryAt || '—'}</td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr><td colSpan={8} className={styles.emptyCell}>No orders found for this period</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.footer}>
            ECOM — Sales &amp; Dispatch Report · {monthName} {year}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDispatchReport;
