import axios from 'axios';
import { clearAuth } from '../store/authReducer';

let _store = null;
export const injectStore = (store) => { _store = store; };

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server returns 401 (user deleted, token expired, etc.)
// automatically clear stored credentials and redirect to login.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = !!localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('roles');
      localStorage.removeItem('userId');
      localStorage.removeItem('supplierId');
      if (hadToken) {
        _store?.dispatch(clearAuth());
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
