import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { clearAuth } from '../store/authReducer';

const STAFF_ROLES = ['ADMIN', 'ADMIN_ORDER', 'ADMIN_STOCK', 'SUPPLIER'];
const LOCAL_KEYS  = ['token', 'username', 'roles', 'userId', 'supplierId'];

const AppInitializer = () => {
  const { token, roles } = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    // No token — guests can browse public pages freely
    if (!token) return;

    // Validate expiry
    try {
      const { exp } = jwtDecode(token);
      if (exp && exp * 1000 < Date.now()) throw new Error('expired');
    } catch {
      LOCAL_KEYS.forEach((k) => localStorage.removeItem(k));
      dispatch(clearAuth());
      navigate('/auth', { replace: true });
      return;
    }

    // Valid token — if on /auth redirect to the right home page
    if (pathname === '/auth') {
      navigate(
        roles.some((r) => STAFF_ROLES.includes(r)) ? '/dashboard' : '/',
        { replace: true }
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default AppInitializer;
