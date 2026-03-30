import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadCategories } from '../../store/categoriesReducer';
import { clearAuth } from '../../store/authReducer';
import { SlideTabs } from '../../components/ui/slide-tabs';
import IconDashboard from '../../assets/svg/IconDashboard';

function Navbar() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const { username, roles: authRoles } = useSelector((state) => state.auth);
  const categories = useSelector((state) => state.categories.list);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const isLoggedIn = !!username;
  const isShopUser = !['ADMIN', 'ADMIN_ORDER', 'ADMIN_STOCK', 'SUPPLIER'].some((r) => (authRoles || []).includes(r));
  const isAdmin = (authRoles || []).includes('ADMIN');
  const canSeeOrdersAndCart = isShopUser || isAdmin;

  const isReportPage = pathname.startsWith('/report/') || pathname === '/sales-report';
  if (isReportPage) return null;
  const initials = username ? username.slice(0, 2).toUpperCase() : '';

  useEffect(() => {
    dispatch(loadCategories());
  }, [pathname, dispatch]);

  useEffect(() => {
    const handleCategoriesChanged = () => dispatch(loadCategories());
    window.addEventListener('categories-changed', handleCategoriesChanged);
    return () => window.removeEventListener('categories-changed', handleCategoriesChanged);
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('userId');
    localStorage.removeItem('supplierId');
    dispatch(clearAuth());
    setUserMenuOpen(false);
    window.location.href = '/auth';
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header>
        {/* Main Navbar */}
        <nav className="bg-white px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-gray-900 shrink-0">
            {/* RG circle icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8 shrink-0">
              <circle cx="50" cy="50" r="50" fill="#1C1C2E"/>
              <line x1="22" y1="78" x2="72" y2="20" stroke="white" strokeWidth="5.5" strokeLinecap="round"/>
              <polygon points="72,20 55,22 70,35" fill="white"/>
              <text x="20" y="68" fontFamily="Georgia, serif" fontSize="36" fontWeight="900" fontStyle="italic" fill="white" letterSpacing="-2">R</text>
              <text x="46" y="72" fontFamily="Georgia, serif" fontSize="32" fontWeight="900" fontStyle="italic" fill="white" letterSpacing="-2">G</text>
            </svg>
            {/* Wordmark */}
            <span className="text-lg font-black tracking-tight uppercase leading-none">
              RG <span className="font-light tracking-widest">ECOM</span>
            </span>
          </Link>

          {/* Nav Links */}
          {pathname !== '/dashboard' && (
            <div className="hidden md:block">
              <SlideTabs
                items={[
                  { label: 'Home', to: '/' },
                  ...categories.map((c) => ({ label: c.name, to: `/category/${c.id}` })),
                  ...(isLoggedIn && canSeeOrdersAndCart ? [{ label: 'Orders', to: '/orders' }] : []),
                ]}
              />
            </div>
          )}

          {/* Right Icons */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Name + role — dashboard only */}
            {isLoggedIn && pathname === '/dashboard' && (
              <div className="flex items-center gap-2 mr-1">
                <span className="text-sm font-semibold text-gray-800">{username}</span>
                <span className="text-xs font-semibold bg-[#1C1C2E] text-white px-2.5 py-1 rounded-full">{(authRoles || [])[0]}</span>
              </div>
            )}

            {/* Cart */}
            {isLoggedIn && canSeeOrdersAndCart && !(isAdmin && pathname === '/dashboard') && (
              <Link to="/cart" data-cart-icon className="relative p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Dashboard */}
            {isLoggedIn && pathname !== '/dashboard' && (authRoles || []).some((r) => ['ADMIN', 'ADMIN_ORDER', 'ADMIN_STOCK', 'SUPPLIER'].includes(r)) && (
              <Link to="/dashboard" className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                <IconDashboard className="w-5 h-5" />
              </Link>
            )}

            {/* User */}
            <div className="relative" ref={userMenuRef}>
              {!isLoggedIn ? (
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
              ) : (
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center">
                  {initials}
                </span>
              </button>
              )}

              {/* User Dropdown */}
              <div
                className={`absolute right-0 top-12 w-64 bg-[#1C1C1E] text-white rounded-2xl shadow-2xl z-50 overflow-hidden
                  transition-all duration-200 origin-top-right
                  ${userMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                {isLoggedIn ? (
                  <>
                    {/* Profile header */}
                    <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                      <div className="w-10 h-10 rounded-full bg-violet-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{username}</p>
                      </div>
                    </div>

                    {isShopUser && (
                      <>
                        <div className="border-t border-white/10 mx-3" />
                        {/* Action icons row — shop users only */}
                        <div className="flex items-center justify-around px-4 py-3">
                          <Link
                            to="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors group"
                          >
                            <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            <span className="text-[10px]">Orders</span>
                          </Link>
                          <Link
                            to="/cart"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors group"
                          >
                            <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                              </svg>
                            </div>
                            <span className="text-[10px]">Cart</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors group"
                          >
                            <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="text-[10px]">Profile</span>
                          </Link>
                        </div>
                      </>
                    )}

                    <div className="border-t border-white/10 mx-3" />

                    {/* Menu items */}
                    <ul className="py-2">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-4">
                      <p className="text-sm font-semibold text-white mb-1">Welcome</p>
                      <p className="text-xs text-gray-400">Sign in to your account</p>
                    </div>
                    <div className="border-t border-white/10 mx-3" />
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/auth"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Login
                        </Link>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>

          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
