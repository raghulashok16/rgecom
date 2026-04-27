import { useState } from 'react';
import { fetchAllOrdersAdmin, getSupplierPerformance } from '../../api/backendCalls';
import { MONTHS_FULL_R, styles } from './ReportsView.styles';

const ReportsView = () => {
  const now   = new Date();
  const [month, setMonth]       = useState(now.getMonth() + 1);
  const [year, setYear]         = useState(now.getFullYear());
  const [checking, setChecking] = useState(null);
  const [noDataPopup, setNoDataPopup] = useState(false);
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  const openReport = async (type) => {
    if (type === 'stock-level' || type === 'low-stock') { window.open(`/report/${type}`, '_blank'); return; }
    setChecking(type);
    try {
      let hasData = false;
      if (type === 'sales' || type === 'sales-dispatch') {
        const res = await fetchAllOrdersAdmin(null, 0, 1, undefined, month, year);
        hasData = (res.data.totalElements || 0) > 0;
      } else if (type === 'suppliers') {
        const res = await getSupplierPerformance(month, year);
        hasData = (res.data || []).some((s) => s.totalRevenue > 0);
      }
      if (!hasData) {
        setNoDataPopup(true);
      } else {
        const urls = { 'sales': `/sales-report?month=${month}&year=${year}`, 'sales-dispatch': `/report/sales-dispatch?month=${month}&year=${year}`, 'suppliers': `/report/suppliers?month=${month}&year=${year}` };
        window.open(urls[type], '_blank');
      }
    } catch { setNoDataPopup(true); }
    finally { setChecking(null); }
  };

  const reportCard = (icon, title, desc, type, color) => (
    <div className={styles.reportCard}>
      <div className={`${styles.iconWrapper} ${color}`}>{icon}</div>
      <div>
        <h3 className={styles.reportTitle}>{title}</h3>
        <p className={styles.reportDesc}>{desc}</p>
      </div>
      <button onClick={() => openReport(type)} disabled={checking === type} className={styles.generateBtn}>
        {checking === type ? (
          <><div className={styles.spinnerSm} /> Checking...</>
        ) : (
          <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> Generate Report</>
        )}
      </button>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Reports</h2>
          <p className={styles.pageSubtitle}>Generate and export reports as PDF</p>
        </div>
        <div className={styles.filterBox}>
          <span className={styles.filterLabel}>Month filter</span>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={styles.filterSelect}>
            {MONTHS_FULL_R.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={styles.filterSelect}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <p className={styles.sectionLabel}>Inventory Reports</p>
      <div className={styles.cardsGrid2}>
        {reportCard(<svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, 'Stock Level Report', 'All products sorted by stock quantity (ascending). Shows In Stock, Low Stock, and Out of Stock status.', 'stock-level', 'bg-slate-100')}
        {reportCard(<svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, 'Low Stock Alert Report', 'Products at or below threshold. Highlights out-of-stock items requiring immediate restocking.', 'low-stock', 'bg-orange-50')}
      </div>

      <p className={styles.sectionLabel}>Sales Reports <span className="normal-case font-normal text-gray-300">— uses month filter above</span></p>
      <div className={styles.cardsGrid2}>
        {reportCard(<svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, 'Monthly Sales Report', 'Overview of orders, revenue, weekly chart, supplier performance, and top 5 customers for the selected month.', 'sales', 'bg-indigo-50')}
        {reportCard(<svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, 'Sales & Dispatch Report', 'Full order list with status breakdown, dispatch dates, and delivery tracking for the selected month.', 'sales-dispatch', 'bg-green-50')}
      </div>

      <p className={styles.sectionLabel}>Supplier Reports <span className="normal-case font-normal text-gray-300">— uses month filter above</span></p>
      <div className={styles.cardsGrid1}>
        {reportCard(<svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, 'Supplier Details Report', 'All supplier contact info with monthly revenue, order count, and items sold for the selected month.', 'suppliers', 'bg-purple-50')}
      </div>

      {noDataPopup && (
        <div className={styles.noDataOverlay}>
          <div className={styles.noDataBox}>
            <div className={styles.noDataIcon}>
              <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <p className={styles.noDataTitle}>No Data Found</p>
            <p className={styles.noDataMsg}>There is no data available for <span className="font-semibold text-gray-600">{MONTHS_FULL_R[month - 1]} {year}</span>. Please select a different month.</p>
            <button onClick={() => setNoDataPopup(false)} className={styles.noDataBtn}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsView;
