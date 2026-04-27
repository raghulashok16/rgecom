import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById } from '../api/backendCalls';
import { getCategoryImage } from '../utils/categoryImages';
import { addToCart } from '../store/cartReducer';

// Props:
//   productId - the ID to fetch; when null the modal is closed
//   onClose   - called when the user closes the modal
const ProductModal = ({ productId, fallbackProduct, onClose }) => {
  const dispatch = useDispatch();
  const { token, roles: authRoles } = useSelector((state) => state.auth);
  const isShopUser = !['ADMIN_ORDER', 'ADMIN_STOCK', 'SUPPLIER'].some((r) => (authRoles || []).includes(r));
  const categories = useSelector((state) => state.categories.list);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [added, setAdded]     = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [visible, setVisible]  = useState(false);
  const addBtnRef = useRef(null);
  const isLoggedIn = !!token;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const AUTO_CLOSE_MS = 2000;

  const handleAddToCart = () => {
    dispatch(addToCart(product, quantity));
    setTimeout(() => setAdded(true), 400);
  };

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200);
    }, AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [added]);

  useEffect(() => {
    if (!productId) return;
    setProduct(fallbackProduct ?? null);
    setLoading(false);
    setAdded(false);
    setQuantity(1);
    // Trigger open animation on next frame
    requestAnimationFrame(() => setVisible(true));

    if (isLoggedIn) {
      setLoading(true);
      fetchProductById(productId)
        .then((res) => setProduct(res.data))
        .catch(() => {/* keep fallback */})
        .finally(() => setLoading(false));
    }
  }, [productId]);

  if (!productId) return null;

  return (
    <>
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${visible ? 'bg-black/50' : 'bg-black/0'}`}
      onClick={handleClose}
    >
      {/* Modal panel */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none z-10"
        >
          ✕
        </button>

        {/* Loading spinner */}
        {loading && (
          <div className="flex items-center justify-center h-72">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          </div>
        )}

        {/* Product content */}
        {product && !loading && (
          <div className="flex flex-col sm:flex-row">

            {/* Left — image */}
            <div className="sm:w-2/5 bg-gray-50 flex items-center justify-center p-10">
              <img
                src={product.imageUrl || getCategoryImage(product.categoryId)}
                alt={product.name}
                className="max-h-56 object-contain"
                onError={(e) => { e.target.src = getCategoryImage(product.categoryId); }}
              />
            </div>

            {/* Right — details */}
            <div className="sm:w-3/5 p-8 flex flex-col justify-center relative">
              {/* Success overlay */}
              {isLoggedIn && added && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-3 rounded-r-2xl z-10 px-8">
                  <div className="w-16 h-16 rounded-full border-2 border-green-400 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-800">Added to cart successfully.</p>
                  {/* Auto-close progress bar */}
                  <div className="w-40 h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-green-400 rounded-full"
                      style={{ animation: `progress-fill ${AUTO_CLOSE_MS}ms linear forwards` }}
                    />
                  </div>
                </div>
              )}

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                {categories.find((c) => c.id === product.categoryId)?.name || 'Product'}
              </p>

              <h2 className="text-xl font-bold text-gray-900 leading-snug mb-4">
                {product.name}
              </h2>

              <div className="inline-block bg-indigo-600 text-white text-2xl font-bold px-5 py-2 rounded-lg mb-5 self-start">
                ₹{product.price.toFixed(2)}
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {product.description || 'No description available.'}
              </p>

              {isLoggedIn && isShopUser && (() => {
                const outOfStock = (product.stockQuantity ?? 0) === 0;
                return (
                  <>
                    {outOfStock && (
                      <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm font-semibold text-red-600">
                        Out of Stock
                      </div>
                    )}

                    {/* Quantity selector */}
                    <div className={`flex items-center gap-3 mb-5 ${outOfStock ? 'opacity-40 pointer-events-none' : ''}`}>
                      <span className="text-sm text-gray-500">Quantity</span>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-gray-800">{quantity}</span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      ref={addBtnRef}
                      onClick={handleAddToCart}
                      disabled={added || outOfStock}
                      className="w-full font-semibold text-sm py-3 rounded-lg transition-colors bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white"
                    >
                      {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </>
                );
              })()}
            </div>

          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ProductModal;
