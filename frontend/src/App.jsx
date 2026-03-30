import './App.css'
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
import SalesReport from './routes/salesreport/SalesReport';
import StockLevelReport from './routes/stocklevelreport/StockLevelReport';
import LowStockReport from './routes/lowstockreport/LowStockReport';
import SupplierDetailsReport from './routes/supplierdetailsreport/SupplierDetailsReport';
import SalesDispatchReport from './routes/salesdispatchreport/SalesDispatchReport';
import Profile from './routes/profile/Profile';

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
        <Navbar />
        <Routes>
          <Route path="/" element={<StaffRedirect><Home /></StaffRedirect>} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/sales-report" element={<ProtectedRoute><SalesReport /></ProtectedRoute>} />
          <Route path="/report/stock-level" element={<ProtectedRoute><StockLevelReport /></ProtectedRoute>} />
          <Route path="/report/low-stock" element={<ProtectedRoute><LowStockReport /></ProtectedRoute>} />
          <Route path="/report/suppliers" element={<ProtectedRoute><SupplierDetailsReport /></ProtectedRoute>} />
          <Route path="/report/sales-dispatch" element={<ProtectedRoute><SalesDispatchReport /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
