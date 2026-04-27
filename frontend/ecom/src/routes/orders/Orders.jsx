import { useState, useEffect } from 'react';
import OrderCard from '../../components/OrderCard';
import { fetchOrdersByUser, cancelOrder } from '../../api/backendCalls';
import SlidingPagination from '../../components/ui/sliding-pagination';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchOrdersByUser()
      .then((res) => {
        const sorted = [...(res.data ?? [])].sort((a, b) => b.id - a.id);
        setOrders(sorted);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? { ...o, status: 'CANCELLED', timeline: { ...o.timeline, cancelledAt: new Date().toLocaleDateString('en-GB').replace(/\//g, '/') } }
            : o
        )
      );
    } catch {
      // silently ignore; order stays unchanged
    }
  };

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const slice = orders.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">My Orders</h1>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-24 text-gray-400">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <p className="text-sm">You have no orders yet.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {slice.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={handleCancel} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <SlidingPagination
                totalPages={totalPages}
                currentPage={page + 1}
                onPageChange={(p) => setPage(p - 1)}
                maxVisiblePages={9}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
