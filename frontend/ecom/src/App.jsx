import './App.css'
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import store from './store'
import Navbar from './routes/navbar/Navbar';
import Home from './routes/home/Home';
import Orders from './routes/orders/Orders';
import Dashboard from './routes/dashboard/Dashboard';
import AuthForm from './routes/authform/AuthForm';
import CategoryPage from './routes/categorypage/CategoryPage';
import Cart from './routes/cart/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './routes/profile/Profile';
import AppInitializer from './components/AppInitializer';

const SalesReport          = lazy(() => import('./routes/salesreport/SalesReport'));
const StockLevelReport     = lazy(() => import('./routes/stocklevelreport/StockLevelReport'));
const LowStockReport       = lazy(() => import('./routes/lowstockreport/LowStockReport'));
const SupplierDetailsReport = lazy(() => import('./routes/supplierdetailsreport/SupplierDetailsReport'));
const SalesDispatchReport  = lazy(() => import('./routes/salesdispatchreport/SalesDispatchReport'));

const STAFF_ROLES = ['ADMIN_ORDER', 'ADMIN_STOCK'];

const StaffRedirect = ({ children }) => {
  const roles = useSelector((state) => state.auth.roles) || [];
  if (roles.some((r) => STAFF_ROLES.includes(r))) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div style={{
          background: '#1e40af',
          color: '#fff',
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          letterSpacing: '0.01em',
        }}>
          Please use <strong>Username : raghul</strong> / <strong>Password : 123456</strong> for Admin Access
        </div>
        <AppInitializer />
        <Navbar />
        <Routes>
          <Route path="/" element={<StaffRedirect><Home /></StaffRedirect>} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/sales-report" element={<ProtectedRoute><Suspense fallback={null}><SalesReport /></Suspense></ProtectedRoute>} />
          <Route path="/report/stock-level" element={<ProtectedRoute><Suspense fallback={null}><StockLevelReport /></Suspense></ProtectedRoute>} />
          <Route path="/report/low-stock" element={<ProtectedRoute><Suspense fallback={null}><LowStockReport /></Suspense></ProtectedRoute>} />
          <Route path="/report/suppliers" element={<ProtectedRoute><Suspense fallback={null}><SupplierDetailsReport /></Suspense></ProtectedRoute>} />
          <Route path="/report/sales-dispatch" element={<ProtectedRoute><Suspense fallback={null}><SalesDispatchReport /></Suspense></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
