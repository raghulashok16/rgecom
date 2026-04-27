import { useState, useEffect } from 'react';
import { fetchAllUsers, updateUserActive, searchUsers, filterUsers } from '../../api/backendCalls';
import { styles } from './UsersView.styles';
import { view, table, btn, modal } from './shared.styles';
import Spinner from '../../components/Spinner';

const ALL_ROLES = ['USER', 'SUPPLIER', 'ADMIN_STOCK', 'ADMIN_ORDER'];

const UpdateUserModal = ({ user, onClose, onUpdated }) => {
  const initialRoles = Array.isArray(user.roles) ? user.roles : (user.role ? [user.role] : []);
  const [active, setActive] = useState(user.active ?? true);
  const [roles, setRoles] = useState(initialRoles);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const toggleRole = (role) => {
    if (role === 'USER') return;
    setRoles((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]);
  };

  const hasChanged =
    active !== (user.active ?? true) ||
    roles.slice().sort().join(',') !== initialRoles.slice().sort().join(',');

  const handleSubmit = async () => {
    setSaving(true); setError(null);
    try { await updateUserActive(user.id, active, roles); onUpdated(); onClose(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to update user.'); }
    finally { setSaving(false); }
  };

  return (
    <div className={modal.overlay} onClick={onClose}>
      <div className={modal.boxMd} onClick={(e) => e.stopPropagation()}>
        <div className={modal.header}>
          <h3 className={modal.title}>Update User</h3>
          <button onClick={onClose} className={modal.closeBtn}>✕</button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-gray-400 mb-0.5">Username</p><p className="font-medium text-gray-800">{user.username}</p></div>
            <div><p className="text-xs text-gray-400 mb-0.5">Email</p><p className="text-gray-700 truncate">{user.email}</p></div>
          </div>

          <div>
            <label className={styles.modalRolesLabel}>Roles</label>
            <div className={styles.roleGrid}>
              {ALL_ROLES.map((role) => {
                const isUser = role === 'USER';
                return (
                  <label key={role} className={`${styles.roleLabel} ${isUser ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                    <input type="checkbox" checked={roles.includes(role)} onChange={() => !isUser && toggleRole(role)} disabled={isUser} className={styles.roleCheckbox} />
                    <span className={styles.roleText}>{role}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className={styles.modalRolesLabel}>Active Status</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setActive(true)} className={active ? styles.statusBtnActive : styles.statusBtnDefault}>Active</button>
              <button onClick={() => setActive(false)} className={!active ? styles.statusBtnInactive : styles.statusBtnDefault}>Inactive</button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className={`${modal.footer} pt-1`}>
            <button onClick={onClose} className={modal.btnCancel}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving || !hasChanged} className={modal.btnSave}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const handleSearch = () => { setRoleFilter(''); setActiveFilter(''); setSearchQuery(searchInput); };

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        let res;
        if (roleFilter) res = await filterUsers(roleFilter, activeFilter);
        else if (searchQuery.trim()) res = await searchUsers(searchQuery.trim());
        else res = await fetchAllUsers();
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshKey, searchQuery, roleFilter, activeFilter]);

  const roleBtnCls = (value) => {
    if (roleFilter !== value) return `${styles.filterBtnBase} ${styles.filterBtnDefault}`;
    const map = { admin: styles.filterBtnAdmin, supplier: styles.filterBtnSupplier, user: styles.filterBtnUser, '': styles.filterBtnAll };
    return `${styles.filterBtnBase} ${map[value] || styles.filterBtnAll}`;
  };

  const statusBtnCls = (value) => {
    if (activeFilter !== value) return `${styles.filterBtnBase} ${styles.filterBtnDefault}`;
    const map = { true: styles.filterBtnActive, false: styles.filterBtnInactive, '': styles.filterBtnAll };
    return `${styles.filterBtnBase} ${map[value] || styles.filterBtnAll}`;
  };

  return (
    <div className={view.wrapper}>
      <div className={styles.toolbarWrap}>
        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search by username..." className={styles.searchInput} />
        <div className={styles.filterGroup}>
          <div className={styles.filterTabs}>
            {[['All', ''], ['Admin', 'admin'], ['Supplier', 'supplier'], ['User', 'user']].map(([label, value]) => (
              <button key={value} onClick={() => { setSearchQuery(''); setSearchInput(''); setRoleFilter(value); }} className={roleBtnCls(value)}>{label}</button>
            ))}
          </div>
          <div className={styles.filterTabs}>
            {[['All', ''], ['Active', 'true'], ['Inactive', 'false']].map(([label, value]) => (
              <button key={value} onClick={() => setActiveFilter(value)} className={statusBtnCls(value)}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className={view.errorWrapper}>
          <p className={view.errorTitle}>{error}</p>
          <button onClick={() => setRefreshKey((k) => k + 1)} className={btn.retry}>Try Again</button>
        </div>
      )}

      {!error && loading && <Spinner />}

      {!error && !loading && (
        <div className={view.tableWrapper}>
          <table className={table.root}>
            <thead>
              <tr className="border-b border-gray-100">
                <th className={table.th}>Username</th>
                <th className={table.th}>Email</th>
                <th className={table.th}>Role</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Joined</th>
                <th className={table.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0
                ? <tr><td colSpan={6} className={table.emptyCell}>No users found.</td></tr>
                : users.map((u) => (
                    <tr key={u.id} className={table.row}>
                      <td className={`${table.td} text-gray-800 font-medium`}>{u.username}</td>
                      <td className={`${table.td} text-gray-600`}>{u.email}</td>
                      <td className={table.td}><span className={styles.roleCell}>{Array.isArray(u.roles) ? u.roles.join(', ') : u.role}</span></td>
                      <td className={table.td}>
                        {u.active !== false
                          ? <span className={styles.activeStatus}>Active</span>
                          : <span className={styles.inactiveStatus}>Inactive</span>}
                      </td>
                      <td className={styles.joinedCell}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      <td className={table.td}>
                        <button onClick={() => setEditUser(u)} className={btn.update}>Update</button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {editUser && (
        <UpdateUserModal user={editUser} onClose={() => setEditUser(null)} onUpdated={() => { setEditUser(null); setRefreshKey((k) => k + 1); }} />
      )}
    </div>
  );
};

export default UsersView;
