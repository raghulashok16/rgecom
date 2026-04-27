import { jwtDecode } from 'jwt-decode';

const SET_AUTH = 'SET_AUTH';
const CLEAR_AUTH = 'CLEAR_AUTH';

const storedRoles = localStorage.getItem('roles');

// Decode the stored token once on init to hydrate any claims not yet in localStorage
// (e.g. supplierId added after the user last logged in)
let tokenDerivedSupplierId = localStorage.getItem('supplierId') || null;
if (!tokenDerivedSupplierId) {
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    try {
      const decoded = jwtDecode(storedToken);
      const sid = decoded.supplierId ?? decoded.supplier_id ?? null;
      if (sid != null) {
        tokenDerivedSupplierId = String(sid);
        localStorage.setItem('supplierId', tokenDerivedSupplierId);
      }
    } catch {
      // invalid token — ignore
    }
  }
}

const initialState = {
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,
  roles: storedRoles ? JSON.parse(storedRoles) : [],
  userId: localStorage.getItem('userId') || null,
  supplierId: tokenDerivedSupplierId,
};

export const setAuth = (payload) => ({ type: SET_AUTH, payload });
export const clearAuth = () => ({ type: CLEAR_AUTH });

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH:
      return { ...state, ...action.payload };
    case CLEAR_AUTH:
      return { token: null, username: null, roles: [], userId: null, supplierId: null };
    default:
      return state;
  }
};

export default authReducer;
