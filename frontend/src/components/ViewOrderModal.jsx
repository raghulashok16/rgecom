import { useState, useEffect } from 'react';
import { fetchOrderById } from '../api/backendCalls';

const STATUS_LABELS = {
  ORDERED:   { label: 'Ordered',   color: 'bg-blue-100 text-blue-700' },
  PAYMENT:   { label: 'Payment',   color: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-600' },
};

const STEP_LABELS = ['Ordered', 'Payment', 'Confirmation', 'Delivery'];

const ViewOrderModal = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderById(orderId)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Failed to load order details.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (!orderId) return null;

  const isCancelled = order?.status === 'CANCELLED';

  const status = order ? (STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' }) : null;
  const timeline = order?.timeline ?? {};
  const dates = [timeline.orderedAt, timeline.paymentAt, timeline.confirmationAt, timeline.deliveryAt];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800">
              {order ? order.orderNumber : `Order #${orderId}`}
            </h2>
            {status && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                {status.label}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="px-6 py-10 text-center text-sm text-gray-400">{error}</div>
        )}

        {order && !loading && (
          <div className="px-6 py-5 flex flex-col gap-6">

            {/* Items */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Items</h3>
              <div className="flex flex-col gap-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <span className="text-xs text-gray-400 font-medium">#{item.productId}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-base font-bold text-gray-800">
                <span>Total</span>
                <span>₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            {/* Timeline */}
            {!isCancelled ? (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Timeline</h3>
                <div className="grid grid-cols-4 gap-2">
                  {STEP_LABELS.map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-1 text-center">
                      <div className={`w-3 h-3 rounded-full ${dates[i] ? 'bg-green-500' : 'bg-gray-200'}`} />
                      <span className="text-xs text-gray-500">{step}</span>
                      <span className="text-xs font-medium text-gray-700">{dates[i] || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <div className="w-3 h-3 rounded-full bg-red-400 shrink-0" />
                <span>Order cancelled on <span className="font-semibold">{timeline.cancelledAt || '—'}</span></span>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOrderModal;
