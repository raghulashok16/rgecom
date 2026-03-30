import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchSuppliers, fetchCategories, getSupplierPerformance } from '../../api/backendCalls';

const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SupplierDetailsReport = () => {
  const now = new Date();
  const [searchParams] = useSearchParams();
  const month = Number(searchParams.get('month')) || now.getMonth() + 1;
  const year  = Number(searchParams.get('year'))  || now.getFullYear();

  const [suppliers, setSuppliers]     = useState([]);
  const [performance, setPerformance] = useState([]);
  const [catMap, setCatMap]           = useState({});
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      fetchSuppliers(),
      fetchCategories(),
      getSupplierPerformance(month, year),
    ]).then(([sRes, cRes, pRes]) => {
      setSuppliers(sRes.data || []);
      const map = {};
      (cRes.data || []).forEach((c) => { map[c.id] = c.name; });
      setCatMap(map);
      setPerformance(pRes.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [month, year]);

  const perfMap = {};
  performance.forEach((p) => { perfMap[p.supplierId] = p; });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 py-8 px-4 print:bg-white print:p-0">
      <div className="flex justify-center mb-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      <div className="bg-white w-full max-w-4xl mx-auto shadow-xl rounded-lg overflow-hidden print:shadow-none print:rounded-none print:max-w-none">

        {/* Header */}
        <div className="bg-purple-700 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold tracking-tight">Supplier Details Report</h1>
          <p className="text-purple-200 text-sm mt-1">All registered suppliers with contact info and performance for {MONTHS_FULL[month - 1]} {year}</p>
          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <p className="text-purple-300 text-xs uppercase tracking-wide">Total Suppliers</p>
              <p className="font-semibold">{suppliers.length}</p>
            </div>
            <div>
              <p className="text-purple-300 text-xs uppercase tracking-wide">Performance Period</p>
              <p className="font-semibold">{MONTHS_FULL[month - 1]} {year}</p>
            </div>
            <div>
              <p className="text-purple-300 text-xs uppercase tracking-wide">Generated</p>
              <p className="font-semibold">{now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">

          {/* Supplier Cards */}
          {suppliers.map((s, i) => {
            const perf = perfMap[s.id];
            return (
              <div key={s.id} className="border border-gray-100 rounded-xl overflow-hidden">
                {/* Card Header */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <div>
                      <p className="font-bold text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">{catMap[s.categoryId] || 'Uncategorized'}</p>
                    </div>
                  </div>
                  {perf && (
                    <div className="flex gap-4 text-right">
                      <div>
                        <p className="text-xs text-gray-400">Revenue (this month)</p>
                        <p className="font-bold text-green-600">₹{perf.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Orders</p>
                        <p className="font-bold text-gray-700">{perf.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Items Sold</p>
                        <p className="font-bold text-gray-700">{perf.totalItems}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-5 py-4 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-28 shrink-0">Contact Person</span>
                    <span className="font-medium text-gray-700">{s.contactPerson || '—'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-28 shrink-0">Phone</span>
                    <span className="font-medium text-gray-700">{s.phone || '—'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-28 shrink-0">Email</span>
                    <span className="font-medium text-gray-700">{s.email || '—'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-28 shrink-0">Registered</span>
                    <span className="font-medium text-gray-700">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                  {s.address && (
                    <div className="flex gap-2 col-span-2">
                      <span className="text-gray-400 w-28 shrink-0">Address</span>
                      <span className="font-medium text-gray-700">{s.address}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {suppliers.length === 0 && (
            <p className="text-center text-gray-400 py-8">No suppliers found</p>
          )}

          <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-300">
            ECOM — Supplier Details Report · {now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailsReport;
