import { useState, useEffect } from 'react';
import { fetchInventory, fetchProducts, fetchCategories } from '../../api/backendCalls';

const STOCK_THRESHOLD = 5;

const StockLevelReport = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      fetchInventory(),
      fetchProducts(0, 1000, 'asc'),
      fetchCategories(),
    ]).then(([invRes, prodRes, catRes]) => {
      const products = prodRes.data.content || [];
      const categories = catRes.data || [];
      const catMap = {};
      categories.forEach((c) => { catMap[c.id] = c.name; });

      const prodMap = {};
      products.forEach((p) => { prodMap[p.id] = p; });

      const merged = (invRes.data || []).map((inv) => {
        const prod = prodMap[inv.productId] || {};
        return {
          productId:   inv.productId,
          productName: inv.productName || prod.name || '—',
          category:    catMap[prod.categoryId] || '—',
          quantity:    inv.quantity ?? 0,
          lastUpdated: inv.lastUpdated,
        };
      });

      // Sort ascending by quantity
      merged.sort((a, b) => a.quantity - b.quantity);
      setItems(merged);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const getStatus = (qty) => {
    if (qty === 0)             return { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' };
    if (qty <= STOCK_THRESHOLD) return { label: 'Low Stock',   cls: 'bg-orange-100 text-orange-700' };
    return                            { label: 'In Stock',     cls: 'bg-green-100 text-green-700' };
  };

  const outOfStock = items.filter((i) => i.quantity === 0).length;
  const lowStock   = items.filter((i) => i.quantity > 0 && i.quantity <= STOCK_THRESHOLD).length;
  const inStock    = items.filter((i) => i.quantity > STOCK_THRESHOLD).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 py-8 px-4 print:bg-white print:p-0">
      <div className="flex justify-center mb-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      <div className="bg-white w-full max-w-4xl mx-auto shadow-xl rounded-lg overflow-hidden print:shadow-none print:rounded-none print:max-w-none">

        {/* Header */}
        <div className="bg-slate-700 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold tracking-tight">Stock Level Report</h1>
          <p className="text-slate-300 text-sm mt-1">All products sorted by stock quantity (ascending)</p>
          <p className="text-slate-400 text-xs mt-1">Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <div className="px-8 py-6 space-y-6">

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-gray-100 rounded-xl p-4 bg-red-50">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{outOfStock}</p>
              <p className="text-xs text-red-400 mt-1">Products with 0 units</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4 bg-orange-50">
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-2">Low Stock</p>
              <p className="text-3xl font-bold text-orange-500">{lowStock}</p>
              <p className="text-xs text-orange-400 mt-1">1–{STOCK_THRESHOLD} units remaining</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4 bg-green-50">
              <p className="text-xs font-semibold text-green-500 uppercase tracking-wide mb-2">In Stock</p>
              <p className="text-3xl font-bold text-green-600">{inStock}</p>
              <p className="text-xs text-green-400 mt-1">Adequate stock level</p>
            </div>
          </div>

          {/* Table */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">All Products — Stock Levels</h2>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide w-8">#</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Stock Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    const status = getStatus(item.quantity);
                    return (
                      <tr key={item.productId} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-400 text-xs font-bold">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{item.productName}</td>
                        <td className="px-4 py-3 text-gray-500">{item.category}</td>
                        <td className="px-4 py-3 font-bold text-gray-800">{item.quantity}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${status.cls}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                  {items.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No inventory data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-300">
            ECOM — Stock Level Report · {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockLevelReport;
