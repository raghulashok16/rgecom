import { useState, useEffect } from 'react';
import { fetchAllOrdersAdmin, fetchOrderById, updateOrderStatus } from '../../api/backendCalls';
import IconChevronDown from '../../assets/svg/IconChevronDown';
import Pagination from './Pagination';
import { statusConfig, tabStatusMap, styles } from './OrdersView.styles';
import { view, table, modal } from './shared.styles';
import Spinner from '../../components/Spinner';

const OrderStatusModal = ({ orderId, onClose, onUpdated }) => {
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    fetchOrderById(orderId)
      .then((res) => { setDetail(res.data); setSelectedStatus(res.data.status); })
      .catch(() => setSaveError('Failed to load order details.'))
      .finally(() => setLoadingDetail(false));
  }, [orderId]);

  const handleSubmit = async () => {
    setSaveError(null);
    setSaving(true);
    try {
      await updateOrderStatus(orderId, selectedStatus);
      onUpdated();
      onClose();
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={modal.overlay} onClick={onClose}>
      <div className={modal.boxLg} onClick={(e) => e.stopPropagation()}>
        <div className={modal.header}>
          <h3 className={modal.title}>Order Details</h3>
          <button onClick={onClose} className={modal.closeBtn}>✕</button>
        </div>

        {loadingDetail ? (
          <div className={styles.modalSpinner}>
            <div className={modal.spinner} />
          </div>
        ) : detail ? (
          <div className={modal.body}>
            <div className={styles.orderGrid}>
              <div><p className={styles.labelText}>Order Number</p><p className={styles.valueText}>{detail.orderNumber}</p></div>
              <div><p className={styles.labelText}>Total Amount</p><p className={styles.valueText}>₹{detail.totalAmount?.toFixed(2)}</p></div>
              <div><p className={styles.labelText}>Customer</p><p className="text-gray-700">{detail.customerName || '—'}</p></div>
              <div><p className={styles.labelText}>Email</p><p className="text-gray-700">{detail.customerEmail || '—'}</p></div>
              <div><p className={styles.labelText}>Ordered At</p><p className="text-gray-700">{detail.timeline?.orderedAt || '—'}</p></div>
              <div>
                <p className={styles.labelText}>Current Status</p>
                <span className={`text-xs px-2.5 py-1 rounded font-medium ${(statusConfig[detail.status] || statusConfig.ORDERED).cls}`}>
                  {(statusConfig[detail.status] || statusConfig.ORDERED).label}
                </span>
              </div>
            </div>

            <div>
              <p className={styles.labelText}>Items</p>
              <div className="flex flex-col gap-2 mt-2">
                {detail.items?.map((item) => (
                  <div key={item.id} className={styles.itemsRow}>
                    <span className="text-gray-700">{item.productName}</span>
                    <span className="text-gray-500 text-xs">× {item.quantity} &nbsp;·&nbsp; ₹{item.price?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={`${styles.labelText} block mb-1.5`}>Update Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={styles.selectField}>
                <option value="ORDERED">Ordered</option>
                <option value="PAYMENT">Payment</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {saveError && <p className="text-xs text-red-500">{saveError}</p>}

            <div className={styles.modalFooter}>
              <button onClick={onClose} className={modal.btnCancel}>Cancel</button>
              <button onClick={handleSubmit} disabled={saving || selectedStatus === detail.status} className={modal.btnSave}>
                {saving ? 'Updating…' : 'Update Status'}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-sm text-gray-400">{saveError || 'Order not found.'}</div>
        )}
      </div>
    </div>
  );
};

const OrdersView = ({ activeSubTab, search, monthYear }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusModalId, setStatusModalId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { setPage(0); }, [activeSubTab, monthYear]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const status = tabStatusMap[activeSubTab];
        let month, year;
        if (monthYear) { const [y, m] = monthYear.split('-'); year = parseInt(y); month = parseInt(m); }
        const res = await fetchAllOrdersAdmin(status, page, 10, undefined, month, year);
        setOrders(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeSubTab, page, refreshKey, monthYear]);

  const filtered = orders.filter((o) => {
    if (monthYear && o.timeline?.orderedAt) {
      const [filterYear, filterMonth] = monthYear.split('-').map(Number);
      const parts = o.timeline.orderedAt.split('/');
      if (parts.length === 3) {
        if (parseInt(parts[1]) !== filterMonth || parseInt(parts[2]) !== filterYear) return false;
      }
    }
    if (!search) return true;
    return o.orderNumber?.toLowerCase().includes(search.toLowerCase()) || o.firstItemName?.toLowerCase().includes(search.toLowerCase());
  });

  if (error) return (
    <div className={view.errorWrapper}><p className="text-gray-700 font-medium">{error}</p></div>
  );

  return (
    <div className={view.wrapper}>
      {loading ? <Spinner /> : (
        <div className={view.tableWrapper}>
          <table className={table.root}>
            <thead>
              <tr className="border-b border-gray-100">
                <th className={table.th}>Order #</th>
                <th className={table.th}>Order Status</th>
                <th className={table.th}>Amount</th>
                <th className={table.th}>Ordered At</th>
                <th className={table.th}>Action</th>
              </tr>
              <tr className={styles.subHeaderRow}>
                <td className={styles.subHeaderCell} colSpan={6}>
                  <span className={styles.subHeaderText}>
                    <IconChevronDown />
                    {activeSubTab}
                    <span className={styles.subHeaderCount}>{filtered.length} Orders</span>
                  </span>
                </td>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
              ? <tr><td colSpan={6} className={table.emptyCell}>No orders found.</td></tr>
              : filtered.map((order) => {
                  const cfg = statusConfig[order.status] || statusConfig.ORDERED;
                  return (
                    <tr key={order.id} className={table.row}>
                      <td className={`${table.td} text-gray-700 font-medium`}>{order.orderNumber}</td>
                      <td className={table.td}>
                        <span className={`text-xs px-2.5 py-1 rounded font-medium ${cfg.cls}`}>{cfg.label}</span>
                      </td>
                      <td className={table.td}>₹{order.totalAmount?.toFixed(2)}</td>
                      <td className={`${table.td} text-gray-500`}>{order.timeline?.orderedAt || '—'}</td>
                      <td className={table.td}>
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <button onClick={() => setStatusModalId(order.id)} className={styles.updateBtn}>
                            Update Status
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {statusModalId && (
        <OrderStatusModal
          orderId={statusModalId}
          onClose={() => setStatusModalId(null)}
          onUpdated={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};

export default OrdersView;
