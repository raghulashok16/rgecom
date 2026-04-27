import { lazy, Suspense, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/cartReducer';
import { getCategoryImage } from '../utils/categoryImages';

const TruckAnimation = lazy(() => import('./TruckAnimation'));

const StockBadge = ({ quantity }) => {
  if (quantity === 0)
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-500 uppercase tracking-wide">OutOfStock</span>;
  if (quantity <= 5)
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-600 uppercase tracking-wide">LowStock</span>;
  return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-600 uppercase tracking-wide">InStock</span>;
};

const StarIcon = ({ fill }) => {
  const id = `h-${Math.random().toString(36).slice(2)}`;
  if (fill === 'full') return (
    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
  if (fill === 'empty') return (
    <svg className="w-4 h-4 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
  // half
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20">
      <defs>
        <linearGradient id={id}>
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
};

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon
        key={star}
        fill={rating >= star ? 'full' : rating >= star - 0.5 ? 'half' : 'empty'}
      />
    ))}
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
    <div className="flex justify-between mb-3">
      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
      <div className="h-5 bg-gray-200 rounded-full animate-pulse w-1/5" />
    </div>
    <div className="aspect-square bg-gray-100 rounded-xl animate-pulse mb-4" />
    <div className="space-y-2 text-center mb-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mx-auto" />
    </div>
    <div className="flex justify-center gap-1 mb-4">
      {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />)}
    </div>
    <div className="h-5 bg-gray-200 rounded animate-pulse w-1/5" />
  </div>
);

const ProductCard = ({ product, onClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buyBtnRef = useRef(null);
  const [truck, setTruck] = useState(null);
  const isLoggedIn = !!useSelector((state) => state.auth.username);
  const authRoles  = useSelector((state) => state.auth.roles) || [];
  const canBuy     = !isLoggedIn || authRoles.length === 0 || authRoles.some((r) => ['USER', 'ADMIN'].includes(r));
  const categories = useSelector((state) => state.categories.list);
  const categoryName = categories.find((c) => c.id === product.categoryId)?.name || 'Product';
  const rating = product.rating ?? (3.5 + ((product.id * 13 + 7) % 4) * 0.5);
  const quantity = product.stockQuantity ?? 99;

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const btnRect = buyBtnRef.current?.getBoundingClientRect();
    if (btnRect) {
      setTruck({ x: btnRect.left + btnRect.width / 2, y: btnRect.top + btnRect.height / 2 });
    } else {
      dispatch(addToCart(product, 1));
      navigate('/cart');
    }
  };

  const handleTruckDone = () => {
    setTruck(null);
    dispatch(addToCart(product, 1));
    navigate('/cart');
  };

  return (
    <>
    <div
      className="bg-white rounded-2xl border-2 border-[#D2C4B4] shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.18)] hover:scale-[1.03] transition-all duration-300 cursor-pointer p-4 flex flex-col"
      onClick={onClick}
    >
      {/* Category + Stock badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          {categoryName}
        </span>
        <StockBadge quantity={quantity} />
      </div>

      {/* Image */}
      <div className="flex items-center justify-center bg-gray-50 rounded-xl mb-4 overflow-hidden aspect-square">
        <img
          src={product.imageUrl || getCategoryImage(product.categoryId)}
          alt={product.name}
          className="w-full h-full object-contain p-3"
          onError={(e) => { e.target.src = getCategoryImage(product.categoryId); }}
        />
      </div>

      {/* Name + Description */}
      <div className="text-center mb-3">
        <p className="text-base font-bold text-gray-800 leading-snug mb-1 line-clamp-2">{product.name}</p>
        <p className="text-xs text-orange-400 line-clamp-1">{product.description || 'Product Description'}</p>
      </div>

      {/* Stars */}
      <div className="flex justify-center mb-4">
        <Stars rating={rating} />
      </div>

      {/* Price + Buy Now */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold text-gray-800">₹{product.price.toFixed(0)}</span>
        {canBuy && quantity > 0 && (
          <button
            ref={buyBtnRef}
            onClick={handleBuyNow}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white text-xs font-semibold transition-all"
          >
            Buy Now
          </button>
        )}
      </div>
    </div>

    {truck && (
      <Suspense fallback={null}>
        <TruckAnimation
          startPos={truck}
          onComplete={handleTruckDone}
        />
      </Suspense>
    )}
    </>
  );
};

export default ProductCard;
