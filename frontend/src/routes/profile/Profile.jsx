import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ROLE_LABELS = {
  ADMIN:       { label: 'Admin',        cls: 'bg-purple-100 text-purple-700' },
  ADMIN_ORDER: { label: 'Order Manager', cls: 'bg-blue-100 text-blue-700' },
  ADMIN_STOCK: { label: 'Stock Manager', cls: 'bg-orange-100 text-orange-700' },
  SUPPLIER:    { label: 'Supplier',     cls: 'bg-yellow-100 text-yellow-700' },
  USER:        { label: 'Customer',     cls: 'bg-green-100 text-green-700' },
};

export default function Profile() {
  const { token, username, roles, userId, supplierId } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  if (!username) {
    navigate('/auth');
    return null;
  }

  let email = null;
  try { email = jwtDecode(token)?.email || null; } catch { /* invalid token */ }

  const initials = username.slice(0, 2).toUpperCase();

  const fields = [
    { label: 'Username',    value: username },
    { label: 'Email',       value: email || '—' },
    { label: 'Supplier ID', value: supplierId || '—', hide: !supplierId },
  ].filter((f) => !f.hide);

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-800 text-white text-2xl font-bold flex items-center justify-center">
            {initials}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900">{username}</h1>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              {(roles || []).map((r) => {
                const meta = ROLE_LABELS[r] || { label: r, cls: 'bg-gray-100 text-gray-600' };
                return (
                  <span key={r} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${meta.cls}`}>
                    {meta.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="divide-y divide-gray-100">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
