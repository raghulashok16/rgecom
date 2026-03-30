import { jwtDecode } from 'jwt-decode';
import { loginRequest, registerRequest } from '../api/backendCalls';
import { setAuth, clearAuth } from '../store/authReducer';
import store from '../store';

export const validateLogin = (username, password) => {
  const errors = {};
  if (!username.trim()) errors.username = 'Username is required';
  if (!password.trim()) errors.password = 'Password is required';
  return errors;
};

export const validateSignup = (signupUsername, signupEmail, signupPassword, confirmPassword) => {
  const errors = {};
  if (!signupUsername.trim()) errors.signupUsername = 'Username is required';
  if (!signupEmail.trim()) errors.signupEmail = 'Email is required';
  if (!signupPassword.trim()) errors.signupPassword = 'Password is required';
  if (!confirmPassword.trim()) errors.confirmPassword = 'Please confirm your password';
  else if (signupPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const loginUser = async ({ username, password, setErrors, navigate }) => {
  const validationErrors = validateLogin(username, password);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  setErrors({});
  try {
    const res = await loginRequest(username, password);
    const token = res.data.token;
    const decoded = jwtDecode(token);
    const authUsername = decoded.username ?? decoded.sub ?? '';
    const roles = decoded.roles ?? (decoded.role ? [decoded.role] : []);
    const userId = decoded.id ?? decoded.userId ?? decoded.user_id ?? null;
    const supplierId = decoded.supplierId ?? decoded.supplier_id ?? null;

    localStorage.setItem('token', token);
    localStorage.setItem('username', authUsername);
    localStorage.setItem('roles', JSON.stringify(roles));
    if (userId != null) localStorage.setItem('userId', String(userId));
    if (supplierId != null) localStorage.setItem('supplierId', String(supplierId));

    store.dispatch(setAuth({
      token,
      username: authUsername,
      roles,
      userId: userId != null ? String(userId) : null,
      supplierId: supplierId != null ? String(supplierId) : null,
    }));

    const staffRoles = ['ADMIN', 'ADMIN_ORDER', 'ADMIN_STOCK'];
    navigate(roles.some((r) => staffRoles.includes(r)) ? '/dashboard' : '/');
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.message;
    if (status === 400 || status === 401) {
      setErrors({ server: message || 'Something went wrong. Please try again.' });
    } else {
      setErrors({ server: 'Something went wrong. Please try again.' });
    }
  }
};

export const registerUser = async ({
  signupUsername, signupEmail, signupPassword, confirmPassword,
  setErrors, setSignupUsername, setSignupEmail, setSignupPassword, setConfirmPassword, switchTab,
}) => {
  const validationErrors = validateSignup(signupUsername, signupEmail, signupPassword, confirmPassword);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  setErrors({});
  try {
    await registerRequest(signupUsername, signupEmail, signupPassword);
    setSignupUsername('');
    setSignupEmail('');
    setSignupPassword('');
    setConfirmPassword('');
    switchTab('login');
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.message;
    if (status === 400 || status === 409) {
      setErrors({ server: message || 'Something went wrong. Please try again.' });
    } else {
      setErrors({ server: 'Something went wrong. Please try again.' });
    }
  }
};
