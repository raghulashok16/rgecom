const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';

const loadCart = () => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const initialState = {
  items: loadCart(),
};

export const addToCart = (product, qty = 1) => ({ type: ADD_TO_CART, payload: { product, qty } });
export const removeFromCart = (productId) => ({ type: REMOVE_FROM_CART, payload: productId });
export const updateQuantity = (productId, quantity) => ({ type: UPDATE_QUANTITY, payload: { productId, quantity } });
export const clearCart = () => ({ type: CLEAR_CART });

const cartReducer = (state = initialState, action) => {
  let newItems;
  switch (action.type) {
    case ADD_TO_CART: {
      const { product, qty } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      newItems = existing
        ? state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
          )
        : [...state.items, { product, quantity: qty }];
      saveCart(newItems);
      return { ...state, items: newItems };
    }
    case REMOVE_FROM_CART:
      newItems = state.items.filter((i) => i.product.id !== action.payload);
      saveCart(newItems);
      return { ...state, items: newItems };
    case UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      if (quantity < 1) return state;
      newItems = state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      );
      saveCart(newItems);
      return { ...state, items: newItems };
    }
    case CLEAR_CART:
      saveCart([]);
      return { ...state, items: [] };
    default:
      return state;
  }
};

export default cartReducer;
