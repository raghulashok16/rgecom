import { useState } from 'react';
import ViewOrderModal from './ViewOrderModal';

const STEPS = ['Ordered', 'Payment', 'Confirmation', 'Delivery'];

// Map backend status → timeline step level
const STATUS_LEVEL = {
  ORDERED:    0,
  PAYMENT:    1,
  CONFIRMED:  2,
  DELIVERED:  3,
  CANCELLED: -1,
};

const STATUS_BADGE = {
  ORDERED:    { label: 'Ordered',   cls: 'bg-blue-50 text-blue-500 border border-blue-300' },
  PAYMENT:    { label: 'Payment',   cls: 'bg-yellow-50 text-yellow-600 border border-yellow-300' },
  CONFIRMED:  { label: 'Confirmed', cls: 'bg-purple-50 text-purple-600 border border-purple-300' },
  DELIVERED:  { label: 'Delivered', cls: 'bg-green-50 text-green-600 border border-green-300' },
  CANCELLED:  { label: 'Cancelled', cls: 'bg-red-50 text-red-500 border border-red-300' },
};

const OrderCard = ({ order, onCancel }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const isCancelled = order.status === 'CANCELLED';
  const isDelivered = order.status === 'DELIVERED';
  const level = isCancelled ? -1 : (STATUS_LEVEL[order.status] ?? 0);
  const badge = STATUS_BADGE[order.status] ?? STATUS_BADGE.ORDERED;

  const timeline = order.timeline ?? {};
  const dates = [
    timeline.orderedAt    || '—',
    timeline.paymentAt    || '—',
    timeline.confirmationAt || '—',
    timeline.deliveryAt   || '—',
  ];

  const dotColor = (i) => {
    if (isCancelled) return 'bg-red-400';
    return i <= level ? 'bg-green-500' : 'bg-yellow-400';
  };

  const lineColor = (i) => {
    if (isCancelled) return 'bg-red-300';
    return i < level ? 'bg-green-500' : 'bg-yellow-400';
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    onCancel(order.id);
  };

  return (
    <>
      <div className="flex items-center gap-6 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-5">

        {/* Order Number */}
        <div className="w-28 shrink-0 flex flex-col items-center justify-center bg-gray-50 rounded-lg h-20 border border-gray-100">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order</span>
          <span className="text-lg font-bold text-gray-800">#{order.id}</span>
          <span className={`mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        </div>

        {/* Summary */}
        <div className="w-48 shrink-0">
          <p className="text-sm text-gray-700 font-medium leading-snug truncate">{order.firstItemName}</p>
          {order.extraItemsCount > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">+{order.extraItemsCount} more item{order.extraItemsCount > 1 ? 's' : ''}</p>
          )}
        </div>

        {/* Total */}
        <div className="w-20 shrink-0 text-center">
          <span className="text-lg font-semibold text-gray-900">₹{order.totalAmount?.toFixed(2)}</span>
        </div>

        {/* Timeline */}
        <div className="flex-1 flex items-center justify-center">
          {isCancelled ? (
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-red-400" />
              <span className="text-xs text-red-500 font-semibold whitespace-nowrap">Cancelled</span>
              <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{timeline.cancelledAt || '—'}</span>
            </div>
          ) : (
            STEPS.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-4 h-4 rounded-full ${dotColor(i)}`} />
                  <span className="text-xs text-gray-500 whitespace-nowrap">{step}</span>
                  <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{dates[i]}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-12 mx-1 mb-7 ${lineColor(i)}`} />
                )}
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setShowDetails(true)}
            className="text-sm px-5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            View Order
          </button>
          {!isDelivered && !isCancelled && (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm px-5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* View Order Modal */}
      {showDetails && <ViewOrderModal orderId={order.id} onClose={() => setShowDetails(false)} />}

      {/* Cancel Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-800">Cancel Order #{order.id}?</h3>
            <p className="text-sm text-gray-500">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCard;
