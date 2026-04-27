import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import AddProductModal from '../../components/AddProductModal';
import IconProducts    from '../../assets/svg/IconProducts';
import IconOrders      from '../../assets/svg/IconOrders';
import IconAnalytics   from '../../assets/svg/IconAnalytics';
import IconSuppliers   from '../../assets/svg/IconSuppliers';
import IconCustomers   from '../../assets/svg/IconCustomers';
import IconSettings    from '../../assets/svg/IconSettings';
import IconList        from '../../assets/svg/IconList';
import IconDashboard   from '../../assets/svg/IconDashboard';
import IconHome        from '../../assets/svg/IconHome';
import IconX           from '../../assets/svg/IconX';
import IconShipped     from '../../assets/svg/IconShipped';
import IconCheck       from '../../assets/svg/IconCheck';
import OrdersView      from './OrdersView';
import ProductsView    from './ProductsView';
import SuppliersView   from './SuppliersView';
import CategoriesView  from './CategoriesView';
import UsersView       from './UsersView';
import MyProductsView  from './MyProductsView';
import InventoryView   from './InventoryView';
import SalesView       from './SalesView';
import ReportsView     from './ReportsView';
import { styles }      from './Dashboard.styles';

const sidebarLinks = [
  { label: 'Products',    icon: <IconProducts /> },
  { label: 'My Products', icon: <IconProducts /> },
  { label: 'Orders',      icon: <IconOrders /> },
  { label: 'Suppliers',   icon: <IconSuppliers /> },
  { label: 'Categories',  icon: <IconSettings /> },
  { label: 'Users',       icon: <IconCustomers /> },
  { label: 'Inventory',   icon: <IconList /> },
  { label: 'Sales',       icon: <IconAnalytics /> },
  { label: 'Reports',     icon: <IconDashboard /> },
];

const ROLE_NAV_ACCESS = {
  ADMIN:       ['Products', 'Orders', 'Suppliers', 'Categories', 'Users', 'Inventory', 'Sales', 'Reports'],
  ADMIN_ORDER: ['Orders'],
  ADMIN_STOCK: ['Products', 'Suppliers', 'Inventory', 'Categories'],
  SUPPLIER:    ['My Products'],
};

const subTabs = ['All Orders', 'Ordered', 'Payment', 'Confirmed', 'Delivered', 'Cancelled'];

const Dashboard = () => {
  const roles    = useSelector((state) => state.auth.roles) || [];
  const username = useSelector((state) => state.auth.username) || '';

  const allowedNavs = (() => {
    const navSet = new Set();
    roles.forEach((role) => (ROLE_NAV_ACCESS[role] || []).forEach((nav) => navSet.add(nav)));
    return sidebarLinks.map((l) => l.label).filter((label) => navSet.has(label));
  })();

  const visibleLinks = sidebarLinks.filter((l) => allowedNavs.includes(l.label));
  const isSupplier   = roles.includes('SUPPLIER');
  const primaryRole  = roles[0] || 'User';

  const [activeSubTab, setActiveSubTab]     = useState('All Orders');
  const [activeNav, setActiveNav]           = useState(() => allowedNavs[0] || 'Orders');
  const [addModalOpen, setAddModalOpen]     = useState(false);
  const [productRefreshKey, setProductRefreshKey] = useState(0);
  const [search, setSearch]                 = useState('');
  const [monthYear, setMonthYear]           = useState('');
  const initials = username ? username.slice(0, 2).toUpperCase() : '??';

  return (
    <div className={styles.layout}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        {/* Sidebar header label */}
        <div className={styles.sidebarHeader}>
          <p className={styles.sidebarTitle}>Dashboard</p>
        </div>

        {/* Nav links */}
        <nav className={styles.sidebarNav}>
          {visibleLinks.map((link) => {
            const isActive = activeNav === link.label;
            return (
              <button
                key={link.label}
                onClick={() => setActiveNav(link.label)}
                className={`${styles.navBtnBase} ${isActive ? styles.navBtnActive : styles.navBtnInactive}`}
              >
                {/* Sliding background highlight */}
                {isActive && (
                  <motion.span
                    layoutId="nav-highlight"
                    className="absolute inset-0 rounded-xl bg-white/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}

                {/* Left edge indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      key="dot"
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={styles.navBtnDot}
                    />
                  )}
                </AnimatePresence>

                {/* Icon — scale up when active */}
                <motion.span
                  className="shrink-0 relative z-10"
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {link.icon}
                </motion.span>

                {/* Label — slide + fade */}
                <motion.span
                  className="relative z-10"
                  animate={{ x: isActive ? 2 : 0, opacity: isActive ? 1 : 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                </motion.span>
              </button>
            );
          })}
        </nav>

      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>

        {/* Orders sub-tab + filter bar */}
        {activeNav === 'Orders' && (
          <div className={styles.orderTabBar}>
            <div className="flex items-center gap-1">
              {subTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`${styles.orderTabBtnBase} ${activeSubTab === tab ? styles.orderTabActive : styles.orderTabDefault}`}
                >
                  {tab === 'All Orders' && <IconHome className="w-4 h-4 text-violet-400" />}
                  {tab === 'Pending'    && <IconX className="w-4 h-4 text-red-400" />}
                  {tab === 'Shipped'    && <IconShipped className="w-4 h-4 text-yellow-400" />}
                  {tab === 'Delivered'  && <IconCheck className="w-4 h-4 text-green-400" />}
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 py-2">
              <span className="text-xs text-gray-400 whitespace-nowrap">Filter by Month</span>
              <input
                type="month"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                className={`${styles.monthInput} ${monthYear ? styles.monthInputActive : styles.monthInputEmpty}`}
                style={!monthYear ? { color: 'transparent' } : {}}
              />
              {monthYear && (
                <button onClick={() => setMonthYear('')} className={styles.monthClearBtn}>
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Views */}
        {activeNav === 'Products'    && <ProductsView onAddNew={roles.includes('ADMIN') ? () => setAddModalOpen(true) : undefined} externalRefreshKey={productRefreshKey} />}
        {activeNav === 'My Products' && <MyProductsView onAddNew={isSupplier ? () => setAddModalOpen(true) : undefined} externalRefreshKey={productRefreshKey} />}
        {activeNav === 'Suppliers'   && <SuppliersView />}
        {activeNav === 'Categories'  && <CategoriesView />}
        {activeNav === 'Users'       && <UsersView />}
        {activeNav === 'Inventory'   && <InventoryView />}
        {activeNav === 'Sales'       && <SalesView />}
        {activeNav === 'Reports'     && <ReportsView />}
        {activeNav === 'Orders'      && <OrdersView activeSubTab={activeSubTab} search={search} monthYear={monthYear} />}
      </main>

      {addModalOpen && (
        <AddProductModal
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => { setActiveNav(isSupplier ? 'My Products' : 'Products'); setProductRefreshKey((k) => k + 1); }}
          isSupplier={isSupplier}
        />
      )}
    </div>
  );
};

export default Dashboard;
