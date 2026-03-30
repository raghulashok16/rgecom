import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ── Monthly sales data (line chart) ────────────────────────────────────────────

const salesDataByYear = {
  2021: [
    { month: 'Jan', sales: 1200 },
    { month: 'Feb', sales: 2900 },
    { month: 'Mar', sales: 1800 },
    { month: 'Apr', sales: 3400 },
    { month: 'May', sales: 2100 },
    { month: 'Jun', sales: 4600 },
    { month: 'Jul', sales: 3000 },
    { month: 'Aug', sales: 1700 },
    { month: 'Sep', sales: 3800 },
    { month: 'Oct', sales: 2500 },
    { month: 'Nov', sales: 5100 },
    { month: 'Dec', sales: 3300 },
  ],
  2022: [
    { month: 'Jan', sales: 5400 },
    { month: 'Feb', sales: 2100 },
    { month: 'Mar', sales: 6800 },
    { month: 'Apr', sales: 3300 },
    { month: 'May', sales: 1900 },
    { month: 'Jun', sales: 7200 },
    { month: 'Jul', sales: 4100 },
    { month: 'Aug', sales: 6500 },
    { month: 'Sep', sales: 2800 },
    { month: 'Oct', sales: 5900 },
    { month: 'Nov', sales: 3700 },
    { month: 'Dec', sales: 8100 },
  ],
  2023: [
    { month: 'Jan', sales: 7300 },
    { month: 'Feb', sales: 4800 },
    { month: 'Mar', sales: 2600 },
    { month: 'Apr', sales: 8500 },
    { month: 'May', sales: 5200 },
    { month: 'Jun', sales: 3100 },
    { month: 'Jul', sales: 9000 },
    { month: 'Aug', sales: 4400 },
    { month: 'Sep', sales: 6700 },
    { month: 'Oct', sales: 3500 },
    { month: 'Nov', sales: 8200 },
    { month: 'Dec', sales: 5600 },
  ],
  2024: [
    { month: 'Jan', sales: 3100 },
    { month: 'Feb', sales: 8700 },
    { month: 'Mar', sales: 5300 },
    { month: 'Apr', sales: 2400 },
    { month: 'May', sales: 9200 },
    { month: 'Jun', sales: 4600 },
    { month: 'Jul', sales: 7100 },
    { month: 'Aug', sales: 2900 },
    { month: 'Sep', sales: 8400 },
    { month: 'Oct', sales: 5700 },
    { month: 'Nov', sales: 3800 },
    { month: 'Dec', sales: 9600 },
  ],
  2025: [
    { month: 'Jan', sales: 6200 },
    { month: 'Feb', sales: 3500 },
    { month: 'Mar', sales: 9800 },
    { month: 'Apr', sales: 4100 },
    { month: 'May', sales: 7600 },
    { month: 'Jun', sales: 2300 },
    { month: 'Jul', sales: 8900 },
    { month: 'Aug', sales: 5400 },
    { month: 'Sep', sales: 3200 },
    { month: 'Oct', sales: 7800 },
    { month: 'Nov', sales: 4900 },
    { month: 'Dec', sales: 9100 },
  ],
};

// ── Category-wise sales data (bar chart) ───────────────────────────────────────

const categoryDataByYear = {
  2021: [
    { category: 'Electronics',    sales: 18400 },
    { category: 'Clothing',       sales: 9200  },
    { category: 'Books',          sales: 5100  },
    { category: 'Home & Kitchen', sales: 12700 },
    { category: 'Sports',         sales: 7300  },
    { category: 'Toys & Games',   sales: 4600  },
    { category: 'Beauty',         sales: 6800  },
  ],
  2022: [
    { category: 'Electronics',    sales: 24100 },
    { category: 'Clothing',       sales: 6800  },
    { category: 'Books',          sales: 8900  },
    { category: 'Home & Kitchen', sales: 15300 },
    { category: 'Sports',         sales: 11200 },
    { category: 'Toys & Games',   sales: 3900  },
    { category: 'Beauty',         sales: 9400  },
  ],
  2023: [
    { category: 'Electronics',    sales: 19700 },
    { category: 'Clothing',       sales: 14500 },
    { category: 'Books',          sales: 4200  },
    { category: 'Home & Kitchen', sales: 8600  },
    { category: 'Sports',         sales: 17800 },
    { category: 'Toys & Games',   sales: 11300 },
    { category: 'Beauty',         sales: 5700  },
  ],
  2024: [
    { category: 'Electronics',    sales: 31200 },
    { category: 'Clothing',       sales: 10400 },
    { category: 'Books',          sales: 13700 },
    { category: 'Home & Kitchen', sales: 7100  },
    { category: 'Sports',         sales: 9800  },
    { category: 'Toys & Games',   sales: 18600 },
    { category: 'Beauty',         sales: 14200 },
  ],
  2025: [
    { category: 'Electronics',    sales: 27500 },
    { category: 'Clothing',       sales: 18900 },
    { category: 'Books',          sales: 7400  },
    { category: 'Home & Kitchen', sales: 21300 },
    { category: 'Sports',         sales: 13600 },
    { category: 'Toys & Games',   sales: 8200  },
    { category: 'Beauty',         sales: 16700 },
  ],
};

const years = [2021, 2022, 2023, 2024, 2025];

const Chart = () => {
  const [year, setYear] = useState(2025);
  const [view, setView] = useState('Sales');

  return (
    <div className="flex-1 overflow-auto bg-white p-8">

      {/* Header row */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            {view === 'Sales' ? 'Product Sales' : 'Category Sales'}
          </h2>
          <p className="text-sm text-gray-400">
            {view === 'Sales'
              ? `Monthly revenue overview for ${year}`
              : `Revenue by category for ${year}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle */}
          <div className="flex items-center bg-purple-600 rounded-full p-1 gap-1">
            {['Sales', 'Category'].map((tab) => (
              <button
                key={tab}
                onClick={() => setView(tab)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  view === tab
                    ? 'bg-white text-purple-600'
                    : 'text-white hover:bg-purple-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Year dropdown */}
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

        </div>
      </div>

      {/* Line chart — Sales view */}
      {view === 'Sales' && (
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={salesDataByYear[year]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 13, fill: '#6b7280' }} tickFormatter={(v) => `₹${v.toLocaleString()}`} />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Bar chart — Category view */}
      {view === 'Category' && (
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={categoryDataByYear[year]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 13, fill: '#6b7280' }} tickFormatter={(v) => `₹${v.toLocaleString()}`} />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
            <Legend />
            <Bar dataKey="sales" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      )}

    </div>
  );
};

export default Chart;
