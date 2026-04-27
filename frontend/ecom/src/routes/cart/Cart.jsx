import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { removeFromCart, updateQuantity, clearCart } from '../../store/cartReducer';
import { getCategoryImage } from '../../utils/categoryImages';
import { createOrder } from '../../api/backendCalls';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const { username, token } = useSelector((state) => state.auth);

  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handlePlaceOrder = async () => {
    setOrderError(null);
    let customerName = username ?? '';
    let customerEmail = '';
    try {
      if (token) {
        const decoded = jwtDecode(token);
        customerName = decoded.username ?? decoded.sub ?? username ?? '';
        customerEmail = decoded.email ?? '';
      }
    } catch {
      // use username from store
    }
    const items = cartItems.map((i) => ({ productId: i.product.id, quantity: i.quantity }));
    setPlacing(true);
    try {
      await createOrder(customerName, customerEmail, items);
      dispatch(clearCart());
      setOrderSuccess(true);
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Success Toast */}
      {orderSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-600 text-white text-sm font-medium px-6 py-3 rounded-2xl shadow-lg animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Order placed successfully! Redirecting to your orders…
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Go Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Go Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
            <p className="text-lg font-medium">Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left — Product List */}
            <div className="flex-1">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 pb-3 text-sm font-medium text-gray-500 border-b border-gray-200">
                <span>Product Details</span>
                <span className="text-center">Quantity</span>
                <span className="text-center">Price</span>
                <span className="text-center">Total</span>
                <span />
              </div>

              {/* Rows */}
              <div className="flex flex-col gap-3 mt-3">
                {cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center bg-white border border-gray-100 rounded-xl px-4 py-4 shadow-sm"
                  >
                    {/* Product Details */}
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl || getCategoryImage(product.categoryId)}
                        alt={product.name}
                        className="w-16 h-16 object-contain rounded-lg bg-gray-50 border border-gray-100 p-1 shrink-0"
                        onError={(e) => { e.target.src = getCategoryImage(product.categoryId); }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">{product.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">ID: {product.id}</p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => dispatch(updateQuantity(product.id, quantity - 1))}
                        className="w-6 h-6 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-sm transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded py-0.5">
                        {String(quantity).padStart(2, '0')}
                      </span>
                      <button
                        onClick={() => dispatch(updateQuantity(product.id, quantity + 1))}
                        className="w-6 h-6 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-sm transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Unit Price */}
                    <p className="text-sm text-gray-700 text-center">₹{product.price.toFixed(2)}</p>

                    {/* Total */}
                    <p className="text-sm font-semibold text-gray-800 text-center">₹{(product.price * quantity).toFixed(2)}</p>

                    {/* Remove */}
                    <button
                      onClick={() => dispatch(removeFromCart(product.id))}
                      className="text-red-400 hover:text-red-600 transition-colors group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:animate-[shake_0.4s_ease-in-out]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Summary */}
            <div className="w-full lg:w-72 shrink-0">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                <h2 className="text-base font-bold text-gray-800">Total</h2>

                <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Sub-Total</span>
                    <span className="font-medium text-gray-800">₹{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                {orderError && (
                  <p className="text-xs text-red-500 text-center -mb-1">{orderError}</p>
                )}
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  {placing ? 'Placing Order…' : 'Place Order'}
                </button>

                {/* We Accept */}
                <div className="pt-2">
                  <p className="text-xs text-gray-400 mb-3">We Accept</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">PayPal</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Stripe</span>
                    <span className="text-xs font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">Apple Pay</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
